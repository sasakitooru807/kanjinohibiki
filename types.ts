
export interface Idiom {
  word: string;
  reading: string;
  meaning: string;
  example: string;
}

export interface KanjiInfo {
  kanji: string;
  idioms: Idiom[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
