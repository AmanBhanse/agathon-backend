"""
Quick embedding test - recompute first 10 chunks with new endpoint
"""
import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def test_recompute():
    # Load first 10 chunks
    base_dir = Path(__file__).parent
    chunks_path = base_dir / "data" / "chunks.json"
    
    with open(chunks_path, 'r', encoding='utf-8') as f:
        chunks = json.load(f)
    
    print(f"📁 Loaded {len(chunks)} total chunks")
    
    # Test with first 10 chunks
    test_chunks = chunks[:10]
    texts = [chunk["text"] for chunk in test_chunks]
    
    # Configure Azure OpenAI
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
    
    client = AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=endpoint
    )
    
    print(f"🔮 Computing embeddings for {len(texts)} chunks...")
    
    # Compute embeddings in smaller batches
    embeddings = []
    for i, text in enumerate(texts):
        print(f"Processing chunk {i+1}/{len(texts)}")
        try:
            response = client.embeddings.create(
                input=[text],
                model="text-embedding-3-large"
            )
            embedding = response.data[0].embedding
            embeddings.append(embedding)
            print(f"✅ Embedding dimension: {len(embedding)}")
        except Exception as e:
            print(f"❌ Error: {e}")
            break
    
    print(f"✅ Completed {len(embeddings)} embeddings")
    
    if embeddings:
        # Save test results
        for i, (chunk, embedding) in enumerate(zip(test_chunks, embeddings)):
            chunk["embedding"] = embedding
        
        output_path = base_dir / "data" / "test_embeddings.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(test_chunks, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Saved test embeddings to {output_path}")

if __name__ == "__main__":
    test_recompute()