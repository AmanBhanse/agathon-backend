"""
Debug RAG query step by step
"""
import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def debug_rag():
    print("🐛 Debugging RAG system step by step...")
    
    # Step 1: Load embeddings
    data_dir = Path(__file__).parent / "data"
    embeddings_path = data_dir / "chunks_embeddings.json"
    
    print(f"📁 Loading from: {embeddings_path}")
    print(f"📁 File exists: {embeddings_path.exists()}")
    
    if not embeddings_path.exists():
        print("❌ Embeddings file not found!")
        return
    
    try:
        with open(embeddings_path, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
        print(f"✅ Loaded {len(chunks)} chunks")
        
        # Check first chunk structure
        if chunks:
            first_chunk = chunks[0]
            print(f"📋 First chunk keys: {list(first_chunk.keys())}")
            print(f"📋 Has embedding: {'embedding' in first_chunk}")
            if 'embedding' in first_chunk:
                print(f"📋 Embedding dimension: {len(first_chunk['embedding'])}")
    except Exception as e:
        print(f"❌ Error loading chunks: {e}")
        return
    
    # Step 2: Test Azure OpenAI client
    print("\n🧪 Testing Azure OpenAI client...")
    try:
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
        
        client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        print("✅ Client created successfully")
        
        # Step 3: Test query embedding
        print("\n🔍 Testing query embedding...")
        test_query = "breast cancer"
        response = client.embeddings.create(
            input=[test_query],
            model="text-embedding-3-large"
        )
        query_embedding = np.array(response.data[0].embedding, dtype=np.float32)
        print(f"✅ Query embedding: {len(query_embedding)} dimensions")
        
        # Step 4: Test similarity search
        print("\n🔍 Testing similarity search...")
        embeddings = np.array([chunk["embedding"] for chunk in chunks[:10]], dtype=np.float32)  # Test with first 10
        print(f"📊 Embeddings shape: {embeddings.shape}")
        
        # Calculate similarities
        similarities = np.dot(embeddings, query_embedding) / (
            np.linalg.norm(embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        print(f"📊 Similarities: {similarities[:5]}")  # Show first 5
        
        # Get top results
        top_indices = np.argsort(similarities)[-3:][::-1]
        print(f"📊 Top 3 indices: {top_indices}")
        
        for i, idx in enumerate(top_indices):
            chunk = chunks[idx]
            print(f"Result {i+1}: Score={similarities[idx]:.3f}, Text preview: {chunk['text'][:100]}...")
        
        # Step 5: Test chat completion
        print("\n🤖 Testing chat completion...")
        context_text = chunks[top_indices[0]]['text'][:500]  # First result
        
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "You are a medical assistant. Answer based on the provided context."},
                {"role": "user", "content": f"Context: {context_text}\n\nQuestion: {test_query}\n\nAnswer:"}
            ],
            max_tokens=200,
            temperature=0.1
        )
        
        answer = response.choices[0].message.content.strip()
        print(f"✅ GPT Response: {answer[:200]}...")
        
    except Exception as e:
        import traceback
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    debug_rag()