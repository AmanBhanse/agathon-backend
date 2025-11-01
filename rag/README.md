RAG quick start
===============

This folder provides a minimal Retrieval-Augmented-Generation (RAG) pipeline for `guidelines.pdf`.

What the scripts do
- `extract_and_index.py`: Extracts text from `guidelines.pdf`, chunks it, computes OpenAI embeddings, and saves them to `rag/data/`.
- `query_cli.py`: Simple interactive CLI — load the index, retrieve relevant chunks, and call OpenAI chat to answer the user question.

Azure OpenAI
--------------
This code supports both OpenAI and Azure OpenAI. If you have an Azure OpenAI deployment, set the following in `rag/.env` or your shell:

```text
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
OPENAI_API_VERSION=2024-10-01
AZURE_OPENAI_CHAT_MODEL=gpt-4o-mini
```

When Azure env vars are present the scripts will use the Azure client and the embedding model `text-embedding-3-large` by default.

Requirements
- Python packages listed in `rag/requirements.txt` plus `pypdf` (for PDF extraction).
- An OpenAI API key available as `OPENAI_API_KEY` in the environment or in `rag/.env`.

Quick usage
1. (Optional) create a virtual environment and install deps:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r rag/requirements.txt pypdf
```

2. Put your OpenAI key in `rag/.env` or your shell env:

```text
OPENAI_API_KEY=sk-...your key...
```

3. Build the index:

```powershell
python rag/extract_and_index.py
```

4. Query interactively:

```powershell
python rag/query_cli.py
```

Notes and caveats
- This is a minimal example for convenience and demonstration. For production consider:
  - persisting an efficient vector DB (FAISS, Milvus, Pinecone)
  - caching and batching embeddings
  - handling token limits when building prompts
  - improving chunking by sentence boundaries (e.g., use an NLP sentence tokenizer)
