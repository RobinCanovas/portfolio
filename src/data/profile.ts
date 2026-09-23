import type { Client, Company, Education, Experience, Project, SkillGroup, SocialLinks, Tech } from '../types';

export const links: SocialLinks = {
  github: 'https://github.com/RobinCanovas',
  linkedin: 'https://www.linkedin.com/in/robin-canovas',
  email: 'robin.canovas@outlook.com',
  cv: './Robin-Canovas-CV.pdf',
};

export const profile = {
  name: 'Robin Canovas',
  title: 'Development Analyst & Web Developer',
  location: 'Paris, France',
  status: 'Open to opportunities',
  currentRole: 'Web Developer @ Éditions Ellipses',
  pitch:
    'I turn business requirements into secure, reliable software — from specifications and quality assurance to Symfony & React delivery. After working on a BNP Paribas group subsidiary’s platform, I’m building my path toward banking and IT consulting.',
  ambition: 'Long-term goal: banking & IT consulting — where rigour, security and business understanding matter as much as code.',
  avatar: './avatar.jpg',
};

/**
 * Logos and visuals: `npm run logos` downloads the official files into public/logos/.
 * Until then the remote official asset is used, and a monogram if both fail.
 */
const companies = {
  ellipses: {
    id: 'ellipses',
    name: 'Éditions Ellipses',
    monogram: 'Ell',
    gradient: ['#f97316', '#e11d48'],
    logos: ['./logos/ellipses.jpg', 'https://www.editions-ellipses.fr/img/ellipses-logo-1564132122.jpg'],
    sector: 'Academic publishing',
    about:
      'Independent French publisher and the leading publisher for universities and preparatory classes, covering every subject from secondary school to the end of higher education — and running its whole book chain, printing included.',
    facts: [
      { value: '50 yrs', label: 'of publishing' },
      { value: '13,000', label: 'titles in catalogue' },
      { value: '12,000+', label: 'authors' },
      { value: '45', label: 'countries reached' },
    ],
    url: 'https://www.editions-ellipses.fr',
  },
  acelys: {
    id: 'acelys',
    name: 'Acelys Services Numériques',
    monogram: 'Ac',
    gradient: ['#e11d48', '#7c3aed'],
    logos: ['./logos/acelys.png', 'https://www.acelys.fr/wp-content/uploads/2021/12/Logo-Acelys.png'],
    sector: 'IT services company (ESN)',
    about:
      'Digital services company based in Montpellier since 1997, supporting organisations in their digital transformation: software development, cybersecurity (audits, ISO 27001 governance, pentests), data and information-system performance — for clients in banking, insurance and social housing.',
    facts: [
      { value: '1997', label: 'founded' },
      { value: 'Montpellier', label: 'headquarters' },
      { value: 'Dev · Cyber · Data', label: 'core offers' },
    ],
    url: 'https://www.acelys.fr',
  },
  education: {
    id: 'education',
    name: 'Éducation Nationale',
    monogram: 'EN',
    gradient: ['#1d4ed8', '#dc2626'],
    logos: ['./logos/education.svg', 'https://www.education.gouv.fr/libraries/dsfr/dist/favicon/favicon.svg'],
    sector: 'French Ministry of Education',
    about:
      'The French Ministry of National Education runs public schools across the country. This mission was carried out for schools in the Gard département (Alès area), to digitise how staff manage students’ administrative files.',
    facts: [
      { value: 'Public', label: 'sector' },
      { value: 'Gard', label: 'schools served' },
      { value: 'Remote', label: 'freelance mission' },
    ],
    url: 'https://www.education.gouv.fr',
  },
  solstice: {
    id: 'solstice',
    name: 'Solutions Solstice',
    monogram: 'So',
    gradient: ['#facc15', '#16a34a'],
    logos: ['./logos/solstice.png', 'https://www.solutions-solstice.com/img/2018-logo-solution-solstice.png'],
    sector: 'Environmental measurement & industrial software',
    about:
      'Group combining gas analysis & instrumentation, building automation and engineering. As a software publisher it develops a data acquisition and handling system (DAHS) for environmental monitoring, including a reporting tool built for the EN 17255 standard.',
    facts: [
      { value: '4', label: 'sites: Paris-Saclay, Arras, Lyon, Metz' },
      { value: 'DAHS', label: 'environmental data software' },
      { value: 'EN 17255', label: 'reporting standard' },
    ],
    url: 'https://www.solutions-solstice.com',
  },
  aeroboat: {
    id: 'aeroboat',
    name: 'Aeroboat France',
    monogram: 'Ae',
    gradient: ['#38bdf8', '#6366f1'],
    logos: ['./logos/aeroboat.png', 'https://aeroboat-france.com/wp-content/uploads/2025/09/logoabf-without-bg-1.png'],
    sector: 'Aeronautics association · ground-effect craft',
    about:
      'Toulouse-based association founded in 2025 by three students. Inspired by Soviet ekranoplans, it designs, builds and instruments ground-effect scale models — and made its first public appearance at the 2025 Paris Air Show.',
    facts: [
      { value: '2025', label: 'founded' },
      { value: 'Toulouse', label: 'home base' },
      { value: 'Paris Air Show', label: 'first public appearance' },
    ],
    visual: {
      src: ['./logos/aeroboat-craft.png', 'https://aeroboat-france.com/wp-content/uploads/2025/09/chatgpt_image_16_sept._2025__09_43_42-removebg-preview.png'],
      alt: 'Aeroboat ground-effect craft',
    },
    url: 'https://aeroboat-france.com',
  },
  boulanger: {
    id: 'boulanger',
    name: 'Boulanger',
    monogram: 'Bo',
    gradient: ['#f97316', '#fb923c'],
    logos: ['./logos/boulanger.svg', 'https://cdn.simpleicons.org/boulanger'],
    sector: 'Consumer electronics retail',
    about: 'French retailer of household appliances and consumer electronics.',
    facts: [],
    url: 'https://www.boulanger.com',
  },
} satisfies Record<string, Company>;

