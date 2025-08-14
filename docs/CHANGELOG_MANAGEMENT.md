# Changelog Management Guide

This guide explains how to maintain the project changelog following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

## Changelog Format

Our changelog follows the Keep a Changelog format with these sections:

- **Added** - New features
- **Changed** - Changes in existing functionality  
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

## Manual Changelog Maintenance

### 1. Adding Unreleased Changes

When you make changes, add them to the `[Unreleased]` section:

```markdown
## [Unreleased]

### Added
- New specialized business tool for customer search
- Comprehensive error handling for API failures

### Changed
- Updated filtering system to support more operators
- Enhanced documentation structure

### Fixed
- Resolved import path issues in modular architecture
```

### 2. Creating a New Release

When releasing a new version:

1. Move items from `[Unreleased]` to a new version section
2. Add the version number and date
3. Leave `[Unreleased]` empty for future changes

```markdown
## [Unreleased]

## [1.0.2] - 2025-01-15 - New Features and Improvements

### Added
- New specialized business tool for customer search
- Comprehensive error handling for API failures

### Changed
- Updated filtering system to support more operators
- Enhanced documentation structure
```

## Automated Changelog Tools

We have several npm scripts available for changelog automation:

### Basic Changelog Generation

```bash
# Generate conventional changelog (from commits)
npm run changelog

# Generate auto-changelog from git history
npm run changelog:auto

# Generate full changelog with Keep a Changelog template
npm run changelog:all

# Show unreleased changes only
npm run changelog:unreleased
```

### Release Scripts

```bash
# Patch release (1.0.1 -> 1.0.2)
npm run release

# Minor release (1.0.1 -> 1.1.0)
npm run release:minor

# Major release (1.0.1 -> 2.0.0)  
npm run release:major
```

### Manual Version Management

```bash
# Create version and update changelog
npm run version

# Minor version bump with tests
npm run version:minor

# Major version bump with tests
npm run version:major
```

## Conventional Commits

To support automatic changelog generation, use conventional commit format:

```bash
# Features
feat: add customer search by email tool
feat(api): implement advanced filtering operators

# Bug fixes
fix: resolve memory leak in background tasks
fix(client): handle API timeout errors properly

# Documentation
docs: update API documentation
docs(changelog): add changelog management guide

# Code style
style: format code with prettier
style(tests): organize test imports

# Refactoring
refactor: reorganize user service modules
refactor(types): simplify interface definitions

# Tests
test: add unit tests for auth module
test(integration): add end-to-end API tests

# Maintenance
chore: update dependencies
chore(ci): configure GitHub Actions
```

## Workflow Integration

### During Development

1. **Make changes** following conventional commit format
2. **Add to Unreleased** section manually for significant changes
3. **Run tests** to ensure everything works
4. **Commit with conventional format**

### Before Release

1. **Review Unreleased section** - ensure all changes are documented
2. **Run changelog generation** if using conventional commits:
   ```bash
   npm run changelog:unreleased
   ```
3. **Manually edit** if needed to improve clarity
4. **Create release** using release scripts

### Release Process

```bash
# For patch releases (bug fixes)
npm run release

# For minor releases (new features)
npm run release:minor

# For major releases (breaking changes)
npm run release:major
```

This will:
1. Bump version in package.json
2. Update changelog
3. Build the project
4. Run tests
5. Create git tag

### After Release

1. **Push changes** to repository:
   ```bash
   git push origin main --tags
   ```
2. **Create GitHub release** from the tag
3. **Update documentation** if needed

## Best Practices

### Writing Good Changelog Entries

✅ **Good examples:**
```markdown
### Added
- Customer invoice search by CIF/NIF tax identification number
- Advanced filtering with operators (gt, gte, lt, lte, neq, like)
- Comprehensive error handling with user-friendly Spanish messages

### Changed
- Improved API response time by 50% through caching
- Enhanced module organization for better maintainability
- Updated dependencies to latest stable versions

### Fixed
- Resolved memory leak in background task processing
- Fixed TypeScript compilation errors in production build
- Corrected timezone handling in date calculations
```

❌ **Poor examples:**
```markdown
### Added
- Stuff
- New function
- Update

### Changed
- Fixed things
- Made it better
- Various improvements
```

### Categorization Guidelines

- **Added**: New features, new resources, new tools, new documentation
- **Changed**: Modifications to existing features, performance improvements, dependency updates
- **Fixed**: Bug fixes, error handling improvements, compilation fixes
- **Security**: Security patches, vulnerability fixes, permission improvements
- **Deprecated**: Features marked for removal (include removal timeline)
- **Removed**: Deleted features, removed dependencies, cleaned up code

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes, major feature overhauls
- **Minor (0.X.0)**: New features, backwards-compatible changes
- **Patch (0.0.X)**: Bug fixes, small improvements

## Troubleshooting

### Common Issues

1. **Changelog not updating automatically**
   ```bash
   # Check if conventional-changelog is installed
   npm list conventional-changelog-cli
   
   # Re-install if missing
   npm install -D conventional-changelog-cli
   ```

2. **Auto-changelog not working**
   ```bash
   # Check git log format
   git log --oneline -10
   
   # Ensure commits follow conventional format
   ```

3. **Version script failing**
   ```bash
   # Check if changelog script works independently
   npm run changelog:unreleased
   
   # Check git status
   git status
   ```

### Manual Fixes

If automated tools fail, you can always maintain the changelog manually:

1. Follow the Keep a Changelog format
2. Add entries to appropriate sections
3. Include version numbers and dates
4. Link to GitHub releases/tags

## Integration with GitHub

### GitHub Releases

Link changelog entries to GitHub releases:

```markdown
## [1.0.2] - 2025-01-15

[View on GitHub](https://github.com/cristotodev/MCP-Facturascripts/releases/tag/v1.0.2)
```

### Pull Request Templates

Include changelog updates in PR templates:

```markdown
## Changelog Updates

- [ ] Added entry to [Unreleased] section
- [ ] Categorized changes appropriately
- [ ] Used clear, user-focused language
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run changelog` | Generate from conventional commits |
| `npm run changelog:auto` | Auto-generate from git history |
| `npm run changelog:unreleased` | Show unreleased changes |
| `npm run release` | Patch release with changelog |
| `npm run release:minor` | Minor release with changelog |
| `npm run release:major` | Major release with changelog |

---

*This guide is maintained by the MCP FacturaScripts development team. Last updated: January 2025*