# Commit Convention Guide

This project uses [Conventional Commits](https://conventionalcommits.org/) for automated versioning and changelog generation.

## Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

## Breaking Changes

Add `!` after the type or add `BREAKING CHANGE:` in the footer to trigger a major version bump.

## Examples

```bash
feat: add get_clientes_frecuencia_compras tool for purchase frequency analysis
fix: handle client lookup failures in frequency calculation
docs: update API documentation with new tool examples
feat!: change API response format (breaking change)
feat(tools): add PDF export functionality for customer invoices
```

## Scopes (Optional)

- `tools`: MCP tools
- `resources`: MCP resources  
- `api`: API client changes
- `tests`: Test-related changes
- `build`: Build system changes
- `ci`: CI/CD changes