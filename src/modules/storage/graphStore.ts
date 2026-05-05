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
}

export const graphStore = new GraphStore();
