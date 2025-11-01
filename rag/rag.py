"""Extract and chunk `guidelines.pdf` then save chunks to JSON.

This script replaces the previous full RAG pipeline with a safe extraction-and-chunk step
that does not call any external APIs. It writes `rag/data/chunks.json`.
"""

from pathlib import Path
import json
import sys

try:
    # prefer pypdf if available
    from pypdf import PdfReader
except Exception:
    try:
        from PyPDF2 import PdfReader
    except Exception:
        print("Missing PDF reader. Install `pypdf` or `PyPDF2`.")
        sys.exit(2)


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100):
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
        chunks.append({
            "id": idx,
            "text": text[start:end].strip(),
            "start": start,
            "end": end,
        })
        idx += 1
        if end == length:
            break
        start = end - overlap
    return chunks


def map_chunk_pages(chunks, pages_texts):
    # build cumulative lengths
    cum = [0]
    for p in pages_texts:
        cum.append(cum[-1] + len(p))

    for c in chunks:
        s, e = c["start"], c["end"]
        # find pages that overlap [s,e)
        pages = []
        for i in range(len(pages_texts)):
            p_start, p_end = cum[i], cum[i + 1]
            if not (e <= p_start or s >= p_end):
                pages.append(i + 1)  # 1-based page numbers
        c["pages"] = pages
    return chunks


def main():
    base = Path(__file__).resolve().parent
    pdf_path = base / "guidelines.pdf"
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        sys.exit(3)

    reader = PdfReader(str(pdf_path))
    # original script targeted pages 37..467 (1-based). We'll cap to available pages.
    start_page = 37
    end_page = 467
    total_pages = len(reader.pages)
    start_idx = max(0, start_page - 1)
    end_idx = min(total_pages, end_page)  # end_idx is exclusive when slicing

    pages_texts = []
    for i in range(start_idx, end_idx):
        txt = reader.pages[i].extract_text() or ""
        pages_texts.append(txt)

    full_text = "\n\n".join(pages_texts)
    print(f"Extracted {len(full_text)} characters from pages {start_page}..{min(end_page, total_pages)}")

    chunks = chunk_text(full_text, chunk_size=1000, overlap=100)
    chunks = map_chunk_pages(chunks, pages_texts)

    data_dir = base / "data"
    data_dir.mkdir(exist_ok=True)
    out_path = data_dir / "chunks.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(chunks)} chunks to {out_path}")

# 





if __name__ == "__main__":
    main()
