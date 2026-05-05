import Fastify from "fastify";
import { toTriples } from "./modules/transformation/toTriples";
import { hashTriples } from "./modules/integrity/hash";
import { graphStore } from "./modules/storage/graphStore";
import { Triple } from "./types/graph";

const app = Fastify({
  logger: true,
});

// Health check
app.get("/", async () => {
  return { status: "TrustGraph running" };
});

// Ingestion + transformation + integrity + storage
app.post("/data", async (request, reply) => {
  const body = request.body as Record<string, any>;

  // 1. Convert to graph triples (force type safety)
  const triples: Triple[] = toTriples(body);

  // 2. Create integrity hash
  const hash = hashTriples(triples);

  // 3. Store in memory graph
  graphStore.add(triples);

  // Logging for debugging/traceability
  app.log.info({
    received: body,
    triples,
    hash,
  });

  // 4. Return verifiable record
  return {
    message: "Verified graph record stored",
    hash,
    triples,
  };
});

// Query endpoint
app.get("/graph/:subject", async (request) => {
  const { subject } = request.params as { subject: string };

  const result = graphStore.findBySubject(subject);

  return {
    subject,
    triples: result,
  };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });

    console.log("Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
