import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Database, KeyRound, Link2, Loader2, Play, RotateCcw, Table2 } from 'lucide-react';

/* sql.js (SQLite compiled to WebAssembly) is loaded from cdnjs on demand. */
const SQLJS_VERSION = '1.13.0';
const SQLJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${SQLJS_VERSION}/`;

interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
}
interface SqlDatabase {
  exec: (sql: string) => QueryResult[];

}
interface SqlJsStatic {
  Database: new () => SqlDatabase;
}
declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

export const SCHEMA = `
PRAGMA foreign_keys = ON;
CREATE TABLE brand (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL
);
CREATE TABLE model (
  id INTEGER PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brand(id),
  name TEXT NOT NULL,
  energy TEXT NOT NULL CHECK (energy IN ('Petrol','Diesel','Hybrid','Electric'))
);
CREATE TABLE vehicle (
  id INTEGER PRIMARY KEY,
  model_id INTEGER NOT NULL REFERENCES model(id),
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  price INTEGER NOT NULL CHECK (price > 0)
);
CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  city TEXT NOT NULL
);
CREATE TABLE sale (
  id INTEGER PRIMARY KEY,
  vehicle_id INTEGER NOT NULL UNIQUE REFERENCES vehicle(id),
  customer_id INTEGER NOT NULL REFERENCES customer(id),
  sold_on TEXT NOT NULL,
  amount INTEGER NOT NULL
);
CREATE INDEX idx_sale_customer ON sale(customer_id);
CREATE INDEX idx_vehicle_model ON vehicle(model_id);
`;

const SEED = `
INSERT INTO brand VALUES (1,'Renault','France'),(2,'Peugeot','France'),(3,'Tesla','USA'),(4,'Toyota','Japan'),(5,'BMW','Germany');
INSERT INTO model VALUES
 (1,1,'Clio','Petrol'),(2,1,'Mégane E-Tech','Electric'),(3,2,'208','Petrol'),(4,2,'3008','Hybrid'),
 (5,3,'Model 3','Electric'),(6,4,'Yaris','Hybrid'),(7,4,'RAV4','Hybrid'),(8,5,'Série 3','Diesel'),(9,5,'iX1','Electric');
INSERT INTO vehicle VALUES
 (1,1,2021,42000,13900),(2,1,2023,12000,17500),(3,2,2024,8000,32900),(4,3,2022,30500,15400),(5,4,2023,21000,29900),
 (6,5,2023,26000,36500),(7,5,2024,5000,41900),(8,6,2022,33000,17900),(9,7,2024,9000,38900),(10,8,2021,61000,27900),
 (11,9,2024,4000,47900),(12,3,2024,2000,19900),(13,4,2021,70000,21900),(14,6,2024,1000,22900),(15,2,2023,15000,28900),
 (16,8,2023,23000,36900),(17,1,2024,500,19400),(18,7,2022,45000,31500);
INSERT INTO customer VALUES
 (1,'Camille','Martin','Paris'),(2,'Lucas','Bernard','Lyon'),(3,'Léa','Dubois','Montpellier'),(4,'Hugo','Thomas','Paris'),
 (5,'Chloé','Robert','Toulouse'),(6,'Nathan','Richard','Nantes'),(7,'Inès','Petit','Montpellier'),(8,'Louis','Durand','Lille');
INSERT INTO sale VALUES
 (1,1,3,'2026-01-12',13500),(2,4,1,'2026-01-25',15000),(3,6,4,'2026-02-03',35900),(4,8,3,'2026-02-18',17500),
 (5,10,2,'2026-03-02',27000),(6,13,5,'2026-03-21',21000),(7,5,6,'2026-04-09',29500),(8,9,1,'2026-04-27',38000),
 (9,3,7,'2026-05-15',32000),(10,16,8,'2026-06-01',36000),(11,18,4,'2026-06-19',31000);
