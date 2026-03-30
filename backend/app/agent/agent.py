import os
from dotenv import load_dotenv
load_dotenv()
# Explicitly force Vertex AI mode and define service account path
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "1"

# Automatically find and mount the serviceAccount.json file located in the backend folder
service_account_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "serviceAccount.json"))
if os.path.exists(service_account_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_path

import json
import logging
import uuid
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from google.genai import types
from .prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

# Reusable session service for the runner
session_service = InMemorySessionService()

def create_agent() -> Agent:
    return Agent(
        model="gemini-2.5-flash",
        name="code_explainer",
        description="Explains code snippets using Vertex AI and the Gemini model.",
        instruction=SYSTEM_PROMPT,
    )

async def explain_code(code: str, language: str) -> dict:
    agent = create_agent()
    
    # Create the runner with the in-memory session service
    runner = Runner(
        agent=agent, 
        app_name="code_explainer_app", 
        session_service=session_service, 
        auto_create_session=True
    )
    
    # Format the input as a types.Content object
    content = types.Content(role="user", parts=[types.Part(text=f"Language: {language}\n\nCode:\n{code}")])
    
    # Generate unique session to avoid overlaps across stateless API requests
    session_id = str(uuid.uuid4())
    
    responses = []
    
    try:
        # Iterate over the async generator returned by Runner
        async for event in runner.run_async(
            user_id="user",
            session_id=session_id,
            new_message=content
        ):
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        responses.append(part.text)
    except Exception as e:
        logger.error(f"Error during ADK Runner execution: {e}")
        raise e

    text = "".join(responses).strip()
    
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"summary": text, "steps": [], "notes": "JSON decode failed, raw text provided instead."}
