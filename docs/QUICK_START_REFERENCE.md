# Quick Start Reference Guide
## MCP FacturaScripts Development

This is a condensed reference for developers already familiar with the codebase.

## 🚀 Quick Setup

```bash
# Clone and install
git clone https://github.com/cristotodev/MCP_Facturascripts.git
cd MCP_Facturascripts
npm install

# Configure environment
cp .env.example .env
# Edit .env with your FacturaScripts config

# Build and test
npm run build && npm run test:run

# Start development
npm run dev
```

## 🏗️ Creating a New Module

### 1. Module Structure
```
src/modules/{category}/{name}/
├── resource.ts    # MCP resource implementation  
├── tool.ts        # Tool definitions
└── index.ts       # Exports
```

### 2. Resource Template (`resource.ts`)
```typescript
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export interface YourEntity {
  // Define interface based on FacturaScripts API
}

export class YourEntityResource {
  constructor(private client: FacturaScriptsClient) {}

  async getResource(uri: string): Promise<Resource> {
    const { limit, offset, additionalParams } = parseUrlParameters(uri);
    
    try {
      const result = await this.client.getWithPagination<YourEntity>(
        '/your-endpoint',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts YourEntity',
        mimeType: 'application/json',
        contents: [{ type: 'text', text: JSON.stringify(result, null, 2), uri }],
      };
    } catch (error) {
      // Error handling...
    }
  }

  matchesUri(uri: string): boolean {
    try {
      const url = new URL(uri);
      return url.protocol === 'facturascripts:' && url.hostname === 'yourentity';
    } catch {
      return false;
    }
  }
}
```

### 3. Tool Template (`tool.ts`)
```typescript
export const toolDefinition = {
  name: 'get_yourentity',
  description: 'Spanish description of functionality',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', default: 50, minimum: 1, maximum: 1000 },
      offset: { type: 'number', default: 0, minimum: 0 },
      filter: { type: 'string', description: 'Dynamic filtering...' },
      order: { type: 'string', description: 'Dynamic sorting...' },
    },
  },
};

export const toolImplementation = async (resource: any, buildUri: (name: string) => string) => {
  const uri = buildUri('yourentity');
  const result = await resource.getResource(uri);
  return {
    content: [{ type: 'text', text: result.contents[0].text }],
  };
};
```

### 4. Module Index (`index.ts`)
```typescript
export { YourEntityResource, type YourEntity } from './resource.js';
export { 
  toolDefinition as yourEntityToolDefinition,
  toolImplementation as yourEntityToolImplementation 
} from './tool.js';
```

### 5. Register in Main Server (`src/index.ts`)
```typescript
// Add import
import { YourEntityResource } from './modules/{category}/{name}/resource.js';

// Add instance
const yourEntityResource = new YourEntityResource(fsClient);

// Add to resources array (in ListResourcesRequestSchema handler)
yourEntityResource,

// Add tool definition (in ListToolsRequestSchema handler)
{
  name: 'get_yourentity',
  description: 'Spanish description',
  inputSchema: { /* ... */ }
}

// Add tool implementation (in CallToolRequestSchema handler)
case 'get_yourentity': {
  const uri = buildUri('yourentity');
  const result = await yourEntityResource.getResource(uri);
  return {
    content: [{ type: 'text', text: result.contents[0].text }],
  };
}
```

## 🧪 Testing Template

### Unit Test (`tests/unit/modules/{category}/{name}.test.ts`)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YourEntityResource } from '../../../../src/modules/{category}/{name}/resource.js';

describe('YourEntityResource', () => {
  let resource: YourEntityResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = { getWithPagination: vi.fn() };
    resource = new YourEntityResource(mockClient);
  });

  it('should handle successful requests', async () => {
    mockClient.getWithPagination.mockResolvedValue({
      data: [/* mock data */],
      meta: { total: 1, limit: 50, offset: 0, hasMore: false }
    });

    const result = await resource.getResource('facturascripts://yourentity');
    expect(result.name).toBe('FacturaScripts YourEntity');
  });

  it('should handle errors', async () => {
    mockClient.getWithPagination.mockRejectedValue(new Error('API Error'));
    const result = await resource.getResource('facturascripts://yourentity');
    expect(result.name).toContain('(Error)');
  });
});
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build TypeScript
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Run tests with UI

# Testing with MCP Inspector
npx @modelcontextprotocol/inspector npm run mcp

# Quality checks
npm run build && npm run test:run

# Release
npm run release        # Version bump + changelog + build + test
```

## 🎯 Specialized Tools Pattern

For multi-step business operations:

```typescript
export const specializedToolDefinition = {
  name: 'get_specialized_operation',
  description: 'Complex business operation description',
  inputSchema: {
    type: 'object',
    properties: {
      businessParam: { type: 'string', description: 'Required business parameter' },
      limit: { type: 'number', default: 50, minimum: 1, maximum: 1000 },
      // ... other params
    },
    required: ['businessParam']
  }
};

export async function specializedToolImplementation(args: any, client: FacturaScriptsClient) {
  try {
    // Step 1: First API call
    const step1Result = await client.getWithPagination(/* ... */);
    if (!step1Result.data.length) {
      return { /* error response */ };
    }

    // Step 2: Second API call using result from step 1
    const step2Result = await client.getWithPagination(/* ... */);

    // Step 3: Combine and return
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          businessContext: { /* extracted from step 1 */ },
          results: step2Result
        })
      }]
    };
  } catch (error) {
    return { /* comprehensive error handling */ };
  }
}
```

## 📁 Module Categories

- **core-business/**: clientes, productos, proveedores, stocks
- **sales-orders/**: pedidoclientes, facturaclientes, presupuestoclientes, albaranclientes, line-items
- **purchasing/**: facturaproveedores, albaranproveedores, productoproveedores
- **accounting/**: asientos, cuentas, diarios, ejercicios, conceptopartidas
- **finance/**: cuentabancos, cuentabancoclientes, cuentabancoproveedores, cuentaespeciales, divisas
- **configuration/**: almacenes, agentes, formapagos, impuestos, familias, fabricantes, etc.
- **system/**: apiaccess, apikeyes, logmessages, cronjobes, attachedfiles, etc.
- **communication/**: contactos, emailnotifications, emailsentes
- **geographic/**: ciudades, codigopostales, empresas

## 🐛 Quick Debugging

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run specific test
npm run test -- tests/unit/modules/specific.test.ts

# Debug MCP Inspector connection
node mcp-server.js  # Should start without errors

# Test API connectivity
curl -H "token: YOUR_TOKEN" http://domain/api/3/clientes?limit=1
```

## 📝 Commit Message Format

```bash
feat: add new feature
fix: bug fix  
docs: documentation changes
test: add tests
chore: maintenance
refactor: code refactoring
perf: performance improvement
```

---

*Quick reference for MCP FacturaScripts development team*