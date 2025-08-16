# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **New OpenAPI Part16 Endpoints**: Implementation of 4 new FacturaScripts API endpoints
- **Product Variants Management**: `get_variantes` tool for product variants with attributes, pricing, and stock tracking
- **Work Events Monitoring**: `get_workeventes` tool for system job/task tracking and process monitoring
- **Analytics Models**: `get_totalmodeles` tool for system analytics and data aggregation models
- **PDF Export Functionality**: `exportar_factura_cliente` tool for customer invoice PDF generation and download
- **Enhanced Client Support**: Added `getRaw` method to FacturaScriptsClient for binary data handling (PDF downloads)
- **Advanced Product Variant Features**: Support for barcode tracking, cost analysis, margin calculation, and multi-attribute variants
- **System Event Analytics**: Work event filtering by completion status, date ranges, and user assignment
- **Binary Data Handling**: Comprehensive PDF export with format options, language selection, and metadata response

### Changed
- **Resource Count**: Expanded from 56 to 59 total MCP resources with specialized system and product management
- **Tool Count**: Enhanced from 61 to 65 interactive tools including specialized export functionality
- **TypeScript Interfaces**: Added 3 new strongly-typed interfaces (TotalModel, Variante, WorkEvent)
- **Client Capabilities**: Enhanced FacturaScriptsClient with binary response handling for document exports
- **Test Coverage**: Increased to 445+ comprehensive tests with new modules validation

### Fixed
- **Integration Test Robustness**: Enhanced error handling for non-existent API endpoints with graceful fallbacks
- **Data Type Flexibility**: Improved test assertions to handle API variations (boolean vs numeric values)
- **Tool Implementation Patterns**: Corrected parameter passing in new tool implementations
- **Date Validation**: Enhanced date parsing validation for work events with invalid date handling

## [1.0.2] - 2025-08-16 - Enhanced Business Analytics and Customer Intelligence

### Added
- **Customer Billing Rankings Tool**: `get_clientes_top_facturacion` for customer analytics by total invoiced amount within date ranges
- **Advanced Customer Analytics**: Multi-step process with invoice filtering, client grouping, totals calculation, and ranking generation
- **Payment Status Filtering**: Optional `solo_pagadas` parameter to analyze only paid invoices for cash flow insights
- **Comprehensive Business Documentation**: Complete usage examples for customer billing analytics in `docs/TOOL_USAGE_EXAMPLES.md`
- **Business Intelligence Use Cases**: Sales team management, financial analysis, CRM insights, and strategic decision making scenarios
- **Advanced Date Range Analytics**: Quarterly, monthly, and year-to-date customer performance analysis
- **Revenue Concentration Analysis**: Tools for identifying dependency on top customers and managing concentration risk
- **Advanced Business Analytics Tool**: `get_productos_mas_vendidos` for best-selling products analysis with date range filtering
- **TypeScript SDK Examples**: Comprehensive production-ready code samples in `examples/typescript-sdk/`
- **Business Intelligence Features**: Product ranking by quantity sold and total revenue with flexible sorting
- **Enhanced Tool Usage Documentation**: Detailed business scenarios and usage patterns in `docs/TOOL_USAGE_EXAMPLES.md`
- **Implementation Status Documentation**: Complete project status overview in `docs/IMPLEMENTATION_STATUS.md`
- **Multi-step Data Aggregation**: Advanced API operations with invoice lookup → line item aggregation → product grouping
- **Smart Product Grouping**: Handles both catalog products (by referencia) and custom services (by descripcion)

### Changed
- **Test Coverage**: Increased from 358 to 421 comprehensive tests with business scenario validation (63 new tests total)
- **Tool Count**: Enhanced from 56 to 61 interactive tools with expanded specialized business analytics (5 new tools)
- **Documentation Structure**: Updated all documentation to reflect new analytics capabilities and expanded tool suite
- **Implementation Status**: Enhanced specialized business tools from 1 to 5 with comprehensive business analytics coverage
- **Tool Usage Examples**: Added 400+ lines of business-focused documentation with real-world scenarios and advanced filtering patterns
- **Developer Experience**: Enhanced onboarding guide with TypeScript SDK examples and patterns

