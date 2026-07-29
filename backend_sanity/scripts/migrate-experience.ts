/**
 * Promotes the nested `experiences[].works[]` data into flat `experience`
 * documents.
 *
 * Dry run by default - it prints what it would write and exits. Pass --write to
 * actually publish, and --delete-old to remove the superseded documents once the
 * new ones look right.
 *
 * Documents use fixed, readable ids (see roles.ts), so running this twice
 * updates the same nine documents rather than creating duplicates.
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

function monthsBetween(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
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
    console.log(`    was:        ${role.originalDesc.slice(0, 90)}...`)
    console.log()
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
      // originalDesc is intentionally not written to Sanity: it exists in this
      // repo for auditing the rewrite, and would only be dead weight in the CMS.
      const {id, originalDesc: _originalDesc, ...fields} = role
      tx.createOrReplace({_id: id, _type: 'experience', ...fields})
    }
    await tx.commit()
    console.log(`Wrote ${ROLES.length} experience documents.\n`)
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
