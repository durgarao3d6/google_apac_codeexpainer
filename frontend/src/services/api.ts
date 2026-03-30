const API_URL = "http://localhost:8000/explain";

export interface ExplanationRequest {
  code: string;
  language: string;
}

export interface ExplanationStep {
  title: string;
  description: string;
}

export interface ExplanationResponse {
  summary: string;
  steps: ExplanationStep[];
  notes?: string;
}

export const analyzeCode = async (data: ExplanationRequest): Promise<ExplanationResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze code");
  }

  return response.json();
};
