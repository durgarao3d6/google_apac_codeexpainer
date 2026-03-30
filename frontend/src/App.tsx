import { useState } from 'react';
import { Editor } from './components/Editor';
import { Explanation } from './components/Explanation';
import { analyzeCode, type ExplanationResponse } from './services/api';

function App() {
  const [data, setData] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await analyzeCode({ code, language });
      setData(response);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>Code Explainer</h1>
      </header>
      
      <main className="container">
        <Editor onAnalyze={handleAnalyze} isLoading={isLoading} />
        <Explanation data={data} isLoading={isLoading} error={error} />
      </main>
    </>
  );
}

export default App;
