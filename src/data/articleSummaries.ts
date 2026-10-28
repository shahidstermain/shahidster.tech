export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured: boolean;
  seriesPosition?: string;
  seoKeywords?: string[];
}

export const articleSummaries: ArticleSummary[] = [
  {
    "slug": "parsing-10gb-database-bundles-locally",
    "title": "Out-of-Memory No More: Parsing 10GB Database Diagnostic Bundles Locally",
    "description": "How I built S2 Report Sniffer's bounded-memory stream processing engine to ingest massive distributed database logs without crashing.",
    "category": "Systems Engineering",
    "readTime": "7 min read",
    "date": "May 2026",
    "featured": true,
    "seoKeywords": [
      "SingleStore",
      "OOM",
      "memory management",
      "Python generators",
      "diagnostic parsing",
      "distributed systems",
      "FastAPI"
    ]
  },
  {
    "slug": "cap-theorem-production",
    "title": "Understanding CAP Theorem in Production",
    "description": "A practical guide to navigating consistency, availability, and partition tolerance trade-offs when architecting distributed databases.",
    "category": "Fundamentals",
    "readTime": "8 min read",
    "date": "Nov 2024",
    "featured": false,
    "seriesPosition": "Part 1 of 14",
    "seoKeywords": [
      "CAP theorem",
      "distributed systems",
      "consistency vs availability",
      "partition tolerance"
    ]
  },
  {
    "slug": "pragmatic-consistency",
    "title": "Pragmatic Consistency: When Stronger Isn't Better",
    "description": "The case against defaulting to strict serializability. Mapping business requirements to the lowest viable consistency level for maximum scalability.",
    "category": "Architecture",
    "readTime": "10 min read",
    "date": "Oct 2024",
    "featured": false,
    "seriesPosition": "Part 2 of 14",
    "seoKeywords": [
      "consistency levels",
      "serializability",
      "isolation levels",
      "database scalability"
    ]
  },
  {
    "slug": "latency-tax-separated-compute-storage",
    "title": "The Latency Tax of Separated Compute and Storage",
    "description": "A critical analysis of disaggregated storage architectures vs shared-nothing systems. Examining network I/O penalties and why caching layers fail for high-concurrency point lookups.",
    "category": "Architecture",
    "readTime": "14 min read",
    "date": "Sep 2024",
    "featured": true,
    "seriesPosition": "Part 3 of 14",
    "seoKeywords": [
      "disaggregated storage",
      "compute storage separation",
      "NVMe latency",
      "cache coherency",
      "HTAP architecture"
    ]
  },
  {
    "slug": "data-skew-distributed-joins",
    "title": "Surviving Data Skew in Distributed Joins",
    "description": "How uneven data distribution destroys shuffle join performance. Contrasting broadcast joins vs repartitioning and why query optimizers often miss skew.",
    "category": "Performance",
    "readTime": "13 min read",
    "date": "Aug 2024",
    "featured": false,
    "seriesPosition": "Part 4 of 14",
    "seoKeywords": [
      "data skew",
      "distributed joins",
      "shuffle join",
      "broadcast join",
      "Spark AQE"
    ]
  },
  {
    "slug": "non-blocking-ddl-myth",
    "title": "Non-Blocking DDL is a Myth: Schema Evolution at Scale",
    "description": "How lock propagation and metadata sync cause latency spikes even in 'online' DDL. Defensive patterns for schema migration using expansion/contraction strategies.",
    "category": "Deep Dive",
    "readTime": "11 min read",
    "date": "Jul 2024",
    "featured": true,
    "seriesPosition": "Part 5 of 14",
    "seoKeywords": [
      "online DDL",
      "schema migration",
      "metadata locks",
      "database migration patterns",
      "expansion contraction"
    ]
  },
  {
    "slug": "defensive-ingestion-backpressure-htap",
    "title": "Defensive Ingestion: Managing Backpressure in HTAP Systems",
    "description": "Protecting HTAP systems from ingestion floods. Why Kafka alone isn't enough and how to implement database-aware flow control.",
    "category": "Operations",
    "readTime": "12 min read",
    "date": "Jun 2024",
    "featured": false,
    "seriesPosition": "Part 6 of 14",
    "seoKeywords": [
      "HTAP systems",
      "backpressure",
      "Kafka ingestion",
      "flow control",
      "resource isolation"
    ]
  },
  {
    "slug": "query-optimization-petabyte-scale",
    "title": "Query Optimization at Petabyte Scale",
    "description": "Lessons learned from debugging slow queries across distributed nodes. Execution plans, index strategies, and memory management.",
    "category": "Deep Dive",
    "readTime": "12 min read",
    "date": "May 2024",
    "featured": false,
    "seriesPosition": "Part 7 of 14",
    "seoKeywords": [
      "query optimization",
      "execution plans",
      "covering indexes",
      "partition pruning",
      "petabyte scale"
    ]
  },
  {
    "slug": "incident-response-database-engineers",
    "title": "Incident Response for Database Engineers",
    "description": "A battle-tested playbook for handling production database incidents. From detection to resolution to post-mortem.",
    "category": "Operations",
    "readTime": "10 min read",
    "date": "Apr 2024",
    "featured": false,
    "seriesPosition": "Part 8 of 14",
    "seoKeywords": [
      "incident response",
      "database postmortem",
      "production debugging",
      "runbooks",
      "on-call"
    ]
  },
  {
    "slug": "sharding-strategies-that-work",
    "title": "Sharding Strategies That Actually Work",
    "description": "Comparing hash, range, and geo-based sharding with real performance benchmarks and migration patterns.",
    "category": "Architecture",
    "readTime": "15 min read",
    "date": "Mar 2024",
    "featured": false,
    "seriesPosition": "Part 9 of 14",
    "seoKeywords": [
      "database sharding",
      "hash sharding",
      "range sharding",
      "geo sharding",
      "resharding migration"
    ]
  },
  {
    "slug": "singlestore-production-lessons",
    "title": "Lessons Learned Running SingleStore in Production",
    "description": "Real-world lessons from operating SingleStore clusters—from memory sizing and query pitfalls to silent failures and what I'd do differently next time.",
    "category": "Operations",
    "readTime": "11 min read",
    "date": "Apr 2026",
    "featured": true,
    "seriesPosition": "Part 10 of 14",
    "seoKeywords": [
      "SingleStore",
      "memory sizing",
      "columnstore",
      "replication",
      "production operations",
      "database reliability"
    ]
  },
  {
    "slug": "singlestore-execution-engine",
    "title": "Understanding the SingleStore Execution Engine",
    "description": "A field guide to SingleStore's execution engine—how aggregators and leaves work, why data movement is expensive, and how to read an execution plan like a detective.",
    "category": "Deep Dive",
    "readTime": "10 min read",
    "date": "Mar 2026",
    "featured": false,
    "seriesPosition": "Part 11 of 14",
    "seoKeywords": [
      "SingleStore",
      "execution engine",
      "shard keys",
      "query plan",
      "distributed joins",
      "data locality"
    ]
  },
  {
    "slug": "indexes-everywhere-bad-strategy",
    "title": "Why Indexes Everywhere Is a Bad Strategy",
    "description": "Indexes look like free speed—until they quietly tax every write, consume memory, and evict the data you actually need.",
    "category": "Performance",
    "readTime": "8 min read",
    "date": "Feb 2026",
    "featured": false,
    "seriesPosition": "Part 12 of 14",
    "seoKeywords": [
      "SingleStore",
      "database indexing",
      "write amplification",
      "index selectivity",
      "query performance"
    ]
  },
  {
    "slug": "your-database-is-probably-fine",
    "title": "Your Database Is Probably Fine",
    "description": "Most outages blamed on the database aren't the database's fault—they're query-shape problems in disguise.",
    "category": "Operations",
    "readTime": "8 min read",
    "date": "Jan 2026",
    "featured": false,
    "seriesPosition": "Part 13 of 14",
    "seoKeywords": [
      "database performance",
      "query optimization",
      "SRE",
      "SingleStore",
      "production debugging"
    ]
  },
  {
    "slug": "vertical-beats-horizontal-scaling",
    "title": "When Vertical Scaling Beats Horizontal",
    "description": "Horizontal scale sounds heroic—until you realize it adds failure modes, latency, and complexity your workload never needed.",
    "category": "Architecture",
    "readTime": "9 min read",
    "date": "Dec 2025",
    "featured": false,
    "seriesPosition": "Part 14 of 14",
    "seoKeywords": [
      "vertical scaling",
      "horizontal scaling",
      "distributed systems",
      "architecture decisions",
      "database capacity planning"
    ]
  }
];
