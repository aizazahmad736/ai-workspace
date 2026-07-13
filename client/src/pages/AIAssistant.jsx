import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FileText, 
  Bot, 
  Terminal, 
  Code, 
  Mail, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Clipboard,
  Check
} from 'lucide-react';

const tabs = [
  { id: 'resume', name: 'Resume Reviewer', icon: FileText, desc: 'Analyze CV relevance for target roles' },
  { id: 'interview', name: 'Interview Simulator', icon: Terminal, desc: 'Chat simulator with mock recruiter' },
  { id: 'code', name: 'Code Explainer', icon: Code, desc: 'Detailed explanations of complex blocks' },
  { id: 'summarizer', name: 'Text Summarizer', icon: Bot, desc: 'Generate high-level summaries' },
  { id: 'email', name: 'Email Generator', icon: Mail, desc: 'Craft outreach and follow-up templates' }
];

const AIAssistant = () => {
  const { user, refreshUsage } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Resume Reviewer State
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [score, setScore] = useState(null);

  // Interview Simulator State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Interviewer. Tell me a bit about a full-stack project you recently built.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Code Explainer State
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('JavaScript');

  // Text Summarizer State
  const [textToSummarize, setTextToSummarize] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');

  // Email Generator State
  const [recipient, setRecipient] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('outreach');
  const [emailTone, setEmailTone] = useState('formal');

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAI = async (endpoint, payload) => {
    setLoading(true);
    setErrorMsg('');
    setResult('');
    try {
      const { data } = await api.post(`/ai/${endpoint}`, payload);
      setResult(data.result);
      if (data.score) setScore(data.score);
      await refreshUsage();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch AI evaluation');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setLoading(true);
    setErrorMsg('');

    try {
      const { data } = await api.post('/ai/interview', {
        messages: newMessages,
        targetRole: 'Full-Stack React Developer'
      });
      setMessages([...newMessages, { role: 'assistant', content: data.result }]);
      await refreshUsage();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Chat error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Playground</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1">Leverage LLM utilities to optimize, evaluate, and learn.</p>
        </div>
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 flex items-center gap-3 w-fit text-xs font-semibold text-gray-300">
          <span>AI Limit Usage:</span>
          <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            {user?.aiUsageCount || 0} / {user?.aiUsageLimit || 20} used
          </span>
        </div>
      </div>

      {/* Grid: Nav Tabs (Left) / Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult('');
                  setErrorMsg('');
                  setScore(null);
                }}
                className={`
                  w-full text-left p-3.5 rounded-2xl flex items-start gap-3 border transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400 font-bold' 
                    : 'bg-[#18181b]/35 border-[#27272a]/20 text-[#a1a1aa] hover:bg-[#18181b]/70 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{tab.name}</p>
                  <p className="text-[10px] text-[#71717a] mt-0.5 font-normal line-clamp-1">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Input Interface (Center/Right) */}
        <div className="lg:col-span-3 space-y-6">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="p-6 rounded-3xl glass border border-[#27272a]/20">
            
            {/* 1. Resume Reviewer */}
            {activeTab === 'resume' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Target Job Title</label>
                    <input 
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-violet-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Resume Plaintext</label>
                  <textarea 
                    rows="6"
                    placeholder="Paste CV text highlights here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>
                <button
                  disabled={loading || !resumeText.trim()}
                  onClick={() => handleRunAI('resume', { resumeText, targetRole })}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run CV Audit'}
                </button>
              </div>
            )}

            {/* 2. Interview Practice Simulator */}
            {activeTab === 'interview' && (
              <div className="space-y-4">
                <div className="bg-[#09090b]/80 border border-[#27272a] rounded-2xl p-4 h-80 overflow-y-auto space-y-4 text-xs">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] ${
                        m.role === 'user' 
                          ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white' 
                          : 'bg-[#18181b] border border-[#27272a] text-[#f4f4f5]'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-2xl flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Recruiter is typing...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleInterviewSubmit} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Type your response to the interviewer..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !chatInput.trim()}
                    className="bg-[#27272a] hover:bg-[#27272a]/80 text-[#f4f4f5] px-4 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-30 flex items-center gap-1"
                  >
                    <span>Send</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* 3. Code Explainer */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    >
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="TypeScript">TypeScript</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Snippet Editor</label>
                  <textarea 
                    rows="6"
                    placeholder="Paste code blocks to review..."
                    value={codeSnippet}
                    onChange={(setCodeSnippetValue) => setCodeSnippet(setCodeSnippetValue.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-4 text-xs text-[#a7f3d0] font-mono focus:outline-none"
                  />
                </div>
                <button
                  disabled={loading || !codeSnippet.trim()}
                  onClick={() => handleRunAI('explain-code', { codeSnippet, language })}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Explain Logic'}
                </button>
              </div>
            )}

            {/* 4. Text Summarizer */}
            {activeTab === 'summarizer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Target Length</label>
                    <select 
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    >
                      <option value="short">Short (2 Key Bulletpoints)</option>
                      <option value="medium">Medium (Detailed Core Points)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Original Text</label>
                  <textarea 
                    rows="6"
                    placeholder="Paste long articles/documentation pages here..."
                    value={textToSummarize}
                    onChange={(e) => setTextToSummarize(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>
                <button
                  disabled={loading || !textToSummarize.trim()}
                  onClick={() => handleRunAI('summarize', { textToSummarize, length: summaryLength })}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Condense Document'}
                </button>
              </div>
            )}

            {/* 5. Email Generator */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Recipient Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Hiring Manager"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Purpose</label>
                    <select 
                      value={emailPurpose}
                      onChange={(e) => setEmailPurpose(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    >
                      <option value="outreach">Cold Outreach</option>
                      <option value="follow_up">Interview Follow-Up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5">Tone</label>
                    <select 
                      value={emailTone}
                      onChange={(e) => setEmailTone(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    >
                      <option value="formal">Formal</option>
                      <option value="casual">Friendly & Casual</option>
                    </select>
                  </div>
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleRunAI('email', { recipient, purpose: emailPurpose, tone: emailTone })}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Email Body'}
                </button>
              </div>
            )}

          </div>

          {/* AI Output Window (Not for interview tab since it is a chat log) */}
          {activeTab !== 'interview' && result && (
            <div className="p-6 rounded-3xl bg-[#18181b]/40 border border-[#27272a] animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a]/40 pb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Engine Response</span>
                </span>
                
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white px-2 py-1 rounded bg-[#27272a] transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Render simulated markdown content */}
              <div className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-line prose prose-invert">
                {result}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AIAssistant;
