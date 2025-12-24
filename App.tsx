
import React, { useState, useCallback } from 'react';
import { AppStatus, Idiom } from './types';
import { fetchIdioms } from './services/geminiService';
import IdiomCard from './components/IdiomCard';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [currentKanji, setCurrentKanji] = useState('');
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmed = input.trim();
    if (trimmed.length !== 1) {
      setErrorMsg('漢字を一文字だけ入力してください。');
      return;
    }

    const isKanji = /[\u4e00-\u9faf]/.test(trimmed);
    if (!isKanji) {
      setErrorMsg('漢字を入力してください。');
      return;
    }

    setErrorMsg('');
    setStatus(AppStatus.LOADING);
    
    try {
      const results = await fetchIdioms(trimmed);
      setIdioms(results);
      setCurrentKanji(trimmed);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('先生、エラーです。もう一度お願いします。');
      setStatus(AppStatus.ERROR);
    }
  }, [input]);

  const handleClear = () => {
    setInput('');
    setStatus(AppStatus.IDLE);
    setIdioms([]);
    setCurrentKanji('');
    setErrorMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto blackboard-frame bg-[#1a3d32] min-h-[90vh] relative p-6 md:p-12 overflow-hidden">
      {/* 黒板の質感を高めるオーバーレイ */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>

      <header className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold chalk-text-white kanji-font tracking-widest mb-4">
          漢字の響き
        </h1>
        <div className="h-1 w-32 bg-white/30 mx-auto mb-4 rounded-full"></div>
        <p className="chalk-text-white opacity-80 text-lg md:text-xl font-light">
          一文字の漢字から広がる、言葉の景色
        </p>
      </header>

      {/* Input Section - チョーク置き場のイメージ */}
      <div className="relative z-10 bg-black/20 p-6 rounded-xl border border-white/10 shadow-inner mb-16 max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            maxLength={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="漢"
            className="flex-1 text-5xl text-center font-bold bg-transparent border-b-4 border-white/40 focus:border-white text-white outline-none kanji-font transition-all placeholder:text-white/10"
          />
          <button
            type="submit"
            disabled={status === AppStatus.LOADING || !input}
            className="bg-white/10 text-white px-8 py-2 rounded-md font-bold hover:bg-white/20 border border-white/30 disabled:opacity-30 transition-all active:scale-95"
          >
            {status === AppStatus.LOADING ? '書込中' : '探索'}
          </button>
        </form>
        
        {errorMsg && (
          <p className="mt-4 chalk-text-red text-sm font-medium text-center">
            {errorMsg}
          </p>
        )}
      </div>

      <main className="relative z-10 min-h-[40vh]">
        {status === AppStatus.IDLE && (
          <div className="text-center text-white/20 mt-20">
            <div className="text-[12rem] kanji-font leading-none select-none opacity-5 mb-8">静</div>
            <p className="text-xl chalk-text-white opacity-40">黒板に漢字を書いてみましょう</p>
          </div>
        )}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-6">
            <div className="w-12 h-4 bg-white/80 animate-bounce rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
            <p className="chalk-text-white text-lg animate-pulse">チョークを走らせています...</p>
          </div>
        )}

        {status === AppStatus.SUCCESS && idioms.length > 0 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-8 mb-16 justify-center">
              <div className="bg-transparent border-4 border-white/40 w-28 h-28 flex items-center justify-center rounded-sm rotate-1 shadow-lg">
                <span className="text-7xl font-bold chalk-text-white kanji-font">{currentKanji}</span>
              </div>
              <div className="h-16 w-1 bg-white/20 rounded-full"></div>
              <div>
                <h2 className="text-3xl font-bold chalk-text-yellow kanji-font">
                  「{currentKanji}」の熟語録
                </h2>
                <p className="chalk-text-white opacity-60">
                   {idioms.length} つの言葉が見つかりました
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {idioms.map((idiom, idx) => (
                <IdiomCard key={idx} idiom={idiom} />
              ))}
            </div>

            <div className="text-center pt-20">
              <button 
                onClick={handleClear}
                className="chalk-text-white opacity-30 hover:opacity-100 transition-opacity text-sm border-b border-white/20 pb-1"
              >
                黒板を消す
              </button>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && idioms.length === 0 && (
          <div className="text-center mt-20 chalk-text-white opacity-60">
             その漢字についてはまだ書かれていないようです。
          </div>
        )}
      </main>

      {/* Footer - チョークの粉のイメージ */}
      <footer className="mt-32 pt-8 border-t border-white/5 text-center chalk-text-white opacity-20 text-xs tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Kanji Explorer - Classroom Mode</p>
      </footer>
    </div>
  );
};

export default App;
