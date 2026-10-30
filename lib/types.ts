export type Point = { date: string; value: number }; // date = ISO yyyy-mm-dd
export type T = { en: string; pt: string };
export type Result<D> = { ok: true; data: D } | { ok: false; error: string };
