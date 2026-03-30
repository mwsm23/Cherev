import React, { useState } from 'react';
import { DailyDevotional } from './components/DailyDevotional';
import { SermonGenerator } from './components/SermonGenerator';
import { TextExplainer } from './components/TextExplainer';
import { PrayerRoom } from './components/PrayerRoom';
import { HistoryTab } from './components/HistoryTab';
import { Logo } from './components/Logo';
import { BookOpen, BookOpenText, FileSearch, HeartHandshake, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'devocional' | 'pregacao' | 'explicacao' | 'oracao' | 'historico';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('devocional');

  const tabs = [
    { id: 'devocional', label: 'Devocional', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100', activeBg: 'bg-amber-50' },
    { id: 'pregacao', label: 'Pregação', icon: BookOpenText, color: 'text-indigo-600', bg: 'bg-indigo-100', activeBg: 'bg-indigo-50' },
    { id: 'explicacao', label: 'Explicação', icon: FileSearch, color: 'text-emerald-600', bg: 'bg-emerald-100', activeBg: 'bg-emerald-50' },
    { id: 'oracao', label: 'Oração', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-100', activeBg: 'bg-rose-50' },
    { id: 'historico', label: 'Histórico', icon: History, color: 'text-stone-600', bg: 'bg-stone-200', activeBg: 'bg-stone-100' },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-900 text-white rounded-lg">
                <Logo size={22} />
              </div>
              <h1 className="text-xl font-serif font-semibold tracking-tight flex items-baseline gap-2">
                Cherev
                <span className="font-sans text-stone-400 text-lg font-normal">חֶרֶב</span>
              </h1>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-1 overflow-x-auto pb-4 scrollbar-hide" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                    ${isActive 
                      ? `${tab.activeBg} ${tab.color} shadow-sm ring-1 ring-black/5` 
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? tab.color : 'text-stone-400'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'devocional' && <DailyDevotional />}
            {activeTab === 'pregacao' && <SermonGenerator />}
            {activeTab === 'explicacao' && <TextExplainer />}
            {activeTab === 'oracao' && <PrayerRoom />}
            {activeTab === 'historico' && <HistoryTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
