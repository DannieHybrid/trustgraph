import crypto from "crypto";

export function hashTriples(triples: any[]) {
  const normalized = JSON.stringify(triples);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