export const companyList: Company[] = Object.values(companies);

const domofinance: Client = {
  name: 'Domofinance',
  logos: ['./logos/domofinance.png', 'https://www.domofinance.com/build/website/domofinance-trans.f48e1653.png'],
  parent: { name: 'BNP Paribas Personal Finance', logos: ['./logos/bnp-paribas.svg', 'https://cdn-group.bnpparibas.com/build/images/logo-bnp.svg'] },
  about:
    'Consumer-credit company born from the alliance of BNP Paribas Personal Finance and EDF, specialised in financing home energy-renovation projects (insulation, heat pumps, solar panels…).',
  facts: [
    { value: '2003', label: 'since' },
    { value: '450,000+', label: 'clients financed' },
    { value: '96%', label: 'satisfied clients' },
  ],
  url: 'https://www.domofinance.com',
};

export const experiences: Experience[] = [
  {
    id: 'ellipses',
    company: companies.ellipses,
    role: 'Web Developer',
    contract: 'Apprenticeship',
    period: 'Sept. 2026 — Present',
    duration: 'Ongoing',
    location: 'Paris, Île-de-France',
    mode: 'On-site',
    current: true,
    summary: 'Developing the publisher’s Symfony web platform within the in-house technical team.',
    missions: [
      {
        title: 'Development',
        items: [
          'Develop and maintain features of the publisher’s Symfony / PHP platform.',
          'Apply the team’s code-quality, review and testing practices.',
        ],
      },
    ],
    stack: ['Symfony', 'PHP', 'MySQL'],
    skills: ['PHP', 'Symfony', 'Web development'],
  },
  {
    id: 'acelys',
    company: companies.acelys,
    role: 'Development Analyst',
    contract: 'Internship',
    period: 'Apr. 2026 — Jul. 2026',
    duration: '4 months',
    location: 'Montpellier, Occitanie',
    mode: 'Hybrid',
    summary:
      'Embedded in an Agile team supporting the technical transformation of Domofinance’s platforms (BNP Paribas Personal Finance group): ensuring the quality of deliverables and acting as the technical bridge between business requirements and external development teams.',
    missions: [
      {
        title: 'Quality assurance & technical expertise',
        items: [
          'Diagnosed and resolved complex anomalies in Symfony and React environments.',
          'Implemented security solutions: a Multi-Factor Authentication (MFA) system and transaction e-mail filtering workflows.',
          'Validated technical deliverables from external partners against project requirements before release.',
        ],
      },
      {
        title: 'Technical interface & methodology',
        items: [
          'Translated business requirements into technical specifications for development teams.',
          'Monitored performance and maintainability of API Platform-driven architectures.',
          'Contributed to Scrum ceremonies to keep deployment cycles smooth and team velocity high.',
        ],
      },
    ],
    stack: ['Symfony', 'React', 'API Platform', 'Security', 'Agile'],
    skills: ['Web development', 'Symfony', 'React', 'API Platform', 'Scrum', 'Specifications', 'Quality assurance'],
    client: domofinance,
    confidential:
      'This work was done on a regulated consumer-credit platform of the BNP Paribas group. For security and confidentiality reasons, no code, screenshot or internal detail is published here.',
    projectIds: ['domofinance-security'],
  },
  {
    id: 'education',
    company: companies.education,
    role: 'Full-Stack Web Developer',
    contract: 'Freelance',
    period: 'Jan. 2026 — Feb. 2026',
    duration: '1 month',
    location: 'Gard (Alès), Occitanie',
    mode: 'Remote',
    summary: 'Full development of an internal application to manage students’ academic accommodation files, from database design to staff training.',
    missions: [
      {
        title: 'Delivered',
        items: [
          'Designed and modelled a dedicated database for student information and administrative records.',
          'Developed an internal PHP web platform to record, track, update and access student files.',
          'Implemented secure interfaces so staff can handle daily administrative tasks faster.',
          'Automated several workflows and centralised data across different schools.',
          'Trained staff members to use the application.',
        ],
      },
    ],
    stack: ['PHP', 'MySQL', 'HTML/CSS', 'Security'],
    skills: ['PHP', 'Database consulting', 'Data modelling', 'User training'],
    projectIds: ['edu-accommodation'],
  },
  {
    id: 'solstice',
    company: companies.solstice,
    role: 'Full-Stack Developer',
    contract: 'Apprenticeship',
    period: 'Sept. 2025 — Jan. 2026',
    duration: '5 months',
    location: 'Paris area',
    mode: 'On-site',
    summary: 'Developed and maintained environmental software and took part in its certification against the applicable standard.',
    missions: [
      {
        title: 'Software & certification',
        items: [
          'Integrated new features into the existing environmental software.',
          'Took part in the certification process of the solution against the applicable standard.',
          'Automated queries to the databases used by the software.',
          'Worked with the development manager to resolve technical issues and improve performance.',
          'Ensured code quality and software maintenance.',
        ],
      },
      {
        title: 'Innovation',
        items: ['Supported the analysis of system diagnostics, with the introduction of AI.'],
      },
    ],
    stack: ['Java', 'AI', 'MySQL', 'Agile'],
    skills: ['Java', 'Autonomy', 'Certification', 'Performance'],
    projectIds: ['solstice-dahs'],
  },
  {
    id: 'aeroboat',
    company: companies.aeroboat,
    role: 'IT Systems Manager',
    contract: 'Fixed-term',
    period: 'Sept. 2025 — Jan. 2026',
    duration: '5 months',
    location: 'Toulouse, Occitanie',
    mode: 'Remote',
    summary: 'In charge of the association’s IT and of the design and development of its website.',
    missions: [
      {
        title: 'Website',
        items: [
          'Designed a clear, intuitive architecture to improve navigation.',
          'Showcased the association’s services and identity through a modern design.',
          'Developed interactive interfaces optimised for user experience.',
          'Ensured cross-platform compatibility (desktop, tablet, mobile).',
          'Applied performance and search-engine-optimisation (SEO) best practices.',
        ],
      },
    ],
    stack: ['WordPress', 'HTML/CSS', 'SEO'],
    skills: ['Project management', 'Web design', 'SEO'],
    projectIds: ['aeroboat-site'],
  },
  {
    id: 'boulanger',
    company: companies.boulanger,
    role: 'Retail Sales & Service Advisor',
    contract: 'Fixed-term',
    period: 'Jul. 2025 — Aug. 2025',
    duration: 'Summer job',
    location: 'Lattes, Occitanie',
    mode: 'On-site',
    minor: true,
    summary: 'Summer job: customer service, after-sales follow-up and presentation of consumer-financing solutions.',
    missions: [
      {
        title: 'Summer job',
        items: ['Customer service and transactions.', 'After-sales follow-up.', 'Presenting instalment-financing solutions and securing the related files.'],
      },
    ],
    stack: [],
    skills: ['Customer relations', 'Consumer financing'],
  },
];

