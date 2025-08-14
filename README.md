# MCP FacturaScripts

**Version 1.0.1** - A comprehensive Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing seamless access to business, accounting, and administrative data through the MCP protocol.

## Features

- **56 MCP Resources**: Complete coverage of FacturaScripts entities including business transactions, accounting accounts, contacts, inventory, system administration, and more
- **Full Accounting Integration**: Access to accounting accounts, entry concepts, bank accounts, and financial data
- **Contact & CRM Management**: Comprehensive contact management with customer and supplier relationships
- **Business Operations**: Orders, invoices, quotes, delivery notes, products, suppliers, and inventory
- **System Administration**: API access control, scheduled jobs, attachments, and configuration
- **MCP Protocol**: Full compatibility with Model Context Protocol for AI integration
- **RESTful Integration**: Connects to FacturaScripts REST API v3
- **TypeScript**: Built with TypeScript for type safety and better development experience
- **Advanced Filtering**: Support for filters, sorting, and pagination on all resources
- **Claude Desktop Integration**: Interactive tools for seamless AI assistant integration
- **Comprehensive Testing**: 358 unit and integration tests with Test-Driven Development approach and modular test organization
- **MCP Inspector Compatible**: Auto-building entry point ensuring compatibility with MCP Inspector and development tools

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
npx @modelcontextprotocol/inspector npm run mcp
```

**Important**: Use `npm run mcp` (not `npm run dev`) to ensure JavaScript execution for MCP Inspector compatibility.

## MCP Resources

All **56 resources** support pagination with `limit`, `offset`, `filter`, and `order` parameters and return data in a consistent format with metadata.

### 📊 Business Core Resources

#### Clientes (Clients)
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

### ConceptoPartidas (Accounting Entry Concepts)
- **URI**: `facturascripts://conceptopartidas?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of accounting entry concepts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Contactos (Contacts)
- **URI**: `facturascripts://contactos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of contacts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CronJobs (Scheduled Jobs)
- **URI**: `facturascripts://cronjobes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of scheduled jobs from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Cuentas (Accounting Accounts)
- **URI**: `facturascripts://cuentas?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of accounting accounts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CuentaBancos (Bank Accounts)
- **URI**: `facturascripts://cuentabancos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of bank accounts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CuentaBancoClientes (Client Bank Accounts)
- **URI**: `facturascripts://cuentabancoclientes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of client bank accounts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CuentaBancoProveedores (Supplier Bank Accounts)
- **URI**: `facturascripts://cuentabancoproveedores?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of supplier bank accounts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### CuentaEspeciales (Special Accounts)
- **URI**: `facturascripts://cuentaespeciales?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of special accounts from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Diarios (Accounting Journals)
- **URI**: `facturascripts://diarios?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of accounting journals from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Divisas (Currencies)
- **URI**: `facturascripts://divisas?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of currencies from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### DocTransformations (Document Transformations)
- **URI**: `facturascripts://doctransformations?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of document transformations from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Ejercicios (Fiscal Years)
- **URI**: `facturascripts://ejercicios?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of fiscal years from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### EmailNotifications (Email Notifications)
- **URI**: `facturascripts://emailnotifications?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of email notifications from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### EmailSentes (Sent Emails)
- **URI**: `facturascripts://emailsentes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of sent emails from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Empresas (Companies)
- **URI**: `facturascripts://empresas?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of companies from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### EstadoDocumentos (Document Status)
- **URI**: `facturascripts://estadodocumentos?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of document status from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Fabricantes (Manufacturers)
- **URI**: `facturascripts://fabricantes?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of manufacturers from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### Familias (Product Families)
- **URI**: `facturascripts://familias?limit={limit}&offset={offset}`
- **Description**: Retrieve paginated list of product families from FacturaScripts
- **Parameters**:
  - `limit` (optional): Number of records to retrieve (default: 50)
  - `offset` (optional): Number of records to skip (default: 0)

### 📋 Complete Resource Summary

**56 MCP Resources organized by category:**

