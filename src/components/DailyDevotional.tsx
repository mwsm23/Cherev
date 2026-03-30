import React, { useState, useEffect } from 'react';
import { generateDailyDevotional } from '../services/gemini';
import Markdown from 'react-markdown';
import { ShareButtons } from './ShareButtons';
import { BookOpen, RefreshCw, Clock } from 'lucide-react';
import { saveToHistory } from '../utils/history';

const DEVO_STORAGE_KEY = 'cherev_daily_devo';
const DEVO_TIMESTAMP_KEY = 'cherev_daily_devo_timestamp';
const EXPIRATION_TIME = 23 * 60 * 60 * 1000; // 23 hours in milliseconds

export function DailyDevotional() {
  const [devotional, setDevotional] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUpdate, setNextUpdate] = useState<string | null>(null);

  const fetchDevotional = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const now = Date.now();
      const savedDevo = localStorage.getItem(DEVO_STORAGE_KEY);
      const savedTimestamp = localStorage.getItem(DEVO_TIMESTAMP_KEY);

      if (!force && savedDevo && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp, 10);
        if (now - timestamp < EXPIRATION_TIME) {
          setDevotional(savedDevo);
          const remaining = EXPIRATION_TIME - (now - timestamp);
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setNextUpdate(`${hours}h ${minutes}min`);
          setLoading(false);
          return;
        }
      }

      const content = await generateDailyDevotional();
      setDevotional(content);
      localStorage.setItem(DEVO_STORAGE_KEY, content);
      localStorage.setItem(DEVO_TIMESTAMP_KEY, now.toString());
      
      const hours = 23;
      setNextUpdate(`${hours}h 0min`);
      
      saveToHistory({ type: 'devocional', title: 'Devocional Diário', content });
    } catch (err) {
      setError('Não foi possível carregar o devocional. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotional();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:p-0 print:shadow-none print:border-none">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-medium text-stone-800">Devocional Diário</h2>
            {nextUpdate && !loading && (
              <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
                <Clock size={12} />
                <span>Atualiza em {nextUpdate}</span>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => fetchDevotional(true)}
          disabled={loading}
          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-colors disabled:opacity-50"
          title="Gerar Novo Devocional"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-stone-100 rounded w-3/4"></div>
          <div className="h-4 bg-stone-100 rounded w-full"></div>
          <div className="h-4 bg-stone-100 rounded w-full"></div>
          <div className="h-4 bg-stone-100 rounded w-5/6"></div>
          <div className="h-20 bg-stone-100 rounded w-full mt-6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-xl text-center">
          {error}
        </div>
      ) : devotional ? (
        <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-amber-600">
          <Markdown>{devotional}</Markdown>
          <div className="mt-8 pt-6 border-t border-stone-100 print:hidden">
            <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">Compartilhe a Palavra</h3>
            <ShareButtons text={devotional} title="Devocional Diário" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
