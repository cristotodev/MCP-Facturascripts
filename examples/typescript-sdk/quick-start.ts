/**
 * Quick Start Example: get_productos_mas_vendidos Tool
 * 
 * A minimal example showing how to quickly get started with the
 * best-selling products analysis tool.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function quickExample() {
  // 1. Create client and transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['path/to/your/mcp-server.js'] // Adjust path as needed
  });

  const client = new Client(
    { name: "quick-example", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  try {
    // 2. Connect
    await client.connect(transport);
    console.log('Connected to FacturaScripts MCP server');

    // 3. Get best-selling products for January 2024
    const result = await client.request({
      method: "tools/call",
      params: {
        name: "get_productos_mas_vendidos",
        arguments: {
          fecha_desde: "2024-01-01",
          fecha_hasta: "2024-01-31",
          limit: 5,
          order: "cantidad_total:desc"
        }
      }
    });

    // 4. Parse and display results
    if (result.content?.[0]?.type === 'text') {
      const data = JSON.parse(result.content[0].text);
      
      console.log(`\nTop ${data.data.length} products in January 2024:`);
      data.data.forEach((product: any, index: number) => {
        console.log(`${index + 1}. ${product.descripcion}`);
        console.log(`   Sold: ${product.cantidad_total} units`);
        console.log(`   Revenue: €${product.total_facturado}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // 5. Disconnect
    await client.close();
  }
}

// Run the example
quickExample();