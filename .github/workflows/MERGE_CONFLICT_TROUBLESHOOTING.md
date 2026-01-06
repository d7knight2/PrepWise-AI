# Merge Conflict Resolution Workflow - Troubleshooting Guide

## Overview

The Nightly Merge Conflict Resolution workflow automatically checks all open pull requests for merge conflicts and attempts to resolve them by merging the latest changes from the base branch.

**Workflow File:** `.github/workflows/resolve-merge-conflicts.yml`

## How It Works

1. **Scheduled Execution**: Runs nightly at 2:00 AM UTC
2. **PR Discovery**: Fetches all open pull requests in the repository
3. **Conflict Detection**: For each PR, attempts to merge the base branch into the PR branch
4. **Automatic Resolution**: If the merge succeeds without conflicts, pushes the changes
5. **Manual Notification**: If conflicts require manual resolution, comments on the PR with instructions

## Schedule and Timezones

The workflow runs at **2:00 AM UTC** every night.

### Timezone Conversions

| Timezone | Time (Standard) | Time (Daylight Saving) |
|----------|----------------|------------------------|
| UTC | 2:00 AM | 2:00 AM |
| EST (US East) | 9:00 PM (previous day) | - |
| EDT (US East) | - | 10:00 PM (previous day) |
| PST (US West) | 6:00 PM (previous day) | - |
| PDT (US West) | - | 7:00 PM (previous day) |
| GMT (UK) | 2:00 AM | - |
| BST (UK) | - | 3:00 AM |
| CET (Central Europe) | 3:00 AM | - |
| CEST (Central Europe) | - | 4:00 AM |
| IST (India) | 7:30 AM | 7:30 AM |
| JST (Japan) | 11:00 AM | 11:00 AM |
| AEST (Australia East) | 12:00 PM (noon) | - |
| AEDT (Australia East) | - | 1:00 PM |

### Manual Triggering

You can manually trigger the workflow at any time:

1. Navigate to **Actions** tab in GitHub
2. Select "Nightly Merge Conflict Resolution" workflow
3. Click "Run workflow" button
4. Select the branch (usually `main`) and click "Run workflow"

## What the Workflow Does

### For PRs Without Conflicts

✅ **Automatic Resolution:**
- Merges the latest base branch changes into the PR
- Pushes the merge commit
- Comments on the PR with success details

### For PRs With Conflicts

⚠️ **Manual Resolution Required:**
- Detects that conflicts exist
- Comments on the PR with:
  - List of conflicting files
  - Step-by-step resolution instructions
  - Links to documentation

### Error Handling

The workflow includes robust error handling:
- **Retry Logic**: Retries failed network operations (fetch, push) up to 3 times
- **Isolated Processing**: Errors in one PR don't affect others
- **Detailed Logging**: Each step is logged for troubleshooting
- **Failure Notifications**: Comments on PRs when automatic resolution fails

## Manual Troubleshooting

### As a PR Author: Resolving Conflicts Manually

If you receive a comment that your PR has merge conflicts:

#### Option 1: Using Command Line (Recommended)

```bash
# 1. Ensure you're on your PR branch
git checkout your-branch-name

# 2. Pull the latest changes from your branch
git pull origin your-branch-name

# 3. Fetch the latest base branch
git fetch origin main  # or the appropriate base branch

# 4. Merge the base branch into your branch
git merge origin/main

# 5. Git will notify you of conflicts. Open the conflicting files and look for conflict markers:
#    <<<<<<< HEAD
#    Your changes
#    =======
#    Changes from base branch
#    >>>>>>> origin/main

# 6. Edit each file to resolve conflicts, removing the markers

# 7. After resolving all conflicts, stage the changes
git add .

# 8. Complete the merge
git commit -m "Resolve merge conflicts with main"

# 9. Push the resolved changes
git push origin your-branch-name
```

#### Option 2: Using GitHub Web Interface

1. Navigate to your pull request
2. Scroll down to the bottom
3. If GitHub can resolve conflicts automatically, click "Resolve conflicts"
4. Use the web editor to resolve conflicts
5. Click "Mark as resolved" when done
6. Click "Commit merge"

#### Option 3: Using GitHub Desktop

1. Open GitHub Desktop
2. Switch to your branch
3. Go to **Branch** → **Update from main** (or appropriate base branch)
4. GitHub Desktop will alert you to conflicts
5. Click on each conflicted file to open in your editor
6. Resolve conflicts and save
7. Return to GitHub Desktop
8. Commit the merge
9. Push to origin