`;

const PRESETS: { label: string; sql: string }[] = [
  {
    label: 'Stock by brand',
    sql: `-- Unsold vehicles and stock value per brand
SELECT b.name AS brand, COUNT(*) AS in_stock, SUM(v.price) AS stock_value
FROM vehicle v
JOIN model m ON m.id = v.model_id
JOIN brand b ON b.id = m.brand_id
LEFT JOIN sale s ON s.vehicle_id = v.id
WHERE s.id IS NULL
GROUP BY b.name
ORDER BY stock_value DESC;`,
  },
  {
    label: 'Revenue per month',
    sql: `-- Monthly revenue and average discount vs listed price
SELECT substr(s.sold_on, 1, 7) AS month,
       COUNT(*) AS sales,
       SUM(s.amount) AS revenue,
       ROUND(AVG(100.0 * (v.price - s.amount) / v.price), 1) AS avg_discount_pct
FROM sale s
JOIN vehicle v ON v.id = s.vehicle_id
GROUP BY month
ORDER BY month;`,
  },
  {
    label: 'Top customers',
    sql: `-- Best customers by amount spent
SELECT c.first_name || ' ' || c.last_name AS customer, c.city,
       COUNT(s.id) AS purchases, SUM(s.amount) AS total_spent
FROM customer c
JOIN sale s ON s.customer_id = c.id
GROUP BY c.id
ORDER BY total_spent DESC
LIMIT 5;`,
  },
  {
    label: 'Electric share',
    sql: `-- Share of each energy type in sales
SELECT m.energy, COUNT(*) AS sold,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM sale), 1) AS share_pct
FROM sale s
JOIN vehicle v ON v.id = s.vehicle_id
JOIN model m ON m.id = v.model_id
GROUP BY m.energy
ORDER BY sold DESC;`,
  },
  {
    label: 'Integrity check',
    sql: `-- The UNIQUE constraint forbids selling the same car twice: this INSERT fails
