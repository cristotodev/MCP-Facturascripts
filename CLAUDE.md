# MCP FacturaScripts

**Version 0.4.0** - TypeScript ESM project for a Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing comprehensive access to business, accounting, and administrative data.

## Project Structure

The project follows a **modular architecture** that groups related functionality for better organization and maintainability:

- `src/index.ts` - Main MCP server entry point
- `src/env.ts` - Environment validation using Zod
- `src/fs/client.ts` - Axios-based FacturaScripts API client
- `src/types/facturascripts.ts` - TypeScript interfaces for all FacturaScripts entities
- `src/utils/filterParser.ts` - Dynamic filtering and sorting utilities

### Modular Organization

```
src/modules/
├── core-business/          # Essential business entities
│   ├── clientes/           # Customer management
│   ├── productos/          # Product catalog
│   ├── proveedores/        # Supplier management
│   └── stocks/             # Inventory management
├── sales-orders/           # Sales and order processing
│   ├── pedidoclientes/     # Customer orders
│   ├── facturaclientes/    # Customer invoices
│   ├── presupuestoclientes/# Customer quotes
│   ├── albaranclientes/    # Customer delivery notes
│   └── line-items/         # All document line items
├── purchasing/             # Procurement and supplier operations
│   ├── facturaproveedores/ # Supplier invoices
│   ├── albaranproveedores/ # Supplier delivery notes
│   └── productoproveedores/# Products by supplier
├── accounting/             # General accounting
│   ├── asientos/           # Accounting entries
│   ├── cuentas/            # Chart of accounts
│   ├── diarios/            # Accounting journals
│   ├── ejercicios/         # Fiscal years
│   └── conceptopartidas/   # Entry concepts
├── finance/                # Financial management
│   ├── cuentabancos/       # Bank accounts
│   ├── cuentabancoclientes/# Customer bank accounts
│   ├── cuentabancoproveedores/# Supplier bank accounts
│   ├── cuentaespeciales/   # Special accounts
│   └── divisas/            # Currencies
├── configuration/          # System configuration
│   ├── almacenes/          # Warehouses
│   ├── agentes/            # Sales agents
│   ├── formapagos/         # Payment methods
│   ├── impuestos/          # Tax rates
│   ├── familias/           # Product families
│   ├── fabricantes/        # Manufacturers
│   └── [14 more modules]   # Complete configuration coverage
├── system/                 # System administration
│   ├── apiaccess/          # API access control
│   ├── apikeyes/           # API key management
│   ├── logmessages/        # System logs
│   └── [4 more modules]    # System management
├── communication/          # Communications
│   ├── emailnotifications/ # Email templates
│   ├── emailsentes/        # Email history
│   └── contactos/          # Contact management
└── geographic/             # Geographic data
    ├── ciudades/           # Cities
    ├── codigopostales/     # Postal codes
    └── empresas/           # Company locations
```

### Module Structure

Each module follows a consistent pattern:
```
module-name/
├── resource.ts    # MCP resource implementation
├── tool.ts        # Claude Desktop tool definition
└── index.ts       # Module exports
```

This modular architecture provides:
- **Better Organization**: Related functionality grouped together
- **Easier Maintenance**: Changes isolated to specific modules
- **Cleaner Code**: Smaller, focused files instead of large monoliths
- **Enhanced Testability**: Individual modules can be tested in isolation
- **Scalability**: Easy to add new modules or modify existing ones

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

The server provides **56 comprehensive MCP resources** covering all major FacturaScripts entities including business transactions, accounting data, contacts, inventory, and system administration.

### Query Parameters

All resources support advanced filtering and sorting with a simple, dynamic parameter format:

**Core Parameters:**
- `limit` - Number of records to return (default: 50)
- `offset` - Number of records to skip (default: 0)
- `filter` - Dynamic filtering with field:value format
- `order` - Sorting with field:direction format

**Filter Parameter Format:**
The `filter` parameter supports a flexible format that gets internally converted to FacturaScripts API format:

- **Basic filtering**: `campo:valor` (e.g., `activo:1`)
- **Multiple filters**: `campo1:valor1,campo2:valor2` (e.g., `activo:1,nombre:Juan`)
- **Advanced operators**: 
  - `campo_gt:valor` - Greater than
  - `campo_gte:valor` - Greater than or equal  
  - `campo_lt:valor` - Less than
  - `campo_lte:valor` - Less than or equal
  - `campo_neq:valor` - Not equal
  - `campo_like:texto` - Text search (automatically normalized)

