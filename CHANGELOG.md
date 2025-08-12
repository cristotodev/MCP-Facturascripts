# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **ProductoproveedoresResource**: New MCP resource for supplier products data
- **PedidoclientesResource**: New MCP resource for customer orders data
- **FacturaclientesResource**: New MCP resource for customer invoices data
- **ProductosResource**: New MCP resource for products data (previously existed but now properly documented)
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
- Enhanced README.md with comprehensive documentation of all 5 MCP resources
- Updated project structure documentation to reflect all resource files
- Enhanced CLAUDE.md with TDD workflow and testing guidelines
- Fixed parameter parsing to handle invalid limit/offset values gracefully across all resources

### Fixed
- Parameter validation now properly handles NaN values from URL query params in all resources