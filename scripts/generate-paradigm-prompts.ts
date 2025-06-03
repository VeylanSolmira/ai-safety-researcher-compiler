// Script to generate all paradigm prompts from paradigms-updated.md
// This will create the prompt structure for all 39 paradigms

import fs from 'fs'
import path from 'path'

// Read the paradigms document
const paradigmsPath = path.join(process.cwd(), 'development-resources', 'paradigms-updated.md')
const paradigmsContent = fs.readFileSync(paradigmsPath, 'utf-8')

// Define all 39 paradigms with their information
const paradigms = [
  { id: 'the-race', section: '1.1', name: 'The Race' },
  { id: 'the-hunt', section: '1.2', name: 'The Hunt' },
  { id: 'military-conquest', section: '1.3', name: 'Military Conquest' },
  { id: 'ecological-succession', section: '1.4', name: 'Ecological Succession' },
  { id: 'birth-parenthood', section: '2.1', name: 'Birth/Parenthood' },
  { id: 'metamorphosis', section: '2.2', name: 'Metamorphosis' },
  { id: 'awakening-enlightenment', section: '2.3', name: 'Awakening/Enlightenment' },
  { id: 'midwifery', section: '2.4', name: 'Midwifery' },
  { id: 'speciation-event', section: '3.1', name: 'Speciation Event' },
  { id: 'phase-transition', section: '3.2', name: 'Phase Transition' },
  { id: 'cambrian-explosion', section: '3.3', name: 'Cambrian Explosion' },
  { id: 'symbiogenesis', section: '3.4', name: 'Symbiogenesis' },
  { id: 'fancy-tool', section: '4.1', name: 'Fancy Tool' },
  { id: 'golem-frankenstein', section: '4.2', name: 'Golem/Frankenstein' },
  { id: 'infrastructure', section: '4.3', name: 'Infrastructure' },
  { id: 'bicycle-for-the-mind', section: '4.4', name: 'Bicycle for the Mind' },
  { id: 'demiurge', section: '5.1', name: 'Demiurge' },
  { id: 'technological-singularity', section: '5.2', name: 'Technological Singularity' },
  { id: 'noosphere-evolution', section: '5.3', name: 'Noosphere Evolution' },
  { id: 'apocalypse-revelation', section: '5.4', name: 'Apocalypse/Revelation' },
  { id: 'automation-labor-replacement', section: '6.1', name: 'Automation/Labor Replacement' },
  { id: 'corporation-as-lifeform', section: '6.2', name: 'Corporation as Lifeform' },
  { id: 'cultural-evolution', section: '6.3', name: 'Cultural Evolution' },
  { id: 'institutional-successor', section: '6.4', name: 'Institutional Successor' },
  { id: 'gaia-hypothesis-extension', section: '7.1', name: 'Gaia Hypothesis Extension' },
  { id: 'coral-reef-bleaching', section: '7.2', name: 'Coral Reef Bleaching' },
  { id: 'keystone-species', section: '7.3', name: 'Keystone Species' },
  { id: 'holobiont', section: '7.4', name: 'Holobiont' },
  { id: 'entropy-reversal', section: '8.1', name: 'Entropy Reversal' },
  { id: 'computational-substrate-liberation', section: '8.2', name: 'Computational Substrate Liberation' },
  { id: 'omega-point', section: '8.3', name: 'Omega Point' },
  { id: 'information-ecology', section: '8.4', name: 'Information Ecology' },
  { id: 'hegelian-synthesis', section: '9.1', name: 'Hegelian Synthesis' },
  { id: 'yin-yang-complementarity', section: '9.2', name: 'Yin-Yang Complementarity' },
  { id: 'eternal-return', section: '9.3', name: 'Eternal Return' },
  { id: 'colonial-invasion', section: '10.1', name: 'Colonial Invasion' },
  { id: 'capitalist-culmination', section: '10.2', name: 'Capitalist Culmination' },
  { id: 'patriarchal-overthrow-reproduction', section: '10.3', name: 'Patriarchal Overthrow/Reproduction' },
  { id: 'disembodiment', section: '10.4', name: 'Disembodiment' }
]

// Function to extract paradigm information from the document
function extractParadigmInfo(section: string, content: string) {
  // Find the section in the content
  const sectionRegex = new RegExp(`### ${section}[\\s\\S]*?(?=###|##|$)`, 'g')
  const sectionContent = content.match(sectionRegex)?.[0] || ''
  
  // Extract key information
  const coreMetaphorMatch = sectionContent.match(/Core metaphor[:\s]+([^\n]+)/i)
  const implicationsMatch = sectionContent.match(/Implications[:\s]+([^\n]+)/i)
  const benefitsMatch = sectionContent.match(/Benefits for AI Safety Research[:\s]+([^\n]+)/i)
  const risksMatch = sectionContent.match(/Risks for AI Safety Research[:\s]+([^\n]+)/i)
  const blurbMatch = sectionContent.match(/Safety Research Blurb[:\s]+([^\n]+)/i)
  
  // Extract proponents
  const proponentsSection = sectionContent.match(/Real-World Proponents[:\s\n]+([\\s\\S]*?)(?=\*\*Fictional|$)/i)?.[1] || ''
  const proponents = proponentsSection.match(/- \*\*[^*]+\*\*[^-\n]+/g)?.map(p => p.trim()) || []
  
  // Extract fictional examples
  const fictionalSection = sectionContent.match(/Fictional Exemplars[:\s\n]+([\\s\\S]*?)(?=###|##|$)/i)?.[1] || ''
  const fictional = fictionalSection.match(/- \*\*[^*]+\*\*[^-\n]+/g)?.map(f => f.trim()) || []
  
  return {
    coreMetaphor: coreMetaphorMatch?.[1]?.trim() || '',
    implications: implicationsMatch?.[1]?.trim() || '',
    benefits: benefitsMatch?.[1]?.trim() || '',
    risks: risksMatch?.[1]?.trim() || '',
    blurb: blurbMatch?.[1]?.trim() || '',
    proponents: proponents.slice(0, 4), // Limit to keep prompts reasonable
    fictional: fictional.slice(0, 4)
  }
}

// Generate prompts for all paradigms
let output = ''

paradigms.forEach((paradigm, index) => {
  const info = extractParadigmInfo(paradigm.section, paradigmsContent)
  
  // Skip if already added (first 4)
  if (index < 4) return
  
  const prompt = `
  '${paradigm.id}': {
    teacher: {
      academic: \`You embody the ${paradigm.name} paradigm - ${info.coreMetaphor}. ${info.implications}. Explain how this ${info.benefits}. Reference ${info.proponents.join(', ')}. Draw parallels to ${info.fictional.join(', ')}. ${info.blurb}\`,
      personal: \`[Personal teaching prompt for ${paradigm.name}]\`
    },
    adversary: {
      academic: \`Challenge the ${paradigm.name} paradigm. ${info.risks}. [Additional critique]\`,
      personal: \`[Personal adversary prompt for ${paradigm.name}]\`
    }
  },`
  
  output += prompt
})

// Write to file
fs.writeFileSync('paradigm-prompts-generated.txt', output)
console.log('Generated paradigm prompts saved to paradigm-prompts-generated.txt')