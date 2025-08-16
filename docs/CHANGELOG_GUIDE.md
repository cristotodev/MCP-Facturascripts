# Changelog Management Guide

This document explains how to maintain and use the changelog system for the MCP FacturaScripts project.

## Overview

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for version management.

## Manual Changelog Updates

### Format Structure

```markdown
## [Unreleased]

## [1.0.0] - 2025-01-14
### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

### Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for security improvements

## Automated Changelog Generation

### Available Scripts

```bash
# Generate changelog from conventional commits (recommended)
npm run changelog

# Generate changelog for unreleased changes only
npm run changelog:unreleased

# Auto-generate from git history (all commits)
npm run changelog:auto

# Generate complete changelog with keepachangelog template
npm run changelog:all

# Create a new version with updated changelog
npm run version

# Full release process (patch version, build, test)
npm run release

# Minor release (new features)
npm run release:minor

# Major release (breaking changes)
npm run release:major
```

### Conventional Commits

Use conventional commit format for automatic changelog generation:

```bash
# Features
feat: add user authentication system
feat(resources): add new productos resource

# Bug fixes
fix: resolve memory leak in background tasks
fix(api): handle timeout errors correctly

# Documentation
docs: update API documentation
docs(readme): add installation instructions

# Code changes
refactor: reorganize user service
style: format code with prettier
perf: optimize database queries

# Tests and maintenance
test: add unit tests for auth
chore: update dependencies
ci: add automated testing workflow
```

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
```bash
git commit -m "feat: add new MCP resource for invoices"
git commit -m "feat(openapi): implement product variants management tool"
git commit -m "feat(export): add PDF export functionality for customer invoices"
git commit -m "fix(client): handle API timeout errors"
git commit -m "fix(tests): resolve integration test parameter passing"
git commit -m "docs: update installation guide with Docker setup"
git commit -m "test: add integration tests for new resources"
```

## Release Process

### Manual Release

1. **Update changelog manually**:
   ```bash
   # Edit CHANGELOG.md
   # Move items from [Unreleased] to new version
   # Add release date
   ```

2. **Create version and tag**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

3. **Push changes**:
   ```bash
   git push origin main --tags
   ```

### Automated Release

1. **Use npm scripts**:
   ```bash
   # Patch release (bug fixes)
   npm run release

   # Minor release (new features)
   npm version minor && npm run build && npm run test:run

   # Major release (breaking changes)
   npm version major && npm run build && npm run test:run
   ```

2. **GitHub Actions**: Automated release creation on tag push

## Configuration Files

### .auto-changelog
- Configures auto-changelog behavior
- Sets up GitHub links and commit patterns
- Customizes section mappings

### .cz.json
- Defines conventional commit types
- Used by commitizen for interactive commits

## Best Practices

1. **Keep entries user-focused**: Write from the user's perspective
2. **Use imperative mood**: "Add feature" not "Added feature"
3. **Be specific**: Include relevant details and context
4. **Group related changes**: Combine related items under single bullets
5. **Link to issues**: Reference GitHub issues where relevant
6. **Date format**: Use ISO date format (YYYY-MM-DD)

## Examples

### Good Entries

```markdown
### Added
- **Product Variants Management**: `get_variantes` tool for product variants with attributes, pricing, and stock tracking
- **Work Events Monitoring**: `get_workeventes` tool for system job/task tracking and process monitoring
- **PDF Export Functionality**: `exportar_factura_cliente` tool for customer invoice PDF generation and download
- **Enhanced Client Support**: Added `getRaw` method to FacturaScriptsClient for binary data handling
- **Advanced Filtering**: Support for date ranges and status filters in all resources
- **Claude Desktop Integration**: Interactive tools for all 59 MCP resources

### Fixed
- **Integration Test Robustness**: Enhanced error handling for non-existent API endpoints with graceful fallbacks
- **Data Type Flexibility**: Improved test assertions to handle API variations (boolean vs numeric values)
- **Tool Implementation Patterns**: Corrected parameter passing in new tool implementations
- **Memory Leak**: Resolved memory leak in background API polling (#123)
- **Type Safety**: Fixed TypeScript compilation errors in resource definitions
- **API Timeout**: Improved error handling for slow FacturaScripts responses
```

### Poor Entries

```markdown
### Added
- Added stuff
- New feature
- Various improvements

### Fixed
- Fixed bugs
- Updated code
- Made changes
```

## Verification

Before releasing, verify:

1. **All tests pass**: `npm run test:run`
2. **Build succeeds**: `npm run build`
3. **Changelog is accurate**: Review all entries
4. **Version number is correct**: Follows semantic versioning
5. **Links work**: GitHub links and references are valid

## Integration with Development Workflow

1. **During development**: Use conventional commits
2. **Before PR merge**: Update [Unreleased] section
3. **During release**: Move unreleased items to new version
4. **After release**: Verify GitHub release was created
5. **Documentation**: Update related docs if needed

This system ensures consistent, automated changelog management while maintaining high-quality, user-focused release notes.