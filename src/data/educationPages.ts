import type { Lang } from './content';

type L = { en: string; fr: string };
type LFact = { value: L | string; label: L };

export interface EducationPage {
  id: 'iut' | 'bac' | 'eedf';
  name: string;
  kicker: L;
  title: L;
  period: L;
  logos: string[];
  photo?: { src: string[]; alt: L; credit: string; source?: string };
  gallery?: { src: string[]; alt: L }[];
  galleryCredit?: { label: string; source: string };
  about: L;
  facts: LFact[];
  sections: { title: L; text?: L; items?: L[] }[];
  url: string;
  urlLabel: L;
}

/**
 * Detail pages for the education & volunteering cards.
 * Facts come from public sources (Shanghai ranking 2026 via the French ministry, Wikipedia, académie de Montpellier, EEDF).
 */
export const educationPages: EducationPage[] = [
  {
    id: 'iut',
    name: 'IUT d’Orsay',
    kicker: { en: 'Université Paris-Saclay', fr: 'Université Paris-Saclay' },
    title: { en: 'BUT Computer Science (Bachelor)', fr: 'BUT Informatique (Bachelor)' },
    period: { en: '2024 → 2027 · work-study track', fr: '2024 → 2027 · en alternance' },
    logos: ['./logos/iut-orsay.png', './logos/paris-saclay.png'],
    about: {
      en: 'The IUT d’Orsay is the University Institute of Technology of Université Paris-Saclay. I study there for the BUT in Computer Science: a three-year national bachelor’s degree (180 ECTS) that combines theory, team projects and long periods in companies.',
      fr: 'L’IUT d’Orsay est l’institut universitaire de technologie de l’université Paris-Saclay. J’y prépare le BUT Informatique : un diplôme national de niveau licence en trois ans (180 ECTS) qui combine théorie, projets en équipe et longues périodes en entreprise.',
    },
    facts: [
      { value: { en: '13th', fr: '13e' }, label: { en: 'worldwide, Shanghai ranking 2026', fr: 'mondiale au classement de Shanghai 2026' } },
      { value: { en: '#1', fr: '1re' }, label: { en: 'university in France (Shanghai)', fr: 'université française (Shanghai)' } },
      { value: { en: '48,000', fr: '48 000' }, label: { en: 'students at Paris-Saclay', fr: 'étudiants à Paris-Saclay' } },
      { value: '180 ECTS', label: { en: 'BUT, three years', fr: 'BUT en trois ans' } },
    ],
    sections: [
      {
        title: { en: 'Université Paris-Saclay', fr: 'L’université Paris-Saclay' },
        text: {
          en: 'Heir to the Orsay Faculty of Science, founded in 1956 on the initiative of Frédéric Joliot-Curie, Paris-Saclay is one of the world’s leading research universities: 13th in the 2026 Shanghai ranking, first in France, and ranked first in the world in mathematics in 2020 and 2021.',
          fr: 'Héritière de la faculté des sciences d’Orsay, fondée en 1956 à l’initiative de Frédéric Joliot-Curie, Paris-Saclay est l’une des grandes universités de recherche mondiales : 13e au classement de Shanghai 2026, 1re en France, et classée 1re mondiale en mathématiques en 2020 et 2021.',
        },
      },
      {
        title: { en: 'What I learn', fr: 'Ce que j’y apprends' },
        items: [
          { en: 'Software and web development: efficient programming, quality, architecture.', fr: 'Développement logiciel et web : programmation efficace, qualité, architecture.' },
          { en: 'Databases and systems: advanced SQL, system programming, networks, virtualisation.', fr: 'Bases de données et systèmes : SQL avancé, programmation système, réseaux, virtualisation.' },
          { en: 'Mathematics: linear algebra, probability and statistics, graphs, numerical methods, operations research.', fr: 'Mathématiques : algèbre linéaire, probabilités et statistiques, graphes, méthodes numériques, recherche opérationnelle.' },
          { en: 'Software engineering: UML, Agile methods, V-Model team projects.', fr: 'Génie logiciel : UML, méthodes Agile, projets d’équipe en cycle en V.' },
          { en: 'Communication, technical English and digital law.', fr: 'Communication, anglais technique et droit du numérique.' },
        ],
      },
      {
        title: { en: 'Work-study', fr: 'L’alternance' },
        text: {
          en: 'The work-study track lets me alternate between the IUT and companies: Solutions Solstice first, then Éditions Ellipses today.',
          fr: 'L’alternance me permet d’alterner entre l’IUT et l’entreprise : Solutions Solstice d’abord, puis Éditions Ellipses aujourd’hui.',
        },
      },
    ],
    url: 'https://www.iut-orsay.universite-paris-saclay.fr',
    urlLabel: { en: 'Visit the IUT d’Orsay website', fr: 'Voir le site de l’IUT d’Orsay' },
  },
  {
    id: 'bac',
    name: 'Lycée Françoise Combes',
    kicker: { en: 'Internat d’Excellence de Montpellier', fr: 'Internat d’Excellence de Montpellier' },
    title: { en: 'Baccalauréat, Mathematics & Computer Science', fr: 'Baccalauréat général, Mathématiques & NSI' },
    period: { en: '2022 → 2024 · boarding school', fr: '2022 → 2024 · en internat' },
    logos: ['./logos/lycee-francoise-combes-logo.png'],
    photo: {
      src: ['./logos/lycee-batiment.webp', './logos/lycee-francoise-combes.webp', 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1459.jpg.webp', 'https://www.ac-montpellier.fr/sites/ac_montpellier/files/styles/banner_750x794/public/2021-09/cit-scolaire-fran-oise-combes-jpg-18161.jpg'],
      alt: { en: 'The historic main building and its arcaded courtyard', fr: 'Le bâtiment historique et sa cour à arcades' },
      credit: 'Film France',
      source: 'https://www.filmfrance.net',
    },
    galleryCredit: { label: 'Pierre-Yves Brunaud / Associer architectes', source: 'https://associer.archi/fr/projets/montpellier-34-iem-internat-dexcellence' },
    gallery: [
      { src: ['./logos/lycee-francoise-combes.webp', 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1459.jpg.webp'], alt: { en: 'The new wood-clad boarding houses', fr: 'Les nouveaux bâtiments d’internat habillés de bois' } },
      { src: ['./logos/lycee-francoise-combes-2.webp', 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1600-bleue.jpg.webp'], alt: { en: 'Former barracks and new wooden buildings side by side', fr: 'Anciennes casernes et nouveaux bâtiments en bois côte à côte' } },
      { src: ['./logos/lycee-francoise-combes-3.webp', 'https://associer.archi/sites/default/files/styles/xlarge_1600/public/images/Madec-PY_Brunaud-1446%202.jpg.webp'], alt: { en: 'Students in the courtyard', fr: 'Élèves dans la cour' } },
    ],
    about: {
      en: 'A national public school, run directly by the State and labelled “Internat d’Excellence”, in the heart of Montpellier. It welcomes motivated students, many of them scholarship holders or high-level athletes, with reinforced support to help them reach higher education.',
      fr: 'Un établissement public national, labellisé « Internat d’Excellence », au cœur de Montpellier. Il accueille des élèves motivés, souvent boursiers ou sportifs de haut niveau, avec un accompagnement renforcé pour réussir dans l’enseignement supérieur.',
    },
    facts: [
      { value: { en: 'National', fr: 'National' }, label: { en: 'public school run by the State', fr: 'établissement public d’État' } },
      { value: { en: 'Excellence', fr: 'Excellence' }, label: { en: 'boarding school label', fr: 'label internat' } },
      { value: '2012', label: { en: 'Mies van der Rohe Award nomination', fr: 'nomination au prix Mies van der Rohe' } },
      { value: 'Montpellier', label: { en: 'Beaux-Arts district', fr: 'quartier des Beaux-Arts' } },
    ],
    sections: [
      {
        title: { en: 'An exceptional place', fr: 'Un lieu d’exception' },
        text: {
          en: 'The school occupies two former barracks, originally convents, in Montpellier’s Beaux-Arts district. Their transformation by architect Philippe Madec was nominated for the 2012 European Mies van der Rohe Award and won the French national wood construction prize the same year.',
          fr: 'L’établissement occupe deux anciennes casernes, autrefois des couvents, dans le quartier des Beaux-Arts à Montpellier. Leur transformation par l’architecte Philippe Madec a été nommée au prix européen Mies van der Rohe 2012 et a remporté le Prix national de la construction bois la même année.',
        },
      },
      {
        title: { en: 'My baccalaureate', fr: 'Mon baccalauréat' },
        items: [
          { en: 'Specialities: Mathematics and NSI (computer science).', fr: 'Spécialités : Mathématiques et NSI (informatique).' },
          { en: 'Options: Expert Mathematics and Theatre.', fr: 'Options : Mathématiques expertes et Théâtre.' },
          { en: 'Two years as a boarder: an early lesson in autonomy and rigour.', fr: 'Deux années d’internat : un apprentissage précoce de l’autonomie et de la rigueur.' },
        ],
      },
    ],
    url: 'https://www.ac-montpellier.fr/le-lycee-college-francoise-combes-internat-d-excellence-123125',
    urlLabel: { en: 'About the school (académie de Montpellier)', fr: 'Présentation de l’établissement (académie de Montpellier)' },
  },
  {
    id: 'eedf',
    name: 'Éclaireuses Éclaireurs de France',
    kicker: { en: 'Scouting · EEDF', fr: 'Scoutisme · EEDF' },
    title: { en: 'Scout since 2013', fr: 'Scout depuis 2013' },
    period: { en: 'Since 2013 · Gard', fr: 'Depuis 2013 · Gard' },
    logos: ['./logos/eedf.png', 'https://icons.duckduckgo.com/ip3/eedf.fr.ico'],
    about: {
      en: 'The Éclaireuses Éclaireurs de France are a secular, co-educational scouting movement. Founded in 1911 as the Éclaireurs de France and in their current form since 1964, they are among the oldest scouting associations in France, recognised as being of public utility and members of the world scouting organisations (WOSM and WAGGGS).',
      fr: 'Les Éclaireuses Éclaireurs de France sont un mouvement de scoutisme laïque et coéduqué. Fondés en 1911 sous le nom d’Éclaireurs de France, et sous leur forme actuelle depuis 1964, ils comptent parmi les plus anciennes associations de scoutisme en France, reconnues d’utilité publique et membres des organisations mondiales du scoutisme (OMMS et AMGE).',
    },
    facts: [
      { value: '1911', label: { en: 'founded', fr: 'fondation' } },
      { value: { en: '~13,000', fr: '~13 000' }, label: { en: 'members', fr: 'membres' } },
      { value: { en: 'Secular', fr: 'Laïque' }, label: { en: 'and co-educational', fr: 'et coéduqué' } },
      { value: '2013', label: { en: 'my first year', fr: 'mon arrivée' } },
    ],
    sections: [
      {
        title: { en: 'What scouting is', fr: 'Le scoutisme, c’est quoi ?' },
        text: {
          en: 'Learning by doing, in small teams and outdoors: children and teenagers build and run their own projects, from camps to activities, supported by volunteer leaders.',
          fr: 'Apprendre en faisant, en petites équipes et en plein air : les jeunes construisent et mènent leurs propres projets, des camps aux activités, accompagnés par des animateurs bénévoles.',
        },
      },
      {
        title: { en: 'What I did', fr: 'Ce que j’y ai fait' },
        items: [
          { en: 'Outdoor activities and group projects.', fr: 'Activités de plein air et projets de groupe.' },
          { en: 'Helped welcome and train new members.', fr: 'Accueil et formation de nouveaux membres.' },
          { en: 'Took part in charity events and fundraising.', fr: 'Participation à des événements caritatifs et des collectes de fonds.' },
        ],
      },
      {
        title: { en: 'What I took from it', fr: 'Ce que j’en retire' },
        text: {
          en: 'Teamwork, autonomy and commitment: the same qualities I bring to projects and teams today.',
          fr: 'Le travail d’équipe, l’autonomie et l’engagement : les qualités que j’apporte aujourd’hui dans mes projets et mes équipes.',
        },
      },
    ],
    url: 'https://www.eedf.fr',
    urlLabel: { en: 'Visit the EEDF website', fr: 'Voir le site des EEDF' },
  },
];

export const pick = (l: L | string, lang: Lang) => (typeof l === 'string' ? l : l[lang]);
export const findEducationPage = (id: string) => educationPages.find((p) => p.id === id);
