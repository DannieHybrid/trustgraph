# TrustGraph

TrustGraph is a Node.js-based knowledge graph system that transforms structured data into verifiable graph relationships using triples, hashing, and queryable graph storage.

---

## 🚀 What it does

TrustGraph takes JSON input and converts it into a graph structure:

### Example input:

```json
{
  "product": "Cocoa",
  "origin": "Nigeria",
  "batch": "B123"
}

Becomes:
Product:B123 → product → Cocoa
Product:B123 → origin → Nigeria
Product:B123 → batch → B123

Core Features
JSON → RDF-style triple conversion
Deterministic graph hashing (integrity layer)
In-memory graph storage
Query by subject
Relationship traversal (connected nodes)
Multi-hop graph exploration
REST API built with Fastify

API Endpoints
Ingest data
POST /data
Get triples by subject
GET /graph/:subject
Get connected nodes
GET /graph/connected/:subject

Explore multi-hop relationships
GET /graph/explore/:subject
Get full graph
GET /graph

Architecture
Input JSON
   ↓
toTriples()
   ↓
Hashing layer (integrity)
   ↓
GraphStore (in-memory)
   ↓
Query API

Example Usage

curl -X POST http://localhost:3000/data \
-H "Content-Type: application/json" \
-d '{"product":"Cocoa","origin":"Nigeria","batch":"B123"}'
🔮 Future Improvements
Neo4j persistent graph storage
Decentralized Knowledge Graph integration (OriginTrail)
Graph visualization UI
Distributed verification layer

Tech Stack
Node.js
Fastify
TypeScript
Graph data modeling

Status

MVP complete — core graph engine functional.
```