export const projects: Project[] = [
  {
    id: 'domofinance-security',
    featured: true,
    title: 'Securing a consumer-credit platform',
    context: 'Acelys × Domofinance (BNP Paribas group)',
    experienceId: 'acelys',
    year: '2026',
    description: 'MFA and transaction e-mail filtering on Domofinance’s platforms, plus validation of external partners’ deliverables.',
    problem:
      'A regulated credit platform needs strong customer authentication and trustworthy transactional e-mails, while several external teams deliver code that must be checked before it reaches production.',
    outcome: [
      'Multi-factor authentication added to the customer journey.',
      'Transaction e-mail filtering workflow in place.',
      'External deliverables validated against requirements before release.',
    ],
    highlights: ['Multi-factor authentication', 'Transaction e-mail filtering', 'Deliverable validation', 'Business → technical specifications'],
    build: [
      { icon: 'file', title: 'Business need', detail: 'Requirements gathered with business teams and turned into technical specifications.' },
      { icon: 'shield', title: 'MFA', detail: 'A second authentication factor protects customer access.' },
      { icon: 'mail', title: 'E-mail filtering', detail: 'Transactional e-mails go through a filtering workflow.' },
      { icon: 'server', title: 'Symfony · API Platform', detail: 'Back-end and APIs, monitored for performance and maintainability.' },
      { icon: 'check', title: 'Validation', detail: 'Partner deliverables checked before release, in Scrum cycles.' },
    ],
    stack: ['Symfony', 'React', 'API Platform', 'Security', 'Agile'],
    confidential:
      'This project is not showcased in detail on purpose: it runs on a regulated platform of the BNP Paribas group, so its code and internals are confidential. What is described here stays at the level of my public LinkedIn profile.',
  },
  {
    id: 'edu-accommodation',
    featured: true,
    title: 'Student accommodation files app',
    context: 'Éducation Nationale · Freelance',
    experienceId: 'education',
    year: '2026',
    description: 'Internal PHP application to record, track and share students’ academic accommodation files across schools.',
    problem: 'Accommodation files were handled manually and scattered across schools, making follow-up slow and error-prone for staff.',
    outcome: ['One central, secure place for every student file.', 'Several administrative workflows automated.', 'Staff trained and autonomous on the tool.'],
    highlights: ['Dedicated relational database', 'Secure staff interfaces', 'Automated workflows', 'User training'],
    build: [
      { icon: 'user', title: 'Staff', detail: 'Authenticated access for school staff members.' },
      { icon: 'layout', title: 'PHP interfaces', detail: 'Forms and dashboards to record, search and update files.' },
      { icon: 'cpu', title: 'Workflows', detail: 'Automations replacing manual hand-offs between schools.' },
      { icon: 'database', title: 'MySQL', detail: 'Database modelled around students and administrative records.' },
    ],
    stack: ['PHP', 'MySQL', 'HTML/CSS', 'Security'],
  },
  {
    id: 'solstice-dahs',
    featured: true,
    title: 'Environmental software & AI diagnostics',
    context: 'Solutions Solstice · Apprenticeship',
    experienceId: 'solstice',
    year: '2025',
    description: 'New features and certification work on environmental monitoring software, automated database queries and AI-assisted diagnostics.',
    problem: 'Industrial sites must report emissions data reliably under strict standards; the software has to be certified and faults diagnosed quickly.',
    outcome: ['New features integrated into the existing software.', 'Contribution to the certification process.', 'Database queries automated.', 'First steps of AI in system diagnostics.'],
    highlights: ['Java features & maintenance', 'Standards certification', 'Database query automation', 'AI for diagnostics'],
    build: [
      { icon: 'cpu', title: 'Measurements', detail: 'Environmental data acquired from on-site analysers.' },
      { icon: 'code', title: 'Java software', detail: 'Features, fixes and performance work on the application.' },
      { icon: 'database', title: 'Automated queries', detail: 'Recurring database queries automated.' },
      { icon: 'search', title: 'AI diagnostics', detail: 'AI introduced to help analyse system diagnostics.' },
      { icon: 'check', title: 'Certification', detail: 'Solution certified against the applicable standard.' },
    ],
    stack: ['Java', 'AI', 'MySQL'],
  },
  {
    id: 'aeroboat-site',
    title: 'Aeroboat France website',
    context: 'Aeroboat France · Fixed-term',
    experienceId: 'aeroboat',
    year: '2025',
    description: 'The association’s website, designed and built from scratch: clear navigation, modern identity, responsive and SEO-ready.',
    problem: 'A brand-new association needed a credible online presence to present its projects and founders, and to attract members and partners.',
    outcome: ['Live website presenting the association and its team.', 'Consistent across desktop, tablet and mobile.', 'SEO best practices applied.'],
    highlights: ['Information architecture', 'Responsive design', 'Performance & SEO'],
    build: [
      { icon: 'search', title: 'Architecture', detail: 'Clear navigation around the association’s story, team and contact.' },
      { icon: 'layout', title: 'Design', detail: 'Modern identity, interactive sections.' },
      { icon: 'globe', title: 'WordPress', detail: 'Built on WordPress so the association can edit it easily.' },
      { icon: 'check', title: 'SEO & performance', detail: 'Metadata, responsive media, cross-device checks.' },
    ],
    stack: ['WordPress', 'HTML/CSS', 'SEO'],
    demoUrl: 'https://aeroboat-france.com',
  },
  {
    id: 'ac-motors',
    title: 'AC-Motors database',
    context: 'IUT d’Orsay · Academic',
    year: '2024',
    description: 'Relational database for a car dealership — vehicles, customers, orders — with a live SQL playground running in your browser.',
    problem: 'A dealership needs to track its stock, customers and sales consistently, and to answer business questions quickly.',
    outcome: ['Normalised schema with integrity constraints.', 'Business queries: revenue, stock, best customers.', 'Interactive demo: run real SQL on the model.'],
    highlights: ['Conceptual → logical → physical model', 'Constraints & indexes', 'Business SQL queries'],
    build: [
      { icon: 'file', title: 'Requirements', detail: 'Entities and rules gathered from the dealership’s needs.' },
      { icon: 'layout', title: 'Conceptual model', detail: 'Entity–relationship model (MCD).' },
      { icon: 'database', title: 'Physical model', detail: 'Tables, keys, constraints and indexes.' },
      { icon: 'search', title: 'Queries', detail: 'Business questions answered in SQL.' },
    ],
    stack: ['MySQL'],
    demo: 'sql',
    demoUrl: 'https://www.canva.com/design/DAGbVnfJa-k/Mr52Ik-2srISCUws5ppVsw/view',
  },
  {
    id: 'cwad',
    title: 'VogMerveille — travel agency site',
    context: 'IUT d’Orsay · Team project',
    year: '2024',
    description: 'Website of a fictional time-travel cruise agency: home, activities, contact with FAQ chatbot, and login — redesigned in 2026.',
    problem: 'Build a complete, responsive multi-page website with HTML/CSS, then push it further with interactivity.',
    outcome: ['Original 4-page responsive site (HTML/CSS).', '2026 redesign: dark luxury theme, filters, booking simulator, chatbot.', 'W3C-validated markup.'],
    highlights: ['Responsive layouts', 'Destination filters & booking simulator', 'FAQ chatbot in vanilla JS'],
    build: [
      { icon: 'layout', title: 'HTML/CSS', detail: 'Semantic pages, Flexbox & Grid layouts.' },
      { icon: 'code', title: 'Vanilla JS', detail: 'Filters, price simulator, chatbot — no framework.' },
      { icon: 'check', title: 'Validation', detail: 'W3C validation and cross-device checks.' },
    ],
    stack: ['HTML/CSS', 'JavaScript'],
    demo: 'cwad',
    demoUrl: './projects/cwad/index.html',
  },
  {
    id: 'paris-sud-app',
    title: 'Student housing manager',
    context: 'IUT d’Orsay · Academic',
    year: '2025',
    description: 'Java application managing new students of Université Paris-Sud: dorm allocation, assignments and staff records.',
    problem: 'Allocate rooms and track students and staff without spreadsheets.',
    outcome: ['Object-oriented domain model.', 'Room allocation logic.', 'Persistent records.'],
    highlights: ['OOP domain model', 'Allocation algorithm', 'Persistence'],
    build: [
      { icon: 'user', title: 'Students & staff', detail: 'Domain classes modelled in UML.' },
      { icon: 'cpu', title: 'Allocation', detail: 'Rules assigning students to rooms.' },
      { icon: 'database', title: 'Storage', detail: 'Records persisted between sessions.' },
    ],
    stack: ['Java', 'UML'],
  },
  {
    id: 'librairie',
    title: 'Canaules bookshop — requirements',
    context: 'IUT d’Orsay · Academic',
    year: '2025',
    description: 'Requirements gathering (AMOA) for a bookshop and a detailed specification of its future management system.',
    problem: 'Turn a small business’s needs into a specification developers can build from — the core of IT consulting.',
    outcome: ['Needs analysis.', 'UML use-case & activity diagrams.', 'Functional & technical specification.'],
    highlights: ['Needs analysis', 'UML modelling', 'Specification writing'],
    build: [
      { icon: 'user', title: 'Interviews', detail: 'Needs gathered with the stakeholders.' },
      { icon: 'layout', title: 'UML', detail: 'Use cases and activities modelled.' },
      { icon: 'file', title: 'Specification', detail: 'Functional and technical requirements written.' },
    ],
    stack: ['UML', 'Agile'],
  },
  {
    id: 'debian',
    title: 'Debian workstation on Raspberry Pi',
    context: 'IUT d’Orsay · Academic',
    year: '2024',
    description: 'Installation and configuration of a complete development workstation on a Raspberry Pi.',
    problem: 'Set up a working Linux workstation with database and Python tooling on low-power hardware.',
    outcome: ['Operational Debian system.', 'SQL server and Python toolchain.', 'Packages tailored to the use case.'],
    highlights: ['OS installation', 'SQL & Python toolchain', 'System configuration'],
    build: [
      { icon: 'cpu', title: 'Raspberry Pi', detail: 'Debian installed and configured.' },
      { icon: 'database', title: 'SQL', detail: 'Database server set up.' },
      { icon: 'code', title: 'Python', detail: 'Development toolchain and packages.' },
    ],
    stack: ['Linux', 'Python', 'MySQL'],
  },
  {
    id: 'python-game',
    title: 'Game with AI opponent',
    context: 'Personal · Academic',
    year: '2024',
    description: 'Python game with an autonomous AI opponent, Pygame rendering and NumPy-backed game logic.',
    problem: 'Make an opponent that plays on its own and stays fun to beat.',
    outcome: ['Playable game loop.', 'Autonomous AI opponent.', 'Vectorised logic with NumPy.'],
    highlights: ['Pygame rendering', 'AI decision logic', 'NumPy computations'],
    build: [
      { icon: 'layout', title: 'Pygame', detail: 'Rendering and input loop.' },
      { icon: 'cpu', title: 'AI', detail: 'Decision logic for the opponent.' },
      { icon: 'code', title: 'NumPy', detail: 'Game state computations.' },
    ],
    stack: ['Python', 'AI'],
  },
];

