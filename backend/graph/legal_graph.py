from typing import List, Dict, Any, Optional

try:
    import networkx as nx
    HAS_NETWORKX = True
except ImportError:
    HAS_NETWORKX = False

class SimpleGraphFallback:
    """Lightweight in-memory directed graph fallback when networkx is not installed."""
    def __init__(self):
        self.nodes_data: Dict[str, Dict[str, Any]] = {}
        self.adj_out: Dict[str, Dict[str, Dict[str, Any]]] = {}
        self.adj_in: Dict[str, Dict[str, Dict[str, Any]]] = {}

    def add_node(self, node_id: str, **attrs):
        self.nodes_data[node_id] = attrs
        if node_id not in self.adj_out:
            self.adj_out[node_id] = {}
        if node_id not in self.adj_in:
            self.adj_in[node_id] = {}

    def add_edge(self, src: str, dst: str, **attrs):
        if src not in self.adj_out:
            self.adj_out[src] = {}
        if dst not in self.adj_in:
            self.adj_in[dst] = {}
        self.adj_out[src][dst] = attrs
        self.adj_in[dst][src] = attrs

    def predecessors(self, node: str):
        return list(self.adj_in.get(node, {}).keys())

    def successors(self, node: str):
        return list(self.adj_out.get(node, {}).keys())

    def get_edge_data(self, src: str, dst: str):
        return self.adj_out.get(src, {}).get(dst, {})

    @property
    def nodes(self):
        return self.nodes_data

