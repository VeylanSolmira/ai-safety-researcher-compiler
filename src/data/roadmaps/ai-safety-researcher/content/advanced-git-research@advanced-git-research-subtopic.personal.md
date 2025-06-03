# Advanced Git for Research: Real Talk

Look, I'll be honest with you - Git for AI research is a complete mess if you don't set it up right from the start. I've seen so many projects turn into absolute chaos because researchers treat version control as an afterthought. Let me share what actually works in the trenches.

## The Reality of ML Git Workflows

Forget everything you know about traditional Git workflows. GitFlow? That's cute for web apps, but it falls apart the moment you have three researchers running experiments in parallel, each generating 5GB model checkpoints.

Here's what actually happens in AI research:
- You'll have experiments branching off experiments branching off experiments
- Someone will accidentally commit a 10GB model file and break everything
- Your Git history will look like spaghetti thrown at a wall
- At least one team member will expose API keys (probably you, at least once)

The solution? Embrace the chaos with structure.

## My Battle-Tested Setup

After years of pain, here's the setup I use for every new project:

### 1. The "Oh Shit" Prevention Kit

First thing I do on any project:

```bash
# The essentials
git lfs install
pip install pre-commit nbdime jupytext git-secrets

# Set up the pre-commit hooks
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: detect-private-key
      - id: check-json
      - id: check-yaml
  - repo: local
    hooks:
      - id: no-api-keys
        name: Check for API keys
        entry: ./scripts/check-secrets.sh
        language: script
EOF
```

This has saved my ass more times than I can count.

### 2. The Experiment Branch Strategy That Actually Works

Here's the branching strategy I've evolved over time:

```
main (production ready)
├── dev (integration branch)
├── exp/jane/adversarial-v1
├── exp/jane/adversarial-v2-fixed-that-bug
├── exp/bob/new-architecture
└── exp/alice/why-is-this-not-working
```

Notice the personal namespaces? Game changer. No more "whose random-experiment-17 branch is this?"

### 3. Dealing with the Large File Problem

LFS is great until it's not. Here's my approach:

**What goes in LFS:**
- Final model checkpoints
- Curated datasets
- Results that need to be reproducible

**What stays out:**
- Intermediate checkpoints (use S3/GCS)
- Tensorboard logs
- Anything over 1GB that changes frequently

**The DVC + Git combo:**
```python
# Track code in Git, data/models in DVC
dvc add data/processed/safety_dataset_v2.parquet
git add data/processed/safety_dataset_v2.parquet.dvc
git commit -m "Update safety dataset with new annotations"
dvc push
```

## Hard-Won Lessons

### Lesson 1: Notebooks Are The Devil

I love Jupyter notebooks. I also hate them with a burning passion when it comes to Git. Here's how I manage:

1. **Clear outputs religiously**: `jupyter nbconvert --clear-output --inplace *.ipynb`
2. **Use Jupytext for anything important**: Sync to `.py` files
3. **Never, ever merge notebook conflicts manually**: Use nbdime or burn it down and start over

### Lesson 2: Security Is Not Optional

I once accidentally pushed OpenAI API keys to a public repo. $3000 in charges later, I learned my lesson. Now:

```bash
# In every single repo
echo "export OPENAI_API_KEY='...'" >> .env
echo ".env" >> .gitignore
git secrets --install
git secrets --add 'sk-[a-zA-Z0-9]{48}'
```

Also, rotate your keys regularly. Set calendar reminders. Do it.

### Lesson 3: Document Your Experiments IN THE COMMIT

This commit message sucks:
```
"Updated model"
```

This is what you need:
```
"Exp: Adversarial training with PGD (eps=0.3)

- Modified attack strength from 0.1 to 0.3
- Increased training epochs to 50
- Results: 73% robust accuracy (+5% from baseline)
- Next: Try with different attack methods

MLflow run: 4f3d2a1b
Related to: #42"
```

Future you will thank present you.

## The Reproducibility Reality Check

Everyone talks about reproducibility, but here's what actually matters:

1. **Pin your damn dependencies**: Not just `torch`, but `torch==1.9.0+cu111`
2. **Log your hardware**: GPU type matters more than you think
3. **Save your random seeds**: All of them. NumPy, PyTorch, Python, everything
4. **Use Docker**: Yes, it's annoying. Yes, you need it.

## My Workflow for Sensitive Research

Working on AI safety means extra paranoia:

### The Three-Layer Security Approach

1. **Code Level**: No hardcoded secrets, ever
2. **Repo Level**: Private repos, signed commits, 2FA required
3. **Access Level**: Minimal permissions, regular audits

### The "Oh Shit We Got Hacked" Preparation

Keep a record of:
- Who has access to what
- When API keys were last rotated
- Which experiments used which models
- Where sensitive data is stored

## Tools That Actually Help

**The Good:**
- **DVC**: Once you get it, you'll never go back
- **MLflow/W&B**: Pick one and stick with it
- **pre-commit**: Catches stupid mistakes before they happen

**The Overhyped:**
- **Git submodules**: More trouble than they're worth for ML
- **Git hooks beyond pre-commit**: Too fragile
- **Fancy Git GUIs**: Command line is faster once you know it

## Real-World Scenarios

### Scenario 1: The Accidental 5GB Commit

It will happen. Here's the fix:

```bash
# If you haven't pushed yet
git rm --cached large_model.pth
git commit --amend

# If you have pushed (and hate everyone)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch large_model.pth" \
  --prune-empty --tag-name-filter cat -- --all
```

Then add it to LFS like you should have initially.

### Scenario 2: The Merge Conflict From Hell

When you have conflicting experiment results:

1. Don't try to merge the notebooks
2. Create a new notebook comparing both approaches
3. Document which approach won and why
4. Archive the losing experiment (don't delete it)

### Scenario 3: "It Worked On My Machine"

The classic. Solution:

```dockerfile
FROM pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
COPY requirements.txt .
RUN pip install -r requirements.txt
# ... rest of your setup
```

If it doesn't work in Docker, it doesn't work.

## The Uncomfortable Truths

1. **Your Git history will be messy**: Accept it, embrace it, document it
2. **You will lose experiments**: That's why we have MLflow
3. **Someone will break the repo**: That's why we have backups
4. **Perfect is the enemy of done**: A working messy repo beats a perfect plan

## My Advice to Past Me

If I could go back and tell myself one thing about Git for AI research, it would be: Set up your infrastructure before you write a single line of model code. The hour you spend setting up proper version control will save you weeks of pain later.

And for the love of all that is holy, never commit API keys. Not even "just for testing." Not even in a private repo. Never.

## Actually Useful Resources

Skip the generic Git tutorials. Here's what actually helps:

- [DVC's ML Versioning Guide](https://dvc.org/doc/use-cases/versioning-data-and-model-files) - Actually practical
- [MLOps Community Slack](https://mlops.community/) - Where people share real solutions
- [This HuggingFace guide on model versioning](https://huggingface.co/docs/hub/models-the-hub) - Modern approach
- [Weights & Biases' experiment tracking examples](https://wandb.ai/site/experiment-tracking) - See what good looks like

Remember: The goal isn't a perfect Git history. It's making progress on your research while being able to sleep at night knowing you can reproduce your results and haven't leaked any API keys. Everything else is just details.