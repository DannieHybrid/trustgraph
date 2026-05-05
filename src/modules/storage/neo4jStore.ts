import { driver } from "../../config/db";
import { Triple } from "../../types/graph";

export class Neo4jStore {
  async add(triples: Triple[]) {
    const session = driver.session();

    try {
      for (const t of triples) {
        await session.run(
          `
          MERGE (s:Entity {id: $subject})
          MERGE (o:Entity {id: $object})
          MERGE (s)-[:RELATION {type: $predicate}]->(o)
          `,
          {
            subject: t.subject,
            predicate: t.predicate,
            object: String(t.object),
          }
        );
      }
    } finally {
      await session.close();
    }
  }

  async findBySubject(subject: string) {
    const session = driver.session();

    try {
      const result = await session.run(
        `
        MATCH (s:Entity {id: $subject})-[r]->(o)
        RETURN s.id AS subject, type(r) AS predicate, o.id AS object
        `,
        { subject }
      );

      return result.records.map((r) => ({
        subject: r.get("subject"),
        predicate: r.get("predicate"),
        object: r.get("object"),
      }));
    } finally {
      await session.close();
    }
  }
}

export const neo4jStore = new Neo4jStore();
