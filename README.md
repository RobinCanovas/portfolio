# Robin Canovas — Portfolio

Vite · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · Vitest.

## Démarrer

Prérequis : **Node.js 20+** (https://nodejs.org → version LTS).

```bash
npm install        # installe les dépendances (crée package-lock.json → à commiter)
npm run logos      # télécharge les logos officiels des entreprises dans public/logos/
npm run dev        # http://localhost:5173
```

## Vérifier

```bash
npm test           # tests unitaires + intégration (Vitest + Testing Library)
npm run test:watch # tests en continu pendant le dev
npm run typecheck  # TypeScript strict
npm run check      # typecheck + tests + build : à lancer avant chaque push
npm run build      # build statique dans dist/
npm run preview    # sert dist/ en local
```

## Où modifier quoi

| Quoi | Fichier |
| --- | --- |
| Textes, expériences, projets, compétences, liens | `src/data/profile.ts` |
| Logos d'entreprise (fichiers locaux) | `public/logos/` (via `npm run logos`, ou déposer les vôtres) |
| CV / photo | `public/Robin-Canovas-CV.pdf`, `public/avatar.jpg` |
| Démos de projets statiques | `public/projects/` |
| Menus déroulants | `src/components/Navbar.tsx` |
| Palette de commandes (Ctrl K) | `src/components/CommandPalette.tsx` |

Les logos sont chargés dans cet ordre : fichier local → logo officiel distant → monogramme généré.

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/ci.yml` lance typecheck, tests et build à chaque push/PR, puis déploie `main` sur GitHub Pages.
Une seule fois : GitHub → *Settings* → *Pages* → *Source* : **GitHub Actions**.
