# Documentation

## Project Documentation

This directory contains comprehensive documentation for the AI Safety Research Compiler project.

### Deployment & Safety Documentation

**Start Here:**
- **[DEPLOYMENT_SAFETY_GUIDE.md](./DEPLOYMENT_SAFETY_GUIDE.md)** - 🔒 Comprehensive guide to all safety measures for protecting personal data during deployment

**Deployment Guides:**
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment options (Vercel + databases, Railway, VPS)
- **[SIMPLE_DEPLOYMENT.md](./SIMPLE_DEPLOYMENT.md)** - Quick deployment options for getting started
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Legacy deployment guide (GitHub Pages, static export)

**Data Privacy:**
- **[DATA_PRIVACY_STRATEGY.md](./DATA_PRIVACY_STRATEGY.md)** - Strategy for separating personal and public data
- **[DATABASE_PATTERNS.md](./DATABASE_PATTERNS.md)** - Correct patterns for database interactions
- **[DATABASE_MIGRATION_SUMMARY.md](./DATABASE_MIGRATION_SUMMARY.md)** - Database migration history

**Other Documentation:**
- **Development Notes** - See `/development-resources/notes.md` for implementation details and technical decisions

### Documentation Structure

```
docs/
├── README.md           # This file
└── DEPLOYMENT.md      # Multi-platform deployment guide

development-resources/
└── notes.md           # Development journal and technical notes
```

### Root-Level Documentation

The following documentation remains at the root level for visibility:

- **README.md** - Project overview and quick start
- **CURRICULUM.md** - Detailed curriculum structure
- **VIEW_MODE_IMPLEMENTATION.md** - View mode feature documentation
- **JOURNEY_IMPLEMENTATION.md** - Interactive journey feature documentation
- **LICENSE** - MIT license

### Contributing

When adding new documentation:
- Platform/deployment guides → `docs/`
- Feature implementation details → Root level with descriptive name
- Development notes → `development-resources/notes.md`