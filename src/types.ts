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
  | 'Agile'
  | 'UML';

export type ContractType = 'Apprenticeship' | 'Internship' | 'Freelance' | 'Fixed-term';

export interface Company {
  id: string;
  name: string;
  /** Short monogram used when no logo image can be loaded */
  monogram: string;
  /** Gradient of the monogram fallback tile */
  gradient: [string, string];
  /** Logo candidates tried in order: local file first, then the official remote asset */
  logos: string[];
  sector: string;
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
  featured?: boolean;
  demoUrl?: string;
  repoUrl?: string;
  snippet?: CodeSnippet;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  logos: string[];
  details: string[];
}

export type SkillLevel = 'daily' | 'solid' | 'learning';

export interface Skill {
  name: string;
  /** Simple Icons slug (https://simpleicons.org) — omitted for skills without a brand icon */
  icon?: string;
  level: SkillLevel;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  cv: string;
}
