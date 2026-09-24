import type { Client, Company, Education, Experience, Project, SkillGroup, SocialLinks, Tech } from '../types';

export const links: SocialLinks = {
  linkedin: 'https://www.linkedin.com/in/robin-canovas',
  email: 'robin.canovas@outlook.com',
  // English resume; the French overlay (fr.ts) points to the French one.
  cv: './Robin-Canovas-CV-EN.pdf',
};

export const profile = {
  name: 'Robin Canovas',
  title: 'Computer Science Student & Development Analyst',
  location: 'Paris, France',
  status: 'Open to opportunities',
  currentRole: 'Web Developer @ Éditions Ellipses',
  pitch:
    'Computer science student in a work-study BUT, I turn business requirements into secure, reliable software, and I’m building a generalist profile, with solid maths, for banking and consulting. After a mission on a BNP Paribas group subsidiary’s platform, my next steps are university, then an ambitious master’s-level degree.',
  ambition: 'Long-term goal: banking & IT consulting, where rigour, security and business understanding matter as much as code.',
  avatar: './robin-canovas.jpg',
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
      'Independent French publisher and the leading publisher for universities and preparatory classes, covering every subject from secondary school to the end of higher education, and running its whole book chain, printing included.',
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
    logos: ['./logos/acelys.webp', 'https://www.acelys.fr/wp-content/uploads/2026/03/logo-acelys-entete-wp.webp'],
    sector: 'IT services company (ESN)',
    about:
      'Digital services company based in Montpellier since 1997, supporting organisations in their digital transformation: software development, cybersecurity (audits, ISO 27001 governance, pentests), data and information-system performance, for clients in banking, insurance and social housing.',
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
      'Toulouse-based association founded in 2025 by three students. Inspired by Soviet ekranoplans, it designs, builds and instruments ground-effect scale models, and made its first public appearance at the 2025 Paris Air Show.',
    facts: [
      { value: '2025', label: 'founded' },
      { value: 'Toulouse', label: 'home base' },
      { value: 'Paris Air Show', label: 'first public appearance' },
    ],
    visual: {
      src: ['./logos/aeroboat.png', 'https://aeroboat-france.com/wp-content/uploads/2025/09/logoabf-without-bg-1.png'],
      alt: 'Aeroboat France emblem',
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
  parent: { name: 'BNP Paribas Personal Finance', logos: ['https://cdn-group.bnpparibas.com/build/images/logo-bnp.svg'] },
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
    period: 'Sept. 2026 → Present',
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
    period: 'Apr. 2026 → Jul. 2026',
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
      {
        title: 'Deployment & DevOps',
        items: [
          'Set up deployment pipelines with Ansible, triggered from Bitbucket Pipelines.',
          'Automated each release: dependency installs (npm, Yarn), database migrations, go-live.',
          'Managed secure access to servers: SSH keys and SSH tunnels to reach protected environments.',
        ],
      },
    ],
    stack: ['Symfony', 'React', 'API Platform', 'Security', 'Ansible', 'Agile'],
    skills: ['Web development', 'Symfony', 'React', 'API Platform', 'Ansible', 'Bitbucket Pipelines', 'SSH', 'Scrum', 'Specifications', 'Quality assurance'],
    client: domofinance,
    confidential:
      'This work was done on a regulated consumer-credit platform of the BNP Paribas group. For security and confidentiality reasons, no code, screenshot or internal detail is published here.',
    projectIds: ['domofinance-mfa', 'acelys-deploy'],
  },
  {
    id: 'education',
    company: companies.education,
    role: 'Full-Stack Web Developer',
    contract: 'Freelance',
    period: 'Jan. 2026 → Feb. 2026',
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
    period: 'Sept. 2025 → Jan. 2026',
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
    period: 'Sept. 2025 → Jan. 2026',
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
    period: 'Jul. 2025 → Aug. 2025',
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
    id: 'domofinance-mfa',
    featured: true,
    title: 'MFA & e-mail security for a credit platform',
    context: 'Acelys × Domofinance (BNP Paribas group)',
    experienceId: 'acelys',
    year: '2026',
    description: 'Multi-factor authentication and transaction e-mail filtering on Domofinance’s platforms, plus validation of external partners’ deliverables.',
    problem:
      'A regulated credit platform needs strong customer authentication and trustworthy transactional e-mails, while several external teams deliver code that must be checked before it reaches production.',
    outcome: [
      'Multi-factor authentication added to the customer journey.',
      'Transaction e-mail filtering workflow in place.',
      'External deliverables validated against requirements before release.',
    ],
    highlights: ['Multi-factor authentication', 'Transaction e-mail filtering', 'Deliverable validation', 'Business needs → specifications'],
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
    id: 'acelys-deploy',
    featured: true,
    title: 'Ansible deployment pipelines',
    context: 'Acelys × Domofinance (BNP Paribas group)',
    experienceId: 'acelys',
    year: '2026',
    description: 'Automated releases: Bitbucket Pipelines runs Ansible playbooks over SSH to install dependencies, migrate the database and go live.',
    problem: 'Manual releases are slow and risky on a platform that must stay available: every step has to be repeatable, secured and reversible.',
    outcome: [
      'Deployments triggered from Bitbucket Pipelines.',
      'Ansible playbooks for dependencies (npm, Yarn), migrations and release.',
      'Secure server access with SSH keys and SSH tunnels.',
    ],
    highlights: ['Bitbucket Pipelines', 'Ansible playbooks', 'SSH keys & tunnels', 'Database migrations'],
    build: [
      { icon: 'git', title: 'Push', detail: 'A push to the main branch starts the pipeline.' },
      { icon: 'rocket', title: 'Bitbucket Pipelines', detail: 'The pipeline runs the Ansible playbook for the target environment.' },
      { icon: 'key', title: 'SSH', detail: 'Key-based access through a tunnel to reach protected servers.' },
      { icon: 'server', title: 'Ansible tasks', detail: 'Dependencies (npm, Yarn), build, database migrations, release.' },
      { icon: 'check', title: 'Go-live', detail: 'The new release is switched on; a failed step keeps the previous one online.' },
    ],
    stack: ['Ansible', 'Networks', 'Linux', 'Symfony'],
    demo: 'deploy',
    confidential:
      'The client’s real infrastructure is confidential: the interactive demo below is a generic illustration of the workflow, not their servers or configuration.',
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
    id: 'gradient-descent',
    title: 'Gradient descent, visualised',
    context: 'Personal · Maths & machine learning',
    year: '2026',
    description: 'An interactive linear regression trained by gradient descent: add points and watch the model learn, error curve included.',
    problem: 'Understand, and show, the optimisation idea behind neural networks on the simplest possible model.',
    outcome: ['Gradient descent implemented from the maths (partial derivatives of the MSE).', 'Live visualisation of the fit and of the error.', 'Tunable learning rate to see convergence and divergence.'],
    highlights: ['Mean squared error', 'Partial derivatives', 'Learning rate & convergence'],
    build: [
      { icon: 'cpu', title: 'Model', detail: 'A line ŷ = w·x + b with two parameters.' },
      { icon: 'search', title: 'Error', detail: 'Mean squared error between predictions and points.' },
      { icon: 'code', title: 'Gradient', detail: 'Partial derivatives of the error with respect to w and b.' },
      { icon: 'check', title: 'Update', detail: 'θ ← θ − η·∇E, repeated until the error stops decreasing.' },
    ],
    stack: ['Maths', 'AI', 'TypeScript'],
    demo: 'gradient',
  },
  {
    id: 'neural-network',
    featured: true,
    title: 'A neural network built by hand in Python',
    context: 'Personal · Deep learning, Machine Learnia course',
    year: '2026',
    description:
      'An artificial neuron, then a 2-layer network and a deep network, written with NumPy only: every derivative worked out by hand, following the Deep Learning course of the Machine Learnia channel.',
    problem:
      'Understand what really happens inside a neural network, without a library doing it for me: how a neuron decides, how it learns from its mistakes, and why several layers solve what a single neuron cannot.',
    outcome: [
      'An artificial neuron (sigmoid and log loss) trained by gradient descent, with its decision boundary.',
      'Applied to real images: cats vs dogs, 64×64 pixels flattened into 4,096 inputs, normalised, with train and test curves.',
      'A 2-layer network with forward and back propagation, which separates concentric circles where a single neuron fails.',
      'Generalised to a deep network with any number of layers, all vectorised with NumPy.',
    ],
    highlights: ['Sigmoid and log loss', 'Gradients derived by hand', 'Forward and back propagation', 'NumPy vectorisation'],
    build: [
      { icon: 'cpu', title: 'Neuron', detail: 'z = w·x + b, then a = σ(z): a probability between 0 and 1.' },
      { icon: 'search', title: 'Log loss', detail: 'Measures how wrong the predictions are, and punishes confident mistakes hard.' },
      { icon: 'code', title: 'Gradients', detail: 'Chain rule: every derivative simplifies to (a − y).' },
      { icon: 'rocket', title: 'Gradient descent', detail: 'W ← W − α·∂L/∂W, over hundreds of iterations.' },
      { icon: 'layout', title: 'Layers', detail: 'Forward propagation layer by layer, then the error flows back.' },
      { icon: 'check', title: 'Evaluation', detail: 'Learning curves, accuracy, train and test sets to spot overfitting.' },
    ],
    stack: ['Python', 'Maths', 'AI'],
    demo: 'neural',
    maths: [
      {
        title: 'The artificial neuron',
        formula: 'z = w₁x₁ + w₂x₂ + b      a = σ(z) = 1 / (1 + e⁻ᶻ)',
        text: 'A weighted sum of the inputs, squashed by the sigmoid into a probability. The frontier a = 0.5 is the line w·x + b = 0: one neuron can only draw a straight line.',
      },
      {
        title: 'The cost: log loss',
        formula: 'L = −(1/m) Σ [ y·log(a) + (1 − y)·log(1 − a) ]',
        text: 'Comes from the likelihood of a Bernoulli law. It punishes a confident wrong answer very hard, and its derivative stays remarkably simple.',
      },
      {
        title: 'The gradients',
        formula: '∂L/∂w = (1/m)·Xᵀ(a − y)      ∂L/∂b = (1/m)·Σ(a − y)',
        text: 'Chain rule ∂L/∂a · ∂a/∂z · ∂z/∂w, with σ′(z) = σ(z)(1 − σ(z)): the terms cancel out and only the error (a − y) remains.',
      },
      {
        title: 'Gradient descent',
        formula: 'w ← w − α·∂L/∂w      b ← b − α·∂L/∂b',
        text: 'α is the learning rate. Too small and learning crawls, too large and the loss diverges: the demo lets you try both.',
      },
      {
        title: 'Vectorisation',
        formula: 'Z = W·X + b      X of shape (n, m)',
        text: 'All m examples at once with matrix products instead of a Python loop: much faster, and the same code for 2 inputs or 4,096 pixels.',
      },
      {
        title: 'Back-propagation (2 layers)',
        formula: 'dZ² = A² − y      dZ¹ = W²ᵀ·dZ² ⊙ A¹(1 − A¹)      dW = (1/m)·dZ·Aᵀ',
        text: 'The output error flows back through the network, layer by layer. Each layer receives its own gradients, then all weights are updated together.',
      },
    ],
    snippet: {
      language: 'python',
      filename: 'neural_network.py',
      code: `import numpy as np

def sigmoid(Z):
    return 1 / (1 + np.exp(-Z))

def initialisation(n0, n1, n2):
    return {'W1': np.random.randn(n1, n0), 'b1': np.zeros((n1, 1)),
            'W2': np.random.randn(n2, n1), 'b2': np.zeros((n2, 1))}

def forward_propagation(X, p):
    A1 = sigmoid(p['W1'] @ X + p['b1'])
    A2 = sigmoid(p['W2'] @ A1 + p['b2'])
    return A1, A2

def log_loss(A, y, eps=1e-15):
    return -np.mean(y * np.log(A + eps) + (1 - y) * np.log(1 - A + eps))

def back_propagation(X, y, p, A1, A2):
    m = y.shape[1]
    dZ2 = A2 - y
    dZ1 = (p['W2'].T @ dZ2) * A1 * (1 - A1)
    return {'W2': dZ2 @ A1.T / m, 'b2': dZ2.sum(axis=1, keepdims=True) / m,
            'W1': dZ1 @ X.T / m,  'b1': dZ1.sum(axis=1, keepdims=True) / m}

def neural_network(X, y, n1=32, learning_rate=0.1, n_iter=1000):
    p = initialisation(X.shape[0], n1, y.shape[0])
    for i in range(n_iter):
        A1, A2 = forward_propagation(X, p)
        gradients = back_propagation(X, y, p, A1, A2)
        for k in p:
            p[k] -= learning_rate * gradients[k]
    return p`,
    },
    course: {
      name: 'Formation Deep Learning',
      author: 'Guillaume Saint-Cirgue · Machine Learnia',
      url: 'https://www.youtube.com/@MachineLearnia',
      steps: [
        'The perceptron and the artificial neuron.',
        'Gradients of a neuron: log loss and gradient descent.',
        'A first neuron in Python, then cats vs dogs on real images.',
        'The 2-layer network: forward propagation and back-propagation.',
        'Deep networks with any number of layers.',
      ],
    },
  },
  {
    id: 'subnet-calculator',
    title: 'IPv4 subnet calculator',
    context: 'Personal · Networks',
    year: '2026',
    description: 'A subnetting tool that shows the 32 bits of an address and computes network, broadcast, mask and usable host range.',
    problem: 'Make subnetting visible: where the network part ends, where the host part starts, and what that means for addressing.',
    outcome: ['Network, broadcast, mask and host range computed live.', 'Bit-level view of the prefix.', 'Handles /31 and /32 special cases and private ranges.'],
    highlights: ['CIDR notation', 'Bitwise operations', 'Private vs public ranges'],
    build: [
      { icon: 'file', title: 'Parse', detail: 'Address and prefix validated (a.b.c.d/p).' },
      { icon: 'code', title: 'Bitwise maths', detail: 'Mask, network and broadcast computed with bit operations.' },
      { icon: 'layout', title: 'Visualise', detail: 'Network bits and host bits coloured on the 32-bit view.' },
    ],
    stack: ['Networks', 'TypeScript'],
    demo: 'subnet',
  },
  {
    id: 'ac-motors',
    title: 'AC-Motors database',
    context: 'IUT d’Orsay · Academic',
    year: '2024',
    description: 'Relational database for a car dealership (vehicles, customers, orders), with a live SQL playground running in your browser.',
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
    title: 'VogMerveille, travel agency site',
    context: 'IUT d’Orsay · Team project',
    year: '2024',
    description: 'Website of a fictional time-travel cruise agency: home, activities, contact with FAQ chatbot, and login, redesigned in 2026.',
    problem: 'Build a complete, responsive multi-page website with HTML/CSS, then push it further with interactivity.',
    outcome: ['Original 4-page responsive site (HTML/CSS).', '2026 redesign: dark luxury theme, filters, booking simulator, chatbot.', 'W3C-validated markup.'],
    highlights: ['Responsive layouts', 'Destination filters & booking simulator', 'FAQ chatbot in vanilla JS'],
    build: [
      { icon: 'layout', title: 'HTML/CSS', detail: 'Semantic pages, Flexbox & Grid layouts.' },
      { icon: 'code', title: 'Vanilla JS', detail: 'Filters, price simulator, chatbot, no framework.' },
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
    title: 'Canaules bookshop: requirements',
    context: 'IUT d’Orsay · Academic',
    year: '2025',
    description: 'Requirements gathering (AMOA) for a bookshop and a detailed specification of its future management system.',
    problem: 'Turn a small business’s needs into a specification developers can build from: the core of IT consulting.',
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

export const projectFilters: Tech[] = ['Symfony', 'React', 'PHP', 'Java', 'MySQL', 'Networks', 'Ansible', 'Security', 'Maths', 'AI', 'HTML/CSS', 'WordPress', 'Python'];

export const education: Education[] = [
  {
    id: 'iut',
    school: 'IUT d’Orsay, Université Paris-Saclay',
    degree: 'BUT Computer Science (Bachelor)',
    period: '2024 → 2027',
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
    school: 'Lycée Françoise Combes, Internat d’Excellence de Montpellier',
    degree: 'Baccalauréat général, Mathematics & Computer Science',
    period: '2022 → 2024',
    logos: ['./logos/lycee-francoise-combes-logo.png'],
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
  org: 'EEDF · Éclaireuses Éclaireurs de France',
  since: 'Scout since 2013 · Gard',
  logos: ['./logos/eedf.png', 'https://icons.duckduckgo.com/ip3/eedf.fr.ico'],
  points: [
    'Outdoor activities and group projects.',
    'Helped welcome and train new members.',
    'Took part in charity events and fundraising.',
  ],
};

export const interests = ['Volleyball & beach volley', 'Tennis', 'Wrestling', 'Piano', 'Travel: Romania, England, Spain', 'Science popularisation'];

/** Icons come from the Simple Icons CDN (https://simpleicons.org) at runtime. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'data',
    title: 'Databases',
    skills: [
      { name: 'MySQL', icon: 'mysql', level: 'daily' },
      { name: 'Data modelling (MCD, MLD)', level: 'daily' },
      { name: 'Advanced SQL', level: 'daily' },
      { name: 'PL/SQL · Oracle', level: 'solid' },
      { name: 'SQLite', icon: 'sqlite', level: 'solid' },
      { name: 'Indexes & query tuning', level: 'solid' },
      { name: 'Doctrine ORM', icon: 'doctrine', level: 'solid' },
      { name: 'phpMyAdmin', icon: 'phpmyadmin', level: 'solid' },
    ],
  },
  {
    id: 'network',
    title: 'Networks & DevOps',
    skills: [
      { name: 'TCP/IP & subnetting', level: 'solid' },
      { name: 'Routing & switching', level: 'solid' },
      { name: 'Linux administration', icon: 'debian', level: 'solid' },
      { name: 'SSH: keys & tunnels', level: 'daily' },
      { name: 'Ansible', icon: 'ansible', level: 'solid' },
      { name: 'Bitbucket Pipelines', icon: 'bitbucket', level: 'solid' },
      { name: 'Git', icon: 'git', level: 'daily' },
      { name: 'Virtualisation', level: 'solid' },
    ],
  },
  {
    id: 'maths',
    title: 'Maths',
    skills: [
      { name: 'Linear algebra', level: 'solid' },
      { name: 'Probability & statistics', level: 'solid' },
      { name: 'Graph theory', level: 'solid' },
      { name: 'Analysis & numerical methods', level: 'solid' },
      { name: 'Operations research & optimisation', level: 'solid' },
      { name: 'Discrete maths & logic', level: 'solid' },
      { name: 'Cryptography', level: 'learning' },
      { name: 'Machine learning basics', level: 'learning' },
    ],
  },
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
    ],
  },
  {
    id: 'backend',
    title: 'Back-end',
    skills: [
      { name: 'PHP', icon: 'php', level: 'daily' },
      { name: 'Symfony', icon: 'symfony', level: 'daily' },
      { name: 'API Platform', level: 'solid' },
      { name: 'Java', icon: 'openjdk', level: 'solid' },
      { name: 'Python', icon: 'python', level: 'solid' },
      { name: 'C / C++', icon: 'cplusplus', level: 'solid' },
      { name: 'Algorithms & OOP', level: 'daily' },
      { name: 'UML', level: 'solid' },
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
];

/** Schools targeted after the BUT (parallel admissions). Logos: local file first, then Wikimedia. */
export const targetSchools = [
  { id: 'paris-saclay', name: 'Université Paris-Saclay', logos: ['./logos/paris-saclay.png', 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Logo_Universit%C3%A9_Paris-Saclay_2019-12.svg'] },
  { id: 'sorbonne', name: 'Sorbonne Université', logos: ['https://upload.wikimedia.org/wikipedia/commons/0/0e/Logo_of_Sorbonne_University.svg'] },
  { id: 'dauphine', name: 'Université Paris Dauphine-PSL', logos: ['./logos/dauphine.png', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Dauphine_logo_2019_-_Bleu.png'] },
  { id: 'paris-cite', name: 'Université Paris Cité', logos: ['./logos/paris-cite.png', 'https://u-paris.fr/wp-content/uploads/2026/01/logo-universite-paris-cite.png'] },
  { id: 'centrale', name: 'CentraleSupélec', logos: ['./logos/centralesupelec.svg', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Ecole_Centrale_Supelec_logo.svg'] },
  { id: 'centrale-med', name: 'Centrale Méditerranée', logos: ['https://upload.wikimedia.org/wikipedia/commons/6/60/Logo_Centrale_M%C3%A9diterrann%C3%A9e.png'] },
  { id: 'ensta', name: 'ENSTA Paris', logos: ['https://upload.wikimedia.org/wikipedia/commons/4/45/Logo_ENSTA_Paris.jpg'] },
  { id: 'telecom-paris', name: 'Télécom Paris', logos: ['./logos/telecom-paris.svg'] },
  { id: 'telecom-sudparis', name: 'Télécom SudParis', logos: ['./logos/telecom-sudparis.svg', 'https://upload.wikimedia.org/wikipedia/fr/1/1d/Logo_T%C3%A9l%C3%A9com_SudParis.svg'] },
];

export const languages = [
  { name: 'French', level: 'Native', code: 'FR' },
  { name: 'English', level: 'B2', code: 'EN' },
  { name: 'Spanish', level: 'B1', code: 'ES' },
];

export const findExperience = (id: string) => experiences.find((e) => e.id === id);
export const findProject = (id: string) => projects.find((p) => p.id === id);
