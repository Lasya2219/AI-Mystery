import { z } from 'zod';
import { evidenceTypes } from '../types.js';
const iso = z.string().min(1);
export const requestSchema = z.object({ premise: z.string().trim().min(30).max(1000), difficulty: z.enum(['easy','medium','hard']).default('medium'), tone: z.enum(['classic_detective','thriller','campus_mystery','locked_room','lighthearted']).default('classic_detective'), evidencePreferences: z.array(z.enum(evidenceTypes)).min(1).max(5).optional() });
const suspect = z.object({ id: z.string().min(1), name: z.string().min(1), role: z.string(), motive: z.string(), alibi: z.string(), publicDescription: z.string() });
const evidence = z.object({ id: z.string().min(1), type: z.enum(evidenceTypes), title: z.string().min(1), description: z.string().min(1), occurredAt: z.string().optional(), content: z.object({ text: z.string().min(1) }), assetAltText: z.string().optional() });
const timeline = z.object({ id: z.string().min(1), occurredAt: iso, description: z.string().min(1), relatedEvidenceIds: z.array(z.string()) });
export const generatedCaseSchema = z.object({ title: z.string().min(1), summary: z.string().min(1), adaptedPremise: z.string().min(1), incident: z.object({ description: z.string().min(1), location: z.string().min(1), occurredAt: iso }), suspects: z.array(suspect).min(3).max(5), culpritId: z.string().min(1), evidence: z.array(evidence).min(5).max(9), timeline: z.array(timeline).min(4), motive: z.string().min(1), explanation: z.string().min(1), revealNarrative: z.string().min(1), reasoningSteps: z.array(z.object({ claim: z.string().min(1), evidenceIds: z.array(z.string()).min(1) })).min(2), redHerringExplanations: z.array(z.object({ suspectId: z.string(), explanation: z.string(), evidenceIds: z.array(z.string()).min(1) })) });
export const notesSchema = z.object({ notes: z.string().max(5000) });
export const accusationSchema = z.object({ suspectId: z.string().min(1).max(80) });
export function validateMystery(input: unknown) {
 const parsed = generatedCaseSchema.parse(input);
 const suspectIds = new Set(parsed.suspects.map(s=>s.id)); const evidenceIds = new Set(parsed.evidence.map(e=>e.id));
 if (suspectIds.size !== parsed.suspects.length || evidenceIds.size !== parsed.evidence.length) throw new Error('Generated case contains duplicate IDs.');
 if (!suspectIds.has(parsed.culpritId)) throw new Error('Culprit must match one suspect.');
 for (const step of parsed.reasoningSteps) if (step.evidenceIds.some(id=>!evidenceIds.has(id))) throw new Error('Solution references missing evidence.');
 for (const item of parsed.redHerringExplanations) { if (!suspectIds.has(item.suspectId)) throw new Error('Red herring references a missing suspect.'); if (item.evidenceIds.some(id=>!evidenceIds.has(id))) throw new Error('Red herring references missing evidence.'); }
 for (const item of parsed.timeline) if (item.relatedEvidenceIds.some(id=>!evidenceIds.has(id))) throw new Error('Timeline references missing evidence.');
 return parsed;
}
