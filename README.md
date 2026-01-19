# 🚀 Backend Copilot AI

**AI-powered backend analysis & generator tool** - Not just another chatbot. A professional backend audit system with rule-based validation and AI-powered insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Fastify](https://img.shields.io/badge/Fastify-5.7.1-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Why This Exists

Traditional AI coding assistants generate code without understanding backend architecture. This tool **analyzes first, suggests second** - providing professional-grade insights that make tech leads raise their eyebrows (in a good way).

## 🎯 Core Principles

✅ **Rule-based first, AI second** - No hallucinations, just facts  
✅ **Structured output only** - No free-form text, always JSON schemas  
✅ **Context-aware analysis** - Understands your backend patterns  
✅ **Gradual enhancement** - AI only when rules are insufficient  

## 🚀 Features

### ✅ **v1.0 - The Foundation** (Current)
- **OpenAPI Spec Generator** - From code to professional API documentation
- **Controller Analyzer** - Complexity, duplication, and validation insights
- **Auth/RBAC Flow Validator** - Security gap detection
- **Rule-based Pre-check** - Syntax & schema validation before AI

### 🔄 **v1.1 - Enhanced Analysis**
- GitHub/GitLab integration
- Performance profiling suggestions
- Database query analysis
- Rate limiting recommendations

### 🎯 **v2.0 - Advanced**
- Multi-language support (Go, Python, Java)
- Auto-test generation
- Architecture pattern suggestions
- Compliance checks (GDPR, PCI-DSS, HIPAA)

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify (Modern, fast, TypeScript-friendly)
- **Validation**: Zod (Schema-first validation)
- **AI/LLM**: OpenAI GPT-4 / Local LLM options
- **Code Analysis**: TypeScript AST Parser
- **API Docs**: Fastify Swagger + Swagger UI

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/backend-copilot-ai.git
cd backend-copilot-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env

# Start development server
npm run dev
```

## ⚡ Quick Start
1. Analyze Your Controller
```bash
curl -X POST http://localhost:3000/api/analyze/controller \
  -H "Content-Type: application/json" \
  -d '{
    "code": "app.post(\"/api/users\", async (req, res) => { const user = req.body; db.save(user); res.json(user); })"
  }'
```

2. Generate OpenAPI Spec
```bash
curl -X POST http://localhost:3000/api/generate/openapi \
  -H "Content-Type: application/json" \
  -d '{
    "code": "app.get(\"/api/users/:id\", authMiddleware, getUser)"
  }'
```

3. Check Health
```bash
curl http://localhost:3000/health
```

## 📊 Sample Output
```json
{
  "complexity": {
    "score": 45,
    "level": "HIGH",
    "issues": ["nested_callbacks", "long_function", "missing_validation"]
  },
  "security_risk": "MEDIUM",
  "suggestions": [
    "Extract validation to middleware",
    "Add error handling for database calls",
    "Implement rate limiting"
  ]
}
```

## 🏗️ Project Structure
```bash
backend-copilot-ai/
├── src/
│   ├── analyzers/           # Code analysis modules
│   ├── generators/         # OpenAPI/documentation generators
│   ├── rules/             # Rule-based validators (FIRST!)
│   ├── ai/               # LLM integration with guardrails
│   ├── routes/           # API endpoints
│   └── utils/           # Shared utilities
├── schemas/             # Zod validation schemas
├── tests/              # Test suites
└── docs/               # Documentation
```

## 🔧 Development
```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with watch
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## 🔐 Environment Variables
Create .env file:
```env
NODE_ENV=development
PORT=3000
OPENAI_API_KEY=your_key_here  # Optional for v1
```

## 📈 Roadmap

### Phase 1: Core Analysis (Current)
- Basic syntax checking

- OpenAPI generation

- Controller analysis

- Auth flow validation

- Rule engine completion

### Phase 2: Enhanced Features
- GitHub integration

- Test generation

- Performance insights

- Database query analysis

### Phase 3: Enterprise Ready
- Multi-language support

- Team collaboration features

- Compliance reporting

- Plugin system

## 🛡️ Security

- No code execution - only static analysis

- API keys stored locally

- All AI calls are opt-in

- Rule-based validation prevents harmful suggestions

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE).

---

Made with ❤️ for backend developers who care about quality

This is not just another AI tool - it's your backend architect assistant.