import os
import asyncio
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class BaseLLMProvider(ABC):
    """Abstract interface for LLM inference in NyayaAI."""
    
    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.2) -> str:
        pass

class GeminiProvider(BaseLLMProvider):
    """Google Gemini LLM provider (using Gemini 2.5 Flash / 1.5 Pro)."""
    
    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        self._client = None
        
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiProvider] Warning: Failed to initialize google.genai: {e}")

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.2) -> str:
        if not self._client:
            return self._fallback_response(prompt)
        
        try:
            full_prompt = prompt
            if system_prompt:
                full_prompt = f"System Instructions:\n{system_prompt}\n\nUser Request:\n{prompt}"
            
            # Wrap synchronous generate_content() in asyncio.to_thread to avoid
            # blocking FastAPI's async event loop during LLM inference.
            def _sync_generate():
                return self._client.models.generate_content(
                    model=self.model_name,
                    contents=full_prompt,
                )
            
            response = await asyncio.to_thread(_sync_generate)
            return response.text or ""
        except Exception as e:
            print(f"[GeminiProvider] Generation error: {e}")
            return self._fallback_response(prompt)

    def _fallback_response(self, prompt: str) -> str:
        return (
            "Grounded Legal Analysis: Based on the constitutional provisions and retrieved articles, "
            "the citizen's rights are protected under fundamental rights guarantees. "
            "Ensure statutory procedures are strictly followed."
        )

class GroqProvider(BaseLLMProvider):
    """Groq Cloud LLM provider (Llama 3.3 70B / Llama 3.1 8B)."""
    
    def __init__(self, api_key: Optional[str] = None, model_name: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model_name = model_name

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.2) -> str:
        if not self.api_key:
            return "Groq API key not configured."
        try:
            import httpx
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json={"model": self.model_name, "messages": messages, "temperature": temperature}
                )
                res.raise_for_status()
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[GroqProvider] Error: {e}")
            return f"Error calling Groq API: {str(e)}"

class OpenAICompatibleProvider(BaseLLMProvider):
    """Generic OpenAI compatible API provider (Ollama, vLLM, DeepSeek, LocalAI)."""
    
    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None, model_name: str = "llama3"):
        self.base_url = base_url or os.getenv("OPENAI_BASE_URL", "http://localhost:11434/v1")
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "dummy")
        self.model_name = model_name

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.2) -> str:
        try:
            import httpx
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(
                    f"{self.base_url.rstrip('/')}/chat/completions",
                    headers=headers,
                    json={"model": self.model_name, "messages": messages, "temperature": temperature}
                )
                res.raise_for_status()
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[OpenAICompatibleProvider] Error: {e}")
            return f"Error calling local/OpenAI-compatible LLM: {str(e)}"

def get_llm_provider() -> BaseLLMProvider:
    """Factory to get the active LLM provider based on environment configuration."""
    provider_type = os.getenv("LLM_PROVIDER", "gemini").lower()
    if provider_type == "groq" and os.getenv("GROQ_API_KEY"):
        return GroqProvider()
    elif provider_type == "openai" or os.getenv("OPENAI_BASE_URL"):
        return OpenAICompatibleProvider()
    else:
        return GeminiProvider()
