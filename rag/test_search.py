"""
Quick test of the search functionality
"""
import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def test_search():
    # Load embeddings
    data_dir = Path(__file__).parent / "data"
    embeddings_path = data_dir / "chunks_embeddings_new.json"
    
    with open(embeddings_path, 'r', encoding='utf-8') as f:
        chunks = json.load(f)
    
    embeddings = np.array([chunk["embedding"] for chunk in chunks], dtype=np.float32)
    print(f"✅ Loaded {len(chunks)} chunks")
    print(f"📊 Embedding shape: {embeddings.shape}")
    
    # Test query
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    
    client = AzureOpenAI(
        api_key=api_key,
        api_version="2025-01-01-preview",
        azure_endpoint=endpoint
    )
    
    query = "breast cancer treatment"
    print(f"🔍 Testing query: {query}")
    
    # Get query embedding
    response = client.embeddings.create(
        input=[query],
        model="text-embedding-3-large"
    )
    query_embedding = np.array(response.data[0].embedding, dtype=np.float32)
    print(f"📊 Query embedding shape: {query_embedding.shape}")
    
    # Calculate similarities
    similarities = np.dot(embeddings, query_embedding) / (
        np.linalg.norm(embeddings, axis=1) * np.linalg.norm(query_embedding)
    )
    
    # Get top 10 results
    top_indices = np.argsort(similarities)[-10:][::-1]
    
    print(f"\n📊 Top 10 similarity scores:")
    for i, idx in enumerate(top_indices):
        chunk = chunks[idx]
        score = similarities[idx]
        pages = chunk.get('pages', 'unknown')
        preview = chunk['text'][:100] + "..." if len(chunk['text']) > 100 else chunk['text']
        print(f"{i+1}. Score: {score:.3f} | Page: {pages} | Text: {preview}")

if __name__ == "__main__":
    test_search()