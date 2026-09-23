export type Tech =
  | 'Symfony'
  | 'PHP'
  | 'React'
  | 'TypeScript'
  | 'JavaScript'
  | 'API Platform'
  | 'Java'
  | 'AI'
  | 'Python'
  | 'MySQL'
  | 'HTML/CSS'
  | 'WordPress'
  | 'Linux'
  | 'SEO'
  | 'Security'
  | 'Agile'
  | 'UML';

export type ContractType = 'Apprenticeship' | 'Internship' | 'Freelance' | 'Fixed-term';
export type WorkMode = 'On-site' | 'Hybrid' | 'Remote';

export interface KeyFact {
  value: string;
  label: string;
}

export interface Company {
  id: string;
  name: string;
  /** Short monogram used when no logo image can be loaded */
  monogram: string;
  /** Brand-ish gradient used for the monogram fallback and the company page hero */
  gradient: [string, string];
  /** Logo candidates tried in order: local file first, then the official remote asset */
  logos: string[];
  sector: string;
  about: string;
  facts: KeyFact[];
  /** Optional illustration shown on the company page (the company's own visual) */
  visual?: { src: string[]; alt: string };
  url?: string;
}

/** End client of a mission, when different from the employer (e.g. a bank subsidiary). */
export interface Client {
  name: string;
  logos: string[];
  parent?: { name: string; logos: string[] };
  about: string;
  facts: KeyFact[];
  url?: string;
}

export interface MissionGroup {
  title: string;
  items: string[];
}

export interface Experience {
  id: string;
  company: Company;
  role: string;
  contract: ContractType;
  period: string;
  duration: string;
  location: string;
  mode: WorkMode;
  current?: boolean;
  /** Short jobs kept discreet: compact card, no highlight */
  minor?: boolean;
  summary: string;
  missions: MissionGroup[];
  stack: Tech[];
  skills: string[];
  client?: Client;
  /** Shown on the page when the work itself cannot be published */
  confidential?: string;
  projectIds?: string[];
}

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
}

/** One step of the "how it's built" diagram on a project page. */
export interface BuildStep {
  title: string;
  detail: string;
  icon: 'user' | 'shield' | 'server' | 'database' | 'code' | 'check' | 'layout' | 'cpu' | 'mail' | 'search' | 'file' | 'globe';
}

export interface Project {
  id: string;
  title: string;
  context: string;
  /** Experience id when the project was done for an employer */
  experienceId?: string;
  year: string;
  description: string;
  problem: string;
  outcome: string[];
  highlights: string[];
  build: BuildStep[];
  stack: Tech[];
  featured?: boolean;
  confidential?: string;
  demoUrl?: string;
  /** Interactive demo rendered inside the project page */
  demo?: 'cwad' | 'sql';
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
