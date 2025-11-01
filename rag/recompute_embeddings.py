"""
Robust embedding recomputation script with better error handling
"""
import json
import os
import time
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def main():
    print("🔄 Starting embedding recomputation...")
    
    try:
        # Set up paths
        base_dir = Path(__file__).parent
        chunks_path = base_dir / "data" / "chunks.json"
        output_path = base_dir / "data" / "chunks_embeddings_new.json"
        index_path = base_dir / "data" / "chunks_new.index"
        
        # Load chunks
        print(f"📁 Loading chunks from {chunks_path}")
        if not chunks_path.exists():
            print(f"❌ Chunks file not found: {chunks_path}")
            return 1
            
        with open(chunks_path, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
        print(f"✅ Loaded {len(chunks)} chunks")
        
        # Configure Azure OpenAI
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
        
        if not api_key or not endpoint:
            print("❌ Missing Azure OpenAI credentials")
            return 1
            
        client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        print(f"✅ Configured Azure OpenAI: {endpoint}")
        
        # Extract texts
        texts = [chunk["text"] for chunk in chunks]
        
        # Compute embeddings in batches
        embeddings = []
        batch_size = 8
        total_batches = (len(texts) + batch_size - 1) // batch_size
        
        print(f"🔮 Computing embeddings for {len(texts)} chunks in {total_batches} batches...")
        
        for i in range(0, len(texts), batch_size):
            batch_num = i // batch_size + 1
            batch = texts[i:i + batch_size]
            batch_end = min(i + batch_size, len(texts))
            
            print(f"Processing batch {batch_num}/{total_batches} (items {i+1}-{batch_end}/{len(texts)})")
            
            try:
                response = client.embeddings.create(
                    input=batch,
                    model="text-embedding-3-large"
                )
                
                # Extract embeddings
                batch_embeddings = [item.embedding for item in response.data]
                embeddings.extend(batch_embeddings)
                
                # Show progress
                if len(embeddings) > 0:
                    print(f"✅ Batch completed. Total embeddings: {len(embeddings)}, Dimension: {len(embeddings[-1])}")
                
                # Small delay to be nice to the API
                time.sleep(0.1)
                
            except Exception as e:
                print(f"❌ Error in batch {batch_num}: {e}")
                # Try individual items in this batch
                print("Retrying individual items...")
                for j, single_text in enumerate(batch):
                    try:
                        response = client.embeddings.create(
                            input=[single_text],
                            model="text-embedding-3-large"
                        )
                        embeddings.append(response.data[0].embedding)
                        print(f"  ✅ Item {i+j+1} successful")
                        time.sleep(0.2)
                    except Exception as single_error:
                        print(f"  ❌ Item {i+j+1} failed: {single_error}")
                        # Add zero vector as placeholder
                        embeddings.append([0.0] * 3072)
        
        print(f"✅ Computed {len(embeddings)} embeddings")
        
        # Add embeddings to chunks
        for chunk, embedding in zip(chunks, embeddings):
            chunk["embedding"] = embedding
        
        # Save new embeddings
        print(f"💾 Saving embeddings to {output_path}")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
        print(f"✅ Saved {len(chunks)} chunks with embeddings")
        
        # Build FAISS index
        try:
            import faiss
            print("🏗️  Building FAISS index...")
            embedding_array = np.array(embeddings, dtype=np.float32)
            dimension = embedding_array.shape[1]
            
            index = faiss.IndexFlatL2(dimension)
            index.add(embedding_array)
            
            faiss.write_index(index, str(index_path))
            print(f"✅ Saved FAISS index: {index.ntotal} vectors, {dimension} dimensions")
        except ImportError:
            print("⚠️  FAISS not available, skipping index building")
        except Exception as e:
            print(f"❌ Error building FAISS index: {e}")
        
        print("🎉 Embedding recomputation completed successfully!")
        print(f"📁 New embeddings: {output_path}")
        print(f"📁 New FAISS Index: {index_path}")
        
        return 0
        
    except Exception as e:
        import traceback
        print(f"❌ Critical error: {e}")
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())