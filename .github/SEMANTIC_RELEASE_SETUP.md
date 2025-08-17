# Semantic Release Setup Guide

This repository is configured for automated releases using semantic-release. Here's how to complete the setup:

## 🚀 Quick Setup

### 1. Update Repository URL

Edit `package.json` and replace the placeholder URLs with your actual repository:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/mcp-facturascripts.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/mcp-facturascripts/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/mcp-facturascripts#readme"
}
```

### 2. GitHub Repository Settings

1. **Push this code to your GitHub repository**
2. **Enable GitHub Actions** (should be enabled by default)
3. **Set branch protection rules** (recommended):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

### 3. Repository Secrets (Optional)

If you plan to publish to npm, add this secret:
- Go to Settings → Secrets and variables → Actions
- Add `NPM_TOKEN` with your npm token

## 🎯 How It Works

### Automatic Releases Trigger On:
- **Push to main branch** with conventional commits
- **Manual trigger** via GitHub Actions UI

### Version Bumping:
- `feat:` → **Minor** version (1.0.2 → 1.1.0)
- `fix:` → **Patch** version (1.0.2 → 1.0.3)  
- `feat!:` or `BREAKING CHANGE:` → **Major** version (1.0.2 → 2.0.0)

### What Happens Automatically:
1. ✅ **Analyzes commits** since last release
2. ✅ **Determines next version** based on commit types
3. ✅ **Generates changelog** from commits
4. ✅ **Updates package.json** version
5. ✅ **Creates Git tag** (e.g., v1.0.3)
6. ✅ **Creates GitHub release** with notes
7. ✅ **Uploads build artifacts** to release

## 📝 Commit Examples

```bash
# Patch release (1.0.2 → 1.0.3)
git commit -m "fix: handle client lookup failures in frequency calculation"

# Minor release (1.0.2 → 1.1.0)  
git commit -m "feat: add purchase frequency analysis tool"

# Major release (1.0.2 → 2.0.0)
git commit -m "feat!: change API response format"
# or
git commit -m "feat: add new API endpoint

BREAKING CHANGE: API response format changed"
```

## 🧪 Testing

Test the configuration locally:

```bash
# Dry run (doesn't create releases)
npm run semantic-release:dry

# Check what would be released
npx semantic-release --dry-run
```

## 📦 Release Process

### Manual Release:
1. Go to Actions tab in GitHub
2. Select "Release" workflow
3. Click "Run workflow" → "Run workflow"

### Automatic Release:
1. Make commits using conventional format
2. Push to main branch
3. Workflow runs automatically
4. Release created if there are releasable commits

## 🔧 Configuration Files

- **`.releaserc.json`** - Semantic release configuration
- **`.github/workflows/release.yml`** - GitHub Actions workflow
- **`.github/COMMIT_CONVENTION.md`** - Commit format guide

## 🎉 First Release

After setup, make a commit and push to trigger your first automated release:

```bash
git add .
git commit -m "feat: setup automated semantic release"
git push origin main
```

This will create version 1.1.0 and your first automated GitHub release! 🚀