**Business Core (5)**: Clients, Suppliers, Contacts, Sales Agents, Companies
**Products & Inventory (6)**: Products, Supplier Products, Stock, Warehouses, Manufacturers, Product Families
**Orders & Documents (4)**: Customer Orders, Quotes, Customer Delivery Notes, Supplier Delivery Notes
**Invoicing & Finance (2)**: Customer Invoices, Supplier Invoices
**Accounting & Financial (10)**: Accounts, Entries, Entry Concepts, Bank Accounts, Client Bank Accounts, Supplier Bank Accounts, Special Accounts, Accounting Journals, Currencies, Fiscal Years
**Logistics (1)**: Transport Agencies
**Product Config (2)**: Attributes, Attribute Values
**Geographic (2)**: Cities, Postal Codes
**Document Management (4)**: File Attachments, File Relations, Document Transformations, Document Status
**System Admin (3)**: API Access, API Keys, Scheduled Jobs
**Communication (2)**: Email Notifications, Sent Emails

### 🔧 Claude Desktop Tools

All resources have corresponding interactive tools for Claude Desktop:
- `get_clientes`, `get_productos`, `get_proveedores`, `get_stocks`
- `get_pedidoclientes`, `get_facturaclientes`, `get_presupuestoclientes`
- `get_cuentas`, `get_asientos`, `get_conceptopartidas`, `get_cuentabancos`
- `get_cuentabancoclientes`, `get_cuentabancoproveedores`, `get_cuentaespeciales`
- `get_diarios`, `get_divisas`, `get_doctransformations`, `get_ejercicios`
- `get_emailnotifications`, `get_emailsentes`, `get_empresas`, `get_estadodocumentos`
- `get_fabricantes`, `get_familias`, `get_contactos`, `get_agentes`
- `get_almacenes`, `get_atributos`, and 19 more tools covering all resources

### 🎯 Specialized Business Tools

**Advanced Customer Invoice Search**:
- **`get_facturas_cliente_por_cifnif`**: Retrieve customer invoices by CIF/NIF (tax ID)
  - **Required Parameter**: `cifnif` - Customer's tax identification number
  - **Optional Parameters**: `limit`, `offset`, `order` (sorting)
  - **Two-step Process**: 
    1. Searches for customer by CIF/NIF
    2. Retrieves all invoices for that customer
  - **Response**: Includes customer information + paginated invoice list
  - **Error Handling**: Comprehensive validation and user-friendly error messages

**Usage Example**:
```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "12345678A",
  limit: 25,
  order: "fecha:desc"
})
```

**Response Structure**:
```json
{
  "clientInfo": {
    "cifnif": "12345678A",
    "codcliente": "CLI001",
    "nombre": "Customer Name"
  },
  "invoices": {
    "meta": { "total": 15, "limit": 25, "offset": 0, "hasMore": false },
    "data": [/* invoice array */]
  }
}
```

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
├── fs/
│   └── client.ts            # FacturaScripts API client
├── types/
│   └── facturascripts.ts    # TypeScript interfaces for all entities
├── utils/
│   └── filterParser.ts      # Dynamic filtering and sorting utilities
└── modules/                  # Modular architecture organized by categories
    ├── core-business/        # Essential business entities
    │   ├── clientes/         # Customer management
    │   ├── productos/        # Product catalog
    │   ├── proveedores/      # Supplier management
    │   └── stocks/           # Inventory management
    ├── sales-orders/         # Sales and order processing
    │   ├── pedidoclientes/   # Customer orders
    │   ├── facturaclientes/  # Customer invoices
    │   ├── presupuestoclientes/ # Customer quotes
    │   ├── albaranclientes/  # Customer delivery notes
    │   └── line-items/       # All document line items
    ├── purchasing/           # Procurement and supplier operations
    │   ├── facturaproveedores/ # Supplier invoices
    │   ├── albaranproveedores/ # Supplier delivery notes
    │   └── productoproveedores/ # Products by supplier
    ├── accounting/           # General accounting
    │   ├── asientos/         # Accounting entries
    │   ├── cuentas/          # Chart of accounts
    │   ├── diarios/          # Accounting journals
    │   ├── ejercicios/       # Fiscal years
    │   └── conceptopartidas/ # Entry concepts
    ├── finance/              # Financial management
    │   ├── cuentabancos/     # Bank accounts
    │   ├── cuentabancoclientes/ # Customer bank accounts
    │   ├── cuentabancoproveedores/ # Supplier bank accounts
    │   ├── cuentaespeciales/ # Special accounts
    │   └── divisas/          # Currencies
    ├── configuration/        # System configuration (14 modules)
    │   ├── almacenes/        # Warehouses
    │   ├── agentes/          # Sales agents
    │   ├── formapagos/       # Payment methods
    │   ├── impuestos/        # Tax rates
    │   ├── familias/         # Product families
    │   ├── fabricantes/      # Manufacturers
    │   └── [8 more...]       # Additional configuration
    ├── system/               # System administration (7 modules)
    │   ├── apiaccess/        # API access control
    │   ├── apikeyes/         # API key management
    │   ├── logmessages/      # System logs
    │   └── [4 more...]       # Additional system modules
    ├── communication/        # Communications (3 modules)
    │   ├── emailnotifications/ # Email templates
    │   ├── emailsentes/      # Email history
    │   └── contactos/        # Contact management
    └── geographic/           # Geographic data (3 modules)
        ├── ciudades/         # Cities
        ├── codigopostales/   # Postal codes
        └── empresas/         # Company locations

