import type { Company, Education, Experience, Project, SocialLinks, Tech } from '../types';

// TODO: replace the GitHub handle with the real one.
export const links: SocialLinks = {
  github: 'https://github.com/robin-canovas',
  linkedin: 'https://www.linkedin.com/in/robin-canovas',
  email: 'robin.canovas@outlook.com',
  cv: './Robin-Canovas-CV.pdf',
};

export const profile = {
  name: 'Robin Canovas',
  title: 'Software Engineer & Web Developer',
  location: 'France',
  status: 'Open to opportunities',
  currentRole: 'Apprenticeship @ Éditions Ellipses',
  pitch:
    'I build secure, maintainable web platforms with Symfony and React — from database modelling to production-grade APIs — and I care as much about the team as about the code.',
  avatar: './avatar.jpg',
};

const companies = {
  ellipses: { id: 'ellipses', name: 'Éditions Ellipses', monogram: 'Ell', gradient: ['#f97316', '#e11d48'] },
  acelys: { id: 'acelys', name: 'Acelys Services Numériques', monogram: 'Ac', gradient: ['#06b6d4', '#3b82f6'] },
  education: { id: 'education', name: 'Éducation Nationale', monogram: 'EN', gradient: ['#1d4ed8', '#dc2626'] },
  solstice: { id: 'solstice', name: 'Solutions Solstice', monogram: 'So', gradient: ['#facc15', '#16a34a'] },
  aeroboat: {
    id: 'aeroboat',
    name: 'Aeroboat France',
    monogram: 'Ae',
    gradient: ['#38bdf8', '#6366f1'],
    url: 'https://aeroboat-france.com',
  },
} satisfies Record<string, Company>;

// Achievements are phrased for impact but carry no invented figures — add your real metrics (e.g. "-40% response time") where you have them.
export const experiences: Experience[] = [
  {
    id: 'ellipses',
    company: companies.ellipses,
    role: 'Web Developer',
    contract: 'Apprenticeship',
    period: '2026 — Present',
    location: 'Paris, France',
    current: true,
    summary:
      'Building and maintaining the publisher’s Symfony web platform: catalogue, back-office tooling and customer-facing features.',
    achievements: [
      'Ship Symfony features end-to-end, from Doctrine entities to Twig views and functional tests.',
      'Refactor legacy PHP modules into services with dependency injection, cutting duplicated logic across controllers.',
      'Optimise catalogue queries with targeted indexes and eager loading to keep page loads fast as the catalogue grows.',
    ],
    stack: ['Symfony', 'PHP', 'MySQL', 'HTML/CSS'],
  },
  {
    id: 'acelys',
    company: companies.acelys,
    role: 'Tech Analyst & Developer',
    contract: 'Internship',
    period: '2026',
    location: 'France',
    summary: 'Delivered features on the Domofinance consumer-credit platform inside an Agile/Scrum squad.',
    achievements: [
      'Implemented multi-factor authentication (MFA) on the customer journey, hardening account access.',
      'Built security filtering on API Platform resources so each role only reaches the data it is entitled to.',
      'Developed React screens consuming the Symfony / API Platform backend with typed API contracts.',
      'Took part in external code validation and review cycles, shipping every sprint against Scrum ceremonies.',
    ],
    stack: ['Symfony', 'API Platform', 'React', 'TypeScript', 'Agile'],
  },
  {
    id: 'education',
    company: companies.education,
    role: 'Full-Stack Web Developer',
    contract: 'Freelance',
    period: 'Jan. 2026',
    location: 'France',
    summary: 'Designed and built an internal PHP management application for school staff.',
    achievements: [
      'Modelled a custom relational database from scratch (MCD → MLD → SQL) around real administrative workflows.',
      'Automated routing of student files between staff members, replacing manual email and paper hand-offs.',
      'Built authenticated, role-based interfaces with server-side validation and prepared statements.',
    ],
    stack: ['PHP', 'MySQL', 'HTML/CSS'],
  },
  {
    id: 'solstice',
    company: companies.solstice,
    role: 'Full-Stack Developer',
    contract: 'Apprenticeship',
    period: 'Sept. 2025 — Jan. 2026',
    location: 'France',
    summary: 'Added features to an environmental-data software suite and prepared it for standards certification.',
    achievements: [
      'Integrated AI-assisted diagnostics that surface likely root causes of system faults to support engineers.',
      'Developed and optimised Java features, improving code quality ahead of the ISO / standards certification audit.',
      'Documented modules and test evidence required by the certification process.',
    ],
    stack: ['Java', 'AI', 'Agile'],
  },
  {
    id: 'aeroboat',
    company: companies.aeroboat,
    role: 'IT Systems Manager & Web Developer',
    contract: 'Fixed-term',
    period: 'Sept. 2025 — Jan. 2026',
    location: 'France',
    summary: 'Owned the company website end to end: information architecture, design, performance and SEO.',
    achievements: [
      'Designed the site architecture and responsive UI/UX from scratch, consistent across desktop, tablet and mobile.',
      'Improved Core Web Vitals through image optimisation, lazy loading and lean CSS.',
      'Set up on-page SEO (semantic markup, metadata, sitemap) to grow organic visibility.',
    ],
    stack: ['HTML/CSS', 'SEO'],
  },
];

export const projects: Project[] = [
  {
    id: 'domofinance-mfa',
    title: 'Domofinance — MFA & API security',
    context: 'Acelys · Internship',
    description: 'Multi-factor authentication and role-based data filtering on an API Platform backend with a React front.',
    highlights: [
      'Custom Doctrine extension filters every collection query by the authenticated user’s scope.',
      'TOTP-based second factor wired into the Symfony security firewall.',
      'Typed React hooks consuming the Hydra/JSON-LD API.',
    ],
    stack: ['Symfony', 'API Platform', 'React', 'TypeScript'],
    snippet: {
      language: 'php',
      filename: 'src/Doctrine/OwnerScopeExtension.php',
      code: `final class OwnerScopeExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private readonly Security $security) {}

    public function applyToCollection(
        QueryBuilder $qb,
        QueryNameGeneratorInterface $names,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = [],
    ): void {
        if (!is_a($resourceClass, OwnedResource::class, true)
            || $this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        $alias = $qb->getRootAliases()[0];
        $qb->andWhere(sprintf('%s.owner = :owner', $alias))
           ->setParameter('owner', $this->security->getUser());
    }
}`,
    },
  },
  {
    id: 'edu-workflow',
    title: 'Student file workflow',
    context: 'Éducation Nationale · Freelance',
    description: 'Internal PHP application that models staff, students and files, and routes each file to the right person automatically.',
    highlights: [
      'Normalised relational schema designed from the actual administrative process.',
      'State machine for file status with a full audit trail.',
      'PDO prepared statements and CSRF tokens on every form.',
    ],
    stack: ['PHP', 'MySQL'],
    snippet: {
      language: 'php',
      filename: 'src/Workflow/FileRouter.php',
      code: `final class FileRouter
{
    private const TRANSITIONS = [
        'submitted' => ['review'],
        'review'    => ['approved', 'rejected'],
    ];

    public function __construct(private PDO $db) {}

    public function advance(int $fileId, string $to, int $actorId): void
    {
        $from = $this->currentStatus($fileId);
        if (!in_array($to, self::TRANSITIONS[$from] ?? [], true)) {
            throw new DomainException("Invalid transition $from → $to");
        }

        $this->db->beginTransaction();
        $this->db->prepare('UPDATE file SET status = ? WHERE id = ?')->execute([$to, $fileId]);
        $this->db->prepare('INSERT INTO file_log (file_id, from_status, to_status, actor_id) VALUES (?, ?, ?, ?)')
                 ->execute([$fileId, $from, $to, $actorId]);
        $this->db->commit();
    }
}`,
    },
  },
  {
    id: 'solstice-ai',
    title: 'AI-assisted system diagnostics',
    context: 'Solutions Solstice · Apprenticeship',
    description: 'Diagnostic module that classifies fault logs of an environmental monitoring system and suggests remediation.',
    highlights: [
      'Java service layer exposing diagnostics to the existing desktop client.',
      'Log features extracted and scored against known fault signatures.',
      'Traceable outputs to satisfy certification requirements.',
    ],
    stack: ['Java', 'AI'],
    snippet: {
      language: 'java',
      filename: 'DiagnosticService.java',
      code: `public final class DiagnosticService {
    private final FaultClassifier classifier;

    public DiagnosticService(FaultClassifier classifier) {
        this.classifier = classifier;
    }

    public List<Diagnosis> analyse(List<LogEntry> logs) {
        return logs.stream()
            .filter(LogEntry::isAnomalous)
            .map(classifier::predict)
            .filter(d -> d.confidence() >= 0.8)
            .sorted(Comparator.comparingDouble(Diagnosis::confidence).reversed())
            .toList();
    }
}`,
    },
  },
  {
    id: 'aeroboat-site',
    title: 'Aeroboat France website',
    context: 'Aeroboat France · Fixed-term',
    description: 'Company showcase website designed and built from scratch with a focus on performance and search visibility.',
    highlights: ['Mobile-first responsive layout', 'Optimised media & lazy loading', 'Structured metadata and sitemap'],
    stack: ['HTML/CSS', 'SEO'],
    demoUrl: 'https://aeroboat-france.com',
  },
  {
    id: 'ac-motors',
    title: 'AC-Motors database',
    context: 'IUT d’Orsay · Academic',
    description: 'Relational database for a car dealer managing products, customers and orders, with query optimisation.',
    highlights: ['Conceptual → logical → physical modelling', 'Indexes tuned for the most frequent queries', 'Integrity via constraints and triggers'],
    stack: ['MySQL'],
    snippet: {
      language: 'sql',
      filename: 'orders_by_customer.sql',
      code: `CREATE INDEX idx_order_customer_date ON orders (customer_id, ordered_at DESC);

SELECT c.last_name, COUNT(o.id) AS orders, SUM(o.total) AS revenue
FROM customer c
JOIN orders o ON o.customer_id = c.id
WHERE o.ordered_at >= CURRENT_DATE - INTERVAL 1 YEAR
GROUP BY c.id
ORDER BY revenue DESC
LIMIT 10;`,
    },
  },
  {
    id: 'cwad',
    title: 'Travel agency web interface',
    context: 'IUT d’Orsay · Academic',
    description: 'Responsive multi-page website for a travel agency built with semantic HTML and Flexbox.',
    highlights: ['Fully responsive Flexbox layouts', 'Accessible forms', 'Validated with W3C tooling'],
    stack: ['HTML/CSS'],
  },
  {
    id: 'paris-sud-app',
    title: 'Student housing manager',
    context: 'IUT d’Orsay · Academic',
    description: 'Java application managing new students of Université Paris-Sud: dorm allocation, assignments and staff records.',
    highlights: ['Object-oriented domain model', 'Allocation algorithm for dorm rooms', 'Persistent storage of staff and students'],
    stack: ['Java'],
  },
  {
    id: 'python-game',
    title: 'Game with AI opponent',
    context: 'Personal · Academic',
    description: 'Python game with an autonomous AI opponent, Pygame rendering and NumPy-backed game logic.',
    highlights: ['Game loop & rendering with Pygame', 'AI decision logic', 'Vectorised computations with NumPy'],
    stack: ['Python', 'AI'],
  },
];

export const projectFilters: Tech[] = ['Symfony', 'React', 'PHP', 'Java', 'AI', 'MySQL', 'HTML/CSS', 'Python'];

export const education: Education[] = [
  {
    id: 'iut',
    school: 'IUT d’Orsay — Université Paris-Saclay',
    degree: 'BUT Computer Science (Bachelor)',
    period: '2024 — 2027',
    details: [
      'Software design, project management, databases, networks and operating systems.',
      'Team projects run with the V-Model: requirements → specification → design → implementation → verification.',
      'Work-study track combining academic modules with industry apprenticeships.',
    ],
  },
  {
    id: 'bac',
    school: 'Internat d’Excellence de Montpellier',
    degree: 'Baccalauréat général — NSI & Mathematics',
    period: '2022 — 2024',
    details: ['Specialities: Computer Science (NSI) and Mathematics.', 'Option: Mathématiques Expertes.'],
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
  points: [
    'Led groups of young scouts on camps and outdoor projects, from planning to logistics.',
    'Built autonomy, team leadership and long-term commitment across 14+ years.',
    'Organised events end to end — budgets, schedules and safety.',
  ],
};

export const interests = ['Volleyball', 'Beach volleyball', 'Piano', 'Science popularisation'];
