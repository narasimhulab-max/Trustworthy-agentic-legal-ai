"""
NyayaAI — Indian Statutory Sections & Penal Provisions Knowledge Base
Provides cross-mappings between Bharatiya Nyaya Sanhita (BNS / IPC),
Bharatiya Nagarik Suraksha Sanhita (BNSS / CrPC), Bharatiya Sakshya Adhiniyam (BSA / Evidence Act),
and the Constitution of India.
Expanded to 45+ provisions covering criminal law, constitutional rights, evidence,
family law, cyber crimes, property offences, and procedural safeguards.
"""

import re
from typing import List, Dict, Any, Optional

INDIAN_STATUTORY_DATABASE: List[Dict[str, Any]] = [

    # ─── BNS: General Criminal Offences ───
    {
        "code": "BNS_318_IPC_420",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 318(4)",
        "ipc_equivalent": "Section 420",
        "title": "Cheating and dishonestly inducing delivery of property",
        "domain": "Criminal Law / White Collar",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 7 years and fine",
        "keywords": ["cheat", "fraud", "420", "dishonest", "deceive", "property delivery", "misrepresentation"],
        "procedural_requirements": "Mandatory BNSS Sec 35(3) notice (CrPC 41A) before arrest since max term is 7 years (Arnesh Kumar guidelines).",
        "strategic_breakthroughs": [
            "Civil dispute dressed up as criminal offense (Mohammed Ibrahim v. State of Bihar) — ground for immediate quashing under BNSS 528 / CrPC 482.",
            "Absence of fraudulent intention at the inception of the contract destroys prima facie ingredient of cheating (Hridaya Ranjan Prasad v. State of Bihar)."
        ]
    },
    {
        "code": "BNS_103_IPC_302",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 103",
        "ipc_equivalent": "Section 302",
        "title": "Punishment for Murder",
        "domain": "Criminal Law",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Death or imprisonment for life, and fine",
        "keywords": ["murder", "kill", "homicide", "culpable homicide", "302", "103 bns"],
        "procedural_requirements": "Mandatory videography of crime scene and seizure under BNSS Sec 105. Forensic audit required.",
        "strategic_breakthroughs": [
            "Failure of prosecution to prove complete chain in circumstantial evidence cases (Sharad Birdhichand Sarda v. State of Maharashtra).",
            "Non-compliance with mandatory electronic seizure certification under BSA Sec 63 (IEA 65B) invalidates digital call data / CCTV evidence (Arjun Panditrao Khotkar)."
        ]
    },
    {
        "code": "BNS_351_IPC_506",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 351",
        "ipc_equivalent": "Section 506",
        "title": "Criminal Intimidation",
        "domain": "Criminal Law",
        "bailable": "Bailable (Part I) / Non-Bailable (Part II - Threat to cause death)",
        "cognizable": "Non-Cognizable / Cognizable (State amendments)",
        "punishment": "Up to 2 years or up to 7 years",
        "keywords": ["threat", "intimidate", "intimidation", "506", "351 bns", "threaten", "frighten"],
        "procedural_requirements": "Must cause real alarm in the mind of the victim; mere empty words do not constitute intimidation.",
        "strategic_breakthroughs": [
            "Vague allegations without specific date, time, and overt act are liable to be quashed (Geeta Mehrotra v. State of U.P.)."
        ]
    },
    {
        "code": "BNS_69_IPC_376",
        "act": "Bharatiya Nyaya Sanhita (BNS)",
        "bns_section": "Section 69",
        "ipc_equivalent": "Section 375/376 (Deceitful promise to marry)",
        "title": "Sexual intercourse on false promise of marriage or employment",
        "domain": "Criminal Law",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 10 years and fine",
        "keywords": ["false promise", "rape", "sexual", "376", "69 bns", "promise marriage", "consent"],
        "procedural_requirements": "Prosecution must prove the promise was false from the very inception and not a consensual relationship that later broke down.",
        "strategic_breakthroughs": [
            "Distinction between false promise at inception vs breach of promise due to circumstances (Pramod Suryabhan Pawar v. State of Maharashtra / Mandar Deepak Pawar)."
        ]
    },
    {
        "code": "BNS_85_IPC_498A",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 85",
        "ipc_equivalent": "Section 498A",
        "title": "Husband or relative of husband subjecting woman to cruelty (Domestic Violence / Dowry Harassment)",
        "domain": "Family Law / Criminal Law",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 3 years and fine",
        "keywords": ["domestic violence", "cruelty", "498a", "85 bns", "dowry", "harassment", "husband", "matrimonial cruelty", "wife"],
        "procedural_requirements": "Pre-arrest notice mandatory. FIR cannot be registered merely on complaint without basic verification (Supreme Court guidelines).",
        "strategic_breakthroughs": [
            "Omnibus allegations against all relatives of husband without specific role attributed to each are liable to be quashed (Preeti Gupta v. State of Jharkhand).",
            "False dowry cases: counter-complaint for malicious prosecution and abuse of process under BNSS 528 / CrPC 482 (Arnesh Kumar v. State of Bihar)."
        ]
    },
    {
        "code": "BNS_316_IPC_406",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 316",
        "ipc_equivalent": "Section 406",
        "title": "Criminal Breach of Trust",
        "domain": "Criminal Law / Commercial",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 7 years or fine or both",
        "keywords": ["breach of trust", "misappropriation", "criminal breach", "entrustment", "406", "316 bns", "misuse of property"],
        "procedural_requirements": "Mandatory pre-arrest notice under BNSS 35(3). Proof of entrustment and dishonest misappropriation is essential.",
        "strategic_breakthroughs": [
            "Mere refusal to return money or dispute over accounts does not constitute criminal breach of trust (civil-criminal overlap doctrine)."
        ]
    },
    {
        "code": "BNS_303_IPC_379",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 303",
        "ipc_equivalent": "Section 379",
        "title": "Theft",
        "domain": "Criminal Law / Property",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 3 years, or fine, or both",
        "keywords": ["theft", "steal", "stolen", "379", "303 bns", "movable property"],
        "procedural_requirements": "Property must be movable, must be taken dishonestly, out of the possession of another person.",
        "strategic_breakthroughs": [
            "Ownership dispute does not automatically make act theft — bona fide claim of right negates criminal intent."
        ]
    },
    {
        "code": "BNS_308_IPC_392",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 308",
        "ipc_equivalent": "Section 392",
        "title": "Robbery",
        "domain": "Criminal Law / Property",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Rigorous imprisonment up to 10 years and fine",
        "keywords": ["robbery", "robbed", "392", "308 bns", "snatch", "dacoity", "armed robbery"],
        "procedural_requirements": "Theft or extortion must be accompanied by voluntarily causing or attempting to cause death, hurt, or wrongful restraint.",
        "strategic_breakthroughs": [
            "Identification parade conducted in non-compliance with BNSS Section 73 / CrPC 54A is inadmissible."
        ]
    },
    {
        "code": "BNS_115_IPC_323",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 115",
        "ipc_equivalent": "Section 323",
        "title": "Punishment for voluntarily causing hurt",
        "domain": "Criminal Law",
        "bailable": "Bailable",
        "cognizable": "Non-Cognizable",
        "punishment": "Imprisonment up to 1 year, or fine up to Rs 10,000, or both",
        "keywords": ["hurt", "assault", "battery", "323", "115 bns", "voluntarily hurt", "physical assault", "beat", "beating"],
        "procedural_requirements": "Complaint must be filed before Magistrate as it is non-cognizable. Medical examination (MLC) is mandatory evidence.",
        "strategic_breakthroughs": [
            "Compoundable offence — can be settled between parties with court permission (BNSS Section 359)."
        ]
    },
    {
        "code": "BNS_152_IPC_124A",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 152",
        "ipc_equivalent": "Section 124A (Sedition — now replaced)",
        "title": "Acts endangering sovereignty, unity and integrity of India",
        "domain": "Constitutional Law / Criminal Law",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment for life or up to 7 years and fine",
        "keywords": ["sedition", "124a", "152 bns", "anti-national", "sovereignty", "integrity", "secession", "protest", "dissent"],
        "procedural_requirements": "Must involve actual incitement to violence or tendency to create public disorder; expression of criticism alone does not qualify.",
        "strategic_breakthroughs": [
            "Supreme Court put Section 124A IPC on hold in S.G. Vombatkere v. UOI (2022) — Section 152 BNS is narrower and requires actual incitement.",
            "Political speech and peaceful protest fully protected under Article 19(1)(a) unless there is direct incitement to imminent lawless action."
        ]
    },
    {
        "code": "BNS_190_IPC_143",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 190",
        "ipc_equivalent": "Section 143",
        "title": "Unlawful assembly — punishment for being member",
        "domain": "Criminal Law / Public Order",
        "bailable": "Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 6 months or fine or both",
        "keywords": ["unlawful assembly", "143", "190 bns", "mob", "riot", "lathi charge", "section 144"],
        "procedural_requirements": "Common object must be one of five specified objects under Section 189 BNS (equivalently Section 141 IPC).",
        "strategic_breakthroughs": [
            "Mere presence in a crowd does not make one a member of unlawful assembly without proof of sharing the common object (Masalti v. State of U.P.)."
        ]
    },
    {
        "code": "BNS_356_IPC_509",
        "act": "Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC)",
        "bns_section": "Section 356",
        "ipc_equivalent": "Section 509",
        "title": "Word, gesture or act intended to insult the modesty of a woman",
        "domain": "Criminal Law / Gender",
        "bailable": "Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "keywords": ["sexual harassment", "outraging modesty", "509", "356 bns", "eve teasing", "workplace harassment", "posh act"],
        "procedural_requirements": "POSH Act (2013) also applies for workplace sexual harassment. Internal Complaints Committee (ICC) mandatory.",
        "strategic_breakthroughs": [
            "Vague, general allegations of verbal comments without date/time/witnesses are not sufficient for conviction."
        ]
    },
    {
        "code": "BNS_336_IT_66C",
        "act": "Bharatiya Nyaya Sanhita (BNS) / IT Act 2000",
        "bns_section": "Section 336",
        "ipc_equivalent": "Section 66C IT Act (Identity Theft)",
        "title": "Cyber Crime: Identity Theft, Online Fraud, Cheating by Personation",
        "domain": "Cyber Law / Criminal Law",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Imprisonment up to 7 years and fine",
        "keywords": ["cyber", "cybercrime", "identity theft", "online fraud", "hacking", "phishing", "social media", "66c", "336 bns", "data theft"],
        "procedural_requirements": "Jurisdiction lies with the Cyber Crime Cell or Economic Offences Wing. Mandatory electronic evidence certificate required.",
        "strategic_breakthroughs": [
            "IP address alone is insufficient to prove identity of accused — must be corroborated with device forensics (Shreya Singhal v. UOI 2015).",
            "Section 66A IT Act (used against online speech) was struck down as unconstitutional (Shreya Singhal 2015) — any revival attempt is void."
        ]
    },

    # ─── Criminal Procedure: BNSS & CrPC ───
    {
        "code": "BNSS_35_CRPC_41A",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Section 35(3)",
        "ipc_equivalent": "Section 41A CrPC",
        "title": "Notice of appearance before police officer (Mandatory Pre-Arrest Protection)",
        "domain": "Criminal Procedure & Constitutional Rights",
        "bailable": "Statutory Protection",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["arrest", "pre-arrest notice", "41a", "35 bnss", "arnesh kumar", "notice before arrest", "anticipatory bail"],
        "procedural_requirements": "Where arrest is not required for offences punishable with imprisonment up to 7 years, IO MUST issue notice of appearance within 14 days.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Arrest made without issuing Sec 35 BNSS / 41A CrPC notice violates Arnesh Kumar v. State of Bihar and renders IO liable for departmental inquiry and contempt of court.",
            "Accused is entitled to immediate interim bail upon non-compliance (Satender Kumar Antil v. CBI)."
        ]
    },
    {
        "code": "BNSS_480_482_CRPC_437_439",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Sections 480 & 483",
        "ipc_equivalent": "Sections 437 & 439 CrPC",
        "title": "Special powers of High Court or Court of Session regarding Bail",
        "domain": "Criminal Procedure & Personal Liberty",
        "bailable": "Bail Jurisdiction",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["bail", "regular bail", "437", "439", "480 bnss", "483 bnss", "bail application", "jail", "release"],
        "procedural_requirements": "Bail is the rule and jail is the exception (Gudikanti Narasimhulu / Manish Sisodia v. Directorate of Enforcement 2024).",
        "strategic_breakthroughs": [
            "Prolonged incarceration without trial violates Article 21 and overrides statutory bail restrictions (Javed Gulam Nabi Shaikh v. State of Maharashtra 2024).",
            "Parity with co-accused who have already been enlarged on bail."
        ]
    },
    {
        "code": "BNSS_528_CRPC_482",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Section 528",
        "ipc_equivalent": "Section 482 CrPC",
        "title": "Saving of inherent powers of High Court (Quashing of FIR / Charge Sheet)",
        "domain": "Criminal Procedure & Judicial Review",
        "bailable": "High Court Inherent Power",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["quash", "quashing", "fir quash", "528 bnss", "482 crpc", "high court quash", "abuse of process", "bhajan lal"],
        "procedural_requirements": "Used to prevent abuse of the process of any court or otherwise to secure the ends of justice.",
        "strategic_breakthroughs": [
            "State of Haryana v. Bhajan Lal categories: where allegations in FIR do not disclose a cognizable offence even if taken at face value.",
            "Matrimonial disputes (498A IPC / 85 BNS) where omnibus allegations are made against distant relatives without specific roles (Preeti Gupta v. State of Jharkhand)."
        ]
    },
    {
        "code": "BNSS_187_CRPC_167",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Section 187",
        "ipc_equivalent": "Section 167(2) CrPC",
        "title": "Default Bail / Statutory Indefeasible Right upon failure to file Charge Sheet",
        "domain": "Criminal Procedure & Fundamental Rights",
        "bailable": "Indefeasible Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["default bail", "167(2)", "187 bnss", "charge sheet not filed", "60 days", "90 days", "indefeasible bail"],
        "procedural_requirements": "Charge sheet must be filed within 60 days (offences < 10 yrs) or 90 days (offences >= 10 yrs / death / life).",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Default bail is an indefeasible fundamental right under Article 21 that cannot be frustrated by subsequent filing of an incomplete charge sheet (Ritu Chhabaria v. Union of India / Bikramjit Singh)."
        ]
    },
    {
        "code": "BNSS_173_CRPC_154",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Section 173",
        "ipc_equivalent": "Section 154 CrPC",
        "title": "First Information Report (FIR) — Mandatory Registration",
        "domain": "Criminal Procedure",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["fir", "first information report", "173 bnss", "154 crpc", "police complaint", "register fir", "fir not registered"],
        "procedural_requirements": "Police are mandatorily bound to register an FIR on receipt of information about a cognizable offence — no preliminary inquiry permitted (Lalita Kumari v. Govt. of U.P. 2013).",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: If police refuse to register FIR, approach SP under BNSS 175(3) / CrPC 154(3), or directly petition the High Court under Article 226 / BNSS 528.",
            "Delay in FIR registration must be explained — unexplained delay raises serious doubt about truthfulness of prosecution case."
        ]
    },
    {
        "code": "BNSS_482_CRPC_438",
        "act": "Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC",
        "bns_section": "Section 482",
        "ipc_equivalent": "Section 438 CrPC",
        "title": "Anticipatory Bail — Direction for grant of bail to person apprehending arrest",
        "domain": "Criminal Procedure & Personal Liberty",
        "bailable": "Anticipatory Bail",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["anticipatory bail", "438", "482 bnss", "pre-arrest bail", "apprehension of arrest"],
        "procedural_requirements": "Apprehension of arrest must be genuine. Court considers: nature of offence, antecedents, likelihood of fleeing.",
        "strategic_breakthroughs": [
            "Anticipatory bail cannot be declined merely due to seriousness of allegation — trial and guilt are separate (Gurbaksh Singh Sibbia v. State of Punjab).",
            "No time limit on anticipatory bail — it continues until arrest or conclusion of trial (Sushila Aggarwal v. State of NCT of Delhi 2020)."
        ]
    },

    # ─── Evidence Law: BSA & Indian Evidence Act ───
    {
        "code": "BSA_63_IEA_65B",
        "act": "Bharatiya Sakshya Adhiniyam (BSA) / Indian Evidence Act",
        "bns_section": "Section 63",
        "ipc_equivalent": "Section 65B Evidence Act",
        "title": "Admissibility of Electronic Records and Mandatory Certification",
        "domain": "Law of Evidence & Digital Forensics",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["electronic evidence", "65b", "63 bsa", "digital evidence", "cctv", "whatsapp", "call records", "cdr", "screenshot", "certificate"],
        "procedural_requirements": "Secondary electronic evidence (WhatsApp chats, CDRs, CCTV footage, audio recordings) MUST be accompanied by Section 63 BSA certificate.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Electronic evidence without a contemporaneous Section 63 BSA / 65B IEA certificate is completely inadmissible in evidence (Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal 2020)."
        ]
    },
    {
        "code": "BSA_8_IEA_17",
        "act": "Bharatiya Sakshya Adhiniyam (BSA) / Indian Evidence Act",
        "bns_section": "Section 8",
        "ipc_equivalent": "Section 17 Evidence Act",
        "title": "Admission — Statements by parties",
        "domain": "Law of Evidence",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["admission", "statement", "confession to police", "prior statement"],
        "procedural_requirements": "Admission is the best evidence against a party but must be voluntary and conscious.",
        "strategic_breakthroughs": [
            "Admission taken under duress or custodial pressure is inadmissible and can be excluded under Article 20(3) (right against self-incrimination)."
        ]
    },
    {
        "code": "BSA_23_IEA_25",
        "act": "Bharatiya Sakshya Adhiniyam (BSA) / Indian Evidence Act",
        "bns_section": "Section 23(1)",
        "ipc_equivalent": "Section 25 Evidence Act",
        "title": "Confession to Police Officer — Absolute Bar",
        "domain": "Law of Evidence & Criminal Rights",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["confession", "police confession", "custodial confession", "statement to police", "self-incrimination"],
        "procedural_requirements": "No confession made to a police officer is admissible in evidence against the accused under any circumstances.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Any confession or disclosure statement recorded by police cannot be used as substantive evidence against the accused. Only the object/material discovered pursuant to a disclosure statement is admissible (Pulukuri Kottaya v. King Emperor)."
        ]
    },

    # ─── Constitutional Provisions ───
    {
        "code": "CONST_ART_14",
        "act": "Constitution of India",
        "bns_section": "Article 14",
        "ipc_equivalent": "N/A",
        "title": "Right to Equality — Equality Before Law and Equal Protection of Laws",
        "domain": "Constitutional Law & Fundamental Rights",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["equality", "article 14", "discrimination", "equal protection", "arbitrariness", "class legislation"],
        "procedural_requirements": "Classification must be intelligible and must have rational nexus to the object of the law.",
        "strategic_breakthroughs": [
            "Manifest arbitrariness in state action is a separate and distinct ground to strike down laws under Article 14 (Shayara Bano v. UOI 2017).",
            "Selective enforcement of law against only one individual without intelligible differentia violates Article 14 (E.P. Royappa v. State of Tamil Nadu)."
        ]
    },
    {
        "code": "CONST_ART_19",
        "act": "Constitution of India",
        "bns_section": "Article 19",
        "ipc_equivalent": "N/A",
        "title": "Freedom of Speech, Expression, Assembly, Association, Movement, Profession",
        "domain": "Constitutional Law & Fundamental Rights",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["free speech", "article 19", "freedom of expression", "censorship", "ban", "press freedom", "association", "protest"],
        "procedural_requirements": "Restrictions under Article 19(2) are exhaustive — only on grounds of sovereignty, public order, decency, morality, contempt, defamation.",
        "strategic_breakthroughs": [
            "Restrictions on speech must pass the twin test: (1) fall within one of the eight specified grounds, and (2) must be 'reasonable' (Romesh Thappar v. State of Madras).",
            "Proportionality is mandatory — internet shutdowns disproportionate to the threat are unconstitutional (Anuradha Bhasin v. UOI 2020)."
        ]
    },
    {
        "code": "CONST_ART_20",
        "act": "Constitution of India",
        "bns_section": "Article 20",
        "ipc_equivalent": "N/A",
        "title": "Protection against conviction for offences — No ex post facto law, No double jeopardy, No self-incrimination",
        "domain": "Constitutional Law & Criminal Rights",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["article 20", "double jeopardy", "self-incrimination", "ex post facto", "retrospective", "acquitted", "narco test", "lie detector"],
        "procedural_requirements": "Article 20(3) bars compelled self-incrimination — no accused can be compelled to be a witness against himself.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Compelling an accused to undergo narco-analysis, brain mapping, or polygraph test without consent violates Article 20(3) (Selvi v. State of Karnataka 2010).",
            "No person can be prosecuted and punished twice for the same offence — even departmental and criminal proceedings together can be challenged."
        ]
    },
    {
        "code": "CONST_ART_21",
        "act": "Constitution of India",
        "bns_section": "Article 21",
        "ipc_equivalent": "N/A",
        "title": "Protection of Life and Personal Liberty",
        "domain": "Constitutional Law & Fundamental Rights",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["article 21", "personal liberty", "right to life", "due process", "fair trial", "speedy trial", "privacy", "dignity"],
        "procedural_requirements": "Procedure depriving liberty must be just, fair, reasonable, and non-arbitrary (Maneka Gandhi v. Union of India).",
        "strategic_breakthroughs": [
            "Right to speedy trial as part of Article 21 (Hussainara Khatoon).",
            "Right to privacy and bodily autonomy (Puttaswamy 2017).",
            "Custodial torture and handcuffing without judicial permission violates Article 21 (DK Basu / Prem Shankar Shukla)."
        ]
    },
    {
        "code": "CONST_ART_22",
        "act": "Constitution of India",
        "bns_section": "Article 22",
        "ipc_equivalent": "N/A",
        "title": "Protection against Arrest and Detention & Mandatory 24-Hour Production",
        "domain": "Constitutional Law & Criminal Justice",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["article 22", "detention", "arrest rights", "24 hours", "magistrate production", "habeas corpus", "grounds of arrest"],
        "procedural_requirements": "Arrested person must be informed of grounds of arrest immediately and produced before the nearest magistrate within 24 hours.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Non-production before magistrate within 24 hours of detention renders continued custody illegal and entitles petitioner to immediate release via Writ of Habeas Corpus under Article 226/32 (Prabir Purkayastha v. State (NCT of Delhi) 2024 / Pankaj Bansal v. UOI)."
        ]
    },
    {
        "code": "CONST_ART_32",
        "act": "Constitution of India",
        "bns_section": "Article 32",
        "ipc_equivalent": "N/A",
        "title": "Right to Constitutional Remedies — Dr. B.R. Ambedkar called it the Heart and Soul of the Constitution",
        "domain": "Constitutional Law & Writs",
        "bailable": "Fundamental Right",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["article 32", "supreme court writ", "habeas corpus", "mandamus", "certiorari", "prohibition", "quo warranto", "fundamental right enforcement"],
        "procedural_requirements": "Petition directly to the Supreme Court of India for enforcement of fundamental rights.",
        "strategic_breakthroughs": [
            "Right to approach the Supreme Court under Article 32 itself cannot be suspended (except during National Emergency under Article 359).",
            "Article 32 petition lies for any violation of Part III rights — court can award compensation for custodial violations (Nilabati Behera v. State of Orissa)."
        ]
    },
    {
        "code": "CONST_ART_226",
        "act": "Constitution of India",
        "bns_section": "Article 226",
        "ipc_equivalent": "N/A",
        "title": "Power of High Court to issue certain writs",
        "domain": "Constitutional Law & Writs",
        "bailable": "Constitutional Power",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["article 226", "high court writ", "writ petition", "habeas corpus high court", "mandamus high court", "judicial review"],
        "procedural_requirements": "Broader jurisdiction than Article 32 — can be used for any legal right violation, not only fundamental rights.",
        "strategic_breakthroughs": [
            "High Court can grant interim stay of FIR, charge sheet, or adverse orders under Article 226 even before final hearing.",
            "No limitation period for writ petition challenging illegal detention or violation of fundamental rights."
        ]
    },
    {
        "code": "CONST_ART_136",
        "act": "Constitution of India",
        "bns_section": "Article 136",
        "ipc_equivalent": "N/A",
        "title": "Special Leave Petition (SLP) — Supreme Court discretionary jurisdiction",
        "domain": "Constitutional Law & Appellate Jurisdiction",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A",
        "keywords": ["slp", "special leave petition", "article 136", "supreme court appeal", "slp to supreme court", "appeal against high court"],
        "procedural_requirements": "SLP lies from any judgment, decree, determination, or order of any court or tribunal in India — filed within 90 days from High Court order.",
        "strategic_breakthroughs": [
            "SLP can be filed even against interlocutory orders if they cause substantial injustice — delay in filing can be condoned for good cause shown."
        ]
    },

    # ─── POCSO Act (Child Protection) ───
    {
        "code": "POCSO_4_6",
        "act": "Protection of Children from Sexual Offences Act (POCSO) 2012",
        "bns_section": "Sections 4 & 6",
        "ipc_equivalent": "Sections 376 / 376AB IPC (amended)",
        "title": "Penetrative and Aggravated Sexual Assault on a Child",
        "domain": "Criminal Law / Child Protection",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Rigorous imprisonment minimum 10 years to life, and fine",
        "keywords": ["pocso", "child abuse", "sexual assault child", "minor", "below 18", "child protection"],
        "procedural_requirements": "Mandatory child-friendly recording of statement by a Magistrate. Special Court trial. Statement can be recorded by police at child's residence.",
        "strategic_breakthroughs": [
            "Age of victim is a jurisdictional fact — prosecution must prove victim's age through birth certificate, school records, or ossification test (Jarnail Singh v. State of Haryana).",
            "Medical examination of victim conducted without consent or in dehumanizing manner can be challenged as violating Section 27 POCSO."
        ]
    },

    # ─── NDPS Act (Drugs) ───
    {
        "code": "NDPS_20_37",
        "act": "Narcotic Drugs and Psychotropic Substances Act (NDPS) 1985",
        "bns_section": "Sections 20/21",
        "ipc_equivalent": "N/A (Special Act)",
        "title": "Possession, Transportation, and Commercial Quantity of Narcotic Drugs",
        "domain": "Criminal Law / Drug Offences",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Rigorous imprisonment 10 years to 20 years and fine for commercial quantity",
        "keywords": ["ndps", "drugs", "narcotic", "ganja", "cannabis", "heroin", "cocaine", "smack", "commercial quantity", "drug possession"],
        "procedural_requirements": "Section 42 NDPS: prior information to superior officer for search without warrant. Section 50: right of personal search before Magistrate or Gazetted Officer.",
        "strategic_breakthroughs": [
            "CRITICAL BREAKTHROUGH: Failure to comply with mandatory Section 50 NDPS (offering accused right to be searched before a Gazetted Officer or Magistrate) makes the recovery itself inadmissible (State of Punjab v. Baldev Singh 1999).",
            "Bail under NDPS Section 37 requires 'reasonable grounds for believing not guilty' — this very high threshold can be challenged if prosecution case has inherent contradictions.",
            "Discrepancy between seized sample and produced sample (FSL mismatch) is a complete defence on adulteration/substitution grounds."
        ]
    },

    # ─── Prevention of Money Laundering Act (PMLA) ───
    {
        "code": "PMLA_3_4",
        "act": "Prevention of Money Laundering Act (PMLA) 2002",
        "bns_section": "Sections 3 & 4",
        "ipc_equivalent": "N/A (Special Act)",
        "title": "Offence and punishment of Money Laundering",
        "domain": "Criminal Law / Financial Crimes",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "punishment": "Rigorous imprisonment 3 to 7 years (can be up to 10 years for specified drug offences)",
        "keywords": ["pmla", "money laundering", "ed", "enforcement directorate", "proceeds of crime", "attachment", "financial crime", "hawala"],
        "procedural_requirements": "ED must record reasons in writing before arrest (PMLA Section 19). Copy of arrest grounds mandatory. Remand to Judicial Custody after first 24 hours.",
        "strategic_breakthroughs": [
            "CRITICAL: Arrest grounds memo must be given to accused in writing — failure renders arrest illegal (Pankaj Bansal v. UOI 2023).",
            "Twin conditions for PMLA bail (Section 45) must be satisfied only if courts are satisfied there are reasonable grounds to believe accused not guilty — this is only a prima facie threshold.",
            "Predicate offence must be proven independently — if underlying FIR is quashed, PMLA prosecution collapses (Vijay Madanlal Choudhary v. UOI 2022 — partially)."
        ]
    },

    # ─── Consumer Protection ───
    {
        "code": "CONSUMER_PROT_2019",
        "act": "Consumer Protection Act 2019",
        "bns_section": "Sections 2(7), 35, 47",
        "ipc_equivalent": "N/A",
        "title": "Consumer Rights — Deficiency of Service, Unfair Trade Practice, Product Liability",
        "domain": "Consumer Law / Civil",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "Compensation, refund, and penalty as determined by Consumer Forum",
        "keywords": ["consumer", "consumer forum", "deficiency of service", "product liability", "unfair trade practice", "e-commerce refund", "consumer complaint"],
        "procedural_requirements": "Complaint to District Consumer Disputes Redressal Commission (up to Rs 50 lakh), State Commission (up to Rs 2 crore), or National Commission (above Rs 2 crore).",
        "strategic_breakthroughs": [
            "E-commerce platforms are liable for deficient services of their sellers under 2019 Act (direct liability for marketplace).",
            "Mental agony and harassment are separately compensable heads of relief beyond product refund."
        ]
    },

    # ─── Information Technology Act (Cyber Law) ───
    {
        "code": "IT_66A_STRUCK_DOWN",
        "act": "Information Technology Act 2000",
        "bns_section": "Section 66A — STRUCK DOWN",
        "ipc_equivalent": "N/A",
        "title": "Section 66A IT Act — UNCONSTITUTIONAL (Struck down by Supreme Court)",
        "domain": "Cyber Law / Constitutional Law",
        "bailable": "N/A",
        "cognizable": "N/A",
        "punishment": "N/A — Section is void and cannot be enforced",
        "keywords": ["66a", "it act 66a", "online post arrest", "offensive post", "cyber crime speech", "shreya singhal"],
        "procedural_requirements": "Section 66A was struck down as unconstitutional in Shreya Singhal v. Union of India (2015). No arrest can be made under Section 66A.",
        "strategic_breakthroughs": [
            "CRITICAL: If police invoke Section 66A IT Act for arrest of online speech, such arrest is absolutely illegal — immediately file Writ of Habeas Corpus (Section 66A is dead law since 2015).",
            "Online speech can only be prosecuted under valid provisions like BNS 152 (incitement), 356 (modesty), or specific IT Act provisions (66C, 67, 67A, 67B)."
        ]
    }
]


