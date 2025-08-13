# MCP FacturaScripts

**Version 0.2.0** - TypeScript ESM project for a Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing comprehensive access to business, accounting, and administrative data.

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
- `src/resources/proveedores.ts` - MCP resource for suppliers data
- `src/resources/stocks.ts` - MCP resource for inventory stock data
- `src/resources/facturaproveedores.ts` - MCP resource for supplier invoices data
- `src/resources/agenciatransportes.ts` - MCP resource for transport agencies data
- `src/resources/agentes.ts` - MCP resource for agents data
- `src/resources/albaranclientes.ts` - MCP resource for customer delivery notes data
- `src/resources/albaranproveedores.ts` - MCP resource for supplier delivery notes data
- `src/resources/almacenes.ts` - MCP resource for warehouses data
- `src/resources/apiaccess.ts` - MCP resource for API access management data
- `src/resources/apikeyes.ts` - MCP resource for API keys management data
- `src/resources/asientos.ts` - MCP resource for accounting entries data
- `src/resources/atributos.ts` - MCP resource for attributes data
- `src/resources/atributovalores.ts` - MCP resource for attribute values data
- `src/resources/attachedfiles.ts` - MCP resource for attached files data
- `src/resources/attachedfilerelations.ts` - MCP resource for attached file relations data
- `src/resources/ciudades.ts` - MCP resource for cities data
- `src/resources/codigopostales.ts` - MCP resource for postal codes data
- `src/resources/conceptopartidas.ts` - MCP resource for accounting entry concepts data
- `src/resources/contactos.ts` - MCP resource for contacts data
- `src/resources/cronjobes.ts` - MCP resource for scheduled jobs data
- `src/resources/cuentas.ts` - MCP resource for accounting accounts data
- `src/resources/cuentabancos.ts` - MCP resource for bank accounts data
- `src/types/facturascripts.ts` - TypeScript interfaces for all FacturaScripts entities

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

The server provides **28 comprehensive MCP resources** covering all major FacturaScripts entities including business transactions, accounting data, contacts, inventory, and system administration.

All resources support the following query parameters:
- `limit` - Number of records to return (default: 50)
- `offset` - Number of records to skip (default: 0)
- `filter` - Filters in format `campo:valor` (e.g., `activo:1`)
- `order` - Sort order in format `campo:asc|desc` (e.g., `nombre:asc`)

Available resources:
- `facturascripts://clientes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated clients list
- `facturascripts://productos?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated products list
- `facturascripts://productoproveedores?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated products by supplier list
- `facturascripts://pedidoclientes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated customer orders list
- `facturascripts://facturaclientes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated customer invoices list
- `facturascripts://presupuestoclientes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated customer quotes list
- `facturascripts://proveedores?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated suppliers list
- `facturascripts://stocks?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated inventory stock list
- `facturascripts://facturaproveedores?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated supplier invoices list
- `facturascripts://agenciatransportes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated transport agencies list
- `facturascripts://agentes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated agents list
- `facturascripts://albaranclientes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated customer delivery notes list
- `facturascripts://albaranproveedores?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated supplier delivery notes list
- `facturascripts://almacenes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated warehouses list
- `facturascripts://apiaccess?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated API access management list
- `facturascripts://apikeyes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated API keys management list
- `facturascripts://asientos?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated accounting entries list
- `facturascripts://atributos?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated attributes list
- `facturascripts://atributovalores?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated attribute values list
- `facturascripts://attachedfiles?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated attached files list
- `facturascripts://attachedfilerelations?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated attached file relations list
- `facturascripts://ciudades?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated cities list
- `facturascripts://codigopostales?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated postal codes list
- `facturascripts://conceptopartidas?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated accounting entry concepts list
- `facturascripts://contactos?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated contacts list
- `facturascripts://cronjobes?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated scheduled jobs list
- `facturascripts://cuentas?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated accounting accounts list
- `facturascripts://cuentabancos?limit={limit}&offset={offset}&filter={filter}&order={order}` - Paginated bank accounts list

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
3. Follow the pattern: `facturascripts://{resourceName}?limit={limit}&offset={offset}&filter={filter}&order={order}`
4. All resources must support: `limit`, `offset`, `filter`, and `order` query parameters
5. Use consistent naming and documentation format
5. **CRITICAL**: Always add corresponding tools to `src/index.ts` for Claude Desktop integration:
   - Add tool definition in `ListToolsRequestSchema` handler
   - Add tool implementation in `CallToolRequestSchema` handler
   - Use naming pattern: `get_{resourceName}` (e.g., `get_clientes`, `get_productos`, `get_proveedores`, `get_stocks`, `get_facturaproveedores`, `get_agenciatransportes`, `get_agentes`, `get_albaranclientes`, `get_albaranproveedores`, `get_almacenes`, `get_conceptopartidas`, `get_contactos`, `get_cronjobes`, `get_cuentas`, `get_cuentabancos`)
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
- `npm run build` - Ensure TypeScript compiles (currently: ✅ passing)
- `npm run test` - Run all tests to ensure nothing is broken (currently: ✅ 193 tests passing)
- Test the resource manually if possible with live FacturaScripts API

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
All 28 resources return consistent pagination format:
```typescript
{
  meta: { total, limit, offset, hasMore },
  data: T[]
}
```

### Current Project Status (v0.2.0)
- ✅ **28 MCP Resources** - Complete FacturaScripts API coverage
- ✅ **28 Interactive Tools** - Full Claude Desktop integration  
- ✅ **193 Tests Passing** - Comprehensive unit & integration testing
- ✅ **Live API Integration** - Working with real FacturaScripts instances
- ✅ **TypeScript Strict Mode** - Full type safety and IntelliSense
- ✅ **Production Ready** - Error handling, documentation, and monitoring