### Fixed
- **Test Assertion Logic**: Corrected sorting validation in unit tests to match actual descending order by total_facturado
- **Parameter Normalization**: Enhanced limit bounds enforcement (1-1000) and offset validation for customer ranking queries
- **Business Error Handling**: Improved error messages for no invoices found, no paid invoices, and client lookup failures
- **Parameter Validation**: Improved limit bounds enforcement with nullish coalescing for edge cases
- **Date Range Handling**: Robust validation and error messaging for business date periods
- **Integration Testing**: Enhanced real API testing with malformed parameter scenarios

## [1.0.1] - 2025-01-14 - Complete Modular Architecture and Production Ready

### Added
- **Complete Modular Architecture**: Full migration to 8-category modular structure (core-business, sales-orders, purchasing, accounting, finance, configuration, system, communication, geographic)
- **MCP Inspector Compatibility**: Auto-building entry point ensuring compatibility with MCP Inspector and development tools
- **Specialized Business Tools**: Advanced customer invoice search tool (`get_facturas_cliente_por_cifnif`) with two-step API operations
- **Comprehensive Testing**: 358 tests passing with modular organization matching source structure
- **Enhanced Documentation**: Updated all documentation to reflect modular architecture and current capabilities

### Changed
- **Project Structure**: Complete reorganization into logical module categories
- **Test Organization**: Modular test structure mirroring source code organization for better maintainability
- **Import Paths**: Updated all imports to use modular paths with proper ESM `.js` extensions
- **Documentation**: Enhanced README.md and CLAUDE.md with current project status and architecture
- **Build Process**: Improved build configuration for production deployment

### Fixed
- **MCP Inspector Issues**: Resolved compatibility problems with auto-building TypeScript entry point
- **Import Resolution**: Fixed ESM import issues across all modules
- **Test Coverage**: Maintained 100% test success rate through architecture migration

## [1.0.0] - 2025-01-14 - Test Reorganization and Enhanced Documentation

### Added
- **Modular Test Organization**: Reorganized all test files to match the modular structure of `src/modules/`
- **Enhanced Test Structure**: Tests now organized into 9 logical categories
- **Comprehensive Test Coverage**: 347 tests across unit and integration testing
- **Improved Documentation**: Updated README.md and CLAUDE.md to reflect new test structure

### Changed
- **Test Structure**: Moved 68 test files from flat structure to modular organization
- **Import Paths**: Updated all test import paths to work with new directory structure
- **Documentation Updates**: Updated resource count and test statistics
- **Maintainability**: Related tests are now grouped together for easier maintenance

### Fixed
- **Test Organization**: Better separation of concerns with category-based test organization
- **Navigation**: Test structure now mirrors source code organization for intuitive navigation

## [0.5.0] - 2025-01-13 - Advanced API Integration and Dynamic Filtering

### Added
- **Advanced Dynamic Filtering**: Complete filtering system supporting operators (_gt, _gte, _lt, _lte, _neq, _like)
- **Comprehensive Sorting**: Multi-field sorting with dynamic parameter parsing
- **Enhanced Query Parameters**: Full support for limit, offset, filter, and order parameters
- **Advanced API Client**: Enhanced FacturaScripts API client with pagination and filtering support

### Changed
- **All Resources**: Updated all 56 resources to support advanced filtering and sorting
- **API Integration**: Improved API response handling and error management
- **Documentation**: Enhanced filtering and sorting documentation with examples

### Fixed
- **Parameter Parsing**: Robust URL parameter parsing with validation
- **Error Handling**: Comprehensive error handling for API operations

## [0.4.0] - 2025-01-13 - Complete Resource Coverage

