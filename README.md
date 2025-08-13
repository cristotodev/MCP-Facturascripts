# MCP FacturaScripts

**Version 0.3.0** - A comprehensive Model Context Protocol (MCP) server that integrates with FacturaScripts ERP system, providing seamless access to business, accounting, and administrative data through the MCP protocol.

## Features

- **38 MCP Resources**: Complete coverage of FacturaScripts entities including business transactions, accounting accounts, contacts, inventory, system administration, and more
- **Full Accounting Integration**: Access to accounting accounts, entry concepts, bank accounts, and financial data
- **Contact & CRM Management**: Comprehensive contact management with customer and supplier relationships
- **Business Operations**: Orders, invoices, quotes, delivery notes, products, suppliers, and inventory
- **System Administration**: API access control, scheduled jobs, attachments, and configuration
- **MCP Protocol**: Full compatibility with Model Context Protocol for AI integration
- **RESTful Integration**: Connects to FacturaScripts REST API v3
- **TypeScript**: Built with TypeScript for type safety and better development experience
- **Advanced Filtering**: Support for filters, sorting, and pagination on all resources
- **Claude Desktop Integration**: Interactive tools for seamless AI assistant integration
- **Comprehensive Testing**: 253 unit and integration tests with Test-Driven Development approach

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

All **38 resources** support pagination with `limit`, `offset`, `filter`, and `order` parameters and return data in a consistent format with metadata.

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

### 📋 Complete Resource Summary

**38 MCP Resources organized by category:**

**Business Core (5)**: Clients, Suppliers, Contacts, Sales Agents, Companies
**Products & Inventory (4)**: Products, Supplier Products, Stock, Warehouses  
**Orders & Documents (4)**: Customer Orders, Quotes, Customer Delivery Notes, Supplier Delivery Notes
**Invoicing & Finance (2)**: Customer Invoices, Supplier Invoices
**Accounting & Financial (10)**: Accounts, Entries, Entry Concepts, Bank Accounts, Client Bank Accounts, Supplier Bank Accounts, Special Accounts, Accounting Journals, Currencies, Fiscal Years
**Logistics (1)**: Transport Agencies
**Product Config (2)**: Attributes, Attribute Values
**Geographic (2)**: Cities, Postal Codes
**Document Management (3)**: File Attachments, File Relations, Document Transformations
**System Admin (3)**: API Access, API Keys, Scheduled Jobs
**Communication (2)**: Email Notifications, Sent Emails

### 🔧 Claude Desktop Tools

All resources have corresponding interactive tools for Claude Desktop:
- `get_clientes`, `get_productos`, `get_proveedores`, `get_stocks`
- `get_pedidoclientes`, `get_facturaclientes`, `get_presupuestoclientes`
- `get_cuentas`, `get_asientos`, `get_conceptopartidas`, `get_cuentabancos`
- `get_cuentabancoclientes`, `get_cuentabancoproveedores`, `get_cuentaespeciales`
- `get_diarios`, `get_divisas`, `get_doctransformations`, `get_ejercicios`
- `get_emailnotifications`, `get_emailsentes`, `get_empresas`, `get_contactos`
- `get_agentes`, `get_almacenes`, `get_atributos`, and 19 more tools covering all resources

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
    ├── codigopostales.ts    # Postal codes resource implementation
    ├── conceptopartidas.ts  # Accounting entry concepts resource implementation
    ├── contactos.ts         # Contacts resource implementation
    ├── cronjobes.ts         # Scheduled jobs resource implementation
    ├── cuentas.ts           # Accounting accounts resource implementation
    ├── cuentabancos.ts      # Bank accounts resource implementation
    ├── cuentabancoclientes.ts # Client bank accounts resource implementation
    ├── cuentabancoproveedores.ts # Supplier bank accounts resource implementation
    ├── cuentaespeciales.ts  # Special accounts resource implementation
    ├── diarios.ts           # Accounting journals resource implementation
    ├── divisas.ts           # Currencies resource implementation
    ├── doctransformations.ts # Document transformations resource implementation
    ├── ejercicios.ts        # Fiscal years resource implementation
    ├── emailnotifications.ts # Email notifications resource implementation
    ├── emailsentes.ts       # Sent emails resource implementation
    └── empresas.ts          # Companies resource implementation

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

The server currently provides **complete coverage** of all major FacturaScripts entities with 38 comprehensive resources. To add new resources:

1. **Create Resource**: Add new resource class in `src/resources/` following existing patterns
2. **Add Types**: Define TypeScript interfaces in `src/types/facturascripts.ts`
3. **Register Resource**: Add to `src/index.ts` imports, instances, tools, and handlers
4. **Add Tests**: Create unit tests in `tests/unit/resources/`
5. **Update Documentation**: Add to README.md and CLAUDE.md

**Resource Implementation Pattern**:
```typescript
// src/resources/newresource.ts
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';

export class NewResourceResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse query parameters
    // Call API with pagination support
    // Return structured response with error handling
  }
  
  matchesUri(uri: string): boolean {
    // URI matching logic
  }
}
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