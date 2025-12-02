export interface Competition {
  year: number;
  name: string;
  rank: string;
  medal?: 'gold' | 'silver' | 'bronze';
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
}