### Added
- **28 New Resources**: Added complete coverage of remaining FacturaScripts entities
- **Geographic Resources**: Cities, postal codes, and company location data
- **System Administration**: API access, scheduled jobs, document transformations
- **Communication**: Email notifications, sent emails, and contact management
- **Configuration**: Product families, manufacturers, document formats, tax zones

### Changed
- **Resource Count**: Expanded from 28 to 56 total MCP resources
- **Complete Coverage**: Full FacturaScripts API coverage across all business domains
- **Enhanced Testing**: Comprehensive test suite for all resources

### Fixed
- **API Compatibility**: Maintained backward compatibility across all resource additions
- **Type Safety**: Complete TypeScript interface coverage for all entities

## [0.3.0] - 2025-01-13 - OpenAPI-Based Resources and System Enhancement

### Added
- **5 New Resources**: Document transformations, fiscal years, email notifications, sent emails, companies
- **OpenAPI Integration**: Resources based on OpenAPI specifications
- **Interactive Tools**: Claude Desktop tools for all new resources
- **System Administration**: Enhanced with email communication resources

### Changed
- **Resource Count**: Expanded from 33 to 38 total MCP resources
- **Test Coverage**: Enhanced to 253 total unit and integration tests

### Fixed
- **Error Handling**: Consistent error handling patterns across all resources
- **Type Safety**: Proper TypeScript compilation validation

## [0.2.0] - 2025-01-13 - Banking and Financial Resources

### Added
- **5 Banking Resources**: Client bank accounts, supplier bank accounts, special accounts, journals, currencies
- **Financial Management**: Complete banking and currency management coverage
- **Accounting Integration**: Enhanced accounting category with journal and special account support

### Changed
- **Resource Count**: Expanded from 28 to 33 total MCP resources
- **Accounting Category**: Enhanced from 4 to 9 resources
- **Test Coverage**: Enhanced to 223 total unit and integration tests

### Fixed
- **Consistent Patterns**: Maintained error handling patterns across all banking resources

## [0.1.0] - 2025-01-13 - Core Business Resources and TDD Setup

### Added
- **22 Core Resources**: Complete coverage of core business entities (customers, products, suppliers, orders, invoices)
- **Test-Driven Development**: Comprehensive TDD setup with Vitest
- **Interactive Tools**: Claude Desktop integration for all resources
- **Comprehensive Testing**: Unit and integration tests for all resources

### Changed
- **Project Structure**: Organized into logical resource categories
- **Documentation**: Complete documentation of all resources and capabilities

### Fixed
- **Parameter Validation**: Robust parameter validation across all resources
- **API Integration**: Reliable FacturaScripts API integration

## [0.0.1] - 2025-01-13 - Initial Release

### Added
- **MCP Server**: Initial Model Context Protocol server implementation
- **FacturaScripts Integration**: Basic API client for FacturaScripts REST API v3
- **Core Resources**: Initial set of business resources (clients, products, suppliers)
- **TypeScript Support**: Full TypeScript implementation with type safety
- **Environment Configuration**: Zod-based environment validation

### Changed
- **Project Setup**: Initial project structure and configuration

### Fixed
- **Initial Implementation**: Basic functionality and error handling

---

## Version Links

- [1.0.2]: https://github.com/cristotodev/MCP-Facturascripts/compare/v1.0.1...v1.0.2
- [1.0.1]: https://github.com/cristotodev/MCP-Facturascripts/compare/v1.0.0...v1.0.1
- [1.0.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.5.0...v1.0.0
- [0.5.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.4.0...v0.5.0
- [0.4.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.3.0...v0.4.0
- [0.3.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.2.0...v0.3.0
- [0.2.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.1.0...v0.2.0
- [0.1.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.0.1...v0.1.0
- [0.0.1]: https://github.com/cristotodev/MCP-Facturascripts/releases/tag/v0.0.1