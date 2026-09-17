"""
NyayaAI — Hybrid Case Breakthrough Engine
Combines:
1. Fast keyword-pattern breakthrough detection (zero latency, always runs)
2. AI-powered breakthrough discovery (LLM enrichment for case-specific angles)

Discovers: Procedural Flaws, Evidentiary Gaps, Constitutional Shields,
           Winning Precedents, Cross-Examination Angles, Quashing Grounds
"""

import asyncio
import json
from typing import List, Optional
from models.schemas import CaseBreakthrough, QueryIntakeOutput, RetrievalOutput
from rag.indian_statutes import search_applicable_sections


class CaseBreakthroughEngine:
    """
    Hybrid Legal Breakthrough & Strategy Engine.
    Phase 1 (synchronous): Rule-based pattern analysis — instant, no API call.
    Phase 2 (AI): LLM enrichment to discover case-specific angles.
    """

    # ─── Phase 1: Keyword-Pattern Breakthrough Rules ───

    def _keyword_breakthroughs(self, query_text: str) -> List[CaseBreakthrough]:
        """Fast, deterministic breakthrough detection based on keyword patterns."""
        q = query_text.lower()
        breakthroughs: List[CaseBreakthrough] = []

        # 1. Arrest / Detention / Custody Procedural Flaws
        if any(w in q for w in ["detain", "detention", "arrest", "police", "custody", "fir", "bail", "remand"]):
            breakthroughs.append(CaseBreakthrough(
                category="Procedural Flaw",
                title="Non-Compliance with Mandatory Pre-Arrest Notice (BNSS Sec 35 / CrPC 41A)",
                impact_level="Critical",
                description="For any offence punishable with 7 years or less imprisonment, police arrest without issuing a formal Section 35(3) BNSS / 41A CrPC notice violates mandatory Supreme Court directives.",
                statutory_basis="Section 35(3) BNSS / Section 41A CrPC & Article 21",
                tactical_advantage="Entitles the accused to immediate interim bail under Satender Kumar Antil v. CBI (2022) and subjects the Investigating Officer to contempt proceedings under Arnesh Kumar v. State of Bihar."
            ))
            breakthroughs.append(CaseBreakthrough(
                category="Constitutional Shield",
                title="Illegal Detention Past 24-Hour Mandate (Article 22(2) & BNSS 187)",
                impact_level="Critical",
                description="Failure to produce a detained individual before the nearest judicial magistrate within 24 hours of apprehension invalidates continued custody.",
                statutory_basis="Article 22(2) Constitution of India & Section 187 BNSS",
                tactical_advantage="File an immediate Writ of Habeas Corpus under Article 226 before the High Court or Article 32 before Supreme Court for instant release (Prabir Purkayastha v. State (NCT of Delhi) 2024)."
            ))

        # 2. Cheating / Financial / Contractual Disputes
        if any(w in q for w in ["cheating", "fraud", "contract", "money", "loan", "420", "318", "property", "agreement", "breach of trust", "misappropriation"]):
            breakthroughs.append(CaseBreakthrough(
                category="Procedural Flaw",
                title="Civil Dispute Dressed Up as Criminal Offence (Bhajan Lal Quashing Ground)",
                impact_level="High",
                description="Mere breach of contractual terms or commercial disagreement does not constitute the criminal offense of cheating unless fraudulent intention existed at the inception.",
                statutory_basis="Section 528 BNSS / Section 482 CrPC & Section 318 BNS",
                tactical_advantage="File a Quashing Petition under Section 528 BNSS / Section 482 CrPC in the High Court relying on Mohammed Ibrahim v. State of Bihar and Hridaya Ranjan Prasad."
            ))

        # 3. Digital / Electronic Evidence Flaws
        if any(w in q for w in ["whatsapp", "chat", "cctv", "email", "recording", "call record", "phone", "digital", "screenshot", "cdr", "electronic"]):
            breakthroughs.append(CaseBreakthrough(
                category="Evidentiary Gap",
                title="Inadmissibility of Electronic Records Lacking Mandatory Sec 63 BSA / 65B IEA Certificate",
                impact_level="Critical",
                description="Any digital secondary evidence (screenshots, WhatsApp messages, call records) produced without a contemporaneous certificate signed by the device custodian is legally inadmissible.",
                statutory_basis="Section 63 Bharatiya Sakshya Adhiniyam / Section 65B Indian Evidence Act",
                tactical_advantage="Object at the stage of marking exhibits or file an objection under Section 63 BSA to exclude the prosecution's entire digital evidence trail (Arjun Panditrao Khotkar v. Kailash Gorantyal 2020)."
            ))

        # 4. Free Speech / Social Media / Expression
        if any(w in q for w in ["speech", "post", "facebook", "twitter", "social media", "defamation", "article 19", "protest", "press", "journalist"]):
            breakthroughs.append(CaseBreakthrough(
                category="Constitutional Shield",
                title="Protection of Legitimate Dissent & Online Expression under Article 19(1)(a)",
                impact_level="High",
                description="Speech can only be restricted under the narrow, exhaustive heads of Article 19(2). Criticism of government policy or public figures does not constitute criminal public disorder.",
                statutory_basis="Article 19(1)(a) & Shreya Singhal v. Union of India (2015)",
                tactical_advantage="Invoke the Proportionality Standard from Justice K.S. Puttaswamy (2017) to strike down arbitrary police summons or notices. If charged under Section 66A IT Act — that provision is void since 2015."
            ))

        # 5. Matrimonial / Domestic Violence / 498A
        if any(w in q for w in ["498a", "85 bns", "domestic violence", "dowry", "matrimonial", "wife", "husband", "cruelty", "dv act"]):
            breakthroughs.append(CaseBreakthrough(
                category="Procedural Flaw",
                title="Omnibus Allegations Against Relatives Without Specific Overt Acts (Section 528 BNSS)",
                impact_level="High",
                description="FIRs under 498A/85 BNS routinely arraign all relatives of husband without specific roles. Supreme Court has consistently quashed such omnibus allegations.",
                statutory_basis="Section 528 BNSS / Section 482 CrPC & Preeti Gupta v. State of Jharkhand",
                tactical_advantage="File an FIR Quashing Petition in the High Court citing Preeti Gupta, Geeta Mehrotra, and Arnesh Kumar. Seek mandatory verification before any arrest."
            ))

        # 6. NDPS / Drugs Recovery
        if any(w in q for w in ["ndps", "drugs", "narcotic", "ganja", "cannabis", "heroin", "cocaine", "drug recovery", "section 50"]):
            breakthroughs.append(CaseBreakthrough(
                category="Procedural Flaw",
                title="Mandatory Section 50 NDPS Violation — Right to be Searched Before Magistrate / Gazetted Officer",
                impact_level="Critical",
                description="Before conducting a personal search under NDPS Act, the accused must be informed of their right to be searched before the nearest Gazetted Officer or Magistrate. Failure to offer this right invalidates the entire recovery.",
                statutory_basis="Section 50 NDPS Act & State of Punjab v. Baldev Singh (1999 SC 9-Judge Bench)",
                tactical_advantage="If Section 50 notice was not given, move for discharge before framing of charges. The recovery itself is inadmissible — prosecution case collapses without the primary evidence."
            ))

        # 7. Bail Denial / Prolonged Custody
        if any(w in q for w in ["bail denied", "bail refused", "bail rejection", "jail", "custody", "remand", "undertrial"]):
            breakthroughs.append(CaseBreakthrough(
                category="Constitutional Shield",
                title="Bail is the Rule, Jail is the Exception — Right to Liberty Under Article 21",
                impact_level="High",
                description="Prolonged pre-trial incarceration without adequate reasoning violates Article 21. Courts must balance the right to liberty against the seriousness of the offence.",
                statutory_basis="Article 21 & Manish Sisodia v. ED (2024) & Javed Gulam Nabi Shaikh v. State of Maharashtra (2024)",
                tactical_advantage="File bail application citing: (1) no flight risk, (2) no tampering risk, (3) length of custody, (4) slow pace of trial. Supreme Court in 2024 has consistently granted bail where trial will take years."
            ))

        # 8. Privacy / Surveillance / Search & Seizure
        if any(w in q for w in ["privacy", "surveillance", "phone tap", "spyware", "search seizure", "puttaswamy", "pegasus"]):
            breakthroughs.append(CaseBreakthrough(
                category="Constitutional Shield",
                title="Illegal Surveillance or Unauthorized Phone Tapping Violates Article 21 & PUCL Safeguards",
                impact_level="High",
                description="Telephone interception is permissible only under Section 5(2) of the Telegraph Act with prior written approval of Home Secretary. Unauthorized tapping violates the right to privacy.",
                statutory_basis="Article 21 & K.S. Puttaswamy v. UOI (2017) & PUCL v. Union of India (1997)",
                tactical_advantage="File a writ petition under Article 226/32 demanding destruction of unlawfully obtained recordings and injunction against further surveillance."
            ))

        # 9. Confession / Custodial Statement
        if any(w in q for w in ["confession", "statement to police", "custodial confession", "self-incrimination", "narco", "polygraph"]):
            breakthroughs.append(CaseBreakthrough(
                category="Evidentiary Gap",
                title="Absolute Bar on Police Confession Under BSA Section 23 / IEA Section 25",
                impact_level="Critical",
                description="No confession made to a police officer shall be proved as against a person accused of any offence. This is an absolute rule with no exceptions.",
                statutory_basis="Section 23(1) BSA / Section 25 IEA & Pulukuri Kottaya v. King Emperor",
                tactical_advantage="Object to any attempt to read the accused's Section 161 BNSS / 161 CrPC statement as substantive evidence. Only material discovered pursuant to a disclosure can be used — not the statement itself."
            ))

        return breakthroughs

    # ─── Phase 2: AI-Powered Breakthrough Discovery ───

    async def _ai_enrich_breakthroughs(
        self,
        intake: QueryIntakeOutput,
        retrieval: RetrievalOutput,
        existing_breakthroughs: List[CaseBreakthrough]
    ) -> List[CaseBreakthrough]:
        """
        Uses LLM to discover additional case-specific breakthroughs
        not captured by keyword patterns.
        """
        try:
            from llm.provider import get_llm_provider

            existing_titles = [b.title for b in existing_breakthroughs]
            sections_text = "\n".join([
                f"- {s['section']} ({s['act']}): {s['title']}"
                for s in search_applicable_sections(intake.normalized_query)[:4]
            ])

            system_prompt = (
                "You are an elite Indian Criminal Defense Advocate with 30+ years of experience. "
                "Your task is to identify ADDITIONAL strategic legal breakthroughs for the given case — "
                "breakthroughs NOT already identified. Focus on: "
                "(1) Jurisdiction/procedural defects, "
                "(2) Missing mandatory procedural steps by police, "
                "(3) Constitutional violations, "
                "(4) Evidentiary chain defects, "
                "(5) Landmark precedent weapons specific to the facts. "
                "Return JSON array ONLY (no markdown fences):\n"
                '[\n'
                '  {\n'
                '    "category": "Procedural Flaw|Evidentiary Gap|Constitutional Shield|Winning Precedent|Cross-Examination Angle",\n'
                '    "title": "Short, precise breakthrough title",\n'
                '    "impact_level": "Critical|High|Medium",\n'
                '    "description": "Why this is a breakthrough — what went wrong",\n'
                '    "statutory_basis": "Exact section and case name",\n'
                '    "tactical_advantage": "Specific court action advocate should take"\n'
                '  }\n'
                ']\n'
                "Return MAXIMUM 2 additional breakthroughs. If no additional unique breakthroughs exist, return []."
            )

            user_prompt = (
                f"Case Facts / Legal Query:\n{intake.normalized_query}\n\n"
                f"Legal Domain: {intake.domain}\n"
                f"Applicable Sections:\n{sections_text}\n\n"
                f"Already Identified Breakthroughs (DO NOT REPEAT THESE):\n"
                + "\n".join([f"- {t}" for t in existing_titles]) +
                "\n\nIdentify additional unique breakthroughs not listed above."
            )

            llm = get_llm_provider()
            raw = await llm.generate_text(user_prompt, system_prompt=system_prompt, temperature=0.15)

            # Parse LLM response
            cleaned = raw.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0].strip()

            ai_data = json.loads(cleaned)
            if not isinstance(ai_data, list):
                return []

            new_breakthroughs = []
            for item in ai_data[:2]:  # Max 2 AI-discovered breakthroughs
                if not isinstance(item, dict):
                    continue
                bt = CaseBreakthrough(
                    category=item.get("category", "Winning Precedent"),
                    title=item.get("title", "Case-Specific Legal Breakthrough"),
                    impact_level=item.get("impact_level", "High"),
                    description=item.get("description", ""),
                    statutory_basis=item.get("statutory_basis", "Indian Constitutional Jurisprudence"),
                    tactical_advantage=item.get("tactical_advantage", "Consult with senior legal counsel.")
                )
                new_breakthroughs.append(bt)

            return new_breakthroughs

        except Exception as e:
            print(f"[BreakthroughEngine] AI enrichment error: {e}")
            return []

    def analyze_breakthroughs(self, intake: QueryIntakeOutput, retrieval: RetrievalOutput) -> List[CaseBreakthrough]:
        """
        Synchronous entry point: runs Phase 1 keyword analysis.
        Returns initial breakthroughs. AI enrichment is done separately via analyze_breakthroughs_async.
        """
        breakthroughs = self._keyword_breakthroughs(intake.normalized_query)

        # Fallback: if no patterns matched, provide a general Article 21 breakthrough
        if not breakthroughs:
            breakthroughs.append(CaseBreakthrough(
                category="Winning Precedent",
                title="Right to Fair Investigation and Non-Arbitrary Procedure",
                impact_level="High",
                description="Article 21 mandates that any investigation must be completely impartial, timely, and free from external influence. Any failure in this standard is actionable.",
                statutory_basis="Article 21 & Babubhai v. State of Gujarat (2010)",
                tactical_advantage="Seek transfer of investigation to an independent agency (CBI/CID) or judicial monitoring under Section 175(3) BNSS / Section 156(3) CrPC by filing a private complaint before the Magistrate."
            ))

        return breakthroughs

    async def analyze_breakthroughs_async(
        self, intake: QueryIntakeOutput, retrieval: RetrievalOutput
    ) -> List[CaseBreakthrough]:
        """
        Full async analysis: Phase 1 keywords + Phase 2 AI enrichment.
        Used by the reasoning engine for maximum breakthrough coverage.
        """
        # Phase 1: synchronous keywords (instant)
        breakthroughs = self._keyword_breakthroughs(intake.normalized_query)

        if not breakthroughs:
            breakthroughs.append(CaseBreakthrough(
                category="Winning Precedent",
                title="Right to Fair Investigation and Non-Arbitrary Procedure",
                impact_level="High",
                description="Article 21 mandates that any investigation must be completely impartial, timely, and free from external influence.",
                statutory_basis="Article 21 & Babubhai v. State of Gujarat (2010)",
                tactical_advantage="Seek transfer of investigation to an independent agency or judicial monitoring under Section 175(3) BNSS."
            ))

        # Phase 2: AI enrichment (async, adds case-specific breakthroughs)
        ai_breakthroughs = await self._ai_enrich_breakthroughs(intake, retrieval, breakthroughs)
        breakthroughs.extend(ai_breakthroughs)

        return breakthroughs


breakthrough_engine = CaseBreakthroughEngine()