**Order Parameter Format:**
- **Single field**: `campo:asc` or `campo:desc` (e.g., `nombre:asc`)
- **Multiple fields**: `campo1:asc,campo2:desc` (e.g., `nombre:asc,fechaalta:desc`)

**Important Notes:**
- **_like searches**: Use lowercase text without accents, no wildcards needed
- **Duplicate filters**: Only the first occurrence is used if the same filter key appears multiple times
- **Empty results**: Non-existent column names return empty arrays
- **Collection endpoints only**: Filters/sorting only work on collection endpoints (not single resource endpoints like `/productos/{id}`)

### Usage Examples

**Simple Filtering:**
```typescript
// Basic field filter
facturascripts://clientes?filter=activo:1

// Multiple filters
facturascripts://productos?filter=precio_gt:10.00,precio_lt:100.00

// Text search (automatically normalized to lowercase, no accents)
facturascripts://clientes?filter=nombre_like:acme
```

**Advanced Filtering:**
```typescript
// Range queries with operators
facturascripts://facturaclientes?filter=fecha_gte:2024-01-01,total_gt:100.00

// Complex text searches
facturascripts://productos?filter=descripcion_like:laptop,familia:INFOR

// Using different operators
facturascripts://clientes?filter=fechaalta_neq:2024-01-01,activo:1
```

**Sorting:**
```typescript
// Single field sorting
facturascripts://clientes?order=nombre:asc

// Multi-field sorting  
facturascripts://clientes?order=nombre:asc,fechaalta:desc

// Combined filtering and sorting
facturascripts://productos?filter=activo:1,precio_gt:10.00&order=nombre:asc&limit=25
```

**Tool Usage (Claude Desktop):**
```typescript
// Using tools with dynamic filter parameter
get_clientes({
  filter: "activo:1,nombre_like:acme",
  order: "nombre:asc",
  limit: 25
})

// Advanced filtering with operators
get_productos({
  filter: "precio_gte:10.00,precio_lte:100.00,descripcion_like:laptop", 
  order: "precio:asc"
})
```

### Available Resources

All resources support advanced filtering and sorting parameters as described above:

**Core Business Resources:**
- `facturascripts://clientes` - Client management and customer data
- `facturascripts://productos` - Product catalog and inventory items  
- `facturascripts://proveedores` - Supplier and vendor management
- `facturascripts://stocks` - Inventory stock levels and warehouse data

**Sales & Orders:**
- `facturascripts://pedidoclientes` - Customer orders and order management
- `facturascripts://facturaclientes` - Customer invoices and billing
- `facturascripts://presupuestoclientes` - Customer quotes and estimates
- `facturascripts://albaranclientes` - Customer delivery notes
- `facturascripts://lineapedidoclientes` - Customer order line items
- `facturascripts://lineafacturaclientes` - Customer invoice line items
- `facturascripts://lineapresupuestoclientes` - Customer quote line items
- `facturascripts://lineaalbaranclientes` - Customer delivery note line items

**Purchasing:**
- `facturascripts://facturaproveedores` - Supplier invoices and payables
- `facturascripts://albaranproveedores` - Supplier delivery notes
- `facturascripts://productoproveedores` - Products by supplier relationships
- `facturascripts://lineafacturaproveedores` - Supplier invoice line items
- `facturascripts://lineaalbaranproveedores` - Supplier delivery note line items
- `facturascripts://lineapedidoproveedores` - Supplier order line items
- `facturascripts://lineapresupuestoproveedores` - Supplier quote line items

**Accounting & Finance:**
- `facturascripts://asientos` - Accounting journal entries
- `facturascripts://cuentas` - Chart of accounts
- `facturascripts://diarios` - Accounting journals
- `facturascripts://ejercicios` - Fiscal years and periods
- `facturascripts://empresas` - Company and organization data
- `facturascripts://conceptopartidas` - Accounting entry concepts
- `facturascripts://cuentabancos` - Bank account management
- `facturascripts://cuentabancoclientes` - Customer bank accounts
- `facturascripts://cuentabancoproveedores` - Supplier bank accounts
- `facturascripts://cuentaespeciales` - Special accounting accounts
- `facturascripts://divisas` - Currency and exchange rates

