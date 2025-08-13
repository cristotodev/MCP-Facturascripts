# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - TBD - New Resources and Tools

### Added
- New Resources and Tools

## [0.3.0] - 2025-01-13 - Banking and Financial Resources

### Added
- **CuentabancocllientesResource**: New MCP resource for client bank accounts data
- **CuentabancoproveedoresResource**: New MCP resource for supplier bank accounts data  
- **CuentaespecialesResource**: New MCP resource for special accounts data
- **DiariosResource**: New MCP resource for accounting journals data
- **DivisasResource**: New MCP resource for currencies data
- New TypeScript interfaces for all 5 resources based on OpenAPI specifications
- Interactive tools for Claude Desktop: `get_cuentabancoclientes`, `get_cuentabancoproveedores`, `get_cuentaespeciales`, `get_diarios`, `get_divisas`
- Comprehensive unit tests for all new resources (30+ new tests)
- Full documentation updates across README.md and CLAUDE.md

### Changed
- Updated resource count from 28 to 33 total MCP resources
- Enhanced accounting & financial category from 4 to 9 resources
- Updated project structure documentation with all new resource files
- Enhanced test coverage to 223 total unit and integration tests

### Fixed
- Maintained consistent error handling patterns across all new resources
- Proper TypeScript compilation and type safety validation

## [0.2.0] - 2025-01-13 - New Resources and Tools

### Added
- **ConceptopartidasResource**: New MCP resource for accounting entry concepts data
- **ContactosResource**: New MCP resource for contacts management data
- **CronjobesResource**: New MCP resource for scheduled jobs data (preserves API endpoint typo)
- **CuentasResource**: New MCP resource for accounting accounts data
- **CuentabancosResource**: New MCP resource for bank accounts data
- New TypeScript interfaces for all 5 resources based on OpenAPI specifications
- Interactive tools for Claude Desktop: `get_conceptopartidas`, `get_contactos`, `get_cronjobes`, `get_cuentas`, `get_cuentabancos`
- Comprehensive unit tests for all new resources (33+ new tests)
- Full documentation updates across README.md and CLAUDE.md

### Changed
- Updated resource count from 22 to 28 total MCP resources
- Enhanced project structure documentation with all new resources
- Updated tool naming patterns documentation
- Improved business data access description to include accounting and contact management

### Fixed
- Resolved duplicate TypeScript interface conflicts in `src/types/facturascripts.ts`
- Maintained consistent error handling patterns across all resources

## [0.0.1] - 2025-01-13 - New Resources and Tools

### Added
- **ProductoproveedoresResource**: New MCP resource for supplier products data
- **PedidoclientesResource**: New MCP resource for customer orders data
- **FacturaclientesResource**: New MCP resource for customer invoices data
- **ProductosResource**: New MCP resource for products data (previously existed but now properly documented)
- **AgenciatransportesResource**: New MCP resource for transport agencies data
- **AgentesResource**: New MCP resource for agents data
- **AlbaranclientesResource**: New MCP resource for customer delivery notes data
- **AlbaranproveedoresResource**: New MCP resource for supplier delivery notes data
- **AlmacenesResource**: New MCP resource for warehouses data
- **ApiaccessResource**: New MCP resource for API access management data
- **ApikeyesResource**: New MCP resource for API keys management data
- **AsientosResource**: New MCP resource for accounting entries data
- **AtributosResource**: New MCP resource for attributes data
- **AtributovaloresResource**: New MCP resource for attribute values data
- **AttachedfilesResource**: New MCP resource for attached files data
- **AttachedfilerelationsResource**: New MCP resource for attached file relations data
- **CiudadesResource**: New MCP resource for cities data
- **CodigopostalesResource**: New MCP resource for postal codes data
- Comprehensive unit tests for all new resources
- Integration tests for all new resources with conditional execution
- Updated documentation across README.md and CLAUDE.md with all new resources
- Test-Driven Development (TDD) setup with Vitest
- Comprehensive unit tests for `FacturaScriptsClient` class
- Comprehensive unit tests for `ClientesResource` class  
- Integration tests for real API testing
- Test scripts: `test`, `test:watch`, `test:ui`, `test:run`
- TDD workflow documentation in CLAUDE.md
- Improved parameter validation in all resource classes

### Changed
- Enhanced README.md with comprehensive documentation of all 22 MCP resources
- Updated project structure documentation to reflect all resource files
- Enhanced CLAUDE.md with TDD workflow and testing guidelines
- Updated CLAUDE.md and README.md with complete resource listings including URIs and descriptions
- Fixed parameter parsing to handle invalid limit/offset values gracefully across all resources

### Fixed
- Parameter validation now properly handles NaN values from URL query params in all resources