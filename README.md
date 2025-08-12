# MCP FacturaScripts

A Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing seamless access to business data through the MCP protocol.

## Features

- **Comprehensive Business Data Access**: Access clients, products, supplier products, customer orders, and customer invoices
- **MCP Protocol**: Full compatibility with Model Context Protocol for AI integration
- **RESTful Integration**: Connects to FacturaScripts REST API v3
- **TypeScript**: Built with TypeScript for type safety and better development experience
- **Pagination**: Efficient data retrieval with configurable limit and offset parameters
- **Comprehensive Testing**: Unit and integration tests with Test-Driven Development approach

## Prerequisites

- Node.js 18 or higher
- FacturaScripts installation with API access
- Valid API token for FacturaScripts

## Installation

1. Clone the repository:
```bash
git clone https://github.com/cristotodev/MCP_Facturascripts.git
cd MCP_Facturascripts
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your FacturaScripts configuration:
```env
FS_BASE_URL=http://your-facturascripts-domain.com
FS_API_VERSION=3
FS_API_TOKEN=your-api-token-here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing with MCP Inspector
```bash
npx @modelcontextprotocol/inspector npm run dev
```

## MCP Resources

All resources support pagination with `limit` and `offset` parameters and return data in a consistent format with metadata.

### Clientes (Clients)
- **URI**: `facturascripts://clientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of clients from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Productos (Products)
- **URI**: `facturascripts://productos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of products from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### ProductoProveedores (Supplier Products)
- **URI**: `facturascripts://productoproveedores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of products by supplier from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### PedidoClientes (Customer Orders)
- **URI**: `facturascripts://pedidoclientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of customer orders from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### FacturaClientes (Customer Invoices)
- **URI**: `facturascripts://facturaclientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of customer invoices from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

**Response Format**:
```json
{
  "meta": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "data": [
    {
      "codcliente": "CLI001",
      "nombre": "John Doe",
      "razonsocial": "John Doe Company",
      "cifnif": "12345678A",
      "telefono1": "+1234567890",
      "email": "john@example.com",
      "fechaalta": "2024-01-15",
      "activo": true
    }
  ]
}
```

## Project Structure

```
src/
├── env.ts                    # Environment configuration and validation
├── index.ts                  # Main MCP server entry point
├── facturascripts/
│   └── client.ts            # FacturaScripts API client
└── resources/
    ├── clientes.ts          # Clients resource implementation
    ├── productos.ts         # Products resource implementation
    ├── productoproveedores.ts # Supplier products resource implementation
    ├── pedidoclientes.ts    # Customer orders resource implementation
    └── facturaclientes.ts   # Customer invoices resource implementation

tests/
├── unit/                    # Unit tests for individual classes/functions
│   ├── facturascripts/
│   └── resources/
├── integration/             # Integration tests with real APIs
└── setup.ts                # Global test setup and teardown
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `FS_BASE_URL` | Base URL of your FacturaScripts instance | - | Yes |
| `FS_API_VERSION` | API version to use | `3` | No |
| `FS_API_TOKEN` | API authentication token | - | Yes |

### FacturaScripts API Requirements

- FacturaScripts with REST API enabled
- Valid API token with read permissions for clients
- API endpoint accessible from the MCP server

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to dist/
- `npm start` - Run production server
- `npm run test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:run` - Run tests once and exit

### Adding New Resources

1. Create a new resource class in `src/resources/`
2. Implement the MCP resource interface
3. Register the resource in `src/index.ts`

Example:
```typescript
// src/resources/productos.ts
export class ProductosResource {
  async getResource(uri: string): Promise<Resource> {
    // Implementation
  }
  
  matchesUri(uri: string): boolean {
    // URI matching logic
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-resource`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add new resource'`
5. Push to the branch: `git push origin feature/new-resource`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the FacturaScripts documentation for API details
- Review the MCP protocol specification

## Related Projects

- [FacturaScripts](https://www.facturascripts.com/) - Open source ERP system
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for AI model context integration