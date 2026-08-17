/**
 * Facts behind the local AI factory case study.
 *
 * Everything here is taken from the build's own record, a running plan document
 * kept while the system was assembled, or from the public GitHub thread. Nothing
 * is an estimate and nothing is remembered. Every measurement was taken on the
 * one machine described on the page, which is why the numbers are quoted with
 * the hardware attached rather than as general claims about the models.
 *
 * Deliberately absent, and to stay absent: the private network's hostnames and
 * addresses, anything about how this relates to employment, and the projects
 * the factory is being pointed at. The first is a security boundary, the second
 * is nobody's business, and the third is not evidence of anything yet.
 */

/** The one machine every number on this page was measured on. */
export const MACHINE = [
  { value: 'M4 Max', label: 'Apple silicon' },
  { value: '64 GB', label: 'unified memory' },
  { value: '40', label: 'GPU cores' },
  { value: '~85', label: 'tokens per second' },
] as const

/**
 * The two ways in.
 *
 * They are genuinely different in privilege, not just in interface, which is
 * the only reason the distinction is worth a reader's attention. The phone lane
 * runs as a different operating system user to the one I log in as.
 */
export const LANES = [
  {
    id: 'lane-2',
    entry: 'My phone',
    via: 'Telegram',
    name: 'Autonomous',
    detail: [
      'Runs as its own macOS user, not as me',
      'Local models only, no cloud provider configured',
      'Confined to one workspace directory',
    ],
  },
  {
    id: 'lane-1',
    entry: 'My laptop',
    via: 'Terminal',
    name: 'Hands on',
    detail: [
      'Runs as me, with my privileges',
      'Local by default, can escalate to a frontier model',
      'For the work I want to watch happen',
    ],
  },
] as const

/**
 * The shared spine both lanes drop into, top to bottom.
 *
 * Only phases the build record marks as done appear here. The pipeline this is
 * eventually meant to feed, project templates, a push flow, preview deploys,
 * is real in the plan and not real on the machine, so it is not drawn.
 */
export const STACK = [
  {
    label: 'Context and gates',
    detail: 'Current library documentation, plus the scripts a task has to survive.',
  },
  {
    label: 'Inference server',
    detail: 'Stateless, OpenAI compatible, bound to the machine and never to the network.',
  },
  {
    label: 'The model',
    detail: 'Qwen3.6-35B-A3B, 4-bit, chosen by measurement. The bake-off is section 04.',
  },
  {
    label: 'One workspace',
    detail: 'Every project lives here. Nothing the agent does happens anywhere else.',
  },
  {
    label: 'Five gates',
    detail: 'Install, lint, typecheck, test, build. A task is not done until all five pass.',
  },
  {
    label: 'A local commit',
    detail: 'And it stops there. Pushing is mine. Section 05 explains why it has to be.',
  },
] as const


/**
 * A row is one model given one task.
 *
 * `outcome` drives the styling rather than being derived from the score,
 * because "won" is a judgement about speed and quality together, and one of
 * the entries did not lose so much as fail to exist.
 */
export type EvalRow = {
  model: string
  quant: string
  score: string
  speed: string
  verdict: string
  outcome: 'win' | 'loss' | 'void'
}

export type Bakeoff = {
  title: string
  note: string
  rows: EvalRow[]
}

/**
 * Eval 1, three builds of the same model family given the same dashboard task
 * and scored against a 22 point logic harness.
 *
 * The interesting row is the middle one. Doubling the weight precision cost
 * roughly 30 GB of memory and scored two points lower.
 */
export const EVAL_UI: Bakeoff = {
  title: 'Three builds, one task',
  note: 'Same dashboard brief, same 22 point logic harness, same machine.',
  rows: [
    {
      model: 'Qwen3.6 35B-A3B',
      quant: '4-bit',
      score: '20/22',
      speed: '~85 tok/s',
      verdict: 'Cleanest behaviour. Won.',
      outcome: 'win',
    },
    {
      model: 'Qwen3.6 35B-A3B',
      quant: '8-bit',
      score: '18/22',
      speed: '~85 tok/s',
      verdict: 'Twice the precision, two points worse.',
      outcome: 'loss',
    },
    {
      model: 'Qwen3.6 27B',
      quant: '8-bit',
      score: '21/22',
      speed: '~16 tok/s',
      verdict: 'Best answers, too slow to hold a conversation with.',
      outcome: 'loss',
    },
  ],
}

/**
 * Eval 2, the dedicated coding models. Every one of them lost, and one of them
 * turned out not to exist.
 */
