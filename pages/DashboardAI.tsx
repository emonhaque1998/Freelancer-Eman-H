
import React, { useState } from 'react';
import { User } from '../types';
import { generateCareerAdvice } from '../services/gemini';

export const DashboardAI: React.FC<{ user: User }> = ({ user }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [goal, setGoal] = useState('Full Stack Lead at Google');

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const result = await generateCareerAdvice(['React', 'Node.js', 'B.Sc Graduate'], goal);
    setAdvice(result || '');
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 text-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Gemini AI Career Strategist</h2>
        <p className="text-indigo-100 mb-8 max-w-xl">
          Personalized roadmaps powered by Gemini.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 outline-none"
            placeholder="Goal..."
          />
          <button 
            onClick={handleGetAdvice}
            disabled={loadingAdvice}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-extrabold hover:bg-indigo-50 transition"
          >
            {loadingAdvice ? 'Thinking...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {advice && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Your Path to {goal}
          </h3>
          <div className="prose prose-indigo max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
            {advice}
          </div>
        </div>
      )}
    </div>
  );
};
