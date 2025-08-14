## 1.0.1 (2025-08-14)


### Bug Fixes

* correct API endpoint names for new MCP resources ([ee5897b](https://github.com/cristotodev/MCP-Facturascripts/commit/ee5897b476d2240c7a448befe74d09db2362e292))


### Features

* add 5 banking and financial resources with comprehensive testing ([76969c0](https://github.com/cristotodev/MCP-Facturascripts/commit/76969c012bf53bbfacdbf46b64d4e3dc050f9425))
* add complete OpenAPI-based resources and enhanced query parameter support ([a26c243](https://github.com/cristotodev/MCP-Facturascripts/commit/a26c243f214f90efe221258425504d93f302cc4b))
* add comprehensive TDD setup with Vitest ([d8efc92](https://github.com/cristotodev/MCP-Facturascripts/commit/d8efc921d08a85fdd1508876e90c163749d2d579))
* add interactive tools for Claude Desktop integration ([204526a](https://github.com/cristotodev/MCP-Facturascripts/commit/204526a3533723022851706424b2b7db13ea750a))
* add presupuestoclientes MCP resource for customer quotes ([623cd38](https://github.com/cristotodev/MCP-Facturascripts/commit/623cd384799525729a926adbd2002332dddd9dc3))
* add productoproveedores, pedidoclientes, and facturaclientes MCP resources ([acf50be](https://github.com/cristotodev/MCP-Facturascripts/commit/acf50beec57082262ee19acdb01e45ee014d8105))
* implement 5 new OpenAPI-based resources and comprehensive documentation update (v0.2.0) ([9d04e1c](https://github.com/cristotodev/MCP-Facturascripts/commit/9d04e1cbe38b002cce5fa5f1007fb81fc29f04de))
* implement 5 new OpenAPI-based resources and comprehensive system enhancement (v0.3.0) ([43393a3](https://github.com/cristotodev/MCP-Facturascripts/commit/43393a35e50c184707bb00f0ba2a021f385d5fca))
* implement advanced FacturaScripts API integration with dynamic filtering (v0.4.0) ([195e175](https://github.com/cristotodev/MCP-Facturascripts/commit/195e1757ac2dd3a997637e38b0e7d274962cf789))
* implement comprehensive changelog automation and test reorganization ([08254fb](https://github.com/cristotodev/MCP-Facturascripts/commit/08254fb130ed0e484ebd1dbea3daa513e33a4e9d))
* implement comprehensive modular architecture and project cleanup (v0.5.0) ([b6e8e3b](https://github.com/cristotodev/MCP-Facturascripts/commit/b6e8e3b6f126f4e65ed890f1743148d463e8de5c))



# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-14 - Test Reorganization and Enhanced Documentation

### Added
- **Modular Test Organization**: Reorganized all test files to match the modular structure of `src/modules/`
- **Enhanced Test Structure**: Tests now organized into 9 logical categories (core-business, sales-orders, purchasing, accounting, finance, configuration, system, communication, geographic)
- **Improved Documentation**: Updated README.md and CLAUDE.md to reflect new test structure and current project statistics

### Changed
- **Test Structure**: Moved 68 test files (56 unit + 12 integration) from flat structure to modular organization
- **Import Paths**: Updated all test import paths to work with new directory structure
- **Test Coverage**: All 347 tests continue to pass with the new organization
- **Documentation Updates**: Updated resource count from 41 to 56 and test count from 271 to 347
- **Maintainability**: Related tests are now grouped together for easier maintenance
- **Navigation**: Test structure now mirrors source code organization for intuitive navigation
- **Organization**: Better separation of concerns with category-based test organization

## [0.3.0] - 2025-01-13 - OpenAPI-Based Resources and System Enhancement

### Added
- **DoctransformationsResource**: New MCP resource for document transformations data
- **EjerciciosResource**: New MCP resource for fiscal years data
- **EmailnotificationsResource**: New MCP resource for email notifications data
- **EmailsentesResource**: New MCP resource for sent emails data  
- **EmpresasResource**: New MCP resource for companies data
- New TypeScript interfaces for all 5 resources based on OpenAPI specifications
- Interactive tools for Claude Desktop: `get_doctransformations`, `get_ejercicios`, `get_emailnotifications`, `get_emailsentes`, `get_empresas`
- Comprehensive unit tests for all new resources (30 new tests)
- Full documentation updates across README.md and CLAUDE.md

### Changed
- Updated resource count from 33 to 38 total MCP resources
- Enhanced system administration category with email communication resources
- Enhanced business core category with companies resource
- Updated project structure documentation with all new resource files
- Enhanced test coverage to 253 total unit and integration tests

### Fixed
- Maintained consistent error handling patterns across all new resources
- Proper TypeScript compilation and type safety validation

## [0.3.1] - 2025-01-13 - Banking and Financial Resources

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