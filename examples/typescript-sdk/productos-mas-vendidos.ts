/**
 * MCP TypeScript SDK Example: get_productos_mas_vendidos Tool
 * 
 * This example demonstrates how to use the MCP TypeScript SDK to interact
 * with the get_productos_mas_vendidos tool in the FacturaScripts MCP server.
 * 
 * The tool provides best-selling product rankings based on invoice line items
 * within specified date ranges, offering both quantity and revenue analysis.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Interface for the tool parameters
interface ProductosMasVendidosParams {
  fecha_desde: string;     // Start date (YYYY-MM-DD) - required
  fecha_hasta: string;     // End date (YYYY-MM-DD) - required
  limit?: number;          // Max products to return (1-1000, default: 50)
  offset?: number;         // Skip products for pagination (default: 0)  
  order?: string;          // Sort order (default: "cantidad_total:desc")
}

// Interface for the response data
interface ProductoVendido {
  referencia: string | null;  // Product reference code (null for services)
  descripcion: string;        // Product/service description
  cantidad_total: number;     // Total units sold
  total_facturado: number;    // Total revenue generated
}

interface ProductosMasVendidosResponse {
  period: {
    fecha_desde: string;
    fecha_hasta: string;
  };
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  data: ProductoVendido[];
}

/**
 * Example client class for interacting with FacturaScripts MCP server
 */
class FacturaScriptsMCPClient {
  private client: Client;
  private transport: StdioClientTransport;

