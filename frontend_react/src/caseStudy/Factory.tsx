import ThemeToggle from '../components/ThemeToggle'
import SectionIndicator from './SectionIndicator'
import { BUGS, EVAL_CODER, EVAL_UI, LANES, LIMITS, MACHINE, STACK, UPSTREAM } from './factoryData'

import './Factory.scss'

type Eval = typeof EVAL_UI

/**
 * A model bake-off, rendered as a comparison rather than a table.
 *
 * The result column is the argument, so it leads on every row and the numbers
 * support it. A real `<table>` would be the honest markup for a grid of
 * measurements, but this is read as a list of verdicts, and at 500px a table
 * either scrolls sideways or collapses into something no longer tabular.
 */
const Bakeoff = ({ data }: { data: Eval }) => (
  <figure className='fx-eval'>
    <ul>
      {data.rows.map((row) => (
        <li key={`${row.model}-${row.quant}`} data-outcome={row.outcome}>
          <p className='fx-eval-model'>
            {row.model} <span>{row.quant}</span>
          </p>
          <p className='fx-eval-verdict'>{row.verdict}</p>
          <dl className='fx-eval-numbers'>
            <div>
              <dt>Result</dt>
              <dd>{row.score}</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{row.speed}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
    <figcaption>{data.note}</figcaption>
  </figure>
)

/**
 * The local AI factory case study.
 *
 * A second Vite entry point, for the same reasons as the first: the home page
 * has no router, and `/factory` resolves to a real file that Netlify serves in
 * preference to the SPA rewrite.
 *
 * This page has no screenshots, which is a constraint rather than an oversight.
 * The interesting parts are a private network and a machine in my house, and
 * the only honest images would either leak addresses or be decoration. So the
 * evidence here is numbers and mechanisms, laid out to be read rather than
 * admired, and the one externally checkable fact is given its own section and
 * a link out.
 */
const Factory = () => (
  <>
    <div className='cs-topbar'>
      <div className='cs-topbar-left'>
        <a className='cs-back' href='/'>
          <span aria-hidden='true'>&larr;</span>
          <span className='cs-back-label'>Miguel Vilhena</span>
        </a>
        <SectionIndicator />
      </div>
      <ThemeToggle />
    </div>

    <main className='cs fx'>
      <header className='cs-hero'>
        <p className='cs-eyebrow'>Case study, personal infrastructure</p>
        <h1>
          The model wrote code that looked right.
          <span>So I built the thing that checks it.</span>
        </h1>
        <p className='cs-standfirst'>
          One engineer can now attempt what used to need a team. That sentence is easy to say and
          expensive to mean, because an agent is only worth having if you can leave it alone, and
          you can only leave it alone if the models are good enough and the boundaries are real. So
          I built the thing that measures the first and enforces the second. This is what it is,
          what it cost, and where it still falls short.
        </p>

        <dl className='cs-meta'>
          <div>
            <dt>Scope</dt>
            <dd>Personal infrastructure</dd>
          </div>
          <div>
            <dt>Hardware</dt>
            <dd>Mac Studio, M4 Max</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>Me</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className='cs-live' /> Running daily
            </dd>
          </div>
        </dl>

        <ul className='cs-stats'>
          {MACHINE.map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </li>
          ))}
        </ul>
      </header>

      {/* 01 -------------------------------------------------------------- */}

      <section className='cs-section'>
        <p className='cs-num'>01</p>
        <h2>Why a person builds this</h2>

        <p className='cs-lede'>
          Start with the part that has nothing to do with technology. The gap between having an
          idea and having something real has always been staffing, and for the first time it might
          not be.
        </p>
        <p>
          I have spent eleven years watching good ideas die in the queue. Not because they were
          wrong, and not because nobody could build them, but because building them needed four
          people for three months and there were only ever two people and one month. That
          arithmetic is the reason most software that should exist does not.
        </p>
        <p>
          An agent that writes and checks its own code changes that arithmetic, but only if you can
          walk away from it. An assistant you have to supervise line by line is a slower version of
          typing. The whole value is in the leaving alone, and leaving something alone requires two
          things I did not want to take on trust: that the model is genuinely good enough, and that
          the worst thing it can do is something I could survive.
        </p>
        <p>
          Neither is answerable by opinion. The first is a measurement problem and the second is a
          permissions problem. So I bought one machine, put both questions to it directly, and
          this page is the answer to each.
        </p>
        <p className='cs-callout'>
          The rest of this is in two registers on purpose. If you run a company, sections 01, 02, 05
          and 09 are the ones that matter and they assume nothing. If you write code, 03 through 07
          are where the receipts are.
        </p>
      </section>

      {/* 02 -------------------------------------------------------------- */}

      <section className='cs-section'>
        <p className='cs-num'>02</p>
        <h2>The shape of it</h2>

        <p className='cs-lede'>
          Two ways in, one spine, and a hard stop at the end. Everything drawn here is running
          today.
        </p>

        <figure className='fx-arch cs-wide'>
          <div className='fx-arch-lanes'>
            {LANES.map((lane) => (
              <div className='fx-arch-lane' key={lane.id}>
                <p className='fx-arch-entry'>{lane.entry}</p>
                <p className='fx-arch-via'>via {lane.via}</p>
                <div className='fx-arch-card'>
                  <p className='fx-arch-name'>{lane.name}</p>
                  <ul>
                    {lane.detail.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='fx-arch-merge' aria-hidden='true' />

          <ol className='fx-arch-stack'>
            {STACK.map((step) => (
              <li key={step.label}>
                <p className='fx-arch-step'>{step.label}</p>
                <p className='fx-arch-detail'>{step.detail}</p>
              </li>
            ))}
          </ol>

          <figcaption>
            Nothing here is exposed to the internet. The server listens on the machine itself, and
            the only way in from outside the house is a private network between my own devices.
          </figcaption>
        </figure>

        <p>
          The two lanes are the part people miss. They are not two interfaces onto one thing, they
          are two different levels of trust. The phone lane runs as a separate operating system user
          with no ability to reach my documents, my keys or my work, because that lane is the one I
          use when I am not watching. The laptop lane runs as me, and is for the work I want to see
          happen. Both talk to the same server and write into the same workspace, so a project
          started on a train can be finished at the desk. The truth lives in files and git, not in
          any tool&rsquo;s memory.
        </p>
        <p>
          The hardware decides the shape of all of it. Sixty-four gigabytes of unified memory puts
          the ceiling at around thirty-five billion parameters at a speed you can hold a
          conversation with. That single constraint is what turned model selection from a matter of
          taste into a matter of measurement, which is section 04.
        </p>
        <p className='cs-callout'>
          The test I set myself was deliberately unglamorous: away from the desk, no laptop,
          scaffold a small TypeScript project from my phone, put it through every gate, and commit
          it. It passed in July, from a pub. That is the whole system working end to end, and it is
          also the honest ceiling of what it does today.
        </p>
      </section>

      {/* 03 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>03</p>
        <h2>The code looked right</h2>

        <p>
          The proving project was deliberately dull: a small chat interface, no database, no
          authentication, nothing to hide behind. The local model wrote most of it and the result
          looked entirely reasonable. I read it anyway, and found a real bug in how it handled a
          stream of newline delimited JSON, the kind that survives a glance and fails on the second
          message.
        </p>

        <blockquote className='cs-quote'>
          <p>
            &ldquo;Local model output <em>looks</em> right and still carries real bugs.&rdquo;
          </p>
          <footer>My own note at the time, which became the reason the quality gates exist</footer>
        </blockquote>

        <p>
          That is the whole thesis of this page, and it arrived early enough to shape everything
          after it. The interesting problem with generated code is not that it is bad. It is that
          it is plausible. Plausible code passes review by a tired human and fails in production,
          so the answer cannot be more careful reading. It has to be a machine that does not get
          tired.
        </p>
        <p>
          So nothing the agent writes is considered done because it says so. A task is finished
          when a script has installed the dependencies, linted it, type checked it, run the tests
          and produced a build. The same script I run by hand is the one the agent has to satisfy,
          which means there is no gentler standard for the machine than for me.
        </p>
      </section>

      {/* 03 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>04</p>
        <h2>I stopped reading about models and measured them</h2>

        <p>
          Two structured bake-offs, both run on the machine above, because a benchmark published by
          somebody with a different box answers a question I was not asking. I wanted to know what
          was good <em>here</em>, at a speed I would actually tolerate.
        </p>

        <h3 className='cs-sub'>{EVAL_UI.title}</h3>
        <Bakeoff data={EVAL_UI} />

        <p>
          The middle row is the one worth stopping on. It is the same model as the winner, at twice
          the weight precision, which is supposed to be the better build. It scored two points
          lower and cost roughly thirty gigabytes of memory to do it. Had I taken the received
          wisdom, I would have run the worse model and never known.
        </p>

        <h3 className='cs-sub'>{EVAL_CODER.title}</h3>
        <Bakeoff data={EVAL_CODER} />

        <p>
          The third row is not a joke. A well ranked article recommended a model, gave its
          identifier, and the model did not exist. Not deprecated, not renamed. Invented. It is a
          small thing that says something large about how much of the current writing on local
          models is worth acting on, and it is the reason the rest of this section is measurements
          rather than opinions.
        </p>

        <p className='cs-callout'>
          What I took away: more precision is not free quality, the specialists were worse than the
          generalist here, and the real bottleneck was never the model&rsquo;s intelligence. It was
          how much it talked to itself, and how fast. I then deleted around ninety-five gigabytes of
          models that had lost.
        </p>
      </section>

      {/* 04 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>05</p>
        <h2>The agent cannot push, and not because I asked it not to</h2>

        <p>
          Most writing about agent safety is a list of instructions: do not touch this, always
          confirm that. I wrote one of those documents too, and it is useful. It is also, in the
          end, a piece of prose being read by something that produces prose for a living.
        </p>

        <blockquote className='cs-quote'>
          <p>
            &ldquo;A command policy document is documentation, not enforcement. If the policy file
            and the operating system ever disagree, the operating system wins.&rdquo;
          </p>
          <footer>The rule the rest of the design follows from</footer>
        </blockquote>

        <p>
          So the boundary is not written down, it is built. The agent runs as its own non
          administrative user on the machine. My home directory is closed to it. Its workspace sits
          outside every home directory on the system, owned by it and nothing else. It has no
          administrative rights and is never granted any: everything it legitimately does needs
          none, so a task that demands them is the signal that a human should be doing it.
        </p>

        <p className='cs-callout'>
          It holds no access token and no key that can push anywhere. That is <em>why</em> it
          cannot reach a remote repository. Not a rule it is obeying, a capability it does not
          have.
        </p>

        <p>
          The difference matters more than it sounds. A rule is a thing that holds until something
          unusual happens, and unusual is the normal operating condition for a language model. A
          missing credential holds when the model is confused, when the prompt is adversarial, and
          when I have made a mistake. It is the only part of this system I would still trust if
          every other part of it failed at once.
        </p>
      </section>

      {/* 05 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>06</p>
        <h2>Three bugs, and what was actually wrong</h2>

        <p>
          Running this yourself means the failures are yours too, and none of them arrive labelled.
          These three are here because in each case the symptom pointed nowhere near the cause.
        </p>

        <ol className='fx-bugs'>
          {BUGS.map((bug) => (
            <li key={bug.symptom}>
              <p className='fx-bug-symptom'>{bug.symptom}</p>
              <p className='fx-bug-mechanism'>{bug.mechanism}</p>
              <p className='fx-bug-fix'>{bug.fix}</p>
              {bug.before && (
                <p className='fx-bug-delta'>
                  <span className='fx-delta-before'>{bug.before}</span>
                  <span className='fx-delta-arrow' aria-hidden='true'>
                    &rarr;
                  </span>
                  <span className='fx-delta-after'>{bug.after}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* 06 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>07</p>
        <h2>One of them was not my bug</h2>

        <p>
          Everything above is my account of my own machine, which is worth what you decide it is
          worth. This part is not. It is on the public record and you can read every line of it
          without taking my word for anything.
        </p>

        <p>
          The server I run the models through streams responses back in pieces, and the final piece
          is supposed to carry a flag saying why it stopped. On a natural ending it never did. If
          the model ran out of room the flag appeared correctly, so the bug was invisible to
          anybody whose prompts were long. Mine were short, and every strict client I pointed at it
          rejected the stream outright.
        </p>

        <p>
          I traced it to the point where the engine finishes a response, filed the bug with a
          reproduction, and wrote the patch. The maintainer asked for regression coverage, added it
          alongside the tests I had proposed, resolved a conflict with a parallel fix, and merged
          it.
        </p>

        <figure className='fx-upstream'>
          <p className='fx-upstream-repo'>
            <a href={UPSTREAM.repoUrl} target='_blank' rel='noreferrer noopener'>
              {UPSTREAM.repo}
            </a>
          </p>
          <p className='fx-upstream-what'>{UPSTREAM.what}</p>
          <dl className='fx-upstream-meta'>
            <div>
              <dt>Stars</dt>
              <dd>{UPSTREAM.stars}</dd>
            </div>
            <div>
              <dt>Forks</dt>
              <dd>{UPSTREAM.forks}</dd>
            </div>
            <div>
              <dt>Merged</dt>
              <dd>{UPSTREAM.mergedOn}</dd>
            </div>
          </dl>
          <p className='fx-upstream-links'>
            <a href={UPSTREAM.issue.url} target='_blank' rel='noreferrer noopener'>
              Issue #{UPSTREAM.issue.number}, the report
            </a>
            <a href={UPSTREAM.pr.url} target='_blank' rel='noreferrer noopener'>
              Pull request #{UPSTREAM.pr.number}, merged
            </a>
          </p>
        </figure>

        <p>
          It is three lines of consequence in somebody else&rsquo;s project, which is roughly the
          size of most real contributions. I include it because it is the one claim on this page
          that survives a stranger clicking it.
        </p>
      </section>

      {/* 07 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>08</p>
        <h2>What it still cannot do</h2>

        <p>
          A page about a machine in your own house, written by the person who owns it, is worth
          about as much as its worst admission. So here are the five a reader would otherwise have
          to ask about, starting with the one that matters most.
        </p>

        <ul className='fx-limits'>
          {LIMITS.map((limit) => (
            <li key={limit.title}>
              <h3>{limit.title}</h3>
              <p>{limit.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 08 -------------------------------------------------------------- */}
      <section className='cs-section'>
        <p className='cs-num'>09</p>
        <h2>Why bother</h2>

        <p>
          Because of the arithmetic in section 01. Four people for three months is why most
          software that should exist does not, and that number is moving. Almost all of the
          difficulty has moved with it. It is no longer in producing the code. It is in knowing
          whether the code you were handed is any good, and in making sure the thing that produced
          it cannot hurt you while you find out.
        </p>
        <p>
          That is not a prompt engineering problem. It is an engineering problem, and it looks
          exactly like the ones I have spent eleven years on: measure instead of assume, put the
          boundary somewhere the kernel enforces it, and never let anything call itself done
          because it feels done.
        </p>
        <p>
          I did not build this to have a local model. I built it to find out what changes when the
          model is yours, the hardware is yours, and every mistake is yours to diagnose. What
          changed is that I now trust generated code less, and ship it more. The next thing to
          build is the layer that takes a checked commit and turns it into something a user can
          open. When that exists this page will say so, and not before.
        </p>
      </section>

      <footer className='cs-footer'>
        <a className='cs-cta' href='/#contact'>
          Work with me
        </a>
        <a className='cs-cta cs-cta--ghost' href={UPSTREAM.pr.url} target='_blank' rel='noreferrer noopener'>
          Read the merged patch
        </a>
        <a className='cs-cta cs-cta--ghost' href='/'>
          Back to the portfolio
        </a>
      </footer>
    </main>
  </>
)

export default Factory
