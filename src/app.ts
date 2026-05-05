import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

import { toTriples } from "./modules/transformation/toTriples";
import { hashTriples } from "./modules/integrity/hash";
import { graphStore } from "./modules/storage/graphStore";
import { Triple } from "./types/graph";
import { neo4jStore } from "./modules/storage/neo4jStore";

const app = Fastify({
  logger: true,
});

// Toggle (so Neo4j doesn’t break your app)
const USE_NEO4J = false;

/* ----------------------------
   STATIC FRONTEND (ADD THIS HERE)
----------------------------- */
app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

/* ----------------------------
   ROUTES
----------------------------- */

// Health check
app.get("/", async () => {
  return { status: "TrustGraph running" };
});

// Ingestion
app.post("/data", async (request) => {
  const body = request.body as Record<string, any>;

  const triples: Triple[] = toTriples(body);
  const hash = hashTriples(triples);

  if (USE_NEO4J) {
    try {
      await neo4jStore.add(triples);
    } catch (err) {
      app.log.error("Neo4j failed, falling back to memory");
      graphStore.add(triples);
    }
  } else {
    graphStore.add(triples);
  }

  app.log.info({
    received: body,
    triples,
    hash,
  });

  return {
    message: "Verified graph record stored",
    hash,
    triples,
  };
});

// 🔎 Direct lookup
app.get("/graph/:subject", async (request) => {
  const { subject } = request.params as { subject: string };

  return {
    subject,
    triples: graphStore.findBySubject(subject),
  };
});

// 🔗 Connected (1-hop)
app.get("/graph/connected/:subject", async (request) => {
  const { subject } = request.params as { subject: string };

  return graphStore.findConnected(subject);
});

// 🧠 Multi-hop exploration
app.get("/graph/explore/:subject", async (request) => {
  const { subject } = request.params as { subject: string };

  return graphStore.explore(subject, 3);
});

// 📊 Full graph dump
app.get("/graph", async () => {
  return {
    triples: graphStore.getAll(),
  };
});

/* ----------------------------
   START SERVER
----------------------------- */
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