export const EVAL_CODER: Bakeoff = {
  title: 'Every specialist lost',
  note: 'Dedicated coder models, four real prompts.',
  rows: [
    {
      model: 'Qwen3-Coder 30B-A3B',
      quant: '4-bit',
      score: 'Corrupt output',
      speed: '110 tok/s',
      verdict: 'Fastest thing tested, and it emitted corrupt tokens.',
      outcome: 'loss',
    },
    {
      model: 'Qwen3-Coder-Next 80B',
      quant: '4-bit',
      score: 'Cleanest code',
      speed: '~16 tok/s',
      verdict: 'Genuinely good, and unusable at conversational speed.',
      outcome: 'loss',
    },
    {
      model: 'Qwen 4 Coder 32B',
      quant: '—',
      score: 'Does not exist',
      speed: '—',
      verdict: 'The article recommending it had invented the model ID.',
      outcome: 'void',
    },
  ],
}

/**
 * The bugs worth keeping, chosen because each one is a mechanism rather than a
 * symptom. A page that says "I debugged it" is worth nothing; the mechanism is
 * the part that cannot be faked.
 */
export type Bug = {
  symptom: string
  mechanism: string
  fix: string
  /** Only the first bug has a measured before and after. */
  before?: string
  after?: string
}

export const BUGS: Bug[] = [
  {
    symptom: 'A one sentence answer took three minutes and thirty-nine seconds.',
    mechanism:
      'The model was thinking out loud where I could not see it. On simple prompts the hidden reasoning was consuming around 97% of the token budget: 831 reasoning chunks against 20 chunks of actual answer. One sentence cost 25,000 invisible tokens.',
    fix: 'Turned thinking off at the client, per request, rather than switching to a weaker model.',
    before: '3m 39s',
    after: '~3s',
  },
  {
    symptom: 'The agent reported zero tools available, on every single request.',
    mechanism:
      'A grouped toolset had been switched off, and its membership quietly covered every file and terminal tool the agent had. Disable beats enable, so a single line removed the lot without ever saying so.',
    fix: 'Removed the group. The failure was silent by design, which is what made it expensive.',
  },
  {
    symptom: 'Backspace did not work over the remote session. I lived with it for four phases.',
    mechanism:
      'The terminal I use locally advertises a name the remote machine had never heard of, so it fell back to a keymap where the delete key means something else.',
    fix: 'Installed the missing terminal definition on the far side. Four phases of irritation, one entry in a database.',
  },
]

/**
 * The upstream contribution. Public and checkable, which is the whole point of
 * including it: everything else on this page is my own account of my own
 * machine, and this is the one part a stranger can verify without taking my
 * word for anything.
 */
export const UPSTREAM = {
  repo: 'waybarrios/vllm-mlx',
  repoUrl: 'https://github.com/waybarrios/vllm-mlx',
  what: 'An OpenAI compatible inference server for Apple silicon',
  stars: '1,500+',
  forks: '200+',
  issue: { number: 628, url: 'https://github.com/waybarrios/vllm-mlx/issues/628' },
  pr: { number: 629, url: 'https://github.com/waybarrios/vllm-mlx/pull/629' },
  mergedOn: '12 August 2026',
} as const

/**
 * What the system cannot do, kept on the page rather than in a drawer.
 *
 * A page about a machine you own, written by the person who owns it, is worth
 * exactly as much as its worst admission. These are the four that a reader
 * would otherwise have to find out by asking.
 */
export const LIMITS = [
  {
    title: 'It scaffolds and checks. It does not yet ship',
    body: 'What runs today is the engine, the boundary and the gates. The layer above it, project templates, a push and review flow, preview deploys, is designed and written down and not yet built. Anyone describing this as an idea going in and a product coming out is describing my plan, not my machine.',
  },
  {
    title: 'It cannot survive a power cut on its own',
    body: 'Disk encryption has no unattended unlock, so a cold boot leaves the machine off the network until somebody walks over and types a password. Remote access is only as good as the last time the room was occupied.',
  },
  {
    title: 'Thinking is still expensive',
    body: 'The reasoning tax is managed, not solved. It is switched off where it hurts and left on where it helps, and deciding which is which is still a judgement I make by hand.',
  },
  {
    title: 'Sixty-four gigabytes is the ceiling',
    body: 'Thirty to thirty-five billion parameters is as far as this box goes at a usable speed. The models above that line are not slow here, they are absent. That is a second machine, not a setting.',
  },
  {
    title: 'Nothing it writes reaches the internet',
    body: 'The agent commits locally and stops. Every push is mine, deliberately, and that is a limit I intend to keep rather than a gap I am working on.',
  },
] as const
