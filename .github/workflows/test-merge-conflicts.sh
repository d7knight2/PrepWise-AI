#!/bin/bash

# Merge Conflict Testing Script
# This script creates test branches and PRs to validate the merge conflict resolution workflow

set -e

echo "================================================"
echo "Merge Conflict Resolution Workflow Test Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_URL=$(git config --get remote.origin.url || echo "")
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
TEST_PREFIX="test-conflict-workflow"
TIMESTAMP=$(date +%s)

echo -e "${GREEN}Repository:${NC} $REPO_URL"
echo -e "${GREEN}Default branch:${NC} $DEFAULT_BRANCH"
echo -e "${GREEN}Test prefix:${NC} $TEST_PREFIX"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to cleanup test branches
cleanup_test_branches() {
    print_info "Cleaning up existing test branches..."
    
    # Get list of test branches
    test_branches=$(git branch -r | grep "origin/${TEST_PREFIX}" | sed 's/origin\///' || echo "")
    
    if [ -z "$test_branches" ]; then
        print_info "No existing test branches found"
        return
    fi
    
    echo "$test_branches" | while read -r branch; do
        branch=$(echo "$branch" | xargs) # trim whitespace
        if [ -n "$branch" ]; then
            print_info "Deleting remote branch: $branch"
            git push origin --delete "$branch" 2>/dev/null || print_warning "Could not delete $branch"
        fi
    done
    
    # Clean up local branches
    local_test_branches=$(git branch | grep "${TEST_PREFIX}" || true)
    if [ -n "$local_test_branches" ]; then
        echo "$local_test_branches" | xargs git branch -D 2>/dev/null || true
    fi
}

# Function to create a test scenario
create_test_scenario() {
    local scenario_name=$1
    local base_branch="${TEST_PREFIX}-base-${TIMESTAMP}"
    local pr_branch="${TEST_PREFIX}-pr-${scenario_name}-${TIMESTAMP}"
    
    echo ""
    echo "================================================"
    echo "Creating Test Scenario: $scenario_name"
    echo "================================================"
    
    # Create base branch
    print_info "Creating base branch: $base_branch"
    git checkout -b "$base_branch" "$DEFAULT_BRANCH" 2>&1
    
    # Create initial file
    mkdir -p test-merge-conflicts
    echo "Initial content" > "test-merge-conflicts/${scenario_name}.txt"
    echo "Line 2" >> "test-merge-conflicts/${scenario_name}.txt"
    echo "Line 3" >> "test-merge-conflicts/${scenario_name}.txt"
    
    git add "test-merge-conflicts/${scenario_name}.txt"
    git commit -m "Add initial file for $scenario_name test"
    git push origin "$base_branch"
    print_success "Base branch created and pushed"
    
    # Create PR branch
    print_info "Creating PR branch: $pr_branch"
    git checkout -b "$pr_branch" "$base_branch"
    
    # Modify file in PR branch based on scenario
    if [ "$scenario_name" == "multiple-files" ]; then
        # For multiple-files scenario, modify first file and create second file
        echo "Modified in PR branch" >> "test-merge-conflicts/${scenario_name}.txt"
        echo "Second file from PR" > "test-merge-conflicts/${scenario_name}-second.txt"
        git add "test-merge-conflicts/"
        git commit -m "Modify files in PR branch for $scenario_name"
    else
        # For other scenarios, just modify the first file
        echo "Modified in PR branch" >> "test-merge-conflicts/${scenario_name}.txt"
        git add "test-merge-conflicts/${scenario_name}.txt"
        git commit -m "Modify file in PR branch for $scenario_name"
    fi
    
    git push origin "$pr_branch"
    print_success "PR branch created and pushed"
    
    # Return to base branch and create conflicting change
    print_info "Creating conflicting change in base branch"
    git checkout "$base_branch"
    
    if [ "$scenario_name" == "conflict" ]; then
        # Create actual conflict
        echo "Modified in base branch (CONFLICT!)" >> "test-merge-conflicts/${scenario_name}.txt"
        git add "test-merge-conflicts/${scenario_name}.txt"
        git commit -m "Create conflicting change in base for $scenario_name"
        git push origin "$base_branch"
        print_success "Conflicting change created (this should require manual resolution)"
    elif [ "$scenario_name" == "no-conflict" ]; then
        # Create non-conflicting change
        echo "# Comment" > "test-merge-conflicts/${scenario_name}-other.txt"
        git add "test-merge-conflicts/${scenario_name}-other.txt"
        git commit -m "Add non-conflicting file in base for $scenario_name"
        git push origin "$base_branch"
        print_success "Non-conflicting change created (this should auto-resolve)"
    elif [ "$scenario_name" == "multiple-files" ]; then
        # Create conflicts in multiple files
        echo "Conflict in first file (BASE)" >> "test-merge-conflicts/${scenario_name}.txt"
        echo "Second file from BASE (CONFLICT!)" > "test-merge-conflicts/${scenario_name}-second.txt"
        git add "test-merge-conflicts/"
        git commit -m "Create multiple file conflicts in base"
        git push origin "$base_branch"
        print_success "Multiple file conflicts created (both files will have conflicts)"
    fi
    
    print_success "Test scenario '$scenario_name' setup complete"
    echo "  Base branch: $base_branch"
    echo "  PR branch: $pr_branch"
    echo ""
    print_info "Create a PR from $pr_branch to $base_branch to test this scenario"
    
    # Return to default branch
    git checkout "$DEFAULT_BRANCH"
}

