import os
import json
import pickle
from dotenv import load_dotenv
from openai import AzureOpenAI
import numpy as np
from typing import List, Tuple, Optional
import PyPDF2

# Load environment variables
load_dotenv()


class RAGSystem:
    """RAG system for querying PDF documents using Azure OpenAI"""
    
    def __init__(self, embeddings_path: str = "embeddings.pkl"):
        # Initialize Azure OpenAI clients
        self.embedding_client = AzureOpenAI(
            api_version=os.getenv("OPENAI_API_VERSION", "2025-01-01-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY")
        )
        
        self.chat_client = AzureOpenAI(
            api_version=os.getenv("OPENAI_API_VERSION", "2025-01-01-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY")
        )
        
        # Storage for document chunks and embeddings
        self.chunks = []
        self.embeddings = []
        self.embeddings_path = embeddings_path
        
        # Try to load existing embeddings
        self.load_embeddings()
        
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def chunk_text(self, text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start += chunk_size - overlap
            
        return chunks
    
    def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for text chunks"""
        embeddings = []
        
        # Process in batches to avoid rate limits
        batch_size = 10
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            response = self.embedding_client.embeddings.create(
                input=batch,
                model="text-embedding-3-large"
            )
            embeddings.extend([item.embedding for item in response.data])
        
        return embeddings

    def save_chunks_json(self, json_path: Optional[str] = None) -> str:
        """Save the current chunks to a JSON file and return its path."""
        if json_path is None:
            base, _ = os.path.splitext(self.embeddings_path)
            json_path = f"{base}_chunks.json"

        try:
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump({'chunks': self.chunks}, f, ensure_ascii=False, indent=2)
            print(f"Chunks saved to JSON: {json_path}")
            return json_path
        except Exception as e:
            raise Exception(f"Error saving chunks JSON: {str(e)}")

    def load_chunks_from_json(self, json_path: str) -> None:
        """Load chunks from a JSON file into self.chunks."""
        if not os.path.exists(json_path):
            raise FileNotFoundError(f"Chunks JSON not found: {json_path}")

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.chunks = data.get('chunks', [])
            print(f"Loaded {len(self.chunks)} chunks from JSON: {json_path}")
        except Exception as e:
            raise Exception(f"Error loading chunks JSON: {str(e)}")

    def create_embeddings_from_json(self, json_path: Optional[str] = None) -> None:
        """Create embeddings by first reading chunks JSON and then generating embeddings."""
        if json_path is None:
            base, _ = os.path.splitext(self.embeddings_path)
            json_path = f"{base}_chunks.json"

        # Ensure chunks are loaded from json
        self.load_chunks_from_json(json_path)

        if not self.chunks:
            raise ValueError("No chunks available to create embeddings from JSON")

        print("Creating embeddings from JSON chunks...")
        self.embeddings = self.create_embeddings(self.chunks)
        print(f"Created {len(self.embeddings)} embeddings from JSON")

        # Persist embeddings along with chunks
        self.save_embeddings()
    
    def save_embeddings(self):
        """Save embeddings and chunks to disk"""
        data = {
            'chunks': self.chunks,
            'embeddings': self.embeddings
        }
        with open(self.embeddings_path, 'wb') as f:
            pickle.dump(data, f)
        print(f"Embeddings saved to {self.embeddings_path}")
    
    def load_embeddings(self) -> bool:
        """Load embeddings and chunks from disk"""
        if os.path.exists(self.embeddings_path):
            try:
                with open(self.embeddings_path, 'rb') as f:
                    data = pickle.load(f)
                    self.chunks = data['chunks']
                    self.embeddings = data['embeddings']
                print(f"Loaded {len(self.chunks)} chunks from {self.embeddings_path}")
                return True
            except Exception as e:
                print(f"Error loading embeddings: {str(e)}")
                return False
        return False
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        magnitude = np.linalg.norm(vec1) * np.linalg.norm(vec2)
        if magnitude == 0:
            return 0
        return np.dot(vec1, vec2) / magnitude
    
    def find_relevant_chunks(self, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
        """Find most relevant chunks for a query"""
        if not self.embeddings:
            raise ValueError("No embeddings loaded. Please index a PDF first.")
        
        # Create embedding for query
        query_response = self.embedding_client.embeddings.create(
            input=[query],
            model="text-embedding-3-large"
        )
        query_embedding = query_response.data[0].embedding
        
        # Calculate similarities
        similarities = []
        for i, chunk_embedding in enumerate(self.embeddings):
            similarity = self.cosine_similarity(query_embedding, chunk_embedding)
            similarities.append((self.chunks[i], similarity))
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]
    
    def load_pdf(self, pdf_path: str, chunk_size: int = 1000, overlap: int = 200):
        """Load and process PDF document"""
        print(f"Loading PDF: {pdf_path}")
        text = self.extract_text_from_pdf(pdf_path)
        
        print("Chunking text...")
        self.chunks = self.chunk_text(text, chunk_size, overlap)
        print(f"Created {len(self.chunks)} chunks")

        # Save chunks to JSON first (two-step process)
        chunks_json_path = self.save_chunks_json()

        # Create embeddings from the JSON file we just wrote
        self.create_embeddings_from_json(chunks_json_path)

        print("PDF loaded and indexed successfully!")
    
    def query(self, question: str, model: str = "gpt-4o-mini", 
              temperature: float = 0.3, top_k: int = 3) -> Tuple[str, List[dict]]:
        """Query the RAG system"""
        # Find relevant chunks
        relevant_chunks = self.find_relevant_chunks(question, top_k=top_k)
        
        # Build context from relevant chunks
        context = "\n\n".join([chunk for chunk, _ in relevant_chunks])
        
        # Create prompt with context
        system_prompt = """You are a helpful assistant that answers questions about breast cancer guidelines and treatment recommendations.
Use only the information from the provided context to answer questions. If the answer cannot be found in the context, say so clearly.
Provide evidence-based, clinical guidance based on the S3 Guideline Breast Cancer document."""
        
        user_prompt = f"""Context from S3 Guideline Breast Cancer:
{context}

Question: {question}

Answer based on the context above:"""
        
        # Get response from LLM
        response = self.chat_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=1000
        )
        
        # Format relevant chunks for response
        chunks_data = [
            {"text": chunk[:300] + "..." if len(chunk) > 300 else chunk, "similarity": float(score)}
            for chunk, score in relevant_chunks
        ]
        
        return response.choices[0].message.content, chunks_data
