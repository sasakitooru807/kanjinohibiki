
import React from 'react';
import { Idiom } from '../types';

interface IdiomCardProps {
  idiom: Idiom;
}

const IdiomCard: React.FC<IdiomCardProps> = ({ idiom }) => {
  return (
    <div className="bg-transparent p-6 rounded-sm border-2 border-white/20 border-dashed transition-all hover:border-white/60 hover:bg-white/5 group relative overflow-hidden">
      {/* チョークの粉っぽさを演出する背景 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')]"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-4">
          <h3 className="text-4xl font-bold chalk-text-white kanji-font group-hover:chalk-text-yellow transition-colors">
            {idiom.word}
          </h3>
          <span className="text-white/60 text-sm font-medium">（{idiom.reading}）</span>
        </div>
        
        <div className="border-l-2 border-white/30 pl-4 mb-4">
          <p className="chalk-text-white leading-relaxed font-light text-lg">
            {idiom.meaning}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 italic chalk-text-yellow text-sm opacity-90">
          <p className="before:content-['「'] after:content-['」']">
            {idiom.example}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdiomCard;