**Configuration & Master Data:**
- `facturascripts://almacenes` - Warehouse and location management
- `facturascripts://agentes` - Sales agents and representatives
- `facturascripts://agenciatransportes` - Shipping and transport agencies
- `facturascripts://formapagos` - Payment methods and terms
- `facturascripts://impuestos` - Tax rates and tax management
- `facturascripts://impuestozonas` - Tax zones and regional settings
- `facturascripts://familias` - Product families and categories
- `facturascripts://fabricantes` - Manufacturers and brands
- `facturascripts://atributos` - Product attributes and properties
- `facturascripts://atributovalores` - Product attribute values
- `facturascripts://estadodocumentos` - Document status definitions
- `facturascripts://formatodocumentos` - Document format templates
- `facturascripts://grupoclientes` - Customer groups and classifications
- `facturascripts://identificadorfiscales` - Tax ID types and formats

**System & Administration:**
- `facturascripts://apiaccess` - API access control and permissions
- `facturascripts://apikeyes` - API key management
- `facturascripts://logmessages` - System logs and audit trails
- `facturascripts://cronjobes` - Scheduled jobs and automation
- `facturascripts://emailnotifications` - Email notification templates
- `facturascripts://emailsentes` - Sent email history
- `facturascripts://doctransformations` - Document transformation logs
- `facturascripts://attachedfiles` - File attachments and uploads
- `facturascripts://attachedfilerelations` - File attachment relationships

**Geographic & Contact Data:**
- `facturascripts://contactos` - Contact information and details
- `facturascripts://ciudades` - Cities and urban areas
- `facturascripts://codigopostales` - Postal codes and ZIP codes

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
3. Follow the pattern: `facturascripts://{resourceName}` - Dynamic filtering and sorting support is automatic
4. All resources must support: `limit`, `offset`, `filter` (dynamic field:value format), and `order` (dynamic field:direction format)
5. Use consistent naming and documentation format
5. **CRITICAL**: Always add corresponding tools to `src/index.ts` for Claude Desktop integration:
   - Add tool definition in `ListToolsRequestSchema` handler with simple 4-parameter schema (limit, offset, filter, order)
   - Add tool implementation in `CallToolRequestSchema` handler
   - Use naming pattern: `get_{resourceName}` with dynamic filtering support
   - All tools support the same consistent parameter interface with advanced filtering via the `filter` parameter
   - Tools make resources interactive in Claude Desktop interface with full FacturaScripts API capability

## Development Standards

### Code Patterns
- **Resource naming**: Use plural names matching FacturaScripts API endpoints (e.g., `clientes`, `productos`)
- **Error handling**: Use try/catch with descriptive error messages
- **TypeScript**: Strict types, use interfaces for API responses
- **Imports**: Use `.js` extensions for ESM compatibility

### Module Implementation Pattern

**1. Resource Implementation (`resource.ts`):**
```typescript
// src/modules/{category}/{name}/resource.ts
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { Entity } from '../../../types/facturascripts.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export class EntityResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    const { limit, offset, additionalParams } = parseUrlParameters(uri);
    // Resource implementation...
  }

  matchesUri(uri: string): boolean {
    // URI matching logic...
  }
}
```

**2. Tool Implementation (`tool.ts`):**
```typescript
// src/modules/{category}/{name}/tool.ts
export const toolDefinition = {
  name: 'get_{name}',
  description: 'Spanish description of the tool functionality',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: '...', default: 50 },
      offset: { type: 'number', description: '...', default: 0 },
      filter: { type: 'string', description: 'Dynamic filtering...' },
      order: { type: 'string', description: 'Dynamic sorting...' },
    },
  },
};

export const toolImplementation = async (resource: any, buildUri: Function) => {
  const uri = buildUri('{name}');
  const result = await resource.getResource(uri);
  return { content: [{ type: 'text', text: result.contents[0].text }] };
};
```

**3. Module Exports (`index.ts`):**
```typescript
// src/modules/{category}/{name}/index.ts
export { EntityResource } from './resource.js';
export { 
  toolDefinition as entityToolDefinition,
  toolImplementation as entityToolImplementation 
} from './tool.js';
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

### Current Project Status (v0.4.0)
- ✅ **56 MCP Resources** - Complete FacturaScripts API coverage
- ✅ **56 Interactive Tools** - Full Claude Desktop integration with advanced filtering
- ✅ **347 Tests Passing** - Comprehensive unit & integration testing
- ✅ **Live API Integration** - Working with real FacturaScripts instances
- ✅ **Advanced API Support** - Full FacturaScripts filtering, sorting, and pagination
- ✅ **TypeScript Strict Mode** - Full type safety and IntelliSense
- ✅ **Production Ready** - Error handling, documentation, and monitoring