import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n';

export interface SubnetInfo {
  address: number;
  prefix: number;
  mask: number;
  network: number;
  broadcast: number;
  first: number;
  last: number;
  hosts: number;
  isPrivate: boolean;
}

const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');

/** Parses "a.b.c.d/p" and computes the subnet. Returns null for invalid input. */
export function computeSubnet(input: string): SubnetInfo | null {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return null;
  const octets = m.slice(1, 5).map(Number);
  const prefix = Number(m[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return null;
  const address = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  // /31 and /32 are special cases (point-to-point links and single hosts).
  const hosts = prefix >= 31 ? 2 ** (32 - prefix) : 2 ** (32 - prefix) - 2;
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  const isPrivate = octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168);
  return { address, prefix, mask, network, broadcast, first, last, hosts, isPrivate };
}

export function SubnetCalculator() {
  const { t, lang } = useLang();
  const [value, setValue] = useState('192.168.10.37/26');
  const info = useMemo(() => computeSubnet(value), [value]);

  const setPrefix = (p: number) => {
    const ip = value.split('/')[0];
    setValue(`${ip}/${p}`);
  };

  const bits = info ? info.address.toString(2).padStart(32, '0').split('') : [];
  const nf = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white">{t('net.title')}</h3>
        <p className="mt-1 text-sm text-zinc-300">{t('net.help')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs text-zinc-300">{t('net.address')}</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            className={`w-full rounded-xl border bg-black/60 px-4 py-3 font-mono text-lg text-cyan-100 outline-none focus:ring-2 focus:ring-cyan-400/30 ${info ? 'border-white/15' : 'border-rose-400/60'}`}
          />
        </label>
        <label className="block sm:w-64">
          <span className="mb-1 flex justify-between text-xs text-zinc-300">
            <span>/{info?.prefix ?? '?'}</span>
            <span>/8 → /30</span>
          </span>
          <input type="range" min={8} max={30} value={info?.prefix ?? 24} onChange={(e) => setPrefix(Number(e.target.value))} className="w-full accent-violet-500" aria-label="Prefix" />
        </label>
      </div>

      {!info ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{t('net.invalid')}</p>
      ) : (
        <>
          <div>
            <p className="mb-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-zinc-400">
              {t('net.bits')}
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-violet-400" /> {info.prefix} {t('net.netbits')}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-cyan-400" /> {32 - info.prefix} {t('net.hostbits')}
              </span>
            </p>
            <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(32,minmax(0,1fr))]">
              {bits.map((b, i) => {
                const net = i < info.prefix;
                return (
                  <motion.span
                    key={i}
                    layout
                    initial={false}
                    animate={{ scale: 1 }}
                    className={`flex aspect-[3/4] items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors duration-300 ${
                      net ? 'border-violet-400/50 bg-violet-500/20 text-violet-100 shadow-[0_0_10px_rgb(168_85_247/0.25)]' : 'border-cyan-400/40 bg-cyan-500/15 text-cyan-100'
                    } ${i % 8 === 7 && i !== 31 ? 'sm:mr-1.5' : ''}`}
                  >
                    {b}
                  </motion.span>
                );
              })}
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [t('net.network'), `${toIp(info.network)}/${info.prefix}`],
              [t('net.broadcast'), toIp(info.broadcast)],
              [t('net.mask'), toIp(info.mask)],
              [t('net.range'), `${toIp(info.first)} → ${toIp(info.last)}`],
              [t('net.hosts'), nf.format(info.hosts)],
              ['', info.isPrivate ? t('net.private') : t('net.public')],
            ].map(([label, val], i) => (
              <div key={i} className="glass rounded-xl px-4 py-3">
                {label && <dt className="text-[11px] tracking-wide text-zinc-400 uppercase">{label}</dt>}
                <dd className={`font-mono text-sm ${label ? 'mt-0.5 text-white' : 'text-emerald-300'}`}>{val}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
