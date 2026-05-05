import { Triple } from "../../types/graph";

export function toTriples(data: any): Triple[] {
  const subject = `Product:${data.batch || "unknown"}`;

  return Object.entries(data).map(([key, value]) => ({
    subject,
    predicate: key,
    object: String(value),
  }));
}
