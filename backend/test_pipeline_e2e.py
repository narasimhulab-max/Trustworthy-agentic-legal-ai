import asyncio
from agents.orchestrator import orchestrator

async def test_full_pipeline():
    query = "Can police detain a citizen indefinitely without producing them before a magistrate?"
    print(f"\n--- Testing 13-Stage Pipeline with Query: '{query}' ---\n")
    
    stage_count = 0
    async for event in orchestrator.execute_stream(query):
        evt_type = event.get("event")
        data = event.get("data", {})
        if evt_type == "stage_update":
            stage_count += 1
            print(f"[{data.get('status').upper():<7}] Stage: {data.get('stage_id'):<18} | Msg: {data.get('message')}")
        elif evt_type == "result":
            print("\n--- Final Recommendation Generated ---")
            print(f"Domain: {data.get('domain')}")
            print(f"Trust Score: {data.get('trust_metrics', {}).get('overall_score')}%")
            print(f"Confidence: {data.get('trust_metrics', {}).get('confidence_level')}")
            print(f"Cited Articles: {[a['article_number'] for a in data.get('applicable_articles', [])]}")
            print(f"Processing Time: {data.get('processing_time_ms')}ms")
            print(f"Summary: {data.get('summary')[:150]}...\n")

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