INSERT INTO sale VALUES (99, 1, 2, '2026-07-01', 12000);`,
  },
];

const TABLES = [
  { name: 'brand', cols: [['id', 'pk'], ['name'], ['country']] },
  { name: 'model', cols: [['id', 'pk'], ['brand_id', 'fk'], ['name'], ['energy']] },
  { name: 'vehicle', cols: [['id', 'pk'], ['model_id', 'fk'], ['year'], ['mileage'], ['price']] },
  { name: 'customer', cols: [['id', 'pk'], ['first_name'], ['last_name'], ['city']] },
  { name: 'sale', cols: [['id', 'pk'], ['vehicle_id', 'fk'], ['customer_id', 'fk'], ['sold_on'], ['amount']] },
];

let loader: Promise<SqlJsStatic> | null = null;
function loadSqlJs(): Promise<SqlJsStatic> {
  loader ??= new Promise<SqlJsStatic>((resolve, reject) => {
    const done = () => (window.initSqlJs ? window.initSqlJs({ locateFile: (f) => SQLJS_BASE + f }).then(resolve, reject) : reject(new Error('sql.js unavailable')));
    if (window.initSqlJs) return done();
    const script = document.createElement('script');
    script.src = `${SQLJS_BASE}sql-wasm.js`;
    script.async = true;
    script.onload = done;
    script.onerror = () => reject(new Error('Could not load the SQL engine (offline?).'));
    document.head.appendChild(script);
  });
  return loader;
}

function SchemaDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {TABLES.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="spotlight overflow-hidden rounded-xl border border-white/10 bg-[#0b0b10]"
        >
          <p className="flex items-center gap-1.5 border-b border-white/10 bg-violet-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-violet-200">
            <Table2 className="size-3.5" aria-hidden="true" /> {t.name}
          </p>
          <ul className="px-3 py-2 font-mono text-[11px] text-zinc-400">
            {t.cols.map(([c, kind]) => (
              <li key={c} className="flex items-center gap-1.5">
                {kind === 'pk' && <KeyRound className="size-3 text-amber-300" aria-label="primary key" />}
                {kind === 'fk' && <Link2 className="size-3 text-cyan-300" aria-label="foreign key" />}
                <span className={kind ? 'text-zinc-200' : ''}>{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

export function SqlPlayground() {
  const dbRef = useRef<SqlDatabase | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sql, setSql] = useState(PRESETS[0].sql);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const reset = useCallback(async () => {
    try {
      const SQL = await loadSqlJs();
      const db = new SQL.Database();
      db.exec(SCHEMA);
      db.exec(SEED);
      dbRef.current = db;
      setStatus('ready');
      return db;
    } catch (e) {
      setStatus('error');
      setError((e as Error).message);
      return null;
    }
  }, []);

  const run = useCallback((query: string) => {
    const db = dbRef.current;
    if (!db) return;
    const t0 = performance.now();
    try {
      const res = db.exec(query);
      setResults(res);
      setError(null);
      setMessage(res.length === 0 ? 'Statement executed — no rows returned.' : null);
    } catch (e) {
      setResults([]);
      setMessage(null);
      setError((e as Error).message);
    }
    setElapsed(performance.now() - t0);
  }, []);

  useEffect(() => {
    let alive = true;
    reset().then((db) => alive && db && run(PRESETS[0].sql));
    return () => {
      alive = false;
    };
  }, [reset, run]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run(sql);
    }
  };

  return (
    <div className="space-y-5">
      <SchemaDiagram />

      <div className="glow-border rounded-2xl">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black/85">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Database className="size-4 text-cyan-300" aria-hidden="true" />
            <span className="mr-2 font-mono text-xs text-zinc-400">ac_motors.db</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSql(p.sql);
                  run(p.sql);
                }}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-violet-400/60 hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>

          <label htmlFor="sql-editor" className="sr-only">
            SQL query
          </label>
          <textarea
            id="sql-editor"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            rows={8}
            className="block w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-cyan-100 caret-cyan-300 outline-none"
          />

          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-2.5">
            <button
              type="button"
              onClick={() => run(sql)}
              disabled={status !== 'ready'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgb(168_85_247/0.4)] transition hover:brightness-110 disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Run
            </button>
            <button
              type="button"
              onClick={() => reset().then(() => setMessage('Database reset to its initial data.'))}
              disabled={status !== 'ready'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              <RotateCcw className="size-4" /> Reset data
            </button>
            <span className="ml-auto font-mono text-[11px] text-zinc-500">
              {status === 'loading' ? 'loading SQLite (WebAssembly)…' : 'Ctrl + Enter to run'}
              {elapsed !== null && status === 'ready' ? ` · ${elapsed.toFixed(1)} ms` : ''}
            </span>
          </div>
        </div>
      </div>

      <div role="status" aria-live="polite">
        {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-200">✗ {error}</p>}
        {message && <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 font-mono text-xs text-emerald-200">✓ {message}</p>}
      </div>

      {results.map((r, i) => (
        <div key={i} className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0b10]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {r.columns.map((c) => (
                  <th key={c} scope="col" className="px-4 py-2.5 font-mono text-[11px] font-semibold tracking-wide text-violet-200 uppercase">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.values.map((row, ri) => (
                <motion.tr key={ri} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ri * 0.03 }} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03]">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-2 ${typeof cell === 'number' ? 'text-right font-mono text-cyan-100 tabular-nums' : 'text-zinc-300'}`}>
                      {cell === null ? <span className="text-zinc-600">NULL</span> : typeof cell === 'number' ? cell.toLocaleString('en-US') : cell}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <p className="text-xs text-zinc-500">
        Fictional demo dataset. The original project ran on MySQL; this demo runs the same relational model on SQLite compiled to WebAssembly, entirely in your browser.
      </p>
    </div>
  );
}
