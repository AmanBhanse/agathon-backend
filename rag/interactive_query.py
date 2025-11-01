"""
Interactive Medical Guidelines Query System

Ask questions about the medical guidelines and get relevant answers with sources.
"""

import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

# Load environment variables
load_dotenv()

class MedicalRAG:
    """Simple RAG system for querying medical guidelines."""
    
    def __init__(self):
        self.data_dir = Path(__file__).parent / "data"
        self.chunks = []
        self.embeddings = None
        self.index = None
        self.client = None
        
        print("🏥 Initializing Medical Guidelines RAG System...")
        self._load_system()
    
    def _load_system(self):
        """Load embeddings, index, and configure OpenAI."""
        
        # Load embeddings
        new_embeddings_path = self.data_dir / "chunks_embeddings_new.json"
        
        if not new_embeddings_path.exists():
            raise FileNotFoundError(f"Embeddings not found: {new_embeddings_path}")
        
        print("📁 Loading chunks and embeddings...")
        with open(new_embeddings_path, 'r', encoding='utf-8') as f:
            self.chunks = json.load(f)
        
        self.embeddings = np.array([chunk["embedding"] for chunk in self.chunks], dtype=np.float32)
        print(f"✅ Loaded {len(self.chunks)} chunks with {self.embeddings.shape[1]}-dimensional embeddings")
        
        # Load FAISS index
        try:
            import faiss
            index_path = self.data_dir / "chunks_new.index"
            if index_path.exists():
                self.index = faiss.read_index(str(index_path))
                print(f"✅ Loaded FAISS index: {self.index.ntotal} vectors")
        except ImportError:
            print("⚠️  Using numpy similarity search (FAISS not available)")
        
        # Configure OpenAI
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
        
        if not api_key or not endpoint:
            raise RuntimeError("Missing Azure OpenAI credentials in .env file")
        
        self.client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        print(f"✅ Connected to Azure OpenAI")
        print("=" * 60)
    
    def search(self, query, top_k=5):
        """Search for relevant chunks using cosine similarity."""
        try:
            # Get query embedding
            response = self.client.embeddings.create(
                input=[query],
                model="text-embedding-3-large"
            )
            query_embedding = np.array(response.data[0].embedding, dtype=np.float32)
            
            # Use cosine similarity for better results
            similarities = np.dot(self.embeddings, query_embedding) / (
                np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            # Get top-k indices
            top_indices = np.argsort(similarities)[-top_k:][::-1]
            
            results = []
            for i, idx in enumerate(top_indices):
                chunk = self.chunks[idx].copy()
                chunk["similarity_score"] = float(similarities[idx])
                chunk["rank"] = i + 1
                results.append(chunk)
            
            return results
        
        except Exception as e:
            print(f"❌ Search error: {e}")
            return []
    
    def generate_answer(self, query, context_chunks):
        """Generate answer using GPT."""
        if not context_chunks:
            return "❌ No relevant information found in the guidelines."
        
        # Use top 3 most relevant chunks
        top_chunks = context_chunks[:3]
        context_text = "\n\n".join([
            f"[Source {chunk['rank']} - Page {chunk.get('pages', 'unknown')} - Score: {chunk['similarity_score']:.3f}]\n{chunk['text']}"
            for chunk in top_chunks
        ])
        
        system_prompt = """You are a medical AI assistant. Provide accurate answers based STRICTLY on the provided context from medical guidelines.

Rules:
1. Only use information from the provided context
2. Include page references when possible
3. Be precise and evidence-based
4. If context is insufficient, clearly state so
5. Use appropriate medical terminology"""
        
        user_prompt = f"""Based on the following medical guidelines context, answer the question.

CONTEXT:
{context_text}

QUESTION: {query}

ANSWER (based only on the provided context):"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=800,
                temperature=0.1
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"❌ Error generating answer: {e}"
    
    def query(self, question):
        """Complete query: search + generate answer."""
        print(f"\n🔍 Searching: {question}")
        
        # Search for relevant content
        results = self.search(question, top_k=5)
        
        if not results:
            print("❌ No relevant information found.")
            return
        
        # Show similarity scores for debugging
        if results:
            max_score = max(r['similarity_score'] for r in results)
            print(f"📊 Best similarity score: {max_score:.3f}")
        
        # Filter results by minimum similarity threshold (very lenient for testing)
        relevant_results = [r for r in results if r['similarity_score'] > 0.15]
        
        if not relevant_results:
            print("❌ No sufficiently relevant information found.")
            print("📊 All similarity scores were below 0.15 threshold")
            # Show top results anyway for debugging
            print("\nTop results found:")
            for r in results[:3]:
                print(f"  • Score: {r['similarity_score']:.3f} | Page: {r.get('pages', 'unknown')}")
            return
        
        print(f"✅ Found {len(relevant_results)} relevant sources")
        
        # Generate answer
        print("🤖 Generating answer...")
        answer = self.generate_answer(question, relevant_results)
        
        # Display results
        print(f"\n📋 **ANSWER:**")
        print(answer)
        print(f"\n📚 **SOURCES:**")
        
        for result in relevant_results:
            pages = result.get('pages', 'unknown')
            score = result['similarity_score']
            preview = result['text'][:150] + "..." if len(result['text']) > 150 else result['text']
            print(f"  • Page {pages} (similarity: {score:.3f})")
            print(f"    {preview}")
        
        print("-" * 80)


def main():
    """Interactive query interface."""
    try:
        # Initialize RAG system
        rag = MedicalRAG()
        
        print("\n🎯 Medical Guidelines Query System Ready!")
        print("\nExample questions:")
        print("  • What are the treatment options for breast cancer?")
        print("  • What are the side effects of chemotherapy?")
        print("  • What are the diagnostic procedures for mammography?")
        print("  • What medications are used for pain management?")
        print("\nType 'quit', 'exit', or 'q' to stop.\n")
        
        while True:
            try:
                question = input("❓ Ask your question: ").strip()
                
                if question.lower() in ['quit', 'exit', 'q', '']:
                    print("👋 Thank you for using the Medical Guidelines system!")
                    break
                
                # Process the query
                rag.query(question)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                continue
    
    except Exception as e:
        print(f"❌ System initialization error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())