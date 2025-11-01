"""
RAG Query System for Guidelines PDF

Interactive system to query the guidelines using embeddings and GPT models.

Usage:
    python rag_query.py
    
Features:
- Loads precomputed embeddings and FAISS index
- Semantic search using vector similarity
- GPT-powered response generation with context
- Interactive CLI interface
"""

import json
import os
import numpy as np
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class RAGSystem:
    """Complete RAG system for querying guidelines."""
    
    def __init__(self, data_dir="data"):
        self.data_dir = Path(__file__).parent / data_dir
        self.chunks = []
        self.embeddings = None
        self.index = None
        self.client = None
        
        self._load_system()
    
    def _load_system(self):
        """Load embeddings, FAISS index, and configure OpenAI."""
        print("🔄 Loading RAG system...")
        
        # Load chunks with embeddings - try new embeddings first
        new_embeddings_path = self.data_dir / "chunks_embeddings_new.json"
        old_embeddings_path = self.data_dir / "chunks_embeddings.json"
        
        if new_embeddings_path.exists():
            embeddings_path = new_embeddings_path
            index_path = self.data_dir / "chunks_new.index"
            print("📁 Using new embeddings (3072 dimensions)")
        elif old_embeddings_path.exists():
            embeddings_path = old_embeddings_path
            index_path = self.data_dir / "chunks.index"
            print("📁 Using old embeddings (1536 dimensions)")
        else:
            raise FileNotFoundError(f"No embeddings file found in {self.data_dir}")
        
        print("📁 Loading chunks and embeddings...")
        with open(embeddings_path, 'r', encoding='utf-8') as f:
            self.chunks = json.load(f)
        
        # Extract embeddings
        self.embeddings = np.array([chunk["embedding"] for chunk in self.chunks], dtype=np.float32)
        embedding_dim = self.embeddings.shape[1] if len(self.embeddings) > 0 else 0
        print(f"✅ Loaded {len(self.chunks)} chunks with {embedding_dim}-dimensional embeddings")
        
        # Load FAISS index
        try:
            import faiss
            if index_path.exists():
                self.index = faiss.read_index(str(index_path))
                print(f"✅ Loaded FAISS index: {self.index.ntotal} vectors")
            else:
                print("⚠️  FAISS index not found, using numpy similarity search")
        except ImportError:
            print("⚠️  FAISS not available, using numpy similarity search")
        
        # Configure OpenAI client
        self.client = self._configure_openai()
        if not self.client:
            raise RuntimeError("Failed to configure OpenAI client")
    
    def _configure_openai(self):
        """Configure Azure OpenAI client."""
        try:
            from openai import AzureOpenAI
        except ImportError:
            print("❌ Error: openai package not installed. Run: pip install openai")
            return None
        
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
        
        if not api_key or not endpoint:
            print("❌ Missing Azure OpenAI credentials in .env file")
            return None
        
        client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        
        print(f"✅ Configured Azure OpenAI: {endpoint}")
        return client
    
    def get_query_embedding(self, query, model="text-embedding-3-large"):
        """Get embedding for a query text."""
        try:
            response = self.client.embeddings.create(
                input=[query],
                model=model
            )
            return np.array(response.data[0].embedding, dtype=np.float32)
        except Exception as e:
            print(f"❌ Error getting query embedding: {e}")
            return None
    
    def search_similar_chunks(self, query, top_k=5):
        """Search for similar chunks using embeddings."""
        query_embedding = self.get_query_embedding(query)
        if query_embedding is None:
            return []
        
        if self.index is not None:
            # Use FAISS for fast similarity search
            distances, indices = self.index.search(query_embedding.reshape(1, -1), top_k)
            results = []
            for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(self.chunks):  # Valid index
                    chunk = self.chunks[idx].copy()
                    chunk["similarity_score"] = float(1 - dist)  # Convert distance to similarity
                    chunk["rank"] = i + 1
                    results.append(chunk)
            return results
        else:
            # Fallback to numpy cosine similarity
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
    
    def generate_answer(self, query, context_chunks, model="gpt-4.1"):
        """Generate an answer using GPT with context."""
        if not context_chunks:
            return "I couldn't find relevant information in the guidelines to answer your question."
        
        # Prepare context
        context_text = "\n\n".join([
            f"[Chunk {chunk['rank']} - Page {chunk.get('pages', 'unknown')} - Similarity: {chunk['similarity_score']:.3f}]\n{chunk['text']}"
            for chunk in context_chunks[:3]  # Use top 3 chunks
        ])
        
        # Create system prompt
        system_prompt = """You are an AI assistant specialized in medical guidelines. You provide accurate, evidence-based answers based strictly on the provided context from medical guidelines.

Guidelines for responses:
1. Base your answer ONLY on the provided context
2. If the context doesn't contain sufficient information, say so clearly
3. Include page references when mentioning specific guidelines
4. Use medical terminology appropriately
5. Be precise and avoid speculation
6. If multiple guidelines conflict, mention both viewpoints"""
        
        # Create user prompt
        user_prompt = f"""Based on the following context from medical guidelines, please answer the question.

CONTEXT:
{context_text}

QUESTION: {query}

ANSWER:"""
        
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1000,
                temperature=0.1  # Low temperature for factual responses
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating response: {e}"
    
    def query(self, question, top_k=5, model="gpt-4.1", show_sources=True):
        """Complete query pipeline: search + generate answer."""
        print(f"\n🔍 Searching for: {question}")
        
        # Search for relevant chunks
        relevant_chunks = self.search_similar_chunks(question, top_k)
        
        if not relevant_chunks:
            return "No relevant information found in the guidelines."
        
        print(f"✅ Found {len(relevant_chunks)} relevant chunks")
        
        # Generate answer
        print("🤖 Generating answer...")
        answer = self.generate_answer(question, relevant_chunks, model)
        
        # Format response
        result = f"\n📋 **ANSWER:**\n{answer}\n"
        
        if show_sources:
            result += "\n📚 **SOURCES:**\n"
            for chunk in relevant_chunks:
                pages = chunk.get('pages', 'unknown')
                score = chunk['similarity_score']
                text_preview = chunk['text'][:200] + "..." if len(chunk['text']) > 200 else chunk['text']
                result += f"• Page {pages} (similarity: {score:.3f}): {text_preview}\n"
        
        return result


def main():
    """Interactive CLI interface."""
    print("🏥 Medical Guidelines RAG System")
    print("=" * 50)
    
    try:
        # Initialize RAG system
        rag = RAGSystem()
        print("\n✅ RAG system ready!")
        
        print("\nExample queries:")
        print("• 'What are the treatment guidelines for diabetes?'")
        print("• 'What are the diagnostic criteria for hypertension?'")
        print("• 'What medications are recommended for heart failure?'")
        print("\nType 'quit' or 'exit' to stop.\n")
        
        while True:
            try:
                query = input("🤔 Enter your question: ").strip()
                
                if query.lower() in ['quit', 'exit', 'q']:
                    print("👋 Goodbye!")
                    break
                
                if not query:
                    continue
                
                # Process query
                response = rag.query(query, top_k=5, show_sources=True)
                print(response)
                print("-" * 80)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                import traceback
                print(f"❌ Error processing query: {e}")
                print("Full error details:")
                traceback.print_exc()
                continue
    
    except Exception as e:
        print(f"❌ Error initializing RAG system: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())