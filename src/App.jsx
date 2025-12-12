import React, { useState } from 'react';
import { generatePrompts } from './mockApi';

function App() {
  const [topic, setTopic] = useState('');
  const [purpose, setPurpose] = useState('social');
  const [tone, setTone] = useState('professional');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrompts([]); // Clear previous results
    setCopiedIndex(null);

    try {
      const results = await generatePrompts(topic, purpose, tone);
      setPrompts(results);
    } catch (error) {
      console.error("Failed to generate prompts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <img src="/logo.png" alt="AI Prompt Assistant Logo" className="app-logo" />
          <h1>AI Prompt Assistant</h1>
        </div>
        <p>Generate consistent Czech prompts for your needs.</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="input-group">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Remote Work Tips"
              required
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label htmlFor="purpose">Purpose</label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="social">Social Media Post</option>
                <option value="workshop">Workshop Agenda</option>
                <option value="case-study">UX Case Study</option>
                <option value="healthcare">Healthcare Content</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Prompts'}
          </button>
        </form>

        {prompts.length > 0 && (
          <div className="results-section">
            <h2>Generated Prompts</h2>
            <div className="prompts-list">
              {prompts.map((prompt, index) => (
                <div key={index} className="prompt-card">
                  <p>{prompt}</p>
                  <button
                    className={`copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                    onClick={() => handleCopy(prompt, index)}
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
