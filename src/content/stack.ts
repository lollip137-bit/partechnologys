import {
  siReact, siNextdotjs, siVuedotjs, siAngular,
  siNodedotjs, siPython, siDotnet, siLaravel, siPhp,
  siFlutter, siSwift, siKotlin,
  siClaude, siGooglegemini, siOllama, siLangchain, siCrewai, siN8n,
  siHuggingface, siPytorch, siTensorflow,
  siGooglecloud,
  siMysql, siPostgresql, siMongodb, siFirebase, siSupabase,
  siDocker, siKubernetes, siGithubactions, siJenkins, siTerraform,
} from 'simple-icons';

/**
 * THE STACK — one source of truth for every technology mark on the site.
 *
 * Marks come from the official vendor vectors via simple-icons wherever they
 * exist. Six do NOT: AWS, Azure, OpenAI, Java, Pinecone and Chroma have all been
 * removed from that set at the brands' request (same reason LinkedIn is missing).
 * Rather than hand-draw an approximation of somebody's trademark — which would
 * publish a subtly WRONG logo — those render as a lettermark tile in the brand's
 * own official colour. Accurate, recognisable, and not a forgery.
 */
export interface Tech {
  name: string;
  hex: string;
  /** official vector path, when one exists */
  path?: string;
  /** short lettermark, used when no official vector is available */
  mark?: string;
}

const t = (icon: { title: string; hex: string; path: string }, name?: string): Tech => ({
  name: name ?? icon.title,
  hex: icon.hex,
  path: icon.path,
});

/** brands with no vector in simple-icons — official colour, honest lettermark */
const lettermark = (name: string, hex: string, mark: string): Tech => ({ name, hex, mark });

export interface StackGroup { group: string; line: string; items: Tech[] }

export const STACK_GROUPS: StackGroup[] = [
  {
    group: 'Frontend',
    line: 'Interfaces that stay fast as they grow.',
    items: [t(siReact), t(siNextdotjs, 'Next.js'), t(siVuedotjs, 'Vue'), t(siAngular)],
  },
  {
    group: 'Backend',
    line: 'The engine room.',
    items: [
      t(siNodedotjs, 'Node.js'), t(siPython), t(siDotnet, '.NET'),
      t(siLaravel), t(siPhp, 'PHP'),
      lettermark('Java', 'E76F00', 'Java'),
    ],
  },
  {
    group: 'Mobile',
    line: 'One codebase, both stores — or native where it counts.',
    items: [t(siFlutter), { ...t(siReact), name: 'React Native' }, t(siSwift), t(siKotlin)],
  },
  {
    group: 'AI',
    line: 'Models, agents and the plumbing that makes them useful.',
    items: [
      lettermark('OpenAI', '412991', 'AI'),
      t(siClaude), t(siGooglegemini, 'Gemini'), t(siOllama, 'Llama'),
      t(siLangchain, 'LangChain'), t(siCrewai, 'CrewAI'), t(siN8n, 'n8n'),
      lettermark('Pinecone', '1C17FF', 'PC'),
      lettermark('ChromaDB', 'FF6B4A', 'CH'),
      t(siHuggingface, 'Hugging Face'), t(siPytorch, 'PyTorch'), t(siTensorflow, 'TensorFlow'),
    ],
  },
  {
    group: 'Cloud',
    line: 'Wherever your data has to live.',
    items: [
      lettermark('AWS', 'FF9900', 'AWS'),
      lettermark('Azure', '0078D4', 'Az'),
      t(siGooglecloud, 'Google Cloud'),
    ],
  },
  {
    group: 'Database',
    line: 'Relational, document or realtime — chosen, not defaulted.',
    items: [t(siMysql, 'MySQL'), t(siPostgresql, 'PostgreSQL'), t(siMongodb, 'MongoDB'), t(siFirebase), t(siSupabase)],
  },
  {
    group: 'DevOps',
    line: 'Ship on a Friday without flinching.',
    items: [t(siDocker), t(siKubernetes), t(siGithubactions, 'GitHub Actions'), t(siJenkins), t(siTerraform)],
  },
];

/** Flat list, handy for the 3D orbits. */
export const ALL_TECH: Tech[] = STACK_GROUPS.flatMap((g) => g.items);

export function techByGroup(...groups: string[]): Tech[] {
  return STACK_GROUPS.filter((g) => groups.includes(g.group)).flatMap((g) => g.items);
}

/**
 * Several brand colours are essentially black (Next.js #000000, Angular #0F0F11,
 * Ollama #000000). On a true-black site those marks would be invisible, so
 * anything below a luminance floor is drawn in brand paper instead.
 */
export function safeHex(hex: string) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.16 ? 'E5E7EB' : hex;
}
