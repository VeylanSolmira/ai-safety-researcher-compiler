# Advanced Git for AI Safety Research

## Learning Objectives

By the end of this topic, you will be able to:
- Implement specialized Git workflows designed for AI/ML research projects
- Manage large model files and datasets efficiently using Git LFS and DVC
- Design branching strategies that support parallel experimentation
- Ensure reproducibility of AI experiments through proper version control
- Secure sensitive data and API keys in collaborative research environments

## Introduction

Version control is fundamental to rigorous AI safety research, but standard Git workflows often fall short when dealing with the unique challenges of machine learning projects. This topic explores advanced Git techniques specifically tailored for AI safety researchers who need to manage large models, track experiments, ensure reproducibility, and maintain security while collaborating on sensitive projects.

The complexity of AI research—with its iterative experimentation, large binary files, and critical security requirements—demands a sophisticated approach to version control that goes beyond basic Git usage.

## Core Concepts

### 1. ML-Specific Git Workflows

Traditional software development workflows like GitFlow need adaptation for machine learning projects. The ML Git workflow extends standard practices with specialized branch types:

```
main/
├── develop/
├── feature/new-safety-metric/
│   ├── experiment/baseline-evaluation/
│   ├── experiment/adversarial-testing/
│   └── experiment/robustness-checks/
├── data/dataset-v2/
├── model/transformer-variant/
└── training/distributed-setup/
```

**Key Branch Types:**
- **Feature branches**: Implement new functionality or research directions
- **Experiment branches**: Isolate specific experimental configurations
- **Data branches**: Track dataset versions and preprocessing changes
- **Model branches**: Manage architectural modifications
- **Training branches**: Version training pipeline changes

This structure enables parallel experimentation without conflicts and maintains clear separation between different aspects of ML development.

### 2. Managing Large Files with Git LFS

AI models and datasets can quickly exceed Git's practical file size limits. Git Large File Storage (LFS) provides a solution:

**Setup and Configuration:**
```bash
# Install Git LFS
git lfs install

# Track ML file types
git lfs track "*.h5" "*.pkl" "*.pth" "*.onnx"
git lfs track "*.parquet" "*.tfrecord"

# Track specific large files
git lfs track "models/safety-classifier-v2.pth"
```

**Best Practices:**
- Only track files that need versioning (not intermediate outputs)
- Use `.gitattributes` to maintain consistent LFS tracking
- Monitor storage usage: `git lfs ls-files --size`
- Consider cloud storage integration for files >5GB

### 3. Experiment Tracking and Reproducibility

Reproducibility is crucial for AI safety research. Integrate Git with specialized ML tools:

**Data Version Control (DVC):**
```yaml
# dvc.yaml
stages:
  prepare:
    cmd: python src/prepare_data.py
    deps:
      - src/prepare_data.py
      - data/raw/
    outs:
      - data/processed/
  
  train:
    cmd: python src/train.py
    deps:
      - src/train.py
      - data/processed/
    params:
      - train.learning_rate
      - train.batch_size
    outs:
      - models/model.pth
    metrics:
      - metrics.json
```

**Integration with MLflow:**
```python
import mlflow

mlflow.set_tracking_uri("./mlruns")
mlflow.set_experiment("safety-evaluation")

with mlflow.start_run():
    # Log Git commit hash
    mlflow.set_tag("git_commit", 
                   subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip())
    
    # Log parameters and metrics
    mlflow.log_params(config)
    mlflow.log_metrics(evaluation_results)
    
    # Log model with Git context
    mlflow.pytorch.log_model(model, "model")
```

### 4. Jupyter Notebook Version Control

Notebooks present unique challenges for version control. Implement these solutions:

**Using nbdime for meaningful diffs:**
```bash
# Install nbdime
pip install nbdime

# Configure Git to use nbdime
nbdime config-git --enable

# View notebook diffs
nbdiff notebook1.ipynb notebook2.ipynb
```

**Jupytext for plain-text synchronization:**
```python
# jupytext.toml
formats = "ipynb,py:percent"
notebook_metadata_filter = "-all"
cell_metadata_filter = "-all"
```

