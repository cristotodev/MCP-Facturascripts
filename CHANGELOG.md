# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Test-Driven Development (TDD) setup with Vitest
- Comprehensive unit tests for `FacturaScriptsClient` class
- Comprehensive unit tests for `ClientesResource` class  
- Integration tests for real API testing
- Test scripts: `test`, `test:watch`, `test:ui`, `test:run`
- TDD workflow documentation in CLAUDE.md
- Improved parameter validation in `ClientesResource.getResource()`

### Changed
- Enhanced CLAUDE.md with TDD workflow and testing guidelines
- Fixed parameter parsing to handle invalid limit/offset values gracefully

### Fixed
- Parameter validation now properly handles NaN values from URL query params