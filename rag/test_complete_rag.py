"""
Complete RAG System Test with Full New Embeddings
"""
import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

class CompleteRAGSystem:
    """Complete RAG system using new 3072-dimensional embeddings"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.chunks = []
        self.embeddings = None
        self.index = None
        self.client = None
        
        self._load_system()
    
    def _load_system(self):
        """Load new embeddings and configure client"""
        print("🔄 Loading complete RAG system...")
        
        # Load new embeddings
        embeddings_path = self.base_dir / "data" / "chunks_embeddings_new.json"
        if not embeddings_path.exists():
            raise FileNotFoundError(f"New embeddings file not found: {embeddings_path}")
        
        print(f"📁 Loading from: {embeddings_path}")
        with open(embeddings_path, 'r', encoding='utf-8') as f:
            self.chunks = json.load(f)
        
        # Extract embeddings
        self.embeddings = np.array([chunk["embedding"] for chunk in self.chunks], dtype=np.float32)
        print(f"✅ Loaded {len(self.chunks)} chunks with {self.embeddings.shape[1]}-dimensional embeddings")
        
        # Load FAISS index
        try:
            import faiss
            index_path = self.base_dir / "data" / "chunks_new.index"
            if index_path.exists():
                self.index = faiss.read_index(str(index_path))
                print(f"✅ Loaded FAISS index: {self.index.ntotal} vectors")
            else:
                print("⚠️  New FAISS index not found")
        except ImportError:
            print("⚠️  FAISS not available")
        
        # Configure Azure OpenAI
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
        
        self.client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        print(f"✅ Configured Azure OpenAI")
    
    def search(self, query, top_k=5):
        """Search for relevant chunks"""
        # Get query embedding
        response = self.client.embeddings.create(
            input=[query],
            model="text-embedding-3-large"
        )
        query_embedding = np.array(response.data[0].embedding, dtype=np.float32)
        
        if self.index is not None:
            # Use FAISS for fast search
            distances, indices = self.index.search(query_embedding.reshape(1, -1), top_k)
            results = []
            for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(self.chunks):
                    chunk = self.chunks[idx].copy()
                    chunk["similarity_score"] = float(1 - dist / 2)  # Convert L2 distance to similarity
                    chunk["rank"] = i + 1
                    results.append(chunk)
            return results
        else:
            # Fallback to numpy cosine similarity
            similarities = np.dot(self.embeddings, query_embedding) / (
                np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            top_indices = np.argsort(similarities)[-top_k:][::-1]
            results = []
            for i, idx in enumerate(top_indices):
                chunk = self.chunks[idx].copy()
                chunk["similarity_score"] = float(similarities[idx])
                chunk["rank"] = i + 1
                results.append(chunk)
            
            return results
    
    def generate_answer(self, query, context_chunks):
        """Generate answer using GPT"""
        if not context_chunks:
            return "I couldn't find relevant information in the guidelines."
        
        # Prepare context from top 3 chunks
        context_text = "\n\n".join([
            f"[Page {chunk.get('pages', 'unknown')} - Relevance: {chunk['similarity_score']:.3f}]\n{chunk['text']}"
            for chunk in context_chunks[:3]
        ])
        
        system_prompt = """You are a medical AI assistant that provides accurate answers based strictly on medical guidelines. 

Rules:
1. Answer ONLY based on the provided context
2. Include page references when available
3. If the context doesn't contain sufficient information, say so clearly
4. Use precise medical terminology
5. Be factual and avoid speculation"""
        
        user_prompt = f"""Based on the medical guidelines context below, answer the question.

CONTEXT FROM MEDICAL GUIDELINES:
{context_text}

QUESTION: {query}

ANSWER (based only on the provided context):"""
        
        response = self.client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.1
        )
        
        return response.choices[0].message.content.strip()
    
    def query(self, question, show_sources=True):
        """Complete query pipeline"""
        print(f"\n🔍 Query: {question}")
        
        # Search
        results = self.search(question, top_k=5)
        
        if not results:
            return "No relevant information found."
        
        print(f"✅ Found {len(results)} relevant chunks")
        
        # Generate answer
        answer = self.generate_answer(question, results)
        
        # Format response
        output = f"\n📋 **ANSWER:**\n{answer}\n"
        
        if show_sources:
            output += "\n📚 **SOURCES:**\n"
            for chunk in results:
                pages = chunk.get('pages', 'unknown')
                score = chunk['similarity_score']
                text_preview = chunk['text'][:150] + "..." if len(chunk['text']) > 150 else chunk['text']
                output += f"• Page {pages} (score: {score:.3f}): {text_preview}\n"
        
        return output


def test_rag_system():
    """Test the complete RAG system with various queries"""
    print("🏥 Testing Complete RAG System")
    print("=" * 50)
    
    try:
        rag = CompleteRAGSystem()
        print("✅ RAG system initialized successfully!\n")
        
        # Test queries
        test_queries = [
            "What are the treatment guidelines for breast cancer?",
            "What are the diagnostic criteria for hypertension?",
            "What medications are recommended for diabetes?",
            "What are the side effects of chemotherapy?",
        ]
        
        for query in test_queries:
            try:
                response = rag.query(query)
                print(response)
                print("-" * 80)
            except Exception as e:
                print(f"❌ Error with query '{query}': {e}\n")
        
    except Exception as e:
        import traceback
        print(f"❌ System initialization error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_rag_system()