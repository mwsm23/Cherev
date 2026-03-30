import React, { useState } from 'react';
import { Share2, Copy, Check, Instagram, MessageCircle, Printer } from 'lucide-react';

interface ShareButtonsProps {
  text: string;
  title?: string;
}

export function ShareButtons({ text, title = 'Mensagem Edificante' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have a direct text share URL. 
    // Best approach is to copy to clipboard and open Instagram.
    handleCopy();
    alert('Texto copiado! Cole no seu Story ou Feed do Instagram.');
    window.open('https://instagram.com', '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 print:hidden">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors text-sm font-medium"
      >
        <Printer size={16} />
        Imprimir
      </button>

      <button
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm font-medium"
      >
        <MessageCircle size={16} />
        WhatsApp
      </button>
      
      <button
        onClick={handleInstagramShare}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity text-sm font-medium"
      >
        <Instagram size={16} />
        Instagram
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-200"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        {copied ? 'Copiado!' : 'Copiar'}
      </button>

      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <Share2 size={16} />
          Compartilhar
        </button>
      )}
    </div>
  );
}
