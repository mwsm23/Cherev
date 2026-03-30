export interface HistoryRecord {
  id: string;
  type: 'devocional' | 'pregacao' | 'explicacao' | 'oracao';
  title: string;
  content: string;
  date: string;
}

export const getHistory = (): HistoryRecord[] => {
  const saved = localStorage.getItem('luz_diaria_history');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
};

export const saveToHistory = (record: Omit<HistoryRecord, 'id' | 'date'>) => {
  const history = getHistory();
  const newRecord: HistoryRecord = {
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  const updated = [newRecord, ...history];
  localStorage.setItem('luz_diaria_history', JSON.stringify(updated));
};

export const deleteFromHistory = (id: string) => {
  const history = getHistory();
  const updated = history.filter(r => r.id !== id);
  localStorage.setItem('luz_diaria_history', JSON.stringify(updated));
};
