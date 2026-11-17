import type { ProfileDraft } from './profileDraft';

export type ProfileDraftErrors = Partial<Record<keyof ProfileDraft, string>>;
