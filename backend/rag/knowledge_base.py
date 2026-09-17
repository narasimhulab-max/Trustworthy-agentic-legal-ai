"""
NyayaAI — Constitution of India Knowledge Base
Downloads, parses, and structures the Constitution of India for RAG retrieval.
"""

import json
import os
import httpx
import logging

logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CONSTITUTION_FILE = os.path.join(DATA_DIR, "constitution_of_india.json")

# Source: civictech-India GitHub repository
CONSTITUTION_URL = "https://raw.githubusercontent.com/civictech-India/constitution-of-india/master/constitution_of_india.json"


def ensure_data_dir():
    """Create data directory if it doesn't exist."""
    os.makedirs(DATA_DIR, exist_ok=True)


async def download_constitution():
    """Download Constitution of India JSON from GitHub if not cached locally."""
    ensure_data_dir()

    if os.path.exists(CONSTITUTION_FILE):
        logger.info("Constitution data already cached locally.")
        return

    logger.info("Downloading Constitution of India from GitHub...")
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.get(CONSTITUTION_URL)
        response.raise_for_status()

        with open(CONSTITUTION_FILE, "w", encoding="utf-8") as f:
            f.write(response.text)

    logger.info(f"Constitution data saved to {CONSTITUTION_FILE}")


def load_constitution() -> list[dict]:
    """
    Load and parse the Constitution of India into structured chunks.
    Each chunk represents an article with metadata.

    Returns:
        List of dicts with keys: article_number, title, text, part, part_title
    """
    if not os.path.exists(CONSTITUTION_FILE):
        raise FileNotFoundError(
            f"Constitution data not found at {CONSTITUTION_FILE}. "
            "Run download_constitution() first."
        )

    with open(CONSTITUTION_FILE, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    articles = []

    # The civictech-India JSON structure varies — handle multiple formats
    if isinstance(raw_data, list):
        # Format: flat list of article objects
        for item in raw_data:
            article = _parse_article_item(item)
            if article:
                articles.append(article)
    elif isinstance(raw_data, dict):
        # Format: nested with "articles", "parts", "schedules" keys
        if "articles" in raw_data:
            for item in raw_data["articles"]:
                article = _parse_article_item(item)
                if article:
                    articles.append(article)
        # Also check for flat key-value pairs
        for key, value in raw_data.items():
            if key.lower().startswith("article") and isinstance(value, str):
                articles.append({
                    "article_number": key,
                    "title": key,
                    "text": value,
                    "part": "Unknown",
                    "part_title": "Unknown",
                })

    # If we couldn't parse structured data, create chunks from raw text
    if not articles:
        articles = _fallback_parse(raw_data)

    logger.info(f"Loaded {len(articles)} constitutional provisions.")
    return articles


def _parse_article_item(item: dict) -> dict | None:
    """Parse a single article item from various JSON formats."""
    if not isinstance(item, dict):
        return None

    # Try common field names
    article_number = (
        item.get("article_no")
        or item.get("article_number")
        or item.get("Article No")
        or item.get("article")
        or item.get("Article")
        or item.get("number")
        or str(item.get("id", ""))
    )

    title = (
        item.get("title")
        or item.get("Title")
        or item.get("article_title")
        or item.get("name")
        or ""
    )

    text = (
        item.get("description")
        or item.get("Description")
        or item.get("text")
        or item.get("content")
        or item.get("article_desc")
        or item.get("body")
        or ""
    )

    part = (
        item.get("part_no")
        or item.get("part")
        or item.get("Part")
        or item.get("part_number")
        or "N/A"
    )

    part_title = (
        item.get("part_title")
        or item.get("Part Title")
        or item.get("part_name")
        or "N/A"
    )

    if not text or len(str(text).strip()) < 10:
        return None

    return {
        "article_number": str(article_number).strip(),
        "title": str(title).strip(),
        "text": str(text).strip(),
        "part": str(part).strip(),
        "part_title": str(part_title).strip(),
    }


def _fallback_parse(raw_data) -> list[dict]:
    """Fallback: convert raw JSON into text chunks if structured parsing fails."""
    articles = []
    raw_str = json.dumps(raw_data, indent=2, ensure_ascii=False)

    # Split into chunks of ~1000 chars for embedding
    chunk_size = 1000
    for i in range(0, len(raw_str), chunk_size):
        chunk = raw_str[i:i + chunk_size]
        articles.append({
            "article_number": f"chunk_{i // chunk_size + 1}",
            "title": f"Constitutional Provision (Chunk {i // chunk_size + 1})",
            "text": chunk,
            "part": "N/A",
            "part_title": "N/A",
        })

    return articles


# Comprehensive Preamble and Fundamental Rights as supplementary data
SUPPLEMENTARY_PROVISIONS = [
    {
        "article_number": "Preamble",
        "title": "Preamble to the Constitution of India",
        "text": (
            "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a "
            "SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: "
            "JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith "
            "and worship; EQUALITY of status and of opportunity; and to promote among them all "
            "FRATERNITY assuring the dignity of the individual and the unity and integrity of the "
            "Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, "
            "do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."
        ),
        "part": "Preamble",
        "part_title": "Preamble",
    },
    {
        "article_number": "Article 14",
        "title": "Equality before law",
        "text": (
            "The State shall not deny to any person equality before the law or the equal "
            "protection of the laws within the territory of India. This article embodies the "
            "concept of rule of law and prohibits class legislation. However, it permits "
            "reasonable classification for the purpose of legislation."
        ),
        "part": "Part III",
        "part_title": "Fundamental Rights",
    },
    {
        "article_number": "Article 19",
        "title": "Protection of certain rights regarding freedom of speech, etc.",
        "text": (
            "All citizens shall have the right to freedom of speech and expression; "
            "to assemble peaceably and without arms; to form associations or unions; "
            "to move freely throughout the territory of India; to reside and settle in any "
            "part of the territory of India; to practise any profession, or to carry on any "
            "occupation, trade or business. These rights are subject to reasonable restrictions "
            "in the interests of the sovereignty and integrity of India, the security of the State, "
            "friendly relations with foreign States, public order, decency or morality."
        ),
        "part": "Part III",
        "part_title": "Fundamental Rights",
    },
    {
        "article_number": "Article 21",
        "title": "Protection of life and personal liberty",
        "text": (
            "No person shall be deprived of his life or personal liberty except according "
            "to procedure established by law. The Supreme Court has interpreted this article "
            "expansively to include the right to live with dignity, right to livelihood, right to "
            "health, right to education, right to privacy, right to shelter, right to speedy trial, "
            "right to clean environment, and many other rights."
        ),
        "part": "Part III",
        "part_title": "Fundamental Rights",
    },
    {
        "article_number": "Article 32",
        "title": "Remedies for enforcement of Fundamental Rights",
        "text": (
            "The right to move the Supreme Court by appropriate proceedings for the enforcement "
            "of the rights conferred by Part III is guaranteed. The Supreme Court shall have "
            "power to issue directions or orders or writs, including writs in the nature of "
            "habeas corpus, mandamus, prohibition, quo warranto and certiorari, for the "
            "enforcement of any of the rights conferred by Part III. Dr. B.R. Ambedkar called "
            "this article the very soul of the Constitution."
        ),
        "part": "Part III",
        "part_title": "Fundamental Rights",
    },
    {
        "article_number": "Article 368",
        "title": "Power of Parliament to amend the Constitution and procedure therefor",
        "text": (
            "Notwithstanding anything in this Constitution, Parliament may in exercise of its "
            "constituent power amend by way of addition, variation or repeal any provision of "
            "this Constitution in accordance with the procedure laid down in this article. "
            "An amendment of this Constitution may be initiated only by the introduction of a "
            "Bill for the purpose in either House of Parliament, and when the Bill is passed in "
            "each House by a majority of the total membership of that House and by a majority "
            "of not less than two-thirds of the members of that House present and voting, it "
            "shall be presented to the President who shall give his assent to the Bill and "
            "thereupon the Constitution shall stand amended."
        ),
        "part": "Part XX",
        "part_title": "Amendment of the Constitution",
    },
    {
        "article_number": "Article 15",
        "title": "Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth",
        "text": (
            "The State shall not discriminate against any citizen on grounds only of religion, "
            "race, caste, sex, place of birth or any of them. No citizen shall, on grounds only "
            "of religion, race, caste, sex, place of birth or any of them, be subject to any "
            "disability, liability, restriction or condition. Nothing in this article shall prevent "
            "the State from making any special provision for women and children or for the "
            "advancement of any socially and educationally backward classes of citizens or for "
            "the Scheduled Castes and the Scheduled Tribes."
        ),
        "part": "Part III",
        "part_title": "Fundamental Rights",
    },
    {
        "article_number": "Article 44",
        "title": "Uniform civil code for the citizens",
        "text": (
            "The State shall endeavour to secure for the citizens a uniform civil code "
            "throughout the territory of India. This is a Directive Principle of State Policy "
            "under Part IV of the Constitution."
        ),
        "part": "Part IV",
        "part_title": "Directive Principles of State Policy",
    },
    {
        "article_number": "Article 51A",
        "title": "Fundamental duties",
        "text": (
            "It shall be the duty of every citizen of India: to abide by the Constitution and "
            "respect its ideals and institutions, the National Flag and the National Anthem; "
            "to cherish and follow the noble ideals which inspired our national struggle for "
            "freedom; to uphold and protect the sovereignty, unity and integrity of India; "
            "to defend the country and render national service when called upon to do so; "
            "to promote harmony and the spirit of common brotherhood amongst all the people "
            "of India transcending religious, linguistic and regional or sectional diversities; "
            "to value and preserve the rich heritage of our composite culture; to protect and "
            "improve the natural environment; to develop the scientific temper, humanism and "
            "the spirit of inquiry and reform; to safeguard public property and to abjure violence; "
            "to strive towards excellence in all spheres of individual and collective activity."
        ),
        "part": "Part IVA",
        "part_title": "Fundamental Duties",
    },
    {
        "article_number": "Article 226",
        "title": "Power of High Courts to issue certain writs",
        "text": (
            "Notwithstanding anything in article 32, every High Court shall have powers, "
            "throughout the territories in relation to which it exercises jurisdiction, to issue "
            "to any person or authority, including in appropriate cases, any Government, within "
            "those territories directions, orders or writs, including writs in the nature of "
            "habeas corpus, mandamus, prohibition, quo warranto and certiorari, or any of them, "
            "for the enforcement of any of the rights conferred by Part III and for any other purpose."
        ),
        "part": "Part VI",
        "part_title": "The States — The High Courts",
    },
]


def get_all_provisions() -> list[dict]:
    """Get all constitutional provisions (parsed + supplementary)."""
    try:
        articles = load_constitution()
    except FileNotFoundError:
        logger.warning("Constitution file not found, using supplementary provisions only.")
        articles = []

    # Add supplementary provisions, avoiding duplicates
    existing_numbers = {a["article_number"] for a in articles}
    for provision in SUPPLEMENTARY_PROVISIONS:
        if provision["article_number"] not in existing_numbers:
            articles.append(provision)

    return articles
