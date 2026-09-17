"""
NyayaAI — Hybrid Vector Store & Search Engine
Provides semantic and keyword-ranked retrieval over constitutional provisions.
Resilient design: works with FAISS when available, or built-in BM25/Cosine ranking engine.
"""

import os
import json
import math
import re
import logging
from typing import List, Dict, Any, Optional
from rag.knowledge_base import get_all_provisions

logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
INDEX_FILE = os.path.join(DATA_DIR, "faiss_index.bin")
METADATA_FILE = os.path.join(DATA_DIR, "index_metadata.json")

class BM25SearchEngine:
    """Built-in pure-Python BM25 scoring engine for zero-dependency instant retrieval."""
    def __init__(self, corpus: List[Dict[str, Any]]):
        self.corpus = corpus
        self.doc_lengths = []
        self.avg_doc_len = 0.0
        self.doc_freqs: Dict[str, int] = {}
        self.doc_token_counts: List[Dict[str, int]] = []
        self.k1 = 1.5
        self.b = 0.75
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_]+\b', text.lower())

    def _build_index(self):
        total_len = 0
        for doc in self.corpus:
            full_text = f"{doc.get('article_number', '')} {doc.get('title', '')} {doc.get('text', '')}"
            tokens = self._tokenize(full_text)
            self.doc_lengths.append(len(tokens))
            total_len += len(tokens)
            
            counts: Dict[str, int] = {}
            for t in tokens:
                counts[t] = counts.get(t, 0) + 1
            self.doc_token_counts.append(counts)
            
            for t in counts.keys():
                self.doc_freqs[t] = self.doc_freqs.get(t, 0) + 1

        self.avg_doc_len = (total_len / len(self.corpus)) if self.corpus else 1.0

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return self.corpus[:top_k]

        n_docs = len(self.corpus)
        scores = []

        for idx, doc in enumerate(self.corpus):
            score = 0.0
            doc_len = self.doc_lengths[idx]
            counts = self.doc_token_counts[idx]

            # Boost exact article number matches (e.g. "Article 21")
            art_num = doc.get("article_number", "").lower()
            if art_num and any(art_num.replace("article", "").strip() == qt for qt in query_tokens):
                score += 25.0

            for qt in query_tokens:
                if qt in counts:
                    df = self.doc_freqs.get(qt, 1)
                    idf = math.log(1.0 + (n_docs - df + 0.5) / (df + 0.5))
                    tf = counts[qt]
                    denom = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / self.avg_doc_len))
                    score += idf * ((tf * (self.k1 + 1.0)) / denom)

            # Boost fundamental rights articles
            if "part iii" in doc.get("part", "").lower():
                score *= 1.15

            scores.append((score, idx))

        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for s, idx in scores[:top_k]:
            item = self.corpus[idx].copy()
            # Normalize score into a friendly 0.70 - 0.98 relevance range
            rel_score = round(min(0.98, max(0.70, 0.70 + (s / (scores[0][0] + 1e-5)) * 0.28)), 2) if scores else 0.85
            item["relevance_score"] = rel_score
            results.append(item)

        return results

_bm25_engine: Optional[BM25SearchEngine] = None

def get_vector_store():
    """Returns vector store search interface."""
    return VectorStoreInterface()

class VectorStoreInterface:
    def __init__(self):
        global _bm25_engine
        if _bm25_engine is None:
            provisions = get_all_provisions()
            _bm25_engine = BM25SearchEngine(provisions)

    def search(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        # Try FAISS if available and built, otherwise use BM25
        try:
            import faiss
            import numpy as np
            from rag.embeddings import generate_query_embedding
            if os.path.exists(INDEX_FILE) and os.path.exists(METADATA_FILE):
                index = faiss.read_index(INDEX_FILE)
                with open(METADATA_FILE, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                q_emb = generate_query_embedding(query)
                scores, indices = index.search(q_emb.astype(np.float32), k)
                res = []
                for score, idx in zip(scores[0], indices[0]):
                    if 0 <= idx < len(meta):
                        art = meta[idx].copy()
                        art["relevance_score"] = round(float(score), 4)
                        res.append(art)
                if res:
                    return res
        except Exception:
            pass

        # Fallback to BM25 search engine
        return _bm25_engine.search(query, top_k=k)
