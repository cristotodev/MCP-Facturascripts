# Developer Onboarding Guide
## MCP FacturaScripts Project

**Welcome to the MCP FacturaScripts development team!** This guide will help you get up and running quickly with our Model Context Protocol server that integrates with FacturaScripts ERP systems.

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Development Environment Setup](#-development-environment-setup)
3. [Codebase Architecture](#-codebase-architecture)
4. [Development Workflows](#-development-workflows)
5. [First Tasks & Learning Path](#-first-tasks--learning-path)
6. [Team Communication](#-team-communication)
7. [Resources & Training](#-resources--training)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

### What We Build
**MCP FacturaScripts** is a comprehensive Model Context Protocol (MCP) server that provides AI assistants (like Claude) with direct access to FacturaScripts ERP data. We enable natural language queries against business data including invoices, customers, products, accounting records, and more.

### Key Stats (v1.0.1)
- **56 MCP Resources**: Complete FacturaScripts API coverage
- **57 Interactive Tools**: Including specialized business logic tools
- **358 Tests**: Comprehensive unit & integration testing
- **8 Module Categories**: Modular, well-organized architecture
- **Production Ready**: Live API integration, error handling, monitoring

### Business Context
FacturaScripts is a popular Spanish ERP system used by businesses for:
- **Accounting & Finance**: Chart of accounts, journal entries, bank management
- **Sales Operations**: Customer management, invoices, orders, delivery notes
- **Purchasing**: Supplier management, purchase orders, supplier invoices
- **Inventory**: Product catalog, stock levels, warehouse management
- **System Administration**: User management, API access, configuration

### Technology Stack
- **Runtime**: Node.js 18+ (ESM modules)
- **Language**: TypeScript (strict mode)
- **Framework**: Model Context Protocol SDK
- **HTTP Client**: Axios for FacturaScripts REST API v3
- **Testing**: Vitest (unit & integration tests)
- **Validation**: Zod for environment configuration
- **Build**: TypeScript compiler
- **Development**: tsx for TypeScript execution

---

## 🚀 Development Environment Setup

### Prerequisites Checklist
- [ ] **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- [ ] **Git**: For version control
- [ ] **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - Vitest extension for testing
  - GitLens for Git integration
- [ ] **FacturaScripts Access**: Development instance or API access

### Step-by-Step Setup

#### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/cristotodev/MCP_Facturascripts.git
cd MCP_Facturascripts

# Install dependencies
npm install

# Verify installation
npm run build
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file with your FacturaScripts configuration:
```env
# FacturaScripts API Configuration
FS_BASE_URL=http://your-facturascripts-domain.com
FS_API_VERSION=3
FS_API_TOKEN=your-api-token-here
```

#### 3. Verify Setup
```bash
# Build the project
npm run build

# Run tests (should see 358 tests pass)
npm run test:run

# Start development server
npm run dev
```

#### 4. Test with MCP Inspector
```bash
# Install and run MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp
```

### Development Tools Setup

#### VS Code Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "vitest.enable": true
}
```

#### Git Configuration
```bash
# Set up conventional commits
npm run changelog  # Generates changelog from commits
```

---

## 🏗️ Codebase Architecture

### Project Structure Overview
```
src/
├── env.ts                     # Environment validation (Zod)
├── index.ts                   # Main MCP server entry point
├── fs/
│   └── client.ts             # FacturaScripts API client
├── types/
│   └── facturascripts.ts     # TypeScript interfaces
├── utils/
│   └── filterParser.ts       # Dynamic filtering utilities
└── modules/                   # 📦 MODULAR ARCHITECTURE
    ├── core-business/         # Essential business entities
    │   ├── clientes/          # Customer management
    │   ├── productos/         # Product catalog
    │   ├── proveedores/       # Supplier management
    │   └── stocks/            # Inventory management
    ├── sales-orders/          # Sales operations
    │   ├── pedidoclientes/    # Customer orders
    │   ├── facturaclientes/   # Customer invoices
    │   ├── presupuestoclientes/ # Customer quotes
    │   └── line-items/        # Document line items
    ├── purchasing/            # Procurement operations
    ├── accounting/            # General accounting
    ├── finance/               # Financial management
    ├── configuration/         # System configuration
    ├── system/                # System administration
    ├── communication/         # Communications
    └── geographic/            # Geographic data
```

### Module Structure Pattern
Each module follows a consistent pattern:
```
module-name/
├── resource.ts    # MCP resource implementation
├── tool.ts        # Claude Desktop tool definition
└── index.ts       # Module exports
```

### Key Architectural Concepts

#### 1. MCP Resources
- **Purpose**: Provide AI assistants access to data via URI schemes
- **Pattern**: `facturascripts://clientes?limit=50&filter=activo:1`
- **Location**: `resource.ts` in each module
- **Features**: Pagination, filtering, sorting, error handling

#### 2. Interactive Tools
- **Purpose**: Enable function calling from AI assistants
- **Pattern**: `get_clientes({ limit: 50, filter: "activo:1" })`
- **Location**: `tool.ts` in each module
- **Features**: Parameter validation, comprehensive error handling

#### 3. Type Safety
- **All APIs**: Fully typed with TypeScript interfaces
- **Runtime Validation**: Zod for environment variables
- **Error Handling**: Typed error responses
- **IDE Support**: Full IntelliSense and autocompletion

---

## 🔄 Development Workflows

### Git Workflow

#### Branch Strategy
```bash
# Feature development
git checkout -b feature/add-new-tool
git commit -m "feat: add specialized customer search tool"
git push origin feature/add-new-tool

# Bug fixes
git checkout -b fix/handle-empty-responses
git commit -m "fix: handle empty API responses gracefully"
```

#### Commit Message Format (Conventional Commits)
```bash
feat: add new feature
fix: bug fix
docs: documentation changes
test: add tests
chore: maintenance tasks
refactor: code refactoring
perf: performance improvements
```

### Code Quality Standards

#### TypeScript Guidelines
- **Strict Mode**: All code must compile without warnings
- **Type Annotations**: Explicit types for public APIs
- **Interfaces**: Define TypeScript interfaces for all data structures
- **Error Types**: Typed error handling with proper error interfaces

#### Testing Requirements
```bash
# Run tests during development
npm run test:watch

# Run all tests before push
npm run test:run

# View test coverage
npm run test:ui
```

**Testing Standards**:
- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test real API interactions
- **Error Scenarios**: Test all error conditions
- **Parameter Validation**: Test input sanitization

#### Code Review Process
1. **Self Review**: Run `npm run build && npm run test:run`
2. **Create PR**: Include description, testing notes, breaking changes
3. **Automated Checks**: Build, tests, and linting must pass
4. **Peer Review**: At least one approval required
5. **Merge**: Squash commits with conventional commit message

### Release Process
```bash
# Automated release (bumps version, generates changelog)
npm run release

# Manual version bump
npm version patch|minor|major
npm run changelog
git add CHANGELOG.md
git commit -m "chore: update changelog"
```

---

## 📚 First Tasks & Learning Path

### Week 1: Environment & Understanding

#### Day 1-2: Setup & Exploration
- [ ] Complete environment setup
- [ ] Run all tests successfully (`npm run test:run`)
- [ ] Explore codebase structure
- [ ] Test MCP Inspector integration
- [ ] Read `CLAUDE.md` and `README.md` thoroughly

**First Task**: Fix a simple documentation typo
- **Location**: README.md or any documentation file
- **Goal**: Learn Git workflow and PR process
- **Time**: 30 minutes

#### Day 3-5: Code Comprehension
- [ ] Read and understand `src/fs/client.ts` (API client)
- [ ] Examine one simple module (e.g., `src/modules/geographic/ciudades/`)
- [ ] Review test structure in `tests/unit/modules/`
- [ ] Study the dynamic filtering system in `src/utils/filterParser.ts`

**Second Task**: Add a test case to an existing module
- **Location**: Any `tests/unit/modules/{category}/{name}.test.ts`
- **Goal**: Understanding testing patterns
- **Time**: 1-2 hours

### Week 2: First Feature Implementation

#### Module Addition Practice
**Task**: Create a new simple resource module
- **Suggested Module**: `src/modules/configuration/retenciones/` (Tax Retentions)
- **Requirements**:
  - Resource implementation following pattern
  - Tool definition with proper parameter validation
  - Unit tests (success, error, parameter validation)
  - Integration test
  - Module export and registration in `src/index.ts`

**Learning Objectives**:
- Understand modular architecture
- Practice TypeScript interface creation
- Learn MCP resource implementation
- Master testing patterns

#### Specialized Tool Development
**Advanced Task**: Create a specialized business tool
- **Example**: `get_productos_por_familia` (products by family)
- **Requirements**:
  - Multi-step API operation
  - Comprehensive error handling
  - Parameter sanitization
  - Business logic validation
  - 5+ comprehensive test cases

### Week 3-4: Advanced Features

#### Performance Optimization
- Study caching strategies for API calls
- Implement request deduplication
- Add performance monitoring

#### Error Handling Enhancement
- Implement retry logic for failed API calls
- Add circuit breaker pattern
- Create detailed error reporting

#### Documentation Contribution
- Write tutorial for common use cases
- Create troubleshooting guide
- Document best practices from experience

### Learning Milestones Checklist

#### Beginner (Week 1)
- [ ] Environment setup complete
- [ ] All tests passing locally
- [ ] Basic understanding of MCP concepts
- [ ] Completed first documentation PR
- [ ] Successfully run MCP Inspector

#### Intermediate (Week 2)
- [ ] Created first resource module with tests
- [ ] Understanding of TypeScript interfaces
- [ ] Familiarity with FacturaScripts API
- [ ] Completed module registration process
- [ ] Understanding of error handling patterns

#### Advanced (Week 3-4)
- [ ] Created specialized business tool
- [ ] Implemented comprehensive error handling
- [ ] Added performance optimizations
- [ ] Contributed to documentation
- [ ] Can mentor new team members

---

## 👥 Team Communication

### Communication Channels
- **GitHub Issues**: Bug reports, feature requests, project planning
- **Pull Requests**: Code review and collaboration
- **Discussions**: Architecture decisions, questions, knowledge sharing

### Development Support
- **Code Reviews**: Provide constructive feedback focusing on:
  - Code quality and TypeScript best practices
  - Test coverage and error handling
  - Documentation completeness
  - Performance considerations

### Meeting Schedules
- **Sprint Planning**: Bi-weekly planning of development priorities
- **Code Review Sessions**: Weekly review of complex PRs
- **Architecture Discussions**: Monthly technical planning

### Escalation Procedures
1. **Technical Questions**: GitHub Discussions
2. **Bugs/Issues**: GitHub Issues with reproduction steps
3. **Architecture Decisions**: Architecture Discussion threads
4. **Urgent Issues**: Direct communication with team leads

---

## 📖 Resources & Training

### Essential Reading
1. **Model Context Protocol Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
2. **FacturaScripts API Documentation**: API v3 reference
3. **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/)
4. **Vitest Testing Framework**: [vitest.dev](https://vitest.dev/)

### Hands-On Tutorials

#### MCP Basics Tutorial
```bash
# Explore resources via MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp

# Test basic resource access
facturascripts://clientes?limit=5

# Test filtering
facturascripts://productos?filter=activo:1,precio_gt:10.00

# Test sorting
facturascripts://facturaclientes?order=fecha:desc&limit=10
```

#### API Client Usage
```typescript
// Basic API client usage
const client = new FacturaScriptsClient();
const result = await client.getWithPagination('/clientes', 10, 0);

// With filtering
const filtered = await client.getWithPagination('/productos', 50, 0, {
  'filter[activo]': '1',
  'filter[precio][gt]': '10.00'
});
```

#### Testing Patterns
```typescript
// Unit test example
it('should handle pagination correctly', async () => {
  mockClient.getWithPagination.mockResolvedValue({
    data: mockData,
    meta: { total: 100, limit: 50, offset: 0, hasMore: true }
  });
  
  const result = await resource.getResource('uri?limit=50');
  expect(mockClient.getWithPagination).toHaveBeenCalledWith(
    '/endpoint', 50, 0, {}
  );
});
```

### Learning Projects

#### Beginner Projects
1. **Add Simple Resource**: Cities, postal codes, or manufacturers
2. **Enhance Error Messages**: Improve user-facing error messages
3. **Add Test Cases**: Expand test coverage for existing modules

#### Intermediate Projects
1. **Specialized Tool**: Create customer search by email tool
2. **Performance Optimization**: Add response caching
3. **Enhanced Filtering**: Add date range filtering support

#### Advanced Projects
1. **Multi-Resource Tool**: Tool that combines data from multiple resources
2. **Batch Operations**: Tool for bulk operations
3. **Real-time Updates**: WebSocket support for live data updates

### Video Tutorials & Screencasts
- **Project Setup Walkthrough**: Environment setup and first run
- **Creating Your First Module**: Step-by-step module development
- **Testing Strategies**: Unit and integration testing approaches
- **Debugging with MCP Inspector**: Effective debugging techniques

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Environment Issues
**Problem**: `npm run build` fails with TypeScript errors
```bash
# Solution: Check TypeScript version and configuration
npm list typescript
npx tsc --showConfig
```

**Problem**: Tests fail with import errors
```bash
# Solution: Verify ESM imports use .js extensions
import { Client } from './client.js';  # Correct
import { Client } from './client';     # Incorrect
```

#### API Connection Issues
**Problem**: Connection refused to FacturaScripts
```bash
# Check environment configuration
cat .env

# Verify API endpoint is accessible
curl -H "token: YOUR_TOKEN" http://your-domain/api/3/clientes
```

**Problem**: Authentication failures
- Verify API token is correct and has proper permissions
- Check FacturaScripts API is enabled and accessible
- Confirm API version (v3) is correct

#### Testing Issues
**Problem**: Integration tests fail
```bash
# Check environment variables are set for testing
NODE_ENV=test npm run test:run

# Run specific integration test
npm run test -- tests/integration/modules/core-business/clientes.integration.test.ts
```

#### MCP Inspector Issues
**Problem**: "Module not found" errors in MCP Inspector
```bash
# Use the correct command for MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp

# NOT npm run dev (uses TypeScript directly)
```

### Performance Troubleshooting

#### Slow Test Execution
```bash
# Run tests with verbose output
npm run test:run -- --reporter=verbose

# Run specific test file
npm run test -- tests/unit/modules/specific.test.ts
```

#### API Response Time Issues
- Check network connectivity to FacturaScripts server
- Verify database performance on FacturaScripts side
- Consider implementing request caching for frequently accessed data

### Debug Mode Setup
```typescript
// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug: API request:', endpoint, params);
}
```

### Getting Help

#### Before Asking for Help
1. Check this troubleshooting section
2. Search existing GitHub issues
3. Review error logs and stack traces
4. Try reproducing with minimal test case

#### How to Ask for Help
1. **Provide Context**: What were you trying to do?
2. **Include Error Details**: Full error messages and stack traces
3. **Share Code**: Minimal reproducible example
4. **Environment Info**: Node version, OS, dependencies
5. **Steps to Reproduce**: Clear step-by-step instructions

#### Support Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general help
- **Code Reviews**: For feedback on implementation approaches

---

## 🎯 Success Metrics

### Onboarding Success Indicators
- [ ] **Week 1**: Environment setup complete and first PR merged
- [ ] **Week 2**: First feature implementation completed with tests
- [ ] **Week 3**: Comfortable with codebase navigation and debugging
- [ ] **Week 4**: Contributing meaningful features and helping others

### Code Quality Standards
- [ ] All PRs pass automated checks (build, tests, linting)
- [ ] Code follows established TypeScript and testing patterns
- [ ] Documentation is updated for new features
- [ ] Error handling is comprehensive and user-friendly

### Team Integration
- [ ] Actively participating in code reviews
- [ ] Contributing to technical discussions
- [ ] Helping other team members with questions
- [ ] Proposing improvements and optimizations

---

## 📝 Feedback & Continuous Improvement

### Onboarding Feedback
Please help us improve this guide by providing feedback on:
- Which sections were most/least helpful
- What information was missing
- Areas that need more detail or clarification
- Suggestions for improvement

### Regular Check-ins
- **Week 1**: Environment and initial understanding check
- **Week 2**: First feature implementation review
- **Week 4**: Comprehensive onboarding assessment
- **Month 3**: Long-term integration and growth planning

### Contributing to Onboarding
Once comfortable with the codebase, consider:
- Updating this guide with new learnings
- Creating video tutorials for complex topics
- Adding common troubleshooting scenarios
- Mentoring new team members

---

## 🚀 Welcome to the Team!

You're now ready to start your journey as a MCP FacturaScripts developer. Remember:

- **Ask Questions**: No question is too basic
- **Experiment Safely**: Use feature branches and testing
- **Document Learning**: Help improve this guide
- **Collaborate**: Code reviews and discussions make us all better

**Happy coding!** 🎉

---

*This guide is maintained by the MCP FacturaScripts development team. Last updated: December 2024*