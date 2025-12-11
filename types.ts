export type Language = 'en' | 'cn';

export interface LanguageProps {
  lang: Language;
}

export interface Competition {
  year: number;
  name: string;
  rank: string;
  medal?: 'gold' | 'silver' | 'bronze';
  link?: string;
  details?: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
}