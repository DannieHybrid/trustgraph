import { Triple } from "../../types/graph";

class GraphStore {
  private triples: Triple[] = [];

  add(triples: Triple[]) {
    this.triples.push(...triples);
  }

  getAll() {
    return this.triples;
  }

  findBySubject(subject: string) {
    return this.triples.filter((t) => t.subject === subject);
  }

  findConnected(subject: string) {
    const direct = this.triples.filter((t) => t.subject === subject);

    const objects = direct.map((t) => t.object);

    const related = this.triples.filter((t) => objects.includes(t.subject));

    return {
      direct,
      related,
    };
  }

  // 🧠 NEW: multi-hop graph exploration (real graph behavior)
  explore(subject: string, depth: number = 2) {
    const visited = new Set<string>();
    const result: Triple[][] = [];

    let currentLevelSubjects = [subject];

    for (let i = 0; i < depth; i++) {
      const levelTriples = this.triples.filter((t) =>
        currentLevelSubjects.includes(t.subject)
      );

      result.push(levelTriples);

      const nextLevelObjects = levelTriples.map((t) => t.object);

      currentLevelSubjects = nextLevelObjects.filter((obj) => {
        if (visited.has(obj)) return false;
        visited.add(obj);
        return true;
      });
    }

    return {
      depth,
      levels: result,
    };
  }
}

export const graphStore = new GraphStore();
