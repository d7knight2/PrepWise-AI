# Branch Protection Configuration Guide

This document describes how to configure branch protection rules to ensure that all pull requests pass unit and UI tests before merging.

## Overview

The repository has two automated test workflows:
1. **Unit Tests** - Runs Jest unit tests for all components, pages, and utilities
2. **UI Tests** - Runs Playwright end-to-end tests to verify UI functionality

Both workflows are triggered automatically when:
- A pull request is opened or updated
- Code is pushed to `main` or `develop` branches

## Configuring Branch Protection Rules

To enforce test requirements before merging, configure branch protection rules in GitHub:

### Steps to Configure

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Select **Branches** from the left sidebar

2. **Add Branch Protection Rule**
   - Click **Add rule** or **Add branch protection rule**
   - In **Branch name pattern**, enter: `main` (or `develop` for the develop branch)

3. **Configure Protection Settings**
   
   Enable the following options:
   
   - ✅ **Require a pull request before merging**
     - This ensures all changes go through a PR workflow
   
   - ✅ **Require status checks to pass before merging**
     - Click **Add required status check**
     - Search and add: `unit-tests`
     - Search and add: `ui-tests`
     - ✅ Check **Require branches to be up to date before merging**
   
   - ✅ **Do not allow bypassing the above settings** (recommended)
     - This prevents administrators from bypassing the rules

4. **Optional but Recommended Settings**
   
   - ✅ **Require conversation resolution before merging**
     - Ensures all review comments are addressed
   
   - ✅ **Require approvals**
     - Set minimum number of approving reviews (e.g., 1)

5. **Save Changes**
   - Click **Create** or **Save changes** at the bottom

## Test Workflows

### Unit Tests (`unit-tests.yml`)
- **Trigger**: Pull requests and pushes to main/develop
- **Runs**: `npm test` (Jest unit tests)
- **Artifacts**: Test coverage reports
- **Duration**: ~1-2 minutes

### UI Tests (`ui-tests.yml`)
- **Trigger**: Pull requests and pushes to main/develop
- **Runs**: `npm run test:e2e` (Playwright tests)
- **Artifacts**: Playwright HTML reports and test results
- **Duration**: ~3-5 minutes
- **Browser**: Chromium (can be extended to Firefox and WebKit)

## Viewing Test Results

### In Pull Requests
- Test status checks appear at the bottom of each PR
- Click **Details** next to each check to view logs
- Failed tests will block the merge button

### Test Artifacts
- Download test reports from the workflow run page
- Unit test coverage reports are uploaded as artifacts
- Playwright HTML reports provide detailed test execution results
- Screenshots and traces are available for failed UI tests

## Running Tests Locally

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### UI Tests
```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run UI tests (headless)
npm run test:e2e

# Run UI tests with browser visible
npm run test:e2e:headed

# Debug tests interactively
npm run test:e2e:debug
```

## Troubleshooting

### Tests Fail in CI but Pass Locally
- Ensure your local environment matches CI (Node.js version, dependencies)
- Check for timing issues in Playwright tests (add appropriate waits)
- Verify environment variables are properly set in GitHub Actions

### Branch Protection Not Working
- Verify the status check names match exactly: `unit-tests` and `ui-tests`
- Ensure workflows have run at least once on the branch
- Check that you have admin permissions to configure branch protection

### Bypass Protection in Emergency
- Repository admins can temporarily disable protection rules if needed
- Re-enable protection immediately after emergency fix
- Document the bypass in the PR for audit purposes

## Adding New Tests

### Unit Tests
1. Create test files in `__tests__/` directory
2. Follow naming convention: `*.test.js`
3. Use Jest and React Testing Library
4. Tests will automatically run in the unit-tests workflow

### UI Tests
1. Create test files in `e2e/` directory
2. Follow naming convention: `*.spec.js`
3. Use Playwright test framework
4. Tests will automatically run in the ui-tests workflow

## Further Reading

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
