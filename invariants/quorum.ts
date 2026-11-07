/**
 * M-of-N oracle quorum with per-oracle strike accounting (educational).
 * No live oracles. No wasm. No broadcast.
 */

export const MIN_ORACLES = 2;
export const MAX_ORACLES = 16;
export const MIN_THRESHOLD = 1;
export const MAX_STRIKES = 5;
export const ENTROPY_HEX = 64;

export type Oracle = {
  id: string;
  strikes: number;
  suspended: boolean;
};

export type Report = {
  oracleId: string;
  entropy: string;
  reportedTs: number;
};

export type QuorumConfig = {
  threshold: number;
  deadlineTs: number;
};

export type Session = {
  id: number;
  config: QuorumConfig;
  oracles: Map<string, Oracle>;
  reports: Map<string, Report>;
  phase: "open" | "quorum" | "failed";
  combined: string | null;
};

export type ActionResult =
  | { ok: true; session: Session }
  | { ok: false; reason: string; session?: Session };

const NAME = /^[a-z0-9_]{1,32}$/;
const HEX64 = /^[0-9a-f]{64}$/;

function cloneSession(s: Session): Session {
  return {
    ...s,
    oracles: new Map(s.oracles),
    reports: new Map(s.reports),
  };
}

export function openSession(input: {
  id: number;
  oracleIds: string[];
  threshold: number;
  deadlineTs: number;
}): Session {
  if (!Number.isInteger(input.id) || input.id < 1) throw new Error("bad id");
  if (
    !Array.isArray(input.oracleIds) ||
    input.oracleIds.length < MIN_ORACLES ||
    input.oracleIds.length > MAX_ORACLES
  ) {
    throw new Error("bad oracles");
  }
  if (
    !Number.isInteger(input.threshold) ||
    input.threshold < MIN_THRESHOLD ||
    input.threshold > input.oracleIds.length
  ) {
    throw new Error("bad threshold");
  }
  if (!Number.isInteger(input.deadlineTs) || input.deadlineTs < 0) {
    throw new Error("bad deadline");
  }
  const oracles = new Map<string, Oracle>();
  for (const id of input.oracleIds) {
    if (!NAME.test(id)) throw new Error("bad oracle id");
    if (oracles.has(id)) throw new Error("duplicate oracle");
    oracles.set(id, { id, strikes: 0, suspended: false });
  }
  return {
    id: input.id,
    config: { threshold: input.threshold, deadlineTs: input.deadlineTs },
    oracles,
    reports: new Map(),
    phase: "open",
    combined: null,
  };
}

function xorHex(a: string, b: string): string {
  const out: string[] = [];
  for (let i = 0; i < 64; i += 2) {
    const x = parseInt(a.slice(i, i + 2), 16) ^ parseInt(b.slice(i, i + 2), 16);
    out.push(x.toString(16).padStart(2, "0"));
  }
  return out.join("");
}

function combineEntropy(reports: Report[]): string {
  let acc = "00".repeat(32);
  const sorted = [...reports].sort((x, y) => x.oracleId.localeCompare(y.oracleId));
  for (const r of sorted) {
    acc = xorHex(acc, r.entropy);
  }
  return acc;
}

export function submitReport(session: Session, report: Report): ActionResult {
  if (session.phase !== "open") return { ok: false, reason: "bad phase" };
  const next = cloneSession(session);
  const oracle = next.oracles.get(report.oracleId);
  if (!oracle) return { ok: false, reason: "unknown oracle" };
  if (oracle.suspended) return { ok: false, reason: "suspended" };
  if (next.reports.has(report.oracleId)) return { ok: false, reason: "duplicate" };
  const entropy = report.entropy.toLowerCase();
  if (!HEX64.test(entropy)) return { ok: false, reason: "bad entropy" };
  if (!Number.isInteger(report.reportedTs) || report.reportedTs < 0) {
    return { ok: false, reason: "bad ts" };
  }
  if (report.reportedTs > next.config.deadlineTs) {
    const strikes = oracle.strikes + 1;
    const suspended = strikes >= MAX_STRIKES;
    next.oracles.set(report.oracleId, { ...oracle, strikes, suspended });
    return { ok: false, reason: "late", session: next };
  }
  next.reports.set(report.oracleId, {
    oracleId: report.oracleId,
    entropy,
    reportedTs: report.reportedTs,
  });
  if (next.reports.size >= next.config.threshold) {
    next.phase = "quorum";
    next.combined = combineEntropy([...next.reports.values()]);
  }
  return { ok: true, session: next };
}

export function closeDeadline(session: Session, nowTs: number): ActionResult {
  if (session.phase === "quorum") return { ok: false, reason: "already quorum" };
  if (session.phase === "failed") return { ok: false, reason: "already failed" };
  if (!Number.isInteger(nowTs) || nowTs < session.config.deadlineTs) {
    return { ok: false, reason: "too early" };
  }
  const next = cloneSession(session);
  for (const [id, oracle] of next.oracles) {
    if (!next.reports.has(id) && !oracle.suspended) {
      const strikes = oracle.strikes + 1;
      next.oracles.set(id, {
        ...oracle,
        strikes,
        suspended: strikes >= MAX_STRIKES,
      });
    }
  }
  if (next.reports.size >= next.config.threshold) {
    next.phase = "quorum";
    next.combined = combineEntropy([...next.reports.values()]);
  } else {
    next.phase = "failed";
  }
  return { ok: true, session: next };
}

export function isSuspended(session: Session, oracleId: string): boolean {
  return session.oracles.get(oracleId)?.suspended === true;
}
