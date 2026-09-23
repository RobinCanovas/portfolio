import type { Client, Company, Education, Experience, KeyFact, Project, SkillGroup, Tech } from '../types';
import { fr } from './fr';
import * as en from './profile';

export type Lang = 'en' | 'fr';

const mergeFacts = (base: KeyFact[], over?: { value?: string; label: string }[]): KeyFact[] =>
  base.map((f, i) => ({ value: over?.[i]?.value ?? f.value, label: over?.[i]?.label ?? f.label }));

function localizeCompany(c: Company): Company {
  const o = fr.companies[c.id];
  if (!o) return c;
  return { ...c, sector: o.sector, about: o.about, facts: mergeFacts(c.facts, o.facts), visual: c.visual && { ...c.visual, alt: o.visualAlt ?? c.visual.alt } };
}

function localizeClient(c: Client): Client {
  const o = fr.clients[c.name];
  if (!o) return c;
  return { ...c, about: o.about, facts: mergeFacts(c.facts, o.facts) };
}

function localizeExperience(e: Experience): Experience {
  const o = fr.experiences[e.id];
  const company = localizeCompany(e.company);
  const client = e.client && localizeClient(e.client);
  if (!o) return { ...e, company, client };
  return { ...e, ...o, skills: o.skills ?? e.skills, confidential: o.confidential ?? e.confidential, company, client };
}

function localizeProject(p: Project): Project {
  const o = fr.projects[p.id];
  if (!o) return p;
  return { ...p, ...o, build: p.build.map((step, i) => ({ ...step, ...o.build[i] })), confidential: o.confidential ?? p.confidential };
}

function localizeEducation(ed: Education): Education {
  const o = fr.education[ed.id];
  return o ? { ...ed, ...o, school: o.school ?? ed.school } : ed;
}

function localizeSkillGroup(g: SkillGroup): SkillGroup {
  const o = fr.skillGroups[g.id];
  if (!o) return g;
  return { ...g, title: o.title, skills: g.skills.map((s) => ({ ...s, name: o.skills?.[s.name] ?? s.name })) };
}

function build(lang: Lang) {
  const isFr = lang === 'fr';
  const experiences = isFr ? en.experiences.map(localizeExperience) : en.experiences;
  const projects = isFr ? en.projects.map(localizeProject) : en.projects;
  return {
    lang,
    links: en.links,
    profile: isFr ? { ...en.profile, ...fr.profile } : en.profile,
    experiences,
    projects,
    projectFilters: en.projectFilters,
    education: isFr ? en.education.map(localizeEducation) : en.education,
    vModel: isFr ? fr.vModel : (en.vModel as readonly { left: string; right: string }[]),
    volunteering: isFr ? { ...en.volunteering, ...fr.volunteering } : en.volunteering,
    interests: isFr ? fr.interests : en.interests,
    skillGroups: isFr ? en.skillGroups.map(localizeSkillGroup) : en.skillGroups,
    languages: isFr ? en.languages.map((l) => ({ ...l, ...fr.languages[l.name] })) : en.languages,
    findExperience: (id: string) => experiences.find((e) => e.id === id),
    findProject: (id: string) => projects.find((p) => p.id === id),
    /** Display label for a contract type, work mode or tech tag. */
    contract: (c: Experience['contract']) => (isFr ? fr.contract[c] : c),
    mode: (m: Experience['mode']) => (isFr ? fr.mode[m] : m),
    tech: (t: Tech) => (isFr ? (fr.tech[t] ?? t) : t),
    group: (name: string) => (isFr ? `groupe ${name}` : `${name} group`),
  };
}

export type Content = ReturnType<typeof build>;

const cache: Partial<Record<Lang, Content>> = {};
export function getContent(lang: Lang): Content {
  return (cache[lang] ??= build(lang));
}
