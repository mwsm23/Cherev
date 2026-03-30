import React, { useState } from 'react';
import { generateSermon } from '../services/gemini';
import Markdown from 'react-markdown';
import { ShareButtons } from './ShareButtons';
import { BookOpenText, Loader2, Send } from 'lucide-react';
import { saveToHistory } from '../utils/history';

export function SermonGenerator() {
  const [theme, setTheme] = useState('');
  const [sermon, setSermon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const content = await generateSermon(theme);
      setSermon(content);
      saveToHistory({ type: 'pregacao', title: theme, content });
    } catch (err) {
      setError('Não foi possível gerar o estudo. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:p-0 print:shadow-none print:border-none">
      <div className="flex items-center gap-3 mb-8 print:hidden">
        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
          <BookOpenText size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-medium text-stone-800">Estudo e Pregação</h2>
          <p className="text-stone-500 text-sm mt-1">Gere um esboço completo sobre qualquer tema bíblico.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 print:hidden">
        <div className="relative">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: O perdão de Deus, A armadura do cristão, Salmo 23..."
            className="w-full pl-4 pr-14 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !theme.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-xl text-center mb-6 print:hidden">
          {error}
        </div>
      )}

      {sermon && !loading && (
        <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-indigo-600 prose-h2:text-indigo-900 prose-h3:text-indigo-800">
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 print:p-0 print:bg-transparent print:border-none">
            <Markdown>{sermon}</Markdown>
            <div className="mt-8 pt-6 border-t border-stone-200 print:hidden">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">Compartilhe este Estudo</h3>
              <ShareButtons text={sermon} title={`Estudo: ${theme}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