class LegalKnowledgeGraph:
    """
    In-memory Dynamic Legal Knowledge Graph.
    Uses NetworkX if available, or lightweight Graph fallback.
    Models Statutes, Landmark Judgments, and Legal Doctrines with explicit relationships.
    """
    
    def __init__(self):
        if HAS_NETWORKX:
            self.graph = nx.DiGraph()
        else:
            self.graph = SimpleGraphFallback()
        self._populate_initial_graph()

    def _populate_initial_graph(self):
        articles = [
            {"id": "ART_14", "type": "Article", "title": "Article 14: Equality before law", "part": "Part III - Fundamental Rights"},
            {"id": "ART_19", "type": "Article", "title": "Article 19: Protection of certain rights regarding freedom of speech, etc.", "part": "Part III - Fundamental Rights"},
            {"id": "ART_21", "type": "Article", "title": "Article 21: Protection of life and personal liberty", "part": "Part III - Fundamental Rights"},
            {"id": "ART_21A", "type": "Article", "title": "Article 21A: Right to education", "part": "Part III - Fundamental Rights"},
            {"id": "ART_25", "type": "Article", "title": "Article 25: Freedom of conscience and free profession, practice and propagation of religion", "part": "Part III - Fundamental Rights"},
            {"id": "ART_32", "type": "Article", "title": "Article 32: Remedies for enforcement of rights conferred by this Part", "part": "Part III - Fundamental Rights"},
            {"id": "ART_226", "type": "Article", "title": "Article 226: Power of High Courts to issue certain writs", "part": "Part VI - The States"},
            {"id": "ART_368", "type": "Article", "title": "Article 368: Power of Parliament to amend the Constitution and procedure therefor", "part": "Part XX - Amendment of Constitution"},
            {"id": "ART_300A", "type": "Article", "title": "Article 300A: Persons not to be deprived of property save by authority of law", "part": "Part XII - Finance, Property, Contracts and Suits"}
        ]
        for art in articles:
            self.graph.add_node(art["id"], **art)

        cases = [
            {"id": "CASE_KESAVANANDA", "type": "Precedent", "name": "Kesavananda Bharati v. State of Kerala (1973)", "year": 1973, "bench": "13 Judges", "summary": "Established the Basic Structure Doctrine."},
            {"id": "CASE_MANEKA_GANDHI", "type": "Precedent", "name": "Maneka Gandhi v. Union of India (1978)", "year": 1978, "bench": "7 Judges", "summary": "Expanded Art 21 to include procedure that is just, fair and reasonable, not arbitrary."},
            {"id": "CASE_PUTTASWAMY", "type": "Precedent", "name": "Justice K.S. Puttaswamy v. Union of India (2017)", "year": 2017, "bench": "9 Judges", "summary": "Right to Privacy declared an intrinsic part of the Right to Life and Personal Liberty under Art 21."},
            {"id": "CASE_SHREYA_SINGHAL", "type": "Precedent", "name": "Shreya Singhal v. Union of India (2015)", "year": 2015, "bench": "2 Judges", "summary": "Struck down Section 66A of IT Act as violative of Article 19(1)(a)."},
            {"id": "CASE_MINERVA_MILLS", "type": "Precedent", "name": "Minerva Mills Ltd. v. Union of India (1980)", "year": 1980, "bench": "5 Judges", "summary": "Reaffirmed the harmony between Fundamental Rights and Directive Principles as basic structure."},
            {"id": "CASE_AK_GOPALAN", "type": "Precedent", "name": "A.K. Gopalan v. State of Madras (1950)", "year": 1950, "bench": "6 Judges", "summary": "Narrow interpretation of Art 21 (procedure established by law). Later overruled by Maneka Gandhi."}
        ]
        for case in cases:
            self.graph.add_node(case["id"], **case)

        doctrines = [
            {"id": "DOC_BASIC_STRUCTURE", "type": "Doctrine", "name": "Basic Structure Doctrine", "domain": "Constitutional"},
            {"id": "DOC_DUE_PROCESS", "type": "Doctrine", "name": "Substantive Due Process / Fairness", "domain": "Constitutional/Criminal"},
            {"id": "DOC_PROPORTIONALITY", "type": "Doctrine", "name": "Proportionality Standard", "domain": "Constitutional"},
            {"id": "DOC_SEVERABILITY", "type": "Doctrine", "name": "Doctrine of Severability", "domain": "Constitutional"}
        ]
        for doc in doctrines:
            self.graph.add_node(doc["id"], **doc)

        edges = [
            ("CASE_KESAVANANDA", "ART_368", {"relation": "INTERPRETS", "note": "Amending power limited by basic structure"}),
            ("CASE_KESAVANANDA", "DOC_BASIC_STRUCTURE", {"relation": "ESTABLISHES", "note": "Created basic structure test"}),
            ("CASE_MANEKA_GANDHI", "ART_21", {"relation": "INTERPRETS", "note": "Expanded procedure to require fairness"}),
            ("CASE_MANEKA_GANDHI", "ART_14", {"relation": "INTERPRETS", "note": "Interconnected Articles 14, 19, and 21 (Golden Triangle)"}),
            ("CASE_MANEKA_GANDHI", "ART_19", {"relation": "INTERPRETS", "note": "Golden Triangle linkage"}),
            ("CASE_MANEKA_GANDHI", "CASE_AK_GOPALAN", {"relation": "OVERRULES", "note": "Overruled literalist interpretation"}),
            ("CASE_MANEKA_GANDHI", "DOC_DUE_PROCESS", {"relation": "ESTABLISHES", "note": "Introduced American substantive due process flavor"}),
            ("CASE_PUTTASWAMY", "ART_21", {"relation": "INTERPRETS", "note": "Right to privacy is protected under Art 21"}),
            ("CASE_PUTTASWAMY", "DOC_PROPORTIONALITY", {"relation": "APPLIES", "note": "Three-fold test: legality, need, proportionality"}),
            ("CASE_SHREYA_SINGHAL", "ART_19", {"relation": "INTERPRETS", "note": "Protection of online speech under 19(1)(a)"}),
            ("CASE_MINERVA_MILLS", "ART_368", {"relation": "INTERPRETS", "note": "Limited amending power is basic structure"}),
            ("CASE_MINERVA_MILLS", "CASE_KESAVANANDA", {"relation": "CITES", "note": "Affirmed Kesavananda ratio"}),
            ("ART_21A", "ART_21", {"relation": "DERIVES_FROM", "note": "Enacted via 86th Constitutional Amendment 2002"})
        ]
        for src, dst, attrs in edges:
            self.graph.add_edge(src, dst, **attrs)

    def query_graph_context(self, article_ids: List[str], keywords: List[str]) -> Dict[str, Any]:
        context = {
            "precedents": [],
            "overrulings": [],
            "related_articles": [],
            "doctrines": [],
            "citations_summary": []
        }
        
        target_nodes = set()
        nodes_dict = self.graph.nodes if isinstance(self.graph.nodes, dict) else dict(self.graph.nodes(data=True))
        
        for node, data in nodes_dict.items():
            for art_id in article_ids:
                clean_id = art_id.upper().replace(" ", "_").replace("ARTICLE_", "ART_")
                if clean_id in node or clean_id == node:
                    target_nodes.add(node)
            for kw in keywords:
                if kw.lower() in data.get("title", "").lower() or kw.lower() in data.get("name", "").lower():
                    target_nodes.add(node)

        for target in target_nodes:
            for predecessor in self.graph.predecessors(target):
                edge_data = self.graph.get_edge_data(predecessor, target)
                p_data = nodes_dict.get(predecessor, {})
                rel = edge_data.get("relation", "RELATES_TO")
                note = edge_data.get("note", "")

                if p_data.get("type") == "Precedent":
                    context["precedents"].append({
                        "case_id": predecessor,
                        "name": p_data.get("name"),
                        "relation": rel,
                        "note": note,
                        "summary": p_data.get("summary")
                    })
                elif p_data.get("type") == "Doctrine":
                    context["doctrines"].append({
                        "name": p_data.get("name"),
                        "domain": p_data.get("domain")
                    })

            for successor in self.graph.successors(target):
                edge_data = self.graph.get_edge_data(target, successor)
                s_data = nodes_dict.get(successor, {})
                rel = edge_data.get("relation", "RELATES_TO")
                note = edge_data.get("note", "")

                if rel == "OVERRULES":
                    context["overrulings"].append({
                        "overruling_case": nodes_dict.get(target, {}).get("name"),
                        "overruled_case": s_data.get("name"),
                        "note": note
                    })
                elif s_data.get("type") == "Article":
                    context["related_articles"].append({
                        "id": successor,
                        "title": s_data.get("title"),
                        "relation": rel
                    })
                elif s_data.get("type") == "Doctrine":
                    context["doctrines"].append({
                        "name": s_data.get("name"),
                        "note": note
                    })

        seen_cases = set()
        dedup_prec = []
        for p in context["precedents"]:
            if p["name"] not in seen_cases:
                seen_cases.add(p["name"])
                dedup_prec.append(p)
        context["precedents"] = dedup_prec

        return context

    def format_graph_context_string(self, graph_context: Dict[str, Any]) -> str:
        lines = []
        if graph_context.get("precedents"):
            lines.append("Landmark Precedents & Jurisprudence:")
            for p in graph_context["precedents"]:
                lines.append(f"  • {p['name']} ({p['relation']}): {p['summary']} - {p.get('note', '')}")
        if graph_context.get("overrulings"):
            lines.append("Precedent Status (Overruled Cases):")
            for o in graph_context["overrulings"]:
                lines.append(f"  • ⚠️ {o['overruled_case']} was OVERRULED by {o['overruling_case']} ({o['note']})")
        if graph_context.get("doctrines"):
            lines.append("Governing Constitutional Doctrines:")
            for d in graph_context["doctrines"]:
                lines.append(f"  • {d['name']}")
        return "\n".join(lines) if lines else "Direct statutory interpretation with standard judicial precedents."

legal_graph = LegalKnowledgeGraph()
