"""
Dedicated embedding script: loads chunks.json, computes embeddings, builds FAISS index.

Usage:
    python embed_chunks.py [--model text-embedding-3-large] [--batch-size 16]

This script:
1. Loads existing chunks from data/chunks.json
2. Computes embeddings using Azure OpenAI
3. Saves chunks with embeddings to data/chunks_embeddings.json  
4. Builds FAISS index and saves to data/chunks.index
"""

import json
import os
import time
import argparse
import numpy as np
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def configure_openai():
    """Configure OpenAI client for Azure OpenAI."""
    try:
        from openai import AzureOpenAI
    except ImportError:
        print("Error: openai package not installed. Run: pip install openai")
        return None
    
    # Get Azure OpenAI credentials
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
    
    if not api_key or not endpoint:
        print("Error: Missing Azure OpenAI credentials in environment variables.")
        print("Required: AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT")
        return None
    
        # Create Azure OpenAI client
        client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        
        print(f"✅ Configured Azure OpenAI: {endpoint}")
        return client


def compute_embeddings_batch(texts, client, model="text-embedding-3-large", batch_size=16):
    """Compute embeddings for a batch of texts."""
    embeddings = []
    total = len(texts)
    
    for i in range(0, total, batch_size):
        batch = texts[i:i + batch_size]
        batch_end = min(i + batch_size, total)
        
        try:
            print(f"Processing batch {i//batch_size + 1}/{(total-1)//batch_size + 1} (items {i+1}-{batch_end}/{total})")
            
            response = client.embeddings.create(
                input=batch,
                model=model
            )
            
            # Extract embeddings from response
            for item in response.data:
                embeddings.append(item.embedding)
            
            # Rate limiting - small delay between batches
            time.sleep(0.1)
            
        except Exception as e:
            print(f"❌ Error processing batch {i//batch_size + 1}: {e}")
            # Retry once with smaller batch
            if batch_size > 1:
                print("Retrying with batch size 1...")
                for single_text in batch:
                    try:
                        response = client.embeddings.create(input=[single_text], model=model)
                        embeddings.append(response.data[0].embedding)
                        time.sleep(0.2)
                    except Exception as retry_error:
                        print(f"❌ Failed to process single text: {retry_error}")
                        # Add zero vector as placeholder
                        embeddings.append([0.0] * 1536)  # typical embedding dimension
            else:
                raise e
    
    return embeddings


def build_faiss_index(embeddings):
    """Build FAISS index from embeddings."""
    try:
        import faiss
    except ImportError:
        print("Error: faiss-cpu not installed. Run: pip install faiss-cpu")
        return None
    
    embedding_array = np.array(embeddings, dtype=np.float32)
    dimension = embedding_array.shape[1]
    
    # Use L2 (Euclidean) distance index
    index = faiss.IndexFlatL2(dimension)
    index.add(embedding_array)
    
    print(f"✅ Built FAISS index: {index.ntotal} vectors, {dimension} dimensions")
    return index


def main():
    parser = argparse.ArgumentParser(description="Compute embeddings for chunks and build FAISS index")
    parser.add_argument("--model", default="text-embedding-3-large", help="Embedding model to use")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size for embedding requests")
    parser.add_argument("--chunks-file", default="data/chunks.json", help="Path to chunks JSON file")
    args = parser.parse_args()
    
    # Set up paths
    base_dir = Path(__file__).parent
    chunks_path = base_dir / args.chunks_file
    output_path = base_dir / "data" / "chunks_embeddings.json"
    index_path = base_dir / "data" / "chunks.index"
    
    # Check if chunks file exists
    if not chunks_path.exists():
        print(f"❌ Chunks file not found: {chunks_path}")
        return 1
    
    # Configure OpenAI
    client = configure_openai()
    if not client:
        return 1
    
    # Load chunks
    print(f"📁 Loading chunks from {chunks_path}")
    try:
        with open(chunks_path, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
        print(f"✅ Loaded {len(chunks)} chunks")
    except Exception as e:
        print(f"❌ Error loading chunks: {e}")
        return 1
    
    # Extract texts for embedding
    texts = [chunk["text"] for chunk in chunks]
    
    # Compute embeddings
    print(f"🔮 Computing embeddings using {args.model} (batch size: {args.batch_size})")
    try:
        embeddings = compute_embeddings_batch(texts, client, model=args.model, batch_size=args.batch_size)
        print(f"✅ Computed {len(embeddings)} embeddings")
    except Exception as e:
        print(f"❌ Error computing embeddings: {e}")
        return 1
    
    # Add embeddings to chunks
    if len(embeddings) != len(chunks):
        print(f"⚠️  Warning: Embedding count ({len(embeddings)}) != chunk count ({len(chunks)})")
    
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        chunk["embedding"] = embedding
    
    # Save chunks with embeddings
    print(f"💾 Saving chunks with embeddings to {output_path}")
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
        print(f"✅ Saved {len(chunks)} chunks with embeddings")
    except Exception as e:
        print(f"❌ Error saving embeddings: {e}")
        return 1
    
    # Build FAISS index
    print("🏗️  Building FAISS index")
    index = build_faiss_index(embeddings)
    if not index:
        return 1
    
    # Save FAISS index
    print(f"💾 Saving FAISS index to {index_path}")
    try:
        import faiss
        faiss.write_index(index, str(index_path))
        print(f"✅ Saved FAISS index with {index.ntotal} vectors")
    except Exception as e:
        print(f"❌ Error saving index: {e}")
        return 1
    
    print("🎉 Embedding process completed successfully!")
    print(f"📁 Embeddings: {output_path}")
    print(f"📁 FAISS Index: {index_path}")
    
    return 0


if __name__ == "__main__":
    exit(main())