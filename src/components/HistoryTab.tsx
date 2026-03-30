import React, { useState, useEffect } from 'react';
import { getHistory, deleteFromHistory, HistoryRecord } from '../utils/history';
import Markdown from 'react-markdown';
import { ShareButtons } from './ShareButtons';
import { History, Trash2, ArrowLeft, BookOpen, BookOpenText, FileSearch, HeartHandshake, Download } from 'lucide-react';

const typeConfig = {
  devocional: { icon: BookOpen, label: 'Devocional', color: 'text-amber-600', bg: 'bg-amber-100' },
  pregacao: { icon: BookOpenText, label: 'Pregação', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  explicacao: { icon: FileSearch, label: 'Explicação', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  oracao: { icon: HeartHandshake, label: 'Oração', color: 'text-rose-600', bg: 'bg-rose-100' },
};

export function HistoryTab() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este item do histórico?')) {
      deleteFromHistory(id);
      setHistory(getHistory());
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const handleExportTXT = () => {
    if (history.length === 0) return;

    let content = "HISTÓRICO DE ESTUDOS - CHEREV (חֶרֶב)\n";
    content += "==========================================\n\n";

    history.forEach((record, index) => {
      const date = new Date(record.date).toLocaleString('pt-BR');
      const typeLabel = typeConfig[record.type].label;
      
      content += `ITEM ${index + 1}\n`;
      content += `TIPO: ${typeLabel}\n`;
      content += `TEMA: ${record.title}\n`;
      content += `DATA: ${date}\n`;
      content += `------------------------------------------\n`;
      content += `${record.content}\n`;
      content += `\n==========================================\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico_cherev_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (selectedRecord) {
    const config = typeConfig[selectedRecord.type];
    const Icon = config.icon;
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:p-0 print:shadow-none print:border-none">
        <button
          onClick={() => setSelectedRecord(null)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-6 print:hidden"
        >
          <ArrowLeft size={20} />
          Voltar para o Histórico
        </button>
        
        <div className="flex items-center justify-between gap-3 mb-8 print:hidden">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${config.bg} ${config.color} rounded-xl`}>
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-medium text-stone-800">{selectedRecord.title}</h2>
              <p className="text-stone-500 text-sm mt-1">
                Salvo em {new Date(selectedRecord.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const date = new Date(selectedRecord.date).toLocaleString('pt-BR');
              const typeLabel = typeConfig[selectedRecord.type].label;
              let content = `CHEREV (חֶרֶב) - ${typeLabel}\n`;
              content += `==========================================\n`;
              content += `TEMA: ${selectedRecord.title}\n`;
              content += `DATA: ${date}\n`;
              content += `------------------------------------------\n\n`;
              content += selectedRecord.content;
              
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${selectedRecord.type}_${selectedRecord.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors text-sm font-medium border border-stone-200"
            title="Exportar como TXT"
          >
            <Download size={18} />
            Exportar TXT
          </button>
        </div>

        <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium">
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 print:p-0 print:bg-transparent print:border-none">
            <Markdown>{selectedRecord.content}</Markdown>
            <div className="mt-8 pt-6 border-t border-stone-200 print:hidden">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">Compartilhe</h3>
              <ShareButtons text={selectedRecord.content} title={selectedRecord.title} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-100 text-stone-700 rounded-xl">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-medium text-stone-800">Histórico Salvo</h2>
            <p className="text-stone-500 text-sm mt-1">Seus estudos, orações e devocionais salvos offline automaticamente.</p>
          </div>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={handleExportTXT}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors text-sm font-medium"
          >
            <Download size={18} />
            Exportar Tudo (TXT)
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
          <History size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="text-lg font-medium text-stone-700">Nenhum item no histórico</h3>
          <p className="text-stone-500 mt-2">Tudo o que você gerar será salvo aqui automaticamente.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map(record => {
            const config = typeConfig[record.type];
            const Icon = config.icon;
            return (
              <div 
                key={record.id} 
                onClick={() => setSelectedRecord(record)}
                className="p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 ${config.bg} ${config.color} rounded-lg`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-800 group-hover:text-stone-900 transition-colors line-clamp-1">{record.title}</h4>
                    <p className="text-sm text-stone-500 mt-1">
                      {config.label} • {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, record.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
