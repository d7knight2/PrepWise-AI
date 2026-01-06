# GitHub Actions Workflows

## Hourly Merge Conflict Resolution

### Overview
The `resolve-merge-conflicts.yml` workflow automatically detects and resolves merge conflicts in open pull requests.

### Trigger Schedule
- **Hourly**: Runs automatically every hour at the start of each hour (via cron schedule)
- **Manual**: Can be triggered manually via the Actions tab using `workflow_dispatch`

### How It Works

1. **Fetch Open PRs**: Uses GitHub CLI to get all open pull requests
2. **Check Each PR**: Iterates through each PR to check for merge conflicts
3. **Attempt Resolution**: For each PR with conflicts:
   - Checks out the PR's head branch
   - Attempts to merge the base branch
   - If successful, pushes the resolved changes
   - Adds a comment to the PR about the resolution
4. **Handle Failures**: If conflicts cannot be auto-resolved:
   - Logs the error clearly
   - Adds a comment to the PR with manual resolution instructions
   - Continues to the next PR

### Features

✅ **Automatic Conflict Resolution**: Merges base branch into PR branches when possible

✅ **Clear Logging**: Provides detailed logs for each step of the process

✅ **PR Comments**: Adds comments to PRs about successful resolutions or required manual intervention

✅ **Error Handling**: Gracefully handles errors and continues processing other PRs

✅ **Safe Operations**: Uses temporary branches and proper cleanup

### Permissions Required

The workflow requires the following permissions:
- `contents: write` - To push resolved changes
- `pull-requests: write` - To add comments to PRs

### Configuration

The workflow uses `GITHUB_TOKEN` which is automatically provided by GitHub Actions. No additional secrets are required.

### Logging

The workflow provides comprehensive logging:
- 📋 PR discovery and listing
- 📥 Branch fetching operations
- 🔍 Conflict detection
- 🔄 Merge attempts
- ✅ Successful resolutions
- ⚠️ Conflicts requiring manual intervention
- ❌ Errors and failures
- 📊 Summary of operations

### Manual Trigger

To manually trigger this workflow:
1. Go to the Actions tab in the repository
2. Select "Hourly Merge Conflict Resolution" from the workflows list
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### Limitations

This workflow can automatically resolve conflicts that don't require code changes, such as:
- Merge conflicts from base branch updates
- Non-overlapping changes in different parts of files

It **cannot** automatically resolve:
- Conflicts requiring code logic decisions
- Conflicts in the same lines of code
- Complex merge scenarios

In these cases, the workflow will add a comment to the PR with instructions for manual resolution.

### Troubleshooting

If the workflow fails:
1. Check the workflow run logs in the Actions tab
2. Verify that the repository has the necessary permissions enabled
3. Ensure that PRs have branches that still exist
4. Check if there are any branch protection rules that might prevent pushes

### Best Practices

- Monitor the workflow runs regularly
- Review the comments added to PRs by the bot
- Follow up on PRs that require manual conflict resolution
- The workflow runs hourly to ensure timely conflict resolution
