export const evidenceTypes = ['chat', 'image', 'cctv', 'document', 'timeline'] as const;
export type EvidenceType = typeof evidenceTypes[number];
export type Difficulty = 'easy' | 'medium' | 'hard';
export interface Suspect { id: string; name: string; role: string; motive: string; alibi: string; publicDescription: string }
export interface Evidence { id: string; type: EvidenceType; title: string; description: string; occurredAt?: string; content: { text: string }; assetAltText?: string }
export interface TimelineEvent { id: string; occurredAt: string; description: string; relatedEvidenceIds: string[] }
export interface MysteryCase {
  id: string; schemaVersion: number; title: string; summary: string; originalPremise: string; adaptedPremise: string; difficulty: Difficulty; tone: string;
  incident: { description: string; location: string; occurredAt: string }; suspects: Suspect[]; evidence: Evidence[]; timeline: TimelineEvent[];
  solution: { culpritId: string; motive: string; explanation: string; revealNarrative: string; reasoningSteps: { claim: string; evidenceIds: string[] }[]; redHerringExplanations: { suspectId: string; explanation: string; evidenceIds: string[] }[] };
  generation: { provider: 'gemini' | 'demo'; model: string; promptVersion: string; generatedAt: Date }; createdAt: Date; expiresAt: Date;
}
export interface Playthrough { id: string; caseId: string; tokenHash: string; status: 'in_progress'|'revealed'; notes: string; selectedSuspectId?: string; isCorrect?: boolean; startedAt: Date; submittedAt?: Date; }
