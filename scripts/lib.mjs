import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

export const NOTES = 'src/content/notes';
export const SOURCES = 'src/content/summaries';

/** Split a markdown file into { data, body }. */
export function parse(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${path}: no frontmatter`);
  return { data: yaml.load(m[1]) ?? {}, body: (m[2] ?? '').trim() };
}

export function collection(dir) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  return files.map((f) => ({ id: f.slice(0, -3), ...parse(join(dir, f)) }));
}

export const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};