### As a Repository Maintainer: Workflow Issues

#### Workflow Not Running

**Symptoms:** Workflow doesn't execute at scheduled time

**Causes & Solutions:**

1. **Repository Activity Required**
   - GitHub may disable scheduled workflows on inactive repositories
   - Solution: Make a commit or manually trigger the workflow to reactivate

2. **Workflow Disabled**
   - Check if workflow is disabled in Actions tab
   - Solution: Navigate to Actions → Workflows → Enable the workflow

3. **Branch Protection**
   - Scheduled workflows only run from the default branch
   - Solution: Ensure the workflow file is in your default branch (main/master)

#### Workflow Fails Immediately

**Symptoms:** Workflow fails in the "Fetch all open pull requests" step

**Causes & Solutions:**

1. **Permissions Issue**
   - The `GITHUB_TOKEN` lacks required permissions
   - Solution: Verify workflow has `contents: write` and `pull-requests: write` permissions

2. **API Rate Limiting**
   - Too many API calls in a short period
   - Solution: Wait for rate limit to reset (usually 1 hour) or use a personal access token

#### Workflow Times Out

**Symptoms:** Workflow is cancelled after 30 minutes

**Causes & Solutions:**

1. **Too Many PRs**
   - Processing takes longer than timeout limit
   - Solution: Increase `timeout-minutes` in workflow or reduce number of open PRs

2. **Large Repository**
   - Fetching and merging large repositories is slow
   - Solution: Consider shallow clones or processing PRs in batches

#### Push Failures

**Symptoms:** Merge succeeds but push fails

**Causes & Solutions:**

1. **Branch Protection Rules**
   - Protected branches may block the workflow
   - Solution: Add `github-actions[bot]` to branch protection bypass list

2. **Concurrent Updates**
   - Branch was updated while workflow was running
   - Solution: The workflow will retry on next scheduled run

3. **Token Permissions**
   - Insufficient permissions to push
   - Solution: Verify workflow permissions and consider using a PAT if needed

#### False Conflict Detection

**Symptoms:** Workflow reports conflicts when there are none

**Causes & Solutions:**

1. **Stale Branch References**
   - Cached branch information is outdated
   - Solution: Manual trigger usually resolves this

2. **Git Configuration Issues**
   - Line ending differences or whitespace issues
   - Solution: Ensure `.gitattributes` is properly configured

### Debugging Steps

#### 1. Check Workflow Run Logs

1. Go to **Actions** tab in GitHub
2. Click on "Nightly Merge Conflict Resolution"
3. Click on the specific run you want to inspect
4. Expand each step to see detailed logs
5. Look for error messages (marked with ❌)

#### 2. Verify PR State

```bash
# Locally check if PR has conflicts
git fetch origin
git checkout origin/pr-branch-name
git merge origin/main --no-commit --no-ff

# If merge succeeds without conflicts, the workflow should handle it
# If merge fails, conflicts exist and manual resolution is needed

# Abort the test merge
git merge --abort
```

#### 3. Test Workflow Locally

You can simulate the workflow logic locally:

```bash
# Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Fetch all branches
git fetch --all

# For each open PR (get list from GitHub)
pr_number=123
head_branch="feature-branch"
base_branch="main"

# Create temp branch
git checkout -B "test-pr-${pr_number}" "origin/${head_branch}"

# Try merge
git merge "origin/${base_branch}" --no-edit

# Check result
if [ $? -eq 0 ]; then
  echo "Merge successful - no conflicts"
  git diff "origin/${head_branch}" --stat
else
  echo "Merge failed - conflicts exist"
  git diff --name-only --diff-filter=U
  git merge --abort
fi
```

## Common Issues and Solutions

### Issue: "Failed to fetch branches"

**Cause:** Network issues or branch has been deleted

**Solution:**
- Verify the branch still exists on GitHub
- Check if the PR is still open
- Try manual workflow trigger
- If branch was deleted, close the PR

### Issue: "Failed to push changes"

**Cause:** Branch protection rules or permission issues

**Solution:**
- Check branch protection settings
- Verify `github-actions[bot]` has push permissions
- Review workflow permissions in the YAML file
- Consider requiring signed commits exceptions

### Issue: "Invalid merge state"

**Cause:** Unexpected git state or corrupted merge

**Solution:**
- Workflow includes automatic cleanup
- Should resolve on next run
- If persistent, manually clean up branches

### Issue: Workflow keeps failing for specific PR

**Cause:** Complex merge scenario or git state issues

