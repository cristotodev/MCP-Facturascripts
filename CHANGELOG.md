# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive developer onboarding guide with 10-section documentation
- Quick start reference guide with code templates and patterns
- Specialized business tool: `get_facturas_cliente_por_cifnif` for invoice search by CIF/NIF

### Changed
- Updated `.gitignore` to include documentation folder in version control
- Enhanced documentation structure and developer experience

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

- [1.0.1]: https://github.com/cristotodev/MCP-Facturascripts/compare/v1.0.0...v1.0.1
- [1.0.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.5.0...v1.0.0
- [0.5.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.4.0...v0.5.0
- [0.4.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.3.0...v0.4.0
- [0.3.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.2.0...v0.3.0
- [0.2.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.1.0...v0.2.0
- [0.1.0]: https://github.com/cristotodev/MCP-Facturascripts/compare/v0.0.1...v0.1.0
- [0.0.1]: https://github.com/cristotodev/MCP-Facturascripts/releases/tag/v0.0.1