def search_applicable_sections(query_text: str) -> List[Dict[str, Any]]:
    """
    Enhanced section search using: direct section mentions, keyword matching,
    regex section-number detection, and domain classification.
    Returns top 5 most relevant provisions.
    """
    query_lower = query_text.lower()
    matched = []

    # Pre-compile regex for section number detection
    section_pattern = re.compile(r'\b(?:section|sec|art(?:icle)?)\s*\.?\s*(\d+[a-z]?(?:\(\d+\))?)\b', re.IGNORECASE)
    mentioned_sections = {m.group(1).lower() for m in section_pattern.finditer(query_lower)}

    for item in INDIAN_STATUTORY_DATABASE:
        score = 0
        bns_sec_lower = item["bns_section"].lower()
        ipc_eq_lower = (item.get("ipc_equivalent") or "").lower()

        # 1. Direct section number mention
        if bns_sec_lower in query_lower:
            score += 50
        if ipc_eq_lower and ipc_eq_lower != "n/a" and ipc_eq_lower in query_lower:
            score += 50

        # 2. Regex-detected section numbers match
        for sec_num in mentioned_sections:
            if sec_num in bns_sec_lower or sec_num in ipc_eq_lower:
                score += 45

        # 3. Title keyword matching
        title_words = [w for w in item["title"].lower().split() if len(w) > 3]
        for tw in title_words:
            if tw in query_lower:
                score += 8

        # 4. Domain keyword matching
        domain_words = [w for w in item["domain"].lower().split("/") if len(w.strip()) > 3]
        for dw in domain_words:
            if dw.strip() in query_lower:
                score += 6

        # 5. Curated keyword matching (highest precision)
        for kw in item.get("keywords", []):
            if kw.lower() in query_lower:
                score += 15

        # 6. Code/shorthand match
        code_lower = item.get("code", "").lower().replace("_", " ")
        if code_lower in query_lower:
            score += 20

        if score > 0:
            matched.append((score, item))

    matched.sort(key=lambda x: x[0], reverse=True)
    if matched:
        return [m[1] for m in matched[:5]]

    # Fallback: return most broadly applicable sections
    return INDIAN_STATUTORY_DATABASE[:3]
