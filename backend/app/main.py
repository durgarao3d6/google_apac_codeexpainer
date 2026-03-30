from dotenv import load_dotenv
load_dotenv()  # Ensure .env config is active for Vertex AI

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import ExplanationRequest, ExplanationResponse
from .agent.agent import explain_code
import logging

app = FastAPI(title="Code Explainer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/explain", response_model=ExplanationResponse)
async def explain(request: ExplanationRequest):
    try:
        result = await explain_code(request.code, request.language)
        return ExplanationResponse(**result)
    except Exception as e:
        logging.error(f"Error during explanation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
