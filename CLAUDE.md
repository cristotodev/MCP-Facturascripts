# MCP FacturaScripts

TypeScript ESM project for a Model Context Protocol (MCP) server that integrates with FacturaScripts.

## Project Structure

- `src/index.ts` - Main MCP server entry point
- `src/env.ts` - Environment validation using Zod
- `src/facturascripts/client.ts` - Axios-based FacturaScripts API client
- `src/resources/clientes.ts` - MCP resource for clients data
- `src/resources/productos.ts` - MCP resource for products data
- `src/resources/productoproveedores.ts` - MCP resource for products by supplier data
- `src/resources/pedidoclientes.ts` - MCP resource for customer orders data
- `src/resources/facturaclientes.ts` - MCP resource for customer invoices data
- `src/resources/presupuestoclientes.ts` - MCP resource for customer quotes data

## Configuration

Environment variables (see `.env.example`):
- `FS_BASE_URL` - Base URL of your FacturaScripts instance
- `FS_API_VERSION` - API version (default: 3)
- `FS_API_TOKEN` - API authentication token

## Available Scripts

- `npm run dev` - Run development server with tsx
- `npm run build` - Build TypeScript to dist/
- `npm run start` - Run built server
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:run` - Run tests once and exit

## MCP Resources

- `facturascripts://clientes?limit={limit}&offset={offset}` - Paginated clients list
- `facturascripts://productos?limit={limit}&offset={offset}` - Paginated products list
- `facturascripts://productoproveedores?limit={limit}&offset={offset}` - Paginated products by supplier list
- `facturascripts://pedidoclientes?limit={limit}&offset={offset}` - Paginated customer orders list
- `facturascripts://facturaclientes?limit={limit}&offset={offset}` - Paginated customer invoices list
- `facturascripts://presupuestoclientes?limit={limit}&offset={offset}` - Paginated customer quotes list

Returns JSON format:
```json
{
  "meta": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  },
  "data": [...]
}
```

## Development Environment

This project runs a local FacturaScripts instance via Docker for development:
- Docker Compose setup includes FacturaScripts and MySQL
- Local directories: `facturascripts/` (app files), `mysql/` (database)
- Use `.claudeignore` to exclude large directories from Claude Code operations

## Claude Code Configuration

Important files for maintaining context:
- `.claudeignore` - Excludes node_modules/, dist/, mysql/, facturascripts/ from operations
- This CLAUDE.md file - Primary context for Claude Code sessions

### Auto-Documentation Rules

**IMPORTANT**: When adding new MCP resources (files in `src/resources/`):
1. Automatically update this CLAUDE.md file with the new resource endpoint
2. Update README.md "Available Resources" section if it exists
3. Follow the pattern: `facturascripts://{resourceName}?limit={limit}&offset={offset}`
4. Use consistent naming and documentation format
5. **CRITICAL**: Always add corresponding tools to `src/index.ts` for Claude Desktop integration:
   - Add tool definition in `ListToolsRequestSchema` handler
   - Add tool implementation in `CallToolRequestSchema` handler
   - Use naming pattern: `get_{resourceName}` (e.g., `get_clientes`, `get_productos`)
   - Tools make resources interactive in Claude Desktop interface

## Development Standards

### Code Patterns
- **Resource naming**: Use plural names matching FacturaScripts API endpoints (e.g., `clientes`, `productos`)
- **Error handling**: Use try/catch with descriptive error messages
- **TypeScript**: Strict types, use interfaces for API responses
- **Imports**: Use `.js` extensions for ESM compatibility

### Resource Implementation Pattern
```typescript
// src/resources/{name}.ts
export const {Name}Resource: Resource = {
  uri: new McpError(...),
  name: "facturascripts://{name}",
  description: "...",
  async read(uri) {
    // Parse limit/offset from uri.query
    // Use client.getWithPagination()
    // Return standardized response format
  }
};
```

### Quality Checks
Before completing any task, run:
- `npm run build` - Ensure TypeScript compiles
- `npm run test` - Run all tests to ensure nothing is broken
- Test the resource manually if possible

### TDD Workflow

**Test-Driven Development Process:**

1. **Red**: Write a failing test first
   ```bash
   npm run test:watch  # Keep tests running
   ```

2. **Green**: Write minimal code to make the test pass
   ```bash
   npm run test        # Verify tests pass
   ```

3. **Refactor**: Clean up code while keeping tests green
   ```bash
   npm run build       # Ensure TypeScript still compiles
   npm run test        # Ensure tests still pass
   ```

**Test Structure:**
- `tests/unit/` - Unit tests for individual classes/functions
- `tests/integration/` - Integration tests with real APIs (require env setup)
- `tests/setup.ts` - Global test setup and teardown

**Writing New Resources (TDD Approach):**
1. Write unit tests in `tests/unit/resources/{name}.test.ts`
2. Write integration tests in `tests/integration/{name}.integration.test.ts`
3. Implement the resource to pass the tests
4. Run quality checks before completion

### API Response Format
All resources should return consistent pagination format:
```typescript
{
  meta: { total, limit, offset, hasMore },
  data: T[]
}
```