import { toTitleCase } from './utils'

export function generateVCard(member: any, categoryName: string): string {
  const fullName = member.fullName.trim()
  const nameParts = fullName.split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  const orgName = member.businessName ? toTitleCase(member.businessName) : ''

  const safeStr = (str: string) => str ? str.replace(/[,;]/g, ' ').replace(/[\r\n]+/g, ' ').trim() : ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${safeStr(lastName)};${safeStr(firstName)};;;`,
    `FN:${safeStr(fullName)}`,
    orgName ? `ORG:${safeStr(orgName)}` : '',
    member.phone ? `TEL;TYPE=CELL:${safeStr(member.phone)}` : '',
    member.email ? `EMAIL;TYPE=WORK:${safeStr(member.email)}` : '',
    member.website ? `URL:${safeStr(member.website)}` : '',
    member.address ? `ADR;TYPE=WORK:;;${safeStr(member.address)};;;` : '',
    categoryName ? `TITLE:${safeStr(categoryName)}` : '',
    'END:VCARD',
  ].filter(Boolean)

  return lines.join('\n')
}