export const projectFilters: Tech[] = ['Symfony', 'React', 'PHP', 'Java', 'Security', 'MySQL', 'AI', 'HTML/CSS', 'WordPress', 'Python'];

export const education: Education[] = [
  {
    id: 'iut',
    school: 'IUT d’Orsay — Université Paris-Saclay',
    degree: 'BUT Computer Science (Bachelor)',
    period: '2024 — 2027',
    logos: ['./logos/iut-orsay.png', './logos/paris-saclay.png'],
    details: [
      'Software & web development: efficient programming, quality, architecture, advanced web.',
      'Databases & systems: advanced SQL, system programming, networks, virtualisation.',
      'Software engineering: UML, Agile methods, V-Model team projects.',
      'Mathematics: analysis, probability, linear algebra, optimisation, automata.',
      'Cross-disciplinary: communication, technical English, digital law.',
    ],
  },
  {
    id: 'bac',
    school: 'Internat d’Excellence de Montpellier',
    degree: 'Baccalauréat général — Mathematics & Computer Science',
    period: '2022 — 2024',
    logos: [],
    details: ['Specialities: Mathematics and NSI (computer science).', 'Options: Mathématiques Expertes, Theatre.'],
  },
];

export const vModel = [
  { left: 'Requirements', right: 'Acceptance testing' },
  { left: 'Specification', right: 'System testing' },
  { left: 'Architecture', right: 'Integration testing' },
  { left: 'Detailed design', right: 'Unit testing' },
] as const;

