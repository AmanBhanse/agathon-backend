"""
Simple RAG test with new 3072-dimensional embeddings
"""
import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def test_rag_simple(query="What is breast cancer treatment?"):
    print(f"🔍 Testing RAG with query: {query}")
    
    # Load new embeddings (will use these once ready)
    base_dir = Path(__file__).parent
    new_embeddings_path = base_dir / "data" / "chunks_embeddings_new.json"
    test_embeddings_path = base_dir / "data" / "test_embeddings.json" 
    
    # Use test embeddings for now
    if test_embeddings_path.exists():
        embeddings_path = test_embeddings_path
        print("📁 Using test embeddings (10 chunks)")
    elif new_embeddings_path.exists():
        embeddings_path = new_embeddings_path
        print("📁 Using new embeddings (full set)")
    else:
        print("❌ No compatible embeddings found")
        return
    
    # Load embeddings
    with open(embeddings_path, 'r', encoding='utf-8') as f:
        chunks = json.load(f)
    
    print(f"✅ Loaded {len(chunks)} chunks")
    
    # Set up Azure OpenAI
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
    
    client = AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=endpoint
    )
    
    try:
        # Get query embedding
        print("🔮 Getting query embedding...")
        response = client.embeddings.create(
            input=[query],
            model="text-embedding-3-large"
        )
        query_embedding = np.array(response.data[0].embedding, dtype=np.float32)
        print(f"✅ Query embedding: {len(query_embedding)} dimensions")
        
        # Extract chunk embeddings
        chunk_embeddings = np.array([chunk["embedding"] for chunk in chunks], dtype=np.float32)
        print(f"📊 Chunk embeddings: {chunk_embeddings.shape}")
        
        # Calculate similarities
        similarities = np.dot(chunk_embeddings, query_embedding) / (
            np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        
        # Get top 3 results
        top_indices = np.argsort(similarities)[-3:][::-1]
        
        print("\n🎯 Top Results:")
        for i, idx in enumerate(top_indices):
            chunk = chunks[idx]
            score = similarities[idx]
            pages = chunk.get('pages', 'unknown')
            text_preview = chunk['text'][:150] + "..." if len(chunk['text']) > 150 else chunk['text']
            print(f"{i+1}. Score: {score:.3f} | Page: {pages} | Text: {text_preview}")
        
        # Generate answer with top result
        if len(chunks) > 0 and similarities[top_indices[0]] > 0.5:
            context_text = chunks[top_indices[0]]['text'][:800]
            
            print("\n🤖 Generating answer...")
            response = client.chat.completions.create(
                model="gpt-4.1",
                messages=[
                    {"role": "system", "content": "You are a medical assistant. Answer based strictly on the provided context from medical guidelines."},
                    {"role": "user", "content": f"Context: {context_text}\n\nQuestion: {query}\n\nAnswer based only on the context:"}
                ],
                max_tokens=300,
                temperature=0.1
            )
            
            answer = response.choices[0].message.content.strip()
            print(f"\n📋 **ANSWER:**\n{answer}")
        else:
            print("\n📋 No highly relevant information found for this query.")
    
    except Exception as e:
        import traceback
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_rag_simple()