export const INTENTS = [
  'RENTAL',
  'EVENT',
  'RESTAURANT',
  'SPONSOR',
  'SUPPORT',
  'GENERAL',
] as const;

export type Intent = (typeof INTENTS)[number];
