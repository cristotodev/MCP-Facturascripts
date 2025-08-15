# MCP FacturaScripts Examples

This directory contains comprehensive examples showing how to use the MCP FacturaScripts server with various clients and programming languages.

## 📁 Directory Structure

```
examples/
├── typescript-sdk/           # TypeScript MCP SDK examples
│   ├── productos-mas-vendidos.ts  # Comprehensive example for best-selling products tool
│   └── quick-start.ts        # Simple quick-start example
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

1. Install the MCP TypeScript SDK:
```bash
npm install @modelcontextprotocol/sdk
```

2. Ensure your FacturaScripts MCP server is properly configured with:
   - `FS_BASE_URL` environment variable
   - `FS_API_TOKEN` environment variable

### Basic Usage

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Connect to your MCP server
const transport = new StdioClientTransport({
  command: 'npm',
  args: ['run', 'mcp']
});

const client = new Client(
  { name: "my-app", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

await client.connect(transport);

// Use the get_productos_mas_vendidos tool
const result = await client.request({
  method: "tools/call",
  params: {
    name: "get_productos_mas_vendidos",
    arguments: {
      fecha_desde: "2024-01-01",
      fecha_hasta: "2024-01-31",
      limit: 10
    }
  }
});
```

## 📊 Available Tools

### `get_productos_mas_vendidos`

Generate rankings of best-selling products within a date period.

**Parameters:**
- `fecha_desde` (required): Start date (YYYY-MM-DD)
- `fecha_hasta` (required): End date (YYYY-MM-DD)  
- `limit` (optional): Max products (1-1000, default: 50)
- `offset` (optional): Skip products for pagination (default: 0)
- `order` (optional): Sort order (default: "cantidad_total:desc")

**Sort Options:**
- `"cantidad_total:desc"` - Most units sold first
- `"cantidad_total:asc"` - Least units sold first
- `"total_facturado:desc"` - Highest revenue first
- `"total_facturado:asc"` - Lowest revenue first

### `get_facturas_cliente_por_cifnif`

Search customer invoices by CIF/NIF tax identification.

**Parameters:**
- `cifnif` (required): Customer tax ID
- `filter` (optional): Additional invoice filters
- `limit` (optional): Max invoices (1-1000, default: 50)
- `offset` (optional): Skip invoices for pagination (default: 0)
- `order` (optional): Sort order

## 🔧 Examples Breakdown

### `quick-start.ts`
- **Purpose**: Minimal example to get you started quickly
- **Features**: Basic connection and single tool call
- **Best for**: Understanding the basics

### `productos-mas-vendidos.ts`
- **Purpose**: Comprehensive example with advanced usage patterns
- **Features**: 
  - Full client wrapper class
  - Multiple business scenarios
  - Error handling
  - Pagination examples
  - Data analysis helpers
  - TypeScript interfaces
- **Best for**: Production applications

## 💡 Usage Patterns

### 1. Monthly Sales Analysis
```typescript
const monthlyResults = await client.request({
  method: "tools/call",
  params: {
    name: "get_productos_mas_vendidos",
    arguments: {
      fecha_desde: "2024-01-01",
      fecha_hasta: "2024-01-31",
      order: "cantidad_total:desc",
      limit: 10
    }
  }
});
```

### 2. Revenue-Focused Analysis
```typescript
const revenueResults = await client.request({
  method: "tools/call",
  params: {
    name: "get_productos_mas_vendidos",
    arguments: {
      fecha_desde: "2024-01-01",
      fecha_hasta: "2024-12-31",
      order: "total_facturado:desc",
      limit: 20
    }
  }
});
```

### 3. Pagination for Large Datasets
```typescript
let offset = 0;
const limit = 25;
let hasMore = true;

while (hasMore) {
  const results = await client.request({
    method: "tools/call",
    params: {
      name: "get_productos_mas_vendidos",
      arguments: {
        fecha_desde: "2024-01-01",
        fecha_hasta: "2024-12-31",
        limit: limit,
        offset: offset
      }
    }
  });

  const data = JSON.parse(results.content[0].text);
  
  // Process results...
  
  hasMore = data.meta.hasMore;
  offset += limit;
}
```

## 🎯 Business Use Cases

### Inventory Management
Identify fast-moving products for restock planning:
```typescript
// Get top 20 products by volume for last quarter
const fastMovers = await getProductosMasVendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-03-31", 
  order: "cantidad_total:desc",
  limit: 20
});
```

### Revenue Analysis
Find your most profitable products:
```typescript
// Get top revenue generators for the year
const topRevenue = await getProductosMasVendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  order: "total_facturado:desc",
  limit: 15
});
```

### Seasonal Planning
Analyze performance by season:
```typescript
// Summer season analysis
const summerResults = await getProductosMasVendidos({
  fecha_desde: "2024-06-01",
  fecha_hasta: "2024-08-31",
  order: "cantidad_total:desc"
});
```

## 🛠️ Development Tips

### Error Handling
Always wrap MCP calls in try-catch blocks:
```typescript
try {
  const result = await client.request({...});
  // Process result
} catch (error) {
  console.error('MCP call failed:', error);
  // Handle error appropriately
}
```

### Connection Management
Always clean up connections:
```typescript
try {
  await client.connect(transport);
  // Your code here
} finally {
  await client.close();
}
```

### Type Safety
Use TypeScript interfaces for better development experience:
```typescript
interface ProductoVendido {
  referencia: string | null;
  descripcion: string;
  cantidad_total: number;
  total_facturado: number;
}
```

## 📚 Further Reading

- [MCP TypeScript SDK Documentation](https://modelcontextprotocol.io/docs/sdk/typescript)
- [FacturaScripts API Documentation](https://facturascripts.com/documentacion/api)
- [Tool Usage Examples](../docs/TOOL_USAGE_EXAMPLES.md) - Comprehensive usage patterns

## 🤝 Contributing

To contribute new examples:

1. Add your example to the appropriate subdirectory
2. Include comprehensive comments explaining the code
3. Add error handling and best practices
4. Update this README with a description of your example
5. Test your example with a real FacturaScripts instance

## 📞 Support

If you need help with these examples:

1. Check the main project [README](../README.md)
2. Review the [Tool Usage Examples](../docs/TOOL_USAGE_EXAMPLES.md)
3. Open an issue in the project repository