export const volunteering = {
  org: 'EEDF — Éclaireuses Éclaireurs de France',
  years: 14,
  since: 'Since 2013 · Gard',
  logos: ['./logos/eedf.png', 'https://icons.duckduckgo.com/ip3/eedf.fr.ico'],
  points: [
    'Organised outdoor activities and group projects.',
    'Took part in training new members of the organisation.',
    'Coordinated charity events and fundraising.',
  ],
};

export const interests = ['Volleyball & beach volley', 'Tennis', 'Wrestling', 'Piano', 'Travel — Romania, England, Spain', 'Science popularisation'];

/** Icons come from the Simple Icons CDN (https://simpleicons.org) at runtime. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'business',
    title: 'Business & consulting',
    skills: [
      { name: 'Requirements → specifications', level: 'daily' },
      { name: 'Quality assurance & acceptance', level: 'daily' },
      { name: 'Security: MFA, access control', level: 'solid' },
      { name: 'Regulated environments', level: 'solid' },
      { name: 'Team & project management', level: 'solid' },
      { name: 'Agile / Scrum', icon: 'jira', level: 'daily' },
      { name: 'Cryptography basics', level: 'learning' },
    ],
  },
  {
    id: 'backend',
    title: 'Back-end',
    skills: [
      { name: 'PHP', icon: 'php', level: 'daily' },
      { name: 'Symfony', icon: 'symfony', level: 'daily' },
      { name: 'API Platform', level: 'solid' },
      { name: 'Doctrine', icon: 'doctrine', level: 'solid' },
      { name: 'Java', icon: 'openjdk', level: 'solid' },
      { name: 'Python', icon: 'python', level: 'solid' },
      { name: 'C / C++', icon: 'cplusplus', level: 'solid' },
      { name: 'C#', level: 'learning' },
    ],
  },
  {
    id: 'frontend',
    title: 'Front-end',
    skills: [
      { name: 'React', icon: 'react', level: 'solid' },
      { name: 'TypeScript', icon: 'typescript', level: 'solid' },
      { name: 'JavaScript', icon: 'javascript', level: 'solid' },
      { name: 'HTML5', icon: 'html5', level: 'daily' },
      { name: 'CSS3', icon: 'css', level: 'daily' },
      { name: 'Twig', level: 'daily' },
      { name: 'WordPress', icon: 'wordpress', level: 'solid' },
      { name: 'Figma', icon: 'figma', level: 'solid' },
    ],
  },
  {
    id: 'data',
    title: 'Data & systems',
    skills: [
      { name: 'MySQL', icon: 'mysql', level: 'daily' },
      { name: 'SQLite', icon: 'sqlite', level: 'solid' },
      { name: 'PL/SQL · Oracle', level: 'solid' },
      { name: 'phpMyAdmin', icon: 'phpmyadmin', level: 'solid' },
      { name: 'Linux / Debian', icon: 'debian', level: 'solid' },
      { name: 'Git', icon: 'git', level: 'daily' },
      { name: 'XML', icon: 'xml', level: 'solid' },
    ],
  },
  {
    id: 'foundations',
    title: 'Foundations',
    skills: [
      { name: 'Algorithms & recursion', level: 'solid' },
      { name: 'Object-oriented design', level: 'daily' },
      { name: 'UML', level: 'solid' },
      { name: 'Numerical optimisation', level: 'solid' },
      { name: 'Human–machine interfaces', level: 'solid' },
      { name: 'LaTeX', icon: 'latex', level: 'solid' },
    ],
  },
];

export const languages = [
  { name: 'French', level: 'Native', code: 'FR' },
  { name: 'English', level: 'B2', code: 'EN' },
  { name: 'Spanish', level: 'B2', code: 'ES' },
];

export const findExperience = (id: string) => experiences.find((e) => e.id === id);
export const findProject = (id: string) => projects.find((p) => p.id === id);
