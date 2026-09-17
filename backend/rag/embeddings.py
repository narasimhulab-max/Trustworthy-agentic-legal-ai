"""
NyayaAI — Embeddings Module
Generates sentence embeddings for constitutional provisions using Sentence Transformers.
"""

import logging
import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Model: lightweight, fast, good semantic quality
MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def get_model() -> SentenceTransformer:
    """Lazy-load the sentence transformer model (singleton)."""
    global _model
    if _model is None:
        logger.info(f"Loading embedding model: {MODEL_NAME}...")
        _model = SentenceTransformer(MODEL_NAME)
        logger.info("Embedding model loaded.")
    return _model


def generate_embeddings(texts: list[str]) -> np.ndarray:
    """
    Generate embeddings for a list of texts.

    Args:
        texts: List of text strings to embed.

    Returns:
        numpy array of shape (len(texts), embedding_dim)
    """
    model = get_model()
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )
    logger.info(f"Generated {len(embeddings)} embeddings of dimension {embeddings.shape[1]}.")
    return embeddings


def generate_query_embedding(query: str) -> np.ndarray:
    """
    Generate embedding for a single query string.

    Args:
        query: The search query text.

    Returns:
        numpy array of shape (1, embedding_dim)
    """
    model = get_model()
    embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
    )
    return embedding