# Main execution
echo "This script will create test branches to validate the merge conflict resolution workflow."
echo ""
echo "What would you like to do?"
echo "1) Create test scenarios"
echo "2) Clean up test branches"
echo "3) Both (cleanup then create)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        print_info "Creating test scenarios..."
        ;;
    2)
        cleanup_test_branches
        print_success "Cleanup complete!"
        exit 0
        ;;
    3)
        cleanup_test_branches
        print_info "Creating test scenarios..."
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_info "Fetching latest changes..."
git fetch origin

echo ""
print_info "Which test scenarios would you like to create?"
echo "1) Conflict scenario (requires manual resolution)"
echo "2) No-conflict scenario (should auto-resolve)"
echo "3) Multiple files conflict scenario"
echo "4) All scenarios"
echo ""
read -p "Enter choice (1-4): " scenario_choice

case $scenario_choice in
    1)
        create_test_scenario "conflict"
        ;;
    2)
        create_test_scenario "no-conflict"
        ;;
    3)
        create_test_scenario "multiple-files"
        ;;
    4)
        create_test_scenario "conflict"
        create_test_scenario "no-conflict"
        create_test_scenario "multiple-files"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "Test Setup Complete!"
echo "================================================"
echo ""
print_success "Test branches have been created"
echo ""
print_info "Next Steps:"
echo "1. Create PRs for the test scenarios using the GitHub UI or gh CLI:"
echo "   - Go to: $REPO_URL/compare"
echo "   - Or use: gh pr create --base <base-branch> --head <pr-branch>"
echo ""
echo "2. Trigger the workflow manually:"
echo "   - Go to Actions → Nightly Merge Conflict Resolution → Run workflow"
echo "   - Or use: gh workflow run resolve-merge-conflicts.yml"
echo ""
echo "3. Monitor the workflow execution:"
echo "   - Check Actions tab for workflow runs"
echo "   - Verify PR comments are added correctly"
echo "   - Confirm auto-resolution works for no-conflict scenarios"
echo "   - Confirm manual resolution instructions for conflict scenarios"
echo ""
echo "4. Clean up after testing:"
echo "   - Run this script again and choose option 2"
echo "   - Or manually delete the test branches"
echo ""

print_success "All done!"