  constructor(serverCommand: string, serverArgs?: string[]) {
    // Create stdio transport to communicate with the MCP server
    this.transport = new StdioClientTransport({
      command: serverCommand,
      args: serverArgs || []
    });
    
    // Create MCP client
    this.client = new Client(
      {
        name: "facturascripts-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<void> {
    await this.client.connect(this.transport);
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    await this.client.close();
  }

  /**
   * Get best-selling products for a specific period
   */
  async getProductosMasVendidos(params: ProductosMasVendidosParams): Promise<ProductosMasVendidosResponse> {
    const result = await this.client.request(
      {
        method: "tools/call",
        params: {
          name: "get_productos_mas_vendidos",
          arguments: params
        }
      },
      { timeout: 30000 } // 30 second timeout
    );

    if (result.content && result.content[0] && result.content[0].type === 'text') {
      return JSON.parse(result.content[0].text);
    }

    throw new Error('Invalid response format');
  }

  /**
   * List available tools (useful for discovery)
   */
  async listTools(): Promise<any> {
    return await this.client.request({
      method: "tools/list",
      params: {}
    });
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

async function runExamples() {
  // Initialize the client (adjust server command as needed)
  const client = new FacturaScriptsMCPClient('node', ['path/to/mcp-server.js']);
  
  try {
    // Connect to the server
    await client.connect();
    console.log('✅ Connected to FacturaScripts MCP server');

    // Example 1: Monthly best sellers by quantity
    console.log('\n📊 Example 1: Top 10 products sold in January 2024');
    const monthlyBestSellers = await client.getProductosMasVendidos({
      fecha_desde: '2024-01-01',
      fecha_hasta: '2024-01-31',
      limit: 10,
      order: 'cantidad_total:desc'
    });

    console.log(`Found ${monthlyBestSellers.data.length} products:`);
    monthlyBestSellers.data.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.descripcion}`);
      console.log(`   Units sold: ${producto.cantidad_total}`);
      console.log(`   Revenue: €${producto.total_facturado.toFixed(2)}`);
      console.log(`   Reference: ${producto.referencia || 'N/A (Service)'}`);
      console.log('');
    });

    // Example 2: Revenue-based ranking for Q1
    console.log('\n💰 Example 2: Top revenue generators Q1 2024');
    const revenueRanking = await client.getProductosMasVendidos({
      fecha_desde: '2024-01-01',
      fecha_hasta: '2024-03-31',
      limit: 5,
      order: 'total_facturado:desc'
    });

    console.log('Top revenue products:');
    revenueRanking.data.forEach((producto, index) => {
      const avgPrice = producto.total_facturado / producto.cantidad_total;
      console.log(`${index + 1}. ${producto.descripcion}`);
      console.log(`   Revenue: €${producto.total_facturado.toFixed(2)}`);
      console.log(`   Units: ${producto.cantidad_total}`);
      console.log(`   Avg. price: €${avgPrice.toFixed(2)}`);
      console.log('');
    });

    // Example 3: Pagination example
    console.log('\n📄 Example 3: Paginated results for annual analysis');
    let offset = 0;
    const limit = 5;
    let hasMore = true;
    let pageNum = 1;

    while (hasMore && pageNum <= 3) { // Limit to first 3 pages for demo
      const pagedResults = await client.getProductosMasVendidos({
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-12-31',
        limit: limit,
        offset: offset,
        order: 'cantidad_total:desc'
      });

      console.log(`Page ${pageNum} (${pagedResults.data.length} products):`);
      pagedResults.data.forEach((producto, index) => {
        const rank = offset + index + 1;
        console.log(`${rank}. ${producto.descripcion} - ${producto.cantidad_total} units`);
      });

      hasMore = pagedResults.meta.hasMore;
      offset += limit;
      pageNum++;
      console.log('');
    }

    // Example 4: Comparative analysis
    console.log('\n📈 Example 4: Comparative monthly analysis');
    const janResults = await client.getProductosMasVendidos({
      fecha_desde: '2024-01-01',
      fecha_hasta: '2024-01-31',
      limit: 3,
      order: 'cantidad_total:desc'
    });

    const febResults = await client.getProductosMasVendidos({
      fecha_desde: '2024-02-01',
      fecha_hasta: '2024-02-29',
      limit: 3,
      order: 'cantidad_total:desc'
    });

    console.log('January top 3:');
    janResults.data.forEach((p, i) => {
      console.log(`${i + 1}. ${p.descripcion} - ${p.cantidad_total} units`);
    });

    console.log('\nFebruary top 3:');
    febResults.data.forEach((p, i) => {
      console.log(`${i + 1}. ${p.descripcion} - ${p.cantidad_total} units`);
    });

    // Example 5: Error handling
    console.log('\n⚠️  Example 5: Error handling for invalid date range');
    try {
      await client.getProductosMasVendidos({
        fecha_desde: '2030-01-01', // Future date with no data
        fecha_hasta: '2030-01-31'
      });
    } catch (error) {
      console.log('Handled expected error for future date range');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Always disconnect
    await client.disconnect();
    console.log('✅ Disconnected from server');
  }
}

// ============================================================================
// BUSINESS ANALYSIS HELPER FUNCTIONS
// ============================================================================

/**
 * Helper function to analyze product performance metrics
 */
function analyzeProductPerformance(productos: ProductoVendido[]): {
  topByVolume: ProductoVendido;
  topByRevenue: ProductoVendido;
  highestMargin: ProductoVendido;
  averagePrice: number;
} {
  if (productos.length === 0) {
    throw new Error('No products to analyze');
  }

  const topByVolume = productos.reduce((prev, current) => 
    prev.cantidad_total > current.cantidad_total ? prev : current
  );

  const topByRevenue = productos.reduce((prev, current) => 
    prev.total_facturado > current.total_facturado ? prev : current
  );

  const highestMargin = productos.reduce((prev, current) => {
    const prevMargin = prev.total_facturado / prev.cantidad_total;
    const currentMargin = current.total_facturado / current.cantidad_total;
    return prevMargin > currentMargin ? prev : current;
  });

  const totalRevenue = productos.reduce((sum, p) => sum + p.total_facturado, 0);
  const totalUnits = productos.reduce((sum, p) => sum + p.cantidad_total, 0);
  const averagePrice = totalRevenue / totalUnits;

  return {
    topByVolume,
    topByRevenue,
    highestMargin,
    averagePrice
  };
}

/**
 * Helper function to format currency values
 */
function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Helper function to calculate growth between periods
 */
function calculateGrowth(current: number, previous: number): {
  absolute: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
} {
  const absolute = current - previous;
  const percentage = previous === 0 ? 0 : (absolute / previous) * 100;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (absolute > 0) trend = 'up';
  else if (absolute < 0) trend = 'down';

  return { absolute, percentage, trend };
}

// ============================================================================
// ADVANCED BUSINESS SCENARIOS
// ============================================================================

/**
 * Advanced Scenario: Seasonal trend analysis
 */
async function seasonalTrendAnalysis(client: FacturaScriptsMCPClient) {
  console.log('\n🌱 Seasonal Trend Analysis');
  
  const quarters = [
    { name: 'Q1 2024', start: '2024-01-01', end: '2024-03-31' },
    { name: 'Q2 2024', start: '2024-04-01', end: '2024-06-30' },
    { name: 'Q3 2024', start: '2024-07-01', end: '2024-09-30' },
    { name: 'Q4 2024', start: '2024-10-01', end: '2024-12-31' }
  ];

  for (const quarter of quarters) {
    const results = await client.getProductosMasVendidos({
      fecha_desde: quarter.start,
      fecha_hasta: quarter.end,
      limit: 1,
      order: 'cantidad_total:desc'
    });

    if (results.data.length > 0) {
      const topProduct = results.data[0];
      console.log(`${quarter.name}: ${topProduct.descripcion} (${topProduct.cantidad_total} units)`);
    }
  }
}

/**
 * Advanced Scenario: Inventory optimization insights
 */
async function inventoryOptimizationInsights(client: FacturaScriptsMCPClient) {
  console.log('\n📦 Inventory Optimization Insights');
  
  // Get fast-moving products (last 30 days)
  const fastMovers = await client.getProductosMasVendidos({
    fecha_desde: '2024-01-01',
    fecha_hasta: '2024-01-31',
    limit: 10,
    order: 'cantidad_total:desc'
  });

  // Analyze products that need attention
  const analysis = analyzeProductPerformance(fastMovers.data);
  
  console.log('📊 Key Insights:');
  console.log(`• Highest volume: ${analysis.topByVolume.descripcion}`);
  console.log(`• Highest revenue: ${analysis.topByRevenue.descripcion}`);
  console.log(`• Best margin: ${analysis.highestMargin.descripcion}`);
  console.log(`• Average price: ${formatCurrency(analysis.averagePrice)}`);

  // Identify products to restock
  console.log('\n🔄 Restock Recommendations:');
  fastMovers.data.slice(0, 5).forEach((product, index) => {
    const daysOfStock = Math.floor(30 / (product.cantidad_total / 30)); // Simplified calculation
    console.log(`${index + 1}. ${product.descripcion}`);
    console.log(`   Daily avg: ${(product.cantidad_total / 30).toFixed(1)} units`);
    console.log(`   Stock needed: ${Math.ceil(product.cantidad_total * 1.2)} units (20% buffer)`);
  });
}

// ============================================================================
// EXPORT FOR USE IN OTHER MODULES
// ============================================================================

export {
  FacturaScriptsMCPClient,
  ProductosMasVendidosParams,
  ProductoVendido,
  ProductosMasVendidosResponse,
  analyzeProductPerformance,
  formatCurrency,
  calculateGrowth,
  seasonalTrendAnalysis,
  inventoryOptimizationInsights
};

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}