This maintains a `.py` version alongside each notebook for better version control.

### 5. Security and Sensitive Data Management

AI safety research often involves sensitive data and expensive API keys:

**Git-secrets configuration:**
```bash
# Install git-secrets
brew install git-secrets  # macOS
# or compile from source on Linux

# Initialize in repository
git secrets --install
git secrets --register-aws  # AWS credentials
git secrets --add "sk-[a-zA-Z0-9]{48}"  # OpenAI API keys
git secrets --add "anthropic_api_key"
```

**Environment variable management:**
```python
# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    MODEL_ENDPOINT = os.getenv("MODEL_ENDPOINT")
    
    @classmethod
    def validate(cls):
        """Ensure all required secrets are present"""
        required = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
        missing = [k for k in required if not getattr(cls, k)]
        if missing:
            raise ValueError(f"Missing required secrets: {missing}")
```

## Practical Applications

### Case Study: Multi-team Safety Evaluation Project

Consider a project evaluating LLM safety across multiple dimensions:

1. **Repository Structure:**
```
ai-safety-eval/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── CODEOWNERS         # Automatic reviewers
├── experiments/
│   ├── red-teaming/       # Attack experiments
│   ├── robustness/        # Robustness testing
│   └── interpretability/  # Model analysis
├── models/                # Model checkpoints (LFS)
├── data/                  # Datasets (DVC)
├── src/                   # Source code
└── notebooks/             # Research notebooks
```

2. **Workflow Implementation:**
- Main branch protected with required reviews
- Feature branches for new evaluation methods
- Experiment branches for parameter tuning
- Automated testing on pull requests
- Security scanning for exposed keys

### Collaborative Research Patterns

**Fork and Pull Model:**
- Researchers fork the main repository
- Develop features in isolation
- Submit pull requests for review
- Automated checks ensure quality

**Shared Repository Model:**
- Direct collaboration on branches
- Protected main branch
- Required status checks
- Automated deployment to test environments

## Common Pitfalls and How to Avoid Them

1. **Committing Large Files Directly**
   - Solution: Configure LFS before adding files
   - Use pre-commit hooks to check file sizes

2. **Exposing API Keys**
   - Solution: Implement git-secrets scanning
   - Regular key rotation policies
   - Use environment variables consistently

3. **Notebook Merge Conflicts**
   - Solution: Clear outputs before committing
   - Use nbdime for conflict resolution
   - Consider jupytext for critical notebooks

4. **Lost Experiments**
   - Solution: Integrate MLflow/W&B from the start
   - Tag experiments with Git commits
   - Document experiment purposes in commit messages

5. **Inconsistent Environments**
   - Solution: Pin all dependencies
   - Use Docker for reproducibility
   - Version control environment files

## Hands-on Exercise

Create a Git repository for an AI safety project with the following requirements:

1. Set up Git LFS for model files
2. Configure git-secrets to prevent API key exposure  
3. Create a branching structure for experiments
4. Integrate DVC for dataset versioning
5. Set up pre-commit hooks for code quality
6. Configure nbdime for notebook diffs
7. Create a GitHub Action for automated testing

This exercise reinforces the key concepts while building a practical foundation for AI safety research.

## Further Reading

- [DVC Documentation](https://dvc.org/doc) - Comprehensive guide to data version control
- [MLflow Tracking](https://mlflow.org/docs/latest/tracking.html) - Experiment tracking integration
- [Pro Git Book - Advanced Topics](https://git-scm.com/book/en/v2) - Deep dive into Git internals
- [GitHub Security Best Practices](https://docs.github.com/en/code-security) - Security recommendations
- [Reproducible ML Guide](https://reproducible-ml.org/) - Best practices for reproducibility

## Related Topics

- [[containerization-research]] - Complementary approach to reproducibility
- [[distributed-training]] - Git workflows for distributed systems
- [[safety-monitoring]] - Version control for monitoring configurations
- [[incident-response]] - Git's role in incident investigation