tests/
├── unit/                    # Unit tests organized by module categories
│   ├── modules/
│   │   ├── core-business/   # Tests for clients, products, suppliers, stock
│   │   ├── sales-orders/    # Tests for customer orders, invoices, quotes, delivery notes
│   │   ├── purchasing/      # Tests for supplier operations and documents
│   │   ├── accounting/      # Tests for accounting entries, accounts, journals
│   │   ├── finance/         # Tests for bank accounts, currencies, financial data
│   │   ├── configuration/   # Tests for system configuration entities
│   │   ├── system/          # Tests for system administration
│   │   ├── communication/   # Tests for contacts, emails, notifications
│   │   └── geographic/      # Tests for geographic data
│   └── fs/                  # Tests for core client functionality
├── integration/
│   └── modules/             # Integration tests organized by same categories
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

The server currently provides **complete coverage** of all major FacturaScripts entities with 56 comprehensive resources. To add new resources:

1. **Create Module**: Add new module in `src/modules/{category}/{name}/` following modular patterns
2. **Resource Implementation**: Create `resource.ts` with MCP resource implementation
3. **Tool Definition**: Create `tool.ts` with Claude Desktop tool definition
4. **Module Exports**: Create `index.ts` with module exports
5. **Add Types**: Define TypeScript interfaces in `src/types/facturascripts.ts`
6. **Register Module**: Add to `src/index.ts` imports, instances, tools, and handlers
7. **Add Tests**: Create unit tests in `tests/unit/modules/{category}/`
8. **Update Documentation**: Add to README.md and CLAUDE.md

**Module Implementation Pattern**:
```typescript
// src/modules/{category}/{name}/resource.ts
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export class NewEntityResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    const { limit, offset, additionalParams } = parseUrlParameters(uri);
    // Call API with advanced filtering/sorting support
    // Return structured response with error handling
  }
  
  matchesUri(uri: string): boolean {
    return uri === 'facturascripts://newentity' || 
           uri.startsWith('facturascripts://newentity?');
  }
}

// src/modules/{category}/{name}/tool.ts
export const toolDefinition = {
  name: 'get_newentity',
  description: 'Spanish description of functionality',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', default: 50 },
      offset: { type: 'number', default: 0 },
      filter: { type: 'string', description: 'Dynamic filtering...' },
      order: { type: 'string', description: 'Dynamic sorting...' }
    }
  }
};
```

**Current Coverage**: Business Core, Products & Inventory, Orders & Documents, Invoicing, Accounting, Logistics, Geographic Data, Document Management, and System Administration.

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