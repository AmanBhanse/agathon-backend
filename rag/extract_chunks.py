"""Extract `guidelines.pdf`, split into overlapping chunks, and save chunks to JSON.

Usage:
    python rag/extract_chunks.py --chunk-size 1200 --overlap 200

Outputs:
    rag/data/chunks.json  (list of {id, text, start, end, pages})

Note: requires `pypdf`.
"""
from pathlib import Path
import json
import argparse
import sys


def chunk_text_with_positions(text: str, chunk_size: int = 1000, overlap: int = 200):
    if chunk_size <= 0:
        raise ValueError("chunk_size must be > 0")
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks = []
    start = 0
    length = len(text)
    idx = 0
    while start < length:
        end = min(start + chunk_size, length)
        chunk_text = text[start:end].strip()
        chunks.append({
            "id": idx,
            "text": chunk_text,
            "start": start,
            "end": end,
        })
        idx += 1
        if end == length:
            break
        start = end - overlap
    return chunks


def extract_pdf_text_per_page(pdf_path: Path):
    try:
        from pypdf import PdfReader
    except Exception:
        print("Missing dependency 'pypdf'. Install with: pip install pypdf")
        sys.exit(2)

    reader = PdfReader(str(pdf_path))
    pages_text = []
    for i, p in enumerate(reader.pages, start=1):
        texts = p.extract_text() or ""
        pages_text.append({"page": i, "text": texts})
    return pages_text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--chunk-size", type=int, default=1200)
    parser.add_argument("--overlap", type=int, default=200)
    args = parser.parse_args()

    base = Path(__file__).resolve().parent
    pdf_path = base / "guidelines.pdf"
    data_dir = base / "data"
    data_dir.mkdir(exist_ok=True)
    out_path = data_dir / "chunks.json"

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        sys.exit(3)

    pages = extract_pdf_text_per_page(pdf_path)
    # Concatenate with page markers to keep simple page references
    joined = []
    cursor = 0
    for p in pages:
        text = p["text"]
        joined.append(text)
        cursor += len(text)

    full_text = "\n\n".join([p["text"] for p in pages])
    chunks = chunk_text_with_positions(full_text, chunk_size=args.chunk_size, overlap=args.overlap)

    # Save chunks to JSON with minimal metadata
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(chunks)} chunks to {out_path}")


if __name__ == "__main__":
    main()
