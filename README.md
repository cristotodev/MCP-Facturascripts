# MCP FacturaScripts

A Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing seamless access to business data through the MCP protocol.

## Features

- **Comprehensive Business Data Access**: Access clients, products, suppliers, stocks, customer orders, supplier orders, customer invoices, supplier invoices, and quotes
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

### PresupuestoClientes (Customer Quotes)
- **URI**: `facturascripts://presupuestoclientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of customer quotes from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Proveedores (Suppliers)
- **URI**: `facturascripts://proveedores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of suppliers from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Stocks (Inventory)
- **URI**: `facturascripts://stocks?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of stock levels from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### FacturaProveedores (Supplier Invoices)
- **URI**: `facturascripts://facturaproveedores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of supplier invoices from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AgenciaTransportes (Transport Agencies)
- **URI**: `facturascripts://agenciatransportes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of transport agencies from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Agentes (Agents)
- **URI**: `facturascripts://agentes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of agents from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AlbaranClientes (Customer Delivery Notes)
- **URI**: `facturascripts://albaranclientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of customer delivery notes from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AlbaranProveedores (Supplier Delivery Notes)
- **URI**: `facturascripts://albaranproveedores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of supplier delivery notes from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Almacenes (Warehouses)
- **URI**: `facturascripts://almacenes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of warehouses from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### ApiAccess (API Access Management)
- **URI**: `facturascripts://apiaccess?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of API access management data from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### ApiKeyes (API Keys Management)
- **URI**: `facturascripts://apikeyes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of API keys management data from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Asientos (Accounting Entries)
- **URI**: `facturascripts://asientos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of accounting entries from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Atributos (Attributes)
- **URI**: `facturascripts://atributos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of attributes from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AtributoValores (Attribute Values)
- **URI**: `facturascripts://atributovalores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of attribute values from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AttachedFiles (Attached Files)
- **URI**: `facturascripts://attachedfiles?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of attached files from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### AttachedFileRelations (Attached File Relations)
- **URI**: `facturascripts://attachedfilerelations?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of attached file relations from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Ciudades (Cities)
- **URI**: `facturascripts://ciudades?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of cities from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CodigoPostales (Postal Codes)
- **URI**: `facturascripts://codigopostales?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of postal codes from FacturaScripts
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
    ├── facturaclientes.ts   # Customer invoices resource implementation
    ├── presupuestoclientes.ts # Customer quotes resource implementation
    ├── proveedores.ts       # Suppliers resource implementation
    ├── stocks.ts            # Stock levels resource implementation
    ├── facturaproveedores.ts # Supplier invoices resource implementation
    ├── agenciatransportes.ts # Transport agencies resource implementation
    ├── agentes.ts           # Agents resource implementation
    ├── albaranclientes.ts   # Customer delivery notes resource implementation
    ├── albaranproveedores.ts # Supplier delivery notes resource implementation
    ├── almacenes.ts         # Warehouses resource implementation
    ├── apiaccess.ts         # API access management resource implementation
    ├── apikeyes.ts          # API keys management resource implementation
    ├── asientos.ts          # Accounting entries resource implementation
    ├── atributos.ts         # Attributes resource implementation
    ├── atributovalores.ts   # Attribute values resource implementation
    ├── attachedfiles.ts     # Attached files resource implementation
    ├── attachedfilerelations.ts # Attached file relations resource implementation
    ├── ciudades.ts          # Cities resource implementation
    └── codigopostales.ts    # Postal codes resource implementation

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