export type Level = "Day 1" | "Day 2" | "Day 3";
 
export interface Materi {
  id: number;
  nomor: string;
  judul: string;
  deskripsi: string;
  tag: string;
  level: Level;
  durasi: string;
  progress: number;
  href: string;
  icon: string;
}
 