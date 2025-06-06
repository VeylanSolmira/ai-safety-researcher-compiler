# Removing Database Backup Files from Git History

## Status: PLANNED (Not yet executed)

## Problem
Database backup files (`journey.db.backup-*`) were accidentally committed to the repository in multiple commits before the `.gitignore` rule was added. While these files don't contain sensitive data, their presence in git history could reflect poorly on repository maintenance practices.

## Affected Files
- `journey.db.backup-20250603-190320`
- `journey.db.backup-mentor-tables-1749012778631`
- `journey.db.backup-mentor-tables-1749016999804`
- `journey.db.backup-mentors-removal-1749016985`

## Current State
- Files have been removed from the working tree (commit `8d22f9c`)
- `.gitignore` already contains `*.backup-*` pattern to prevent future commits
- Files still exist in git history

## Proposed Solution

### Method 1: Using git filter-repo (Recommended)
```bash
# Install git filter-repo if not already installed
brew install git-filter-repo

# Create a fresh backup of the repository
cp -r . ../ai-safety-research-compiler-backup

# Remove the backup files from all history
git filter-repo --path journey.db.backup-20250603-190320 --invert-paths
git filter-repo --path journey.db.backup-mentor-tables-1749012778631 --invert-paths
git filter-repo --path journey.db.backup-mentor-tables-1749016999804 --invert-paths
git filter-repo --path journey.db.backup-mentors-removal-1749016985 --invert-paths

# Or remove all at once with a pattern
git filter-repo --path-regex '.*journey\.db\.backup.*' --invert-paths
```

### Method 2: Using BFG Repo-Cleaner (Alternative)
```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Delete files matching pattern
java -jar bfg-1.14.0.jar --delete-files '*journey.db.backup*' .

# Clean up the repository
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

## Pre-execution Checklist
- [ ] Notify all collaborators about the upcoming history rewrite
- [ ] Ensure all collaborators have pushed their changes
- [ ] Create a full backup of the repository
- [ ] Document the current HEAD commit hash: `8d22f9c`
- [ ] Close any open pull requests (they will need to be recreated)

## Post-execution Steps
1. Force push to all branches:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

2. Notify all collaborators to:
   ```bash
   # Delete their local repository
   rm -rf ai-safety-research-compiler
   
   # Re-clone fresh
   git clone https://github.com/VeylanSolmira/ai-safety-research-compiler.git
   ```

3. Update any CI/CD webhooks if commit hashes are referenced

## Risks
- All commit hashes will change after the first backup file was added
- Any external references to commits will break
- Collaborators must re-clone the repository
- GitHub may cache old commits for up to 90 days

## Decision Record
- **Date considered**: June 5, 2025
- **Reason**: Maintain professional appearance of repository history
- **Alternative considered**: Leave history as-is with acknowledgment in README
- **Decision**: Postponed for better timing

## When to Execute
Best times to execute this cleanup:
- Before any major release or announcement
- When all active development is at a stable point
- When all collaborators can be coordinated
- During a planned maintenance window

## Notes
- The files don't contain sensitive data, just redundant backups
- This is primarily for repository hygiene and professional appearance
- The `.gitignore` already prevents this issue from recurring