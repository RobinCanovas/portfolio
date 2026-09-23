import type { ContractType, Tech, WorkMode } from '../types';

/**
 * French overlay of the content in profile.ts. Anything missing here falls back to English.
 * Arrays (missions, outcomes, build steps…) replace the English ones item by item.
 */
type Facts = { value?: string; label: string }[];
type Missions = { title: string; items: string[] }[];

export interface FrOverlay {
  profile: Record<'title' | 'location' | 'status' | 'currentRole' | 'pitch' | 'ambition', string>;
  companies: Record<string, { sector: string; about: string; facts: Facts; visualAlt?: string }>;
  clients: Record<string, { about: string; facts: Facts; parentLabel?: string }>;
  experiences: Record<
    string,
    { role: string; period: string; duration: string; location: string; summary: string; missions: Missions; skills?: string[]; confidential?: string }
  >;
  projects: Record<
    string,
    {
      title: string;
      context: string;
      description: string;
      problem: string;
      outcome: string[];
      highlights: string[];
      build: { title: string; detail: string }[];
      confidential?: string;
    }
  >;
  education: Record<string, { school?: string; degree: string; details: string[] }>;
  vModel: { left: string; right: string }[];
  volunteering: { since: string; points: string[] };
  interests: string[];
  skillGroups: Record<string, { title: string; skills?: Record<string, string> }>;
  languages: Record<string, { name: string; level?: string }>;
  contract: Record<ContractType, string>;
  mode: Record<WorkMode, string>;
  tech: Partial<Record<Tech, string>>;
}

export const fr: FrOverlay = {
  profile: {
    title: 'Analyste développement & développeur web',
    location: 'Paris, France',
    status: 'Ouvert aux opportunités',
    currentRole: 'Développeur web @ Éditions Ellipses',
    pitch:
      'Je transforme des besoins métier en logiciels sûrs et fiables, et je construis un profil généraliste pour la banque et le conseil. Après une mission sur la plateforme d’une filiale du groupe BNP Paribas, mes prochaines étapes : la fac, puis un Bac+5 ambitieux.',
    ambition: 'Objectif à long terme : la banque et le conseil IT, là où la rigueur, la sécurité et la compréhension du métier comptent autant que le code.',
  },

  companies: {
    ellipses: {
      sector: 'Édition universitaire',
      about:
        'Maison d’édition indépendante, 1er éditeur universitaire et des classes préparatoires : des livres pour toutes les matières, du collège à la fin des études supérieures, avec toute sa chaîne du livre intégrée, impression comprise.',
      facts: [{ value: '50 ans', label: 'de publications' }, { value: '13 000', label: 'titres au catalogue' }, { value: '12 000+', label: 'auteurs' }, { label: 'pays de diffusion' }],
    },
    acelys: {
      sector: 'Entreprise de services numériques (ESN)',
      about:
        'ESN montpelliéraine créée en 1997, qui accompagne les organisations dans leur transformation numérique : développement, cybersécurité (audits, gouvernance ISO 27001, pentests), data et performance des systèmes d’information, pour des clients de la banque, de l’assurance et du logement social.',
      facts: [{ label: 'création' }, { label: 'siège' }, { label: 'offres principales' }],
    },
    education: {
      sector: 'Ministère de l’Éducation nationale',
      about:
        'Le ministère de l’Éducation nationale gère les établissements publics du pays. Cette mission a été réalisée pour des établissements du Gard (secteur d’Alès), afin de numériser la gestion des dossiers administratifs des élèves.',
      facts: [{ value: 'Public', label: 'secteur' }, { label: 'établissements servis' }, { value: 'À distance', label: 'mission freelance' }],
    },
    solstice: {
      sector: 'Mesure environnementale & logiciel industriel',
      about:
        'Groupe réunissant analyse de gaz & instrumentation, automatisme du bâtiment et ingénierie. En tant qu’éditeur, il développe un système d’acquisition et de traitement des données (DAHS) pour la surveillance environnementale, dont un outil de reporting conçu pour la norme EN 17255.',
      facts: [{ label: 'sites : Paris-Saclay, Arras, Lyon, Metz' }, { label: 'logiciel de données environnementales' }, { label: 'norme de reporting' }],
    },
    aeroboat: {
      sector: 'Association aéronautique · engins à effet de sol',
      about:
        'Association toulousaine fondée en 2025 par trois étudiants. Inspirée des ekranoplanes soviétiques, elle conçoit, construit et instrumente des maquettes à effet de sol, et a fait sa première apparition publique au Salon du Bourget 2025.',
      facts: [{ label: 'création' }, { label: 'port d’attache' }, { value: 'Salon du Bourget', label: 'première apparition publique' }],
      visualAlt: 'Emblème d’Aeroboat France',
    },
    boulanger: {
      sector: 'Distribution d’électroménager et de multimédia',
      about: 'Enseigne française d’électroménager et de multimédia.',
      facts: [],
    },
  },

  clients: {
    Domofinance: {
      about:
        'Société de crédit à la consommation née de l’alliance de BNP Paribas Personal Finance et d’EDF, spécialiste du financement des travaux de rénovation énergétique (isolation, pompes à chaleur, panneaux solaires…).',
      facts: [{ label: 'depuis' }, { value: '450 000+', label: 'clients financés' }, { value: '96 %', label: 'clients satisfaits' }],
      parentLabel: 'groupe',
    },
  },

  experiences: {
    ellipses: {
      role: 'Développeur web',
      period: 'Sept. 2026 → aujourd’hui',
      duration: 'En cours',
      location: 'Paris, Île-de-France',
      summary: 'Développement de la plateforme web Symfony de l’éditeur, au sein de l’équipe technique interne.',
      missions: [
        {
          title: 'Développement',
          items: ['Développer et maintenir des fonctionnalités de la plateforme Symfony / PHP de l’éditeur.', 'Appliquer les pratiques de qualité, de revue de code et de tests de l’équipe.'],
        },
      ],
      skills: ['PHP', 'Symfony', 'Développement web'],
    },
    acelys: {
      role: 'Analyste du développement',
      period: 'Avr. 2026 → juil. 2026',
      duration: '4 mois',
      location: 'Montpellier, Occitanie',
      summary:
        'Intégré à une équipe Agile qui accompagne la transformation technique des plateformes de Domofinance (groupe BNP Paribas Personal Finance) : garantir la qualité des livrables et faire le lien technique entre les besoins métier et les équipes de développement externes.',
      missions: [
        {
          title: 'Assurance qualité & expertise technique',
          items: [
            'Diagnostic et résolution d’anomalies complexes sur des environnements Symfony et React.',
            'Mise en place de solutions de sécurité : système d’authentification multifacteur (MFA) et workflows de filtrage des e-mails transactionnels.',
            'Validation des livrables techniques des partenaires externes au regard des exigences du projet.',
          ],
        },
        {
          title: 'Interface technique & méthodologie',
          items: [
            'Traduction des besoins métier en spécifications techniques pour les équipes de développement.',
            'Suivi de la performance et de la maintenabilité d’architectures basées sur API Platform.',
            'Participation aux cérémonies Scrum pour des cycles de déploiement fluides et une bonne vélocité.',
          ],
        },
        {
          title: 'Déploiement & DevOps',
          items: [
            'Mise en place de pipelines de déploiement avec Ansible, déclenchés depuis Bitbucket Pipelines.',
            'Automatisation de chaque mise en production : installation des dépendances (npm, Yarn), migrations de base de données, mise en ligne.',
            'Gestion des accès sécurisés aux serveurs : clés SSH et tunnels SSH vers les environnements protégés.',
          ],
        },
      ],
      skills: ['Développement web', 'Symfony', 'React', 'API Platform', 'Ansible', 'Bitbucket Pipelines', 'SSH', 'Scrum', 'Spécifications', 'Assurance qualité'],
      confidential:
        'Cette mission s’est déroulée sur une plateforme de crédit à la consommation réglementée du groupe BNP Paribas. Pour des raisons de sécurité et de confidentialité, aucun code, aucune capture ni aucun détail interne n’est publié ici.',
    },
    education: {
      role: 'Développeur web full-stack',
      period: 'Janv. 2026 → févr. 2026',
      duration: '1 mois',
      location: 'Gard (Alès), Occitanie',
      summary: 'Développement complet d’une application interne de gestion des dossiers d’aménagement des élèves, de la conception de la base à la formation du personnel.',
      missions: [
        {
          title: 'Réalisé',
          items: [
            'Conception et modélisation d’une base de données dédiée aux informations des élèves et aux dossiers administratifs.',
            'Développement d’une plateforme web interne en PHP pour enregistrer, suivre, mettre à jour et consulter les dossiers.',
            'Mise en place d’interfaces sécurisées pour faciliter les tâches administratives quotidiennes du personnel.',
            'Automatisation de plusieurs workflows et centralisation des données entre établissements.',
            'Formation du personnel à l’utilisation de l’application.',
          ],
        },
      ],
      skills: ['PHP', 'Conseil en bases de données', 'Modélisation de données', 'Formation des utilisateurs'],
    },
    solstice: {
      role: 'Développeur full-stack',
      period: 'Sept. 2025 → janv. 2026',
      duration: '5 mois',
      location: 'Paris et périphérie',
      summary: 'Développement et maintenance d’un logiciel environnemental, et participation à sa certification selon la norme applicable.',
      missions: [
        {
          title: 'Logiciel & certification',
          items: [
            'Intégration de nouvelles fonctionnalités au logiciel environnemental existant.',
            'Participation au processus de certification de la solution selon la norme applicable.',
            'Automatisation de requêtes vers les bases de données du logiciel.',
            'Résolution de problèmes techniques et amélioration des performances avec le responsable du développement.',
            'Qualité du code et maintenance logicielle.',
          ],
        },
        { title: 'Innovation', items: ['Accompagnement de l’analyse des diagnostics système, avec l’introduction de l’IA.'] },
      ],
      skills: ['Java', 'Autonomie', 'Certification', 'Performance'],
    },
    aeroboat: {
      role: 'Responsable des systèmes informatiques',
      period: 'Sept. 2025 → janv. 2026',
      duration: '5 mois',
      location: 'Toulouse, Occitanie',
      summary: 'Responsable de l’informatique de l’association, ainsi que de la conception et du développement de son site web.',
      missions: [
        {
          title: 'Site web',
          items: [
            'Conception d’une architecture claire et intuitive pour faciliter la navigation.',
            'Mise en valeur des activités et de l’identité de l’association avec un design moderne.',
            'Développement d’interfaces interactives pensées pour l’expérience utilisateur.',
            'Compatibilité multiplateforme (ordinateur, tablette, mobile).',
            'Bonnes pratiques de performance et de référencement (SEO).',
          ],
        },
      ],
      skills: ['Gestion de projet', 'Web design', 'SEO'],
    },
    boulanger: {
      role: 'Conseiller vente & services',
      period: 'Juil. 2025 → août 2025',
      duration: 'Job d’été',
      location: 'Lattes, Occitanie',
      summary: 'Job d’été : accueil client, suivi du SAV et présentation de solutions de financement.',
      missions: [{ title: 'Job d’été', items: ['Accueil client et encaissements.', 'Suivi du service après-vente.', 'Présentation de solutions de paiement en plusieurs fois et sécurisation des dossiers.'] }],
      skills: ['Relation client', 'Crédit à la consommation'],
    },
  },

  projects: {
    'domofinance-security': {
      title: 'Sécuriser une plateforme de crédit à la consommation',
      context: 'Acelys × Domofinance (groupe BNP Paribas)',
      description: 'MFA, filtrage des e-mails transactionnels et pipelines de déploiement Ansible sur les plateformes Domofinance, et validation des livrables des partenaires externes.',
      problem:
        'Une plateforme de crédit réglementée doit authentifier fortement ses clients et fiabiliser ses e-mails transactionnels, tandis que plusieurs équipes externes livrent du code qu’il faut vérifier avant la mise en production.',
      outcome: [
        'Authentification multifacteur ajoutée au parcours client.',
        'Workflow de filtrage des e-mails transactionnels en place.',
        'Déploiements automatisés avec Ansible depuis Bitbucket Pipelines.',
        'Livrables externes validés par rapport aux exigences avant mise en production.',
      ],
      highlights: ['Authentification multifacteur', 'Pipelines de déploiement Ansible', 'Filtrage des e-mails transactionnels', 'Validation des livrables'],
      build: [
        { title: 'Besoin métier', detail: 'Besoins recueillis avec les équipes métier et traduits en spécifications techniques.' },
        { title: 'MFA', detail: 'Un second facteur d’authentification protège l’accès client.' },
        { title: 'Filtrage e-mails', detail: 'Les e-mails transactionnels passent par un workflow de filtrage.' },
        { title: 'Bitbucket Pipelines', detail: 'Chaque push déclenche le pipeline de déploiement.' },
        { title: 'Ansible via SSH', detail: 'Les playbooks installent les dépendances (npm, Yarn), jouent les migrations et mettent en ligne.' },
        { title: 'Validation', detail: 'Livrables partenaires vérifiés avant mise en production, en cycles Scrum.' },
      ],
      confidential:
        'Ce projet n’est volontairement pas détaillé : il tourne sur une plateforme réglementée du groupe BNP Paribas, son code et son fonctionnement interne sont donc confidentiels. Ce qui est décrit ici reste au niveau de mon profil LinkedIn public.',
    },
    'edu-accommodation': {
      title: 'Application de gestion des dossiers d’aménagement',
      context: 'Éducation nationale · Freelance',
      description: 'Application PHP interne pour enregistrer, suivre et partager les dossiers d’aménagement des élèves entre établissements.',
      problem: 'Les dossiers étaient gérés à la main et dispersés entre établissements : un suivi lent et source d’erreurs pour le personnel.',
      outcome: ['Un espace central et sécurisé pour chaque dossier élève.', 'Plusieurs workflows administratifs automatisés.', 'Personnel formé et autonome sur l’outil.'],
      highlights: ['Base de données dédiée', 'Interfaces sécurisées', 'Workflows automatisés', 'Formation des utilisateurs'],
      build: [
        { title: 'Personnel', detail: 'Accès authentifié pour le personnel des établissements.' },
        { title: 'Interfaces PHP', detail: 'Formulaires et tableaux de bord pour saisir, rechercher et mettre à jour.' },
        { title: 'Workflows', detail: 'Automatisations qui remplacent les échanges manuels entre établissements.' },
        { title: 'MySQL', detail: 'Base modélisée autour des élèves et des dossiers administratifs.' },
      ],
    },
    'solstice-dahs': {
      title: 'Logiciel environnemental & diagnostics par IA',
      context: 'Solutions Solstice · Alternance',
      description: 'Nouvelles fonctionnalités et certification d’un logiciel de surveillance environnementale, automatisation de requêtes et diagnostics assistés par IA.',
      problem: 'Les sites industriels doivent déclarer leurs émissions de façon fiable selon des normes strictes : le logiciel doit être certifié et les pannes diagnostiquées rapidement.',
      outcome: ['Nouvelles fonctionnalités intégrées au logiciel.', 'Contribution au processus de certification.', 'Requêtes base de données automatisées.', 'Premiers pas de l’IA dans les diagnostics système.'],
      highlights: ['Fonctionnalités & maintenance Java', 'Certification selon la norme', 'Automatisation de requêtes', 'IA pour les diagnostics'],
      build: [
        { title: 'Mesures', detail: 'Données environnementales acquises depuis les analyseurs sur site.' },
        { title: 'Logiciel Java', detail: 'Fonctionnalités, corrections et performance de l’application.' },
        { title: 'Requêtes automatisées', detail: 'Requêtes récurrentes vers la base automatisées.' },
        { title: 'Diagnostics IA', detail: 'L’IA introduite pour aider à analyser les diagnostics système.' },
        { title: 'Certification', detail: 'Solution certifiée selon la norme applicable.' },
      ],
    },
    'aeroboat-site': {
      title: 'Site web d’Aeroboat France',
      context: 'Aeroboat France · CDD',
      description: 'Le site de l’association, conçu et développé de zéro : navigation claire, identité moderne, responsive et optimisé SEO.',
      problem: 'Une toute jeune association avait besoin d’une présence en ligne crédible pour présenter ses projets et ses fondateurs, et attirer membres et partenaires.',
      outcome: ['Site en ligne présentant l’association et son équipe.', 'Cohérent sur ordinateur, tablette et mobile.', 'Bonnes pratiques SEO appliquées.'],
      highlights: ['Architecture de l’information', 'Design responsive', 'Performance & SEO'],
      build: [
        { title: 'Architecture', detail: 'Navigation claire autour de l’histoire, de l’équipe et du contact.' },
        { title: 'Design', detail: 'Identité moderne, sections interactives.' },
        { title: 'WordPress', detail: 'Construit sous WordPress pour que l’association puisse le modifier facilement.' },
        { title: 'SEO & performance', detail: 'Métadonnées, médias adaptés, vérifications multi-appareils.' },
      ],
    },
    'ac-motors': {
      title: 'Base de données AC-Motors',
      context: 'IUT d’Orsay · Académique',
      description: 'Base de données relationnelle pour une concession automobile (véhicules, clients, ventes), avec un bac à sable SQL qui tourne dans votre navigateur.',
      problem: 'Une concession doit suivre son stock, ses clients et ses ventes de façon cohérente, et répondre vite aux questions métier.',
      outcome: ['Schéma normalisé avec contraintes d’intégrité.', 'Requêtes métier : chiffre d’affaires, stock, meilleurs clients.', 'Démo interactive : exécutez du vrai SQL sur le modèle.'],
      highlights: ['Modèle conceptuel → logique → physique', 'Contraintes & index', 'Requêtes SQL métier'],
      build: [
        { title: 'Besoins', detail: 'Entités et règles recueillies auprès de la concession.' },
        { title: 'Modèle conceptuel', detail: 'Modèle entité–association (MCD).' },
        { title: 'Modèle physique', detail: 'Tables, clés, contraintes et index.' },
        { title: 'Requêtes', detail: 'Questions métier traduites en SQL.' },
      ],
    },
    cwad: {
      title: 'VogMerveille, site d’agence de voyage',
      context: 'IUT d’Orsay · Projet en équipe',
      description: 'Site d’une agence fictive de croisières dans le temps : accueil, activités, contact avec chatbot FAQ et connexion, refondu en 2026.',
      problem: 'Réaliser un site multi-pages complet et responsive en HTML/CSS, puis aller plus loin avec de l’interactivité.',
      outcome: ['Site original de 4 pages responsive (HTML/CSS).', 'Refonte 2026 : thème luxe sombre, filtres, simulateur de réservation, chatbot.', 'Code validé W3C.'],
      highlights: ['Mises en page responsive', 'Filtres & simulateur de réservation', 'Chatbot FAQ en JavaScript natif'],
      build: [
        { title: 'HTML/CSS', detail: 'Pages sémantiques, mises en page Flexbox & Grid.' },
        { title: 'JavaScript natif', detail: 'Filtres, simulateur de prix, chatbot, sans framework.' },
        { title: 'Validation', detail: 'Validation W3C et tests multi-appareils.' },
      ],
    },
    'paris-sud-app': {
      title: 'Gestion des logements étudiants',
      context: 'IUT d’Orsay · Académique',
      description: 'Application Java de gestion des nouveaux étudiants de l’Université Paris-Sud : attribution des chambres, affectations et dossiers du personnel.',
      problem: 'Attribuer les chambres et suivre étudiants et personnel sans tableurs.',
      outcome: ['Modèle objet du domaine.', 'Logique d’attribution des chambres.', 'Données persistantes.'],
      highlights: ['Modèle objet', 'Algorithme d’attribution', 'Persistance'],
      build: [
        { title: 'Étudiants & personnel', detail: 'Classes du domaine modélisées en UML.' },
        { title: 'Attribution', detail: 'Règles d’affectation des étudiants aux chambres.' },
        { title: 'Stockage', detail: 'Données conservées entre les sessions.' },
      ],
    },
    librairie: {
      title: 'Librairie Canaules : cahier des charges',
      context: 'IUT d’Orsay · Académique',
      description: 'Recueil des besoins (AMOA) pour une librairie et cahier des charges détaillé de son futur système de gestion.',
      problem: 'Transformer les besoins d’un petit commerce en un cahier des charges exploitable par des développeurs : le cœur du conseil IT.',
      outcome: ['Analyse des besoins.', 'Diagrammes UML de cas d’utilisation et d’activité.', 'Spécifications fonctionnelles et techniques.'],
      highlights: ['Analyse des besoins', 'Modélisation UML', 'Rédaction de spécifications'],
      build: [
        { title: 'Entretiens', detail: 'Besoins recueillis auprès des parties prenantes.' },
        { title: 'UML', detail: 'Cas d’utilisation et activités modélisés.' },
        { title: 'Cahier des charges', detail: 'Exigences fonctionnelles et techniques rédigées.' },
      ],
    },
    debian: {
      title: 'Poste Debian sur Raspberry Pi',
      context: 'IUT d’Orsay · Académique',
      description: 'Installation et configuration d’un poste de développement complet sur Raspberry Pi.',
      problem: 'Mettre en place un poste Linux fonctionnel, avec base de données et outils Python, sur un matériel peu puissant.',
      outcome: ['Système Debian opérationnel.', 'Serveur SQL et outils Python.', 'Paquets adaptés à l’usage.'],
      highlights: ['Installation du système', 'Outils SQL & Python', 'Configuration système'],
      build: [
        { title: 'Raspberry Pi', detail: 'Debian installée et configurée.' },
        { title: 'SQL', detail: 'Serveur de base de données mis en place.' },
        { title: 'Python', detail: 'Outils de développement et paquets.' },
      ],
    },
    'python-game': {
      title: 'Jeu avec adversaire IA',
      context: 'Personnel · Académique',
      description: 'Jeu en Python avec un adversaire IA autonome, affichage Pygame et logique de jeu en NumPy.',
      problem: 'Créer un adversaire qui joue seul tout en restant amusant à battre.',
      outcome: ['Boucle de jeu jouable.', 'Adversaire IA autonome.', 'Logique vectorisée avec NumPy.'],
      highlights: ['Affichage Pygame', 'Logique de décision IA', 'Calculs NumPy'],
      build: [
        { title: 'Pygame', detail: 'Affichage et boucle d’entrées.' },
        { title: 'IA', detail: 'Logique de décision de l’adversaire.' },
        { title: 'NumPy', detail: 'Calculs de l’état du jeu.' },
      ],
    },
  },

  education: {
    iut: {
      degree: 'BUT Informatique (Bachelor)',
      details: [
        'Développement logiciel & web : programmation efficace, qualité, architecture, web avancé.',
        'Bases de données & systèmes : SQL avancé, programmation système, réseaux, virtualisation.',
        'Génie logiciel : UML, méthodes Agile, projets en équipe selon le cycle en V.',
        'Mathématiques : analyse, probabilités, algèbre linéaire, optimisation, automates.',
        'Transverse : communication, anglais technique, droit du numérique.',
      ],
    },
    bac: {
      degree: 'Baccalauréat général, Mathématiques & NSI',
      details: ['Spécialités : Mathématiques et NSI (informatique).', 'Options : Mathématiques expertes, Théâtre.'],
    },
  },

  vModel: [
    { left: 'Besoins', right: 'Recette' },
    { left: 'Spécification', right: 'Tests système' },
    { left: 'Architecture', right: 'Tests d’intégration' },
    { left: 'Conception détaillée', right: 'Tests unitaires' },
  ],

  volunteering: {
    since: 'Scout depuis 2013 · Gard',
    points: ['Activités de plein air et projets de groupe.', 'Accueil et formation de nouveaux membres.', 'Participation à des événements caritatifs et des collectes de fonds.'],
  },

  interests: ['Volley & beach-volley', 'Tennis', 'Lutte', 'Piano', 'Voyages : Roumanie, Angleterre, Espagne', 'Vulgarisation scientifique'],

  skillGroups: {
    data: {
      title: 'Bases de données',
      skills: {
        'Data modelling (MCD, MLD)': 'Modélisation (MCD, MLD)',
        'Advanced SQL': 'SQL avancé',
        'Indexes & query tuning': 'Index & optimisation de requêtes',
      },
    },
    network: {
      title: 'Réseaux & DevOps',
      skills: {
        'TCP/IP & subnetting': 'TCP/IP & sous-réseaux',
        'Routing & switching': 'Routage & commutation',
        'Linux administration': 'Administration Linux',
        'SSH: keys & tunnels': 'SSH : clés & tunnels',
        Virtualisation: 'Virtualisation',
      },
    },
    maths: {
      title: 'Maths',
      skills: {
        'Linear algebra': 'Algèbre linéaire',
        'Probability & statistics': 'Probabilités & statistiques',
        'Graph theory': 'Théorie des graphes',
        'Analysis & numerical methods': 'Analyse & méthodes numériques',
        'Operations research & optimisation': 'Recherche opérationnelle & optimisation',
        'Discrete maths & logic': 'Maths discrètes & logique',
        Cryptography: 'Cryptographie',
        'Machine learning basics': 'Bases du machine learning',
      },
    },
    business: {
      title: 'Métier & conseil',
      skills: {
        'Requirements → specifications': 'Besoins → spécifications',
        'Quality assurance & acceptance': 'Assurance qualité & recette',
        'Security: MFA, access control': 'Sécurité : MFA, contrôle d’accès',
        'Regulated environments': 'Environnements réglementés',
        'Team & project management': 'Gestion d’équipe & de projet',
      },
    },
    backend: { title: 'Back-end', skills: { 'Algorithms & OOP': 'Algorithmique & POO' } },
    frontend: { title: 'Front-end' },
  },

  languages: {
    French: { name: 'Français', level: 'Natif' },
    English: { name: 'Anglais' },
    Spanish: { name: 'Espagnol' },
  },

  contract: { Apprenticeship: 'Alternance', Internship: 'Stage', Freelance: 'Freelance', 'Fixed-term': 'CDD' },
  mode: { 'On-site': 'Sur site', Hybrid: 'Hybride', Remote: 'À distance' },
  tech: { Security: 'Sécurité', AI: 'IA' },
};