**Solution:**
1. Close and reopen the PR (creates fresh git state)
2. Rebase the PR branch instead of merging
3. Manually resolve conflicts and disable auto-resolution for that PR
4. Check for binary files or large files causing issues

## Testing the Workflow

### Create Test PRs with Conflicts

To test the workflow, you can create controlled merge conflict scenarios:

#### Test Scenario 1: Simple Text Conflict

```bash
# Create base branch with a file
git checkout -b test-base
echo "Hello World" > test.txt
git add test.txt
git commit -m "Add test file"
git push origin test-base

# Create first branch that modifies the file
git checkout -b test-pr-1 test-base
echo "Hello from PR 1" > test.txt
git add test.txt
git commit -m "Update from PR 1"
git push origin test-pr-1

# Update base branch differently
git checkout test-base
echo "Hello from base" > test.txt
git add test.txt
git commit -m "Update in base"
git push origin test-base

# Create PR from test-pr-1 to test-base
# This PR will have a merge conflict
```

#### Test Scenario 2: No Conflict (Should Auto-Resolve)

```bash
# Create base branch
git checkout -b test-base-2
echo "Line 1" > file.txt
git add file.txt
git commit -m "Initial commit"
git push origin test-base-2

# Create PR branch
git checkout -b test-pr-2 test-base-2
echo "Line 2" >> file.txt
git add file.txt
git commit -m "Add line 2"
git push origin test-pr-2

# Update base branch (different file or different section)
git checkout test-base-2
echo "Line 0" | cat - file.txt > temp && mv temp file.txt
git add file.txt
git commit -m "Add line 0"
git push origin test-base-2

# Create PR from test-pr-2 to test-base-2
# This PR should auto-resolve
```

### Manual Workflow Testing

1. Create test branches and PRs as above
2. Manually trigger the workflow:
   - Go to Actions tab
   - Select "Nightly Merge Conflict Resolution"
   - Click "Run workflow"
3. Watch the workflow execution in real-time
4. Verify PR comments are posted
5. Check that successful merges are pushed
6. Confirm conflict PRs receive appropriate instructions

## Monitoring and Maintenance

### Regular Checks

- **Weekly:** Review workflow success rate in Actions tab
- **Monthly:** Check for disabled workflows due to inactivity
- **After Repository Changes:** Test workflow after changing branch protection rules

### Performance Optimization

- **High PR Volume:** Consider running workflow during off-peak hours
- **Large Repository:** Increase timeout or implement batching
- **Many Conflicts:** Consider notification-only mode for complex conflicts

### Alerting

Set up notifications for workflow failures:

1. Go to repository **Settings** → **Notifications**
2. Enable "Actions" notifications
3. Configure email or webhook notifications

## FAQ

### Q: Will the workflow break my PR?

**A:** No. The workflow only pushes changes if the merge succeeds without conflicts. If conflicts exist, it only comments and waits for manual resolution.

### Q: Can I disable this for my PR?

**A:** The workflow processes all open PRs. To exclude a specific PR, you would need to modify the workflow or add a label-based filter.

### Q: What if I'm working on my PR when the workflow runs?

**A:** The workflow fetches the latest state from GitHub. If you're working locally, you'll need to pull the changes after the workflow completes. We recommend running it during low-activity hours (hence 2 AM UTC).

### Q: Does this use force push?

**A:** No. The workflow uses regular `git push`, which will fail if there are concurrent updates, preventing any data loss.

### Q: How do I change the schedule?

**A:** Edit the `cron` expression in `.github/workflows/resolve-merge-conflicts.yml`. Use [crontab.guru](https://crontab.guru/) to help create your schedule.

### Q: Can I run this on-demand?

**A:** Yes! Use the "workflow_dispatch" trigger from the Actions tab.

### Q: What permissions does the workflow need?

**A:** The workflow needs:
- `contents: write` - To fetch and push to branches
- `pull-requests: write` - To comment on PRs
- `issues: write` - To create notifications if needed

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Resolving Merge Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
- [Git Merge Documentation](https://git-scm.com/docs/git-merge)
- [GitHub API Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the workflow run logs in the Actions tab
2. Search for similar issues in the repository's Issues tab
3. Create a new issue with:
   - Workflow run ID
   - Relevant log excerpts
   - PR number (if applicable)
   - Steps to reproduce

## Contributing

To improve this workflow:

1. Test changes in a fork first
2. Use `workflow_dispatch` for testing
3. Document any new features or fixes
4. Update this troubleshooting guide with new scenarios
