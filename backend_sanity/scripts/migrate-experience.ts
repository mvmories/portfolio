/**
 * Promotes the nested `experiences[].works[]` data into flat `experience`
 * documents.
 *
 * Dry run by default - it prints what it would write and exits. Pass --write to
 * actually publish, and --delete-old to remove the superseded documents once the
 * new ones look right.
 *
 * Documents use fixed, readable ids (see roles.ts), so running this twice
 * updates the same nine documents rather than creating duplicates. ROLES is
 * treated as the complete set: any other `experience` document is removed, so
 * renaming a company cannot strand its old entry on the site.
 *
 *   npx tsx scripts/migrate-experience.ts
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/migrate-experience.ts --write
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/migrate-experience.ts --delete-old
 */

import {createClient} from '@sanity/client'

import {ROLES} from './roles'

const write = process.argv.includes('--write')
const deleteOld = process.argv.includes('--delete-old')
const token = process.env.SANITY_WRITE_TOKEN

const client = createClient({
  projectId: 'khsof0do',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

/** Inclusive of both end months, matching the CV, LinkedIn and the frontend. */
function monthsBetween(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1
}

function describeDuration(role: (typeof ROLES)[number]): string {
  const end = role.current ? new Date().toISOString().slice(0, 10) : role.endDate
  if (!end) return '?'
  const months = monthsBetween(role.startDate, end)
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years ? `${years}y` : '', rest ? `${rest}m` : ''].filter(Boolean).join(' ') || '<1m'
}

async function main() {
  console.log(`\n${write ? 'WRITING' : 'DRY RUN'} - ${ROLES.length} roles\n`)

  // Guard against the migration silently rewriting content that has already been
  // edited by hand in the Studio. Re-running after an edit would discard it.
  if (write) {
    const existing: {_id: string; _updatedAt: string}[] = await client.fetch(
      '*[_type == "experience"]{_id, _updatedAt}'
    )
    if (existing.length) {
      console.log(
        `! ${existing.length} experience documents already exist and will be overwritten.\n` +
          '  Any edits made in the Studio since the last run will be lost.\n'
      )
    }
  }

  for (const role of ROLES) {
    const range = role.current
      ? `${role.startDate.slice(0, 7)} - present`
      : `${role.startDate.slice(0, 7)} - ${role.endDate?.slice(0, 7)}`
    console.log(`  ${role.role} @ ${role.company}`)
    console.log(`    ${range}  (${describeDuration(role)})`)
    console.log(`    summary:    ${role.summary}`)
    console.log(`    highlights: ${role.highlights.length}, tech: ${role.techStack.join(', ')}`)
    for (const line of role.highlights) console.log(`      - ${line}`)
    console.log()
  }

  // Documents are keyed by an id derived from the company name, so renaming a
  // company writes a new document and silently strands the old one - which is
  // exactly what happened on the first run, leaving three duplicate roles on the
  // site. Treating ROLES as the complete set is what makes re-running safe.
  const orphans: {_id: string; role?: string; company?: string}[] = await client.fetch(
    '*[_type == "experience" && !(_id in $ids)]{_id, role, company}',
    {ids: ROLES.map((r) => r.id)}
  )
  if (orphans.length) {
    console.log(`  ${orphans.length} experience documents are no longer produced by roles.ts`)
    for (const doc of orphans) console.log(`    - ${doc._id}  (${doc.role} @ ${doc.company})`)
    console.log(write ? '  These will be deleted.\n' : '  A --write run would delete these.\n')
  }

  if (!write && !deleteOld) {
    console.log('Nothing written. Re-run with --write to publish.\n')
    return
  }

  if (!token) {
    console.error('SANITY_WRITE_TOKEN is not set. Create a token with Editor rights.')
    process.exitCode = 1
    return
  }

  if (write) {
    const tx = client.transaction()
    for (const role of ROLES) {
      // `sources` is deliberately not written to Sanity: it exists in this repo
      // so every claim can be traced back to the CV and LinkedIn, and would only
      // be dead weight in the CMS.
      const {id, sources: _sources, ...fields} = role
      tx.createOrReplace({_id: id, _type: 'experience', ...fields})
    }

    for (const doc of orphans) tx.delete(doc._id)

    await tx.commit()
    console.log(
      `Wrote ${ROLES.length} experience documents` +
        (orphans.length ? ` and removed ${orphans.length} orphaned.` : '.') +
        '\n'
    )
  }

  if (deleteOld) {
    const stale: {_id: string}[] = await client.fetch(
      '*[_type in ["experiences", "workExperience"]]{_id}'
    )
    if (!stale.length) {
      console.log('No superseded documents left to delete.\n')
      return
    }
    const tx = client.transaction()
    for (const doc of stale) tx.delete(doc._id)
    await tx.commit()
    console.log(`Deleted ${stale.length} superseded documents.\n`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
