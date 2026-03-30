import React, { useState } from 'react';

interface EditorProps {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

export const Editor: React.FC<EditorProps> = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  return (
    <div className="panel">
      <h2>Code Input</h2>
      
      <div className="form-group">
        <label htmlFor="language">Language</label>
        <select 
          id="language"
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isLoading}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
        </select>
      </div>

      <div className="form-group" style={{ flex: 1 }}>
        <label htmlFor="code">Code Snippet</label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          disabled={isLoading}
        ></textarea>
      </div>

      <button 
        onClick={() => onAnalyze(code, language)} 
        disabled={isLoading || !code.trim()}
      >
        {isLoading ? 'Analyzing...' : 'Explain Code'}
      </button>
    </div>
  );
};
