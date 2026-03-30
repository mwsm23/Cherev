import React, { useState } from 'react';
import { generatePrayer } from '../services/gemini';
import Markdown from 'react-markdown';
import { ShareButtons } from './ShareButtons';
import { HeartHandshake, Loader2, Send } from 'lucide-react';
import { saveToHistory } from '../utils/history';

export function PrayerRoom() {
  const [situation, setSituation] = useState('');
  const [prayer, setPrayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const content = await generatePrayer(situation);
      setPrayer(content);
      saveToHistory({ type: 'oracao', title: situation, content });
    } catch (err) {
      setError('Não foi possível gerar a oração. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:p-0 print:shadow-none print:border-none">
      <div className="flex items-center gap-3 mb-8 print:hidden">
        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
          <HeartHandshake size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-medium text-stone-800">Sala de Oração</h2>
          <p className="text-stone-500 text-sm mt-1">Receba uma oração baseada na Bíblia para o seu momento.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 print:hidden">
        <div className="relative">
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Pelo que você gostaria de orar hoje? (Ex: Ansiedade no trabalho, saúde da minha família, sabedoria para uma decisão...)"
            className="w-full pl-4 pr-14 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-stone-800 placeholder-stone-400 min-h-[120px] resize-y"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !situation.trim()}
            className="absolute right-3 bottom-3 p-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:hover:bg-rose-600"
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

      {prayer && !loading && (
        <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-rose-600 prose-h2:text-rose-900 prose-h3:text-rose-800">
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 print:p-0 print:bg-transparent print:border-none">
            <Markdown>{prayer}</Markdown>
            <div className="mt-8 pt-6 border-t border-stone-200 print:hidden">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">Compartilhe esta Oração</h3>
              <ShareButtons text={prayer} title="Oração" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
