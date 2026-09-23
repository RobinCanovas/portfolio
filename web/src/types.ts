export type Tech =
  | 'Symfony'
  | 'PHP'
  | 'React'
  | 'TypeScript'
  | 'API Platform'
  | 'Java'
  | 'AI'
  | 'Python'
  | 'MySQL'
  | 'HTML/CSS'
  | 'Linux'
  | 'SEO'
  | 'Agile';

export type ContractType = 'Apprenticeship' | 'Internship' | 'Freelance' | 'Fixed-term';

export interface Company {
  id: string;
  name: string;
  /** Short monogram rendered in the generated SVG logo */
  monogram: string;
  /** Tailwind-compatible gradient stops for the logo tile */
  gradient: [string, string];
  url?: string;
}

export interface Experience {
  id: string;
  company: Company;
  role: string;
  contract: ContractType;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  achievements: string[];
  stack: Tech[];
}

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
}

export interface Project {
  id: string;
  title: string;
  context: string;
  description: string;
  highlights: string[];
  stack: Tech[];
  demoUrl?: string;
  repoUrl?: string;
  snippet?: CodeSnippet;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  details: string[];
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  cv: string;
}
