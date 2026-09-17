from typing import List
from models.schemas import RetrievalInput, RetrievalOutput, Citation
from agents.base import PipelineStage
from graph.legal_graph import legal_graph
from rag.vector_store import get_vector_store
from rag.knowledge_base import get_all_provisions

class RetrievalAgentStage(PipelineStage):
    """
    Stage 4 & 5: Retrieval Agent & Dynamic Legal Knowledge Graph
    Executes hybrid retrieval:
    1. Vector retrieval against Constitution of India text chunks.
    2. Graph traversal to fetch citing precedents, overruled decisions, and doctrines.
    """

    @property
    def stage_id(self) -> str:
        return "retrieval"

    @property
    def stage_name(self) -> str:
        return "Retrieval Agent & Legal Knowledge Graph"

    async def process(self, input_data: RetrievalInput) -> RetrievalOutput:
        intake = input_data.intake
        query = intake.normalized_query
        
        # 1. Vector Search against Constitution of India
        citations: List[Citation] = []
        try:
            store = get_vector_store()
            results = store.search(query, k=4)
            for r in results:
                citations.append(Citation(
                    source_id=r.get("article_number", "Article"),
                    title=f"{r.get('article_number', 'Art')}: {r.get('title', '')}",
                    text_snippet=r.get("text", "")[:400],
                    relevance_score=round(float(r.get("relevance_score", 0.85)), 2)
                ))
        except Exception as e:
            print(f"[RetrievalAgent] Vector store search fallback: {e}")
            provisions = get_all_provisions()
            matched = [a for a in provisions if any(e.lower() in a["text"].lower() or e.lower() in a["title"].lower() for e in intake.entities)]
            if not matched:
                matched = provisions[:3]
            for a in matched[:4]:
                citations.append(Citation(
                    source_id=a["article_number"],
                    title=f"{a['article_number']}: {a['title']}",
                    text_snippet=a["text"][:400],
                    relevance_score=0.90
                ))

        # 2. Graph Traversal for Precedents, Overrulings, and Doctrines
        extracted_articles = [c.source_id for c in citations]
        graph_data = legal_graph.query_graph_context(extracted_articles, intake.entities)
        graph_summary_str = legal_graph.format_graph_context_string(graph_data)

        # Append key precedents as citations with graph relevance
        for p in graph_data.get("precedents", [])[:3]:
            citations.append(Citation(
                source_id=p.get("case_id", "Precedent"),
                title=f"Landmark Case: {p['name']}",
                text_snippet=f"{p['summary']} Relationship: {p['relation']} ({p.get('note', '')})",
                relevance_score=0.95
            ))

        return RetrievalOutput(
            retrieved_documents=citations,
            graph_context=graph_summary_str
        )
