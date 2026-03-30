import React, { useState } from 'react';
import { explainText } from '../services/gemini';
import Markdown from 'react-markdown';
import { ShareButtons } from './ShareButtons';
import { FileSearch, Loader2, Send } from 'lucide-react';
import { saveToHistory } from '../utils/history';

export function TextExplainer() {
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const content = await explainText(text);
      setExplanation(content);
      saveToHistory({ type: 'explicacao', title: text, content });
    } catch (err) {
      setError('Não foi possível explicar o texto. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:p-0 print:shadow-none print:border-none">
      <div className="flex items-center gap-3 mb-8 print:hidden">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
          <FileSearch size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-medium text-stone-800">Explicação de Texto</h2>
          <p className="text-stone-500 text-sm mt-1">Entenda o contexto, significado original e aplicação de um versículo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 print:hidden">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole aqui o versículo ou passagem que deseja entender melhor..."
            className="w-full pl-4 pr-14 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400 min-h-[120px] resize-y"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="absolute right-3 bottom-3 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      {explanation && !loading && (
        <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-emerald-600 prose-h2:text-emerald-900 prose-h3:text-emerald-800">
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 print:p-0 print:bg-transparent print:border-none">
            <Markdown>{explanation}</Markdown>
            <div className="mt-8 pt-6 border-t border-stone-200 print:hidden">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">Compartilhe esta Explicação</h3>
              <ShareButtons text={explanation} title="Explicação Bíblica" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
