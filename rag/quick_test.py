"""
Simple test of query system
"""
from interactive_query import MedicalRAG

# Initialize system
print("Initializing RAG system...")
rag = MedicalRAG()

# Test query
print("\n" + "="*80)
query = "What are the treatment options for breast cancer?"
print(f"Testing query: {query}")
print("="*80)

rag.query(query)

print("\n" + "="*80)
query = "What are the side effects of chemotherapy?"
print(f"Testing query: {query}")
print("="*80)

rag.query(query)