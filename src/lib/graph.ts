import { getCollection } from 'astro:content';
import type { Relation } from './relations';

export interface GraphEdge {
  from: string;
  to: string;
  rel: Relation;
  note?: string;
}

export interface GraphNode {
  id: string;
  /** Short card headline — the label you can read at graph zoom. */
  title: string;
  claim: string;
  /** Inherited from the first source, so clusters read as "the Dalio cluster". */
  accent: string;
  topics: string[];
  sources: { id: string; title: string; cover: string; kind: string }[];
  /** Total links in + out — drives node radius, so hubs look like hubs. */
  degree: number;
}

/**
 * Resolves the whole note graph once, at build time.
 *
 * Links are authored on one side only; the reverse direction is derived here so
 * there's never a pair of frontmatter blocks to keep in sync.
 */
export async function buildGraph() {
  const notes = (await getCollection('notes')).filter((n) => !n.data.draft);
  const summaries = await getCollection('summaries');
  const sourceById = new Map(summaries.map((s) => [s.id, s.data]));
  const noteIds = new Set(notes.map((n) => n.id));

  const edges: GraphEdge[] = [];
  // A link to an id that doesn't exist yet — surfaced in the UI rather than
  // silently dropped, since in a Zettelkasten it usually means "note to write".
  const dangling: { from: string; to: string }[] = [];

  for (const n of notes) {
    for (const l of n.data.links) {
      if (l.to === n.id) continue;
      if (!noteIds.has(l.to)) {
        dangling.push({ from: n.id, to: l.to });
        continue;
      }
      edges.push({ from: n.id, to: l.to, rel: l.rel, note: l.note });
    }
  }

  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }

  const nodes: GraphNode[] = notes.map((n) => {
    const sources = n.data.sources
      .map((id) => {
        const s = sourceById.get(id);
        return s
          ? { id, title: s.title, cover: s.cover, kind: s.kind }
          : null;
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return {
      id: n.id,
      title: n.data.title,
      claim: n.data.claim,
      accent: n.data.sources.length
        ? (sourceById.get(n.data.sources[0])?.accent ?? '#6b6b76')
        : '#6b6b76',
      topics: n.data.topics,
      sources,
      degree: degree.get(n.id) ?? 0,
    };
  });

  return { notes, nodes, edges, dangling };
}

/** Edges touching one note, split by direction, with the other end resolved. */
export function neighborsOf(
  id: string,
  edges: GraphEdge[],
  nodes: GraphNode[],
) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = edges
    .filter((e) => e.from === id)
    .map((e) => ({ ...e, other: byId.get(e.to)! }));
  const incoming = edges
    .filter((e) => e.to === id)
    .map((e) => ({ ...e, other: byId.get(e.from)! }));
  return { outgoing, incoming };
}
