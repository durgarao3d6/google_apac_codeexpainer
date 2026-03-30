import React from 'react';
import type { ExplanationResponse } from '../services/api';

interface ExplanationProps {
  data: ExplanationResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const Explanation: React.FC<ExplanationProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="panel">
        <h2>Explanation</h2>
        <div className="loading">
          Calling Vertex AI (gemini-2.5-flash)...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel" style={{ borderColor: '#f85149' }}>
        <h2 style={{ color: '#f85149' }}>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <h2>Explanation</h2>
        <div className="loading">Submit code to see the explanation here.</div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ overflowY: 'auto' }}>
      <h2>Analysis Results</h2>
      
      <div className="result-summary">
        {data.summary}
      </div>

      {data.steps && data.steps.length > 0 && (
        <div className="result-steps">
          {data.steps.map((step, index) => (
            <div key={index} className="step-card">
              <h3>{index + 1}. {step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.notes && (
        <div className="result-notes">
          <strong>Notes:</strong> {data.notes}
        </div>
      )}
    </div>
  );
};
