import traceback
try:
    from agents.orchestrator import orchestrator
    print("SUCCESS: 13-stage Orchestrator imported and initialized!")
except Exception as e:
    print(f"FAILED: {e}")
    traceback.print_exc()
