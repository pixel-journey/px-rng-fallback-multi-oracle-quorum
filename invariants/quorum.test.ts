import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_STRIKES,
  closeDeadline,
  isSuspended,
  openSession,
  submitReport,
} from "./quorum.ts";

const T0 = 1_700_000_000;
const E1 = "11".repeat(32);
const E2 = "22".repeat(32);

function base(threshold = 2) {
  return openSession({
    id: 1,
    oracleIds: ["ora_a", "ora_b", "ora_c"],
    threshold,
    deadlineTs: T0 + 60,
  });
}

test("open session tracks oracles and threshold", () => {
  const s = base(2);
  assert.equal(s.phase, "open");
  assert.equal(s.oracles.size, 3);
  assert.equal(s.config.threshold, 2);
});

test("two reports reach 2-of-3 quorum", () => {
  let s = base(2);
  let r = submitReport(s, { oracleId: "ora_a", entropy: E1, reportedTs: T0 + 10 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  s = r.session;
  assert.equal(s.phase, "open");
  r = submitReport(s, { oracleId: "ora_b", entropy: E2, reportedTs: T0 + 20 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.session.phase, "quorum");
  assert.ok(r.session.combined);
  assert.equal(r.session.combined!.length, 64);
});

test("duplicate report refused", () => {
  let r = submitReport(base(), {
    oracleId: "ora_a",
    entropy: E1,
    reportedTs: T0 + 5,
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  r = submitReport(r.session, {
    oracleId: "ora_a",
    entropy: E2,
    reportedTs: T0 + 6,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "duplicate");
});

test("late report strikes and does not count", () => {
  const s = base(2);
  const r = submitReport(s, {
    oracleId: "ora_a",
    entropy: E1,
    reportedTs: T0 + 61,
  });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.equal(r.reason, "late");
    assert.equal(r.session!.oracles.get("ora_a")!.strikes, 1);
    assert.equal(r.session!.reports.size, 0);
  }
});

test("silent oracles are struck on closeDeadline", () => {
  let s = base(2);
  let r = submitReport(s, { oracleId: "ora_a", entropy: E1, reportedTs: T0 + 1 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  s = r.session;
  r = closeDeadline(s, T0 + 60);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.session.phase, "failed");
  assert.equal(r.session.oracles.get("ora_b")!.strikes, 1);
  assert.equal(r.session.oracles.get("ora_c")!.strikes, 1);
  assert.equal(r.session.oracles.get("ora_a")!.strikes, 0);
});

test("MAX_STRIKES suspends oracle", () => {
  let s = openSession({
    id: 2,
    oracleIds: ["ora_a", "ora_b"],
    threshold: 2,
    deadlineTs: T0,
  });
  for (let i = 0; i < MAX_STRIKES; i++) {
    const r = closeDeadline(s, T0 + i);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    s = r.session;
    s = { ...s, phase: "open", reports: new Map() };
  }
  assert.equal(isSuspended(s, "ora_a"), true);
  assert.equal(isSuspended(s, "ora_b"), true);
});

test("unknown oracle refused", () => {
  const r = submitReport(base(), {
    oracleId: "ora_x",
    entropy: E1,
    reportedTs: T0,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "unknown oracle");
});

test("bad entropy refused", () => {
  const r = submitReport(base(), {
    oracleId: "ora_a",
    entropy: "zz",
    reportedTs: T0,
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "bad entropy");
});

test("bad threshold and duplicate ids refused", () => {
  assert.throws(
    () =>
      openSession({
        id: 1,
        oracleIds: ["ora_a", "ora_b"],
        threshold: 3,
        deadlineTs: T0,
      }),
    /bad threshold/,
  );
  assert.throws(
    () =>
      openSession({
        id: 1,
        oracleIds: ["ora_a", "ora_a"],
        threshold: 1,
        deadlineTs: T0,
      }),
    /duplicate oracle/,
  );
});

test("combined entropy is deterministic xor by oracle id order", () => {
  let s = base(2);
  let r = submitReport(s, { oracleId: "ora_b", entropy: E2, reportedTs: T0 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  r = submitReport(r.session, { oracleId: "ora_a", entropy: E1, reportedTs: T0 + 1 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  const combined = r.session.combined!;
  s = base(2);
  r = submitReport(s, { oracleId: "ora_a", entropy: E1, reportedTs: T0 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  r = submitReport(r.session, { oracleId: "ora_b", entropy: E2, reportedTs: T0 + 1 });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.session.combined, combined);
});
