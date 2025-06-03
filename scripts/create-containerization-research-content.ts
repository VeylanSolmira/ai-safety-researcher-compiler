import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const containerizationContent = {
  id: 'containerization-research',
  academicContent: `# Containerization for Research

## Learning Objectives

By the end of this topic, you should be able to:
- Understand containerization concepts and benefits for AI research
- Create reproducible research environments using Docker
- Manage GPU resources in containerized environments
- Implement security best practices for research containers
- Build efficient CI/CD pipelines for ML experiments

## Introduction

Containerization has revolutionized how AI safety research is conducted by providing reproducible, isolated environments for experiments. In a field where subtle differences in dependencies or configurations can lead to vastly different model behaviors, containers ensure that research results can be verified and built upon by others.

For AI safety researchers, containerization addresses critical challenges: ensuring experiments are reproducible across different systems, isolating potentially dangerous model behaviors, managing complex dependency chains, and enabling safe collaboration across institutions. Docker has become the de facto standard, though other technologies like Singularity are gaining traction in HPC environments.

## Core Concepts

### Why Containerization Matters for AI Safety

#### Reproducibility Crisis in ML

\`\`\`python
# The nightmare scenario without containers:
# Researcher A's environment
# Python 3.8.5, PyTorch 1.9.0, CUDA 11.1, numpy 1.19.2
result_a = train_model(data)  # Loss: 0.023

# Researcher B trying to reproduce
# Python 3.8.10, PyTorch 1.9.0, CUDA 11.3, numpy 1.19.5  
result_b = train_model(data)  # Loss: 0.157

# Different results, same code!
\`\`\`

Containers solve this by freezing the entire environment:

\`\`\`dockerfile
FROM pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime

# Lock every dependency
RUN pip install --no-cache-dir \
    numpy==1.19.2 \
    transformers==4.18.0 \
    wandb==0.12.16

# Even system libraries are fixed
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx=20.3.5-1 \
    libglib2.0-0=2.66.8-1

COPY . /workspace
WORKDIR /workspace

# Anyone running this gets EXACTLY the same environment
CMD ["python", "train.py"]
\`\`\`

### Docker Fundamentals for Researchers

#### Creating Research-Grade Dockerfiles

\`\`\`dockerfile
# Multi-stage build for efficiency
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04 AS builder

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3.10-dev \
    python3-pip \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3.10 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Runtime stage - smaller final image
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# Copy Python and virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /usr/bin/python3.10 /usr/bin/python3.10

# Set up environment
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV CUDA_VISIBLE_DEVICES=0

# Security: Run as non-root user
RUN useradd -m -u 1000 researcher
USER researcher
WORKDIR /home/researcher

# Copy research code
COPY --chown=researcher:researcher . .

# Health check for long-running experiments
HEALTHCHECK --interval=5m --timeout=3s \
    CMD python -c "import torch; assert torch.cuda.is_available()"

CMD ["python", "main.py"]
\`\`\`

#### Managing GPU Resources

\`\`\`yaml
# docker-compose.yml for multi-GPU experiments
version: '3.8'

services:
  experiment-1:
    build: .
    runtime: nvidia
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - EXPERIMENT_NAME=safety_baseline
    volumes:
      - ./data:/data:ro
      - ./outputs/exp1:/outputs
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ['0']
              capabilities: [gpu]

  experiment-2:
    build: .
    runtime: nvidia  
    environment:
      - CUDA_VISIBLE_DEVICES=1
      - EXPERIMENT_NAME=safety_enhanced
    volumes:
      - ./data:/data:ro
      - ./outputs/exp2:/outputs
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ['1']
              capabilities: [gpu]

  tensorboard:
    image: tensorflow/tensorflow:latest
    ports:
      - "6006:6006"
    volumes:
      - ./outputs:/logs
    command: tensorboard --logdir=/logs --bind_all
\`\`\`

### Advanced Container Patterns

#### Experiment Orchestration

\`\`\`python
# experiment_runner.py
import docker
import yaml
from datetime import datetime

class ExperimentOrchestrator:
    def __init__(self):
        self.client = docker.from_env()
        self.experiments = []
        
    def run_parameter_sweep(self, base_config, param_grid):
        """Run multiple experiments with different parameters"""
        
        for params in self.generate_param_combinations(param_grid):
            # Create unique container for each experiment
            experiment_id = f"exp_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            container_config = {
                'image': 'ai-safety-research:latest',
                'name': experiment_id,
                'environment': {
                    **base_config,
                    **params,
                    'EXPERIMENT_ID': experiment_id
                },
                'volumes': {
                    './data': {'bind': '/data', 'mode': 'ro'},
                    f'./results/{experiment_id}': {'bind': '/results', 'mode': 'rw'}
                },
                'runtime': 'nvidia',
                'detach': True,
                'device_requests': [
                    docker.types.DeviceRequest(
                        device_ids=[str(len(self.experiments) % 4)],  # Round-robin GPUs
                        capabilities=[['gpu']]
                    )
                ]
            }
            
            container = self.client.containers.run(**container_config)
            self.experiments.append({
                'id': experiment_id,
                'container': container,
                'params': params,
                'status': 'running'
            })
            
        return self.experiments
    
    def monitor_experiments(self):
        """Monitor running experiments and collect results"""
        while any(e['status'] == 'running' for e in self.experiments):
            for exp in self.experiments:
                if exp['status'] == 'running':
                    container = exp['container']
                    container.reload()
                    
                    if container.status == 'exited':
                        exp['status'] = 'completed'
                        exp['exit_code'] = container.attrs['State']['ExitCode']
                        exp['logs'] = container.logs().decode('utf-8')
                        
                        # Collect results
                        self.collect_results(exp)
            
            time.sleep(30)  # Check every 30 seconds
\`\`\`

#### Security Isolation for Untrusted Models

\`\`\`dockerfile
# Dockerfile for running potentially dangerous models
FROM python:3.10-slim

# Security hardening
RUN apt-get update && apt-get install -y \
    libseccomp2 \
    && rm -rf /var/lib/apt/lists/*

# Create isolated user with minimal permissions
RUN useradd -m -u 1000 -s /bin/bash untrusted && \
    mkdir -p /home/untrusted/model && \
    chown -R untrusted:untrusted /home/untrusted

# Install dependencies as root
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# Switch to untrusted user
USER untrusted
WORKDIR /home/untrusted

# Copy model files with restricted permissions
COPY --chown=untrusted:untrusted model/ ./model/

# Security constraints
ENV PYTHONPATH=/home/untrusted
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

# Disable network access at runtime
# Run with: docker run --network none --security-opt no-new-privileges

ENTRYPOINT ["python", "-u"]
CMD ["model/evaluate.py"]
\`\`\`

### Container Registry Best Practices

\`\`\`yaml
# .github/workflows/build-research-containers.yml
name: Build Research Containers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and Test Container
        run: |
          # Build with cache
          docker buildx build \
            --cache-from type=registry,ref=ghcr.io/\${{ github.repository }}:buildcache \
            --cache-to type=registry,ref=ghcr.io/\${{ github.repository }}:buildcache,mode=max \
            --tag ghcr.io/\${{ github.repository }}:test \
            --load \
            .
          
          # Run tests in container
          docker run --rm ghcr.io/\${{ github.repository }}:test pytest tests/
          
      - name: Build Multi-Platform Images
        if: github.event_name == 'push'
        run: |
          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --tag ghcr.io/\${{ github.repository }}:latest \
            --tag ghcr.io/\${{ github.repository }}:\$(date +%Y%m%d) \
            --push \
            .
\`\`\`

### Development Workflow Integration

\`\`\`python
# devcontainer.json for VS Code integration
{
    "name": "AI Safety Research Environment",
    "build": {
        "dockerfile": "Dockerfile",
        "context": "..",
        "args": {
            "VARIANT": "3.10-bullseye"
        }
    },
    "runArgs": [
        "--gpus", "all",
        "--shm-size", "16g",
        "--network", "host"
    ],
    "mounts": [
        "source=\${localWorkspaceFolder},target=/workspace,type=bind",
        "source=\${localEnv:HOME}/.cache,target=/home/researcher/.cache,type=bind"
    ],
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "ms-toolsai.jupyter",
                "github.copilot"
            ],
            "settings": {
                "python.defaultInterpreterPath": "/opt/venv/bin/python",
                "python.linting.enabled": true,
                "python.formatting.provider": "black"
            }
        }
    },
    "postCreateCommand": "pip install -e .",
    "remoteUser": "researcher"
}
\`\`\`

## Practical Implementation

### Building a Research Platform

\`\`\`python
# research_platform.py
class ContainerizedResearchPlatform:
    def __init__(self, registry_url):
        self.registry = registry_url
        self.docker_client = docker.from_env()
        
    def create_experiment_template(self, base_image, requirements):
        """Generate Dockerfile for new experiment"""
        template = f"""
FROM {base_image}

# Experiment metadata
LABEL maintainer="research-team@example.org"
LABEL description="AI Safety Research Experiment"
LABEL version="1.0.0"

# Install additional requirements
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Setup experiment structure
RUN mkdir -p /experiment/{{data,models,results,logs}}

# Copy experiment code
COPY src/ /experiment/src/
COPY configs/ /experiment/configs/

WORKDIR /experiment

# Validation script
COPY validate.py /experiment/
RUN python validate.py

# Entry point with proper error handling
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
"""
        return template
    
    def validate_reproducibility(self, dockerfile_path):
        """Ensure Dockerfile meets reproducibility standards"""
        with open(dockerfile_path, 'r') as f:
            content = f.read()
            
        issues = []
        
        # Check for unpinned dependencies
        if 'pip install' in content and '==' not in content:
            issues.append("Unpinned Python dependencies detected")
            
        # Check for latest tags
        if ':latest' in content:
            issues.append("Using :latest tag - pin specific versions")
            
        # Check for proper WORKDIR
        if 'WORKDIR' not in content:
            issues.append("No WORKDIR specified")
            
        return len(issues) == 0, issues
\`\`\`

### Performance Optimization

\`\`\`dockerfile
# Optimized Dockerfile for large models
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04 AS runtime

# Use BuildKit cache mounts for pip
# syntax=docker/dockerfile:1.4

# Optimize apt installations
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Cache pip downloads
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install torch==2.0.1+cu118 \
    -f https://download.pytorch.org/whl/torch_stable.html

# Use cache mounts for model downloads
RUN --mount=type=cache,target=/root/.cache/huggingface \
    python -c "from transformers import AutoModel; \
    AutoModel.from_pretrained('bert-base-uncased')"

# Copy only necessary files
COPY src/ /app/src/
COPY configs/ /app/configs/

WORKDIR /app

# Optimize Python
ENV PYTHONUNBUFFERED=1
ENV PYTHONOPTIMIZE=1

CMD ["python", "-m", "src.main"]
\`\`\`

## Common Pitfalls

1. **Image bloat**: Including unnecessary build tools in runtime images
2. **Cache invalidation**: Poor layer ordering causing rebuilds
3. **Security vulnerabilities**: Running as root or with excessive permissions
4. **Resource limits**: Not setting appropriate CPU/memory constraints
5. **Data persistence**: Forgetting to mount volumes for results

## Practical Exercise

**Build a Containerized Research Environment**

1. **Day 1**: Create base research image
   - Install CUDA, PyTorch, common libraries
   - Set up proper user permissions
   - Implement health checks

2. **Day 2**: Build experiment orchestration
   - Parameter sweep automation
   - GPU allocation management
   - Result collection system

3. **Day 3**: Implement security measures
   - Network isolation
   - Resource constraints
   - Secrets management

4. **Day 4**: Create CI/CD pipeline
   - Automated building
   - Vulnerability scanning
   - Registry management

5. **Day 5**: Documentation and templates
   - Usage guides
   - Template repository
   - Best practices documentation

## Further Reading

- "Best Practices for Scientific Computing in Containers" - Nature (2023)
- "Docker for Data Science" - Joshua Cook
- "Reproducible Machine Learning with Docker" - MLOps Community
- "Container Security for ML Workloads" - NVIDIA Developer Blog
- "Singularity vs Docker for HPC" - Comparison guide

## Connections

- **Prerequisites**: [Version Control](version-control), [Distributed Systems](distributed-systems)
- **Related Topics**: [Distributed Training Systems](distributed-training), [Safety API Design](safety-apis)
- **Advanced Topics**: [Kubernetes for ML](kubernetes-ml), [Container Orchestration](container-orchestration)
- **Tools**: Docker, Singularity, Podman, Container registries (DockerHub, GHCR, ACR)`,

  personalContent: `# Containerization for Research - Or: How I Learned to Stop Worrying and Love the Whale

Let me tell you about the time I spent THREE WEEKS trying to reproduce a paper's results. The authors said "just run train.py!" What they didn't mention was their specific cocktail of CUDA 10.1, PyTorch 1.4.0a0+git2845ebe, and some random commit of a library that no longer existed.

After installing and uninstalling CUDA seventeen times and probably shortening my laptop's lifespan by several years, I finally got it working. The results? Completely different from the paper.

That's when I became a Docker evangelist. Not because I love containers (though baby whales are cute), but because I love my sanity more.

## My Container Journey: From "What's a Dockerfile?" to "Everything Must Be Containerized"

### Phase 1: The Skeptic

\`\`\`bash
# Me in 2019
$ docker run hello-world
"Why do I need this? I have virtualenv!"

# Also me in 2019, later that day
$ pip install tensorflow==1.14
ERROR: Could not find a version that satisfies the requirement
$ pip install tensorflow==1.13
ERROR: tensorflow 1.13 requires numpy<1.17,>=1.13.3
$ pip install numpy==1.16.9
ERROR: [47 other packages break]
*laptop catches fire*
\`\`\`

### Phase 2: The Convert

My first real Dockerfile:

\`\`\`dockerfile
FROM ubuntu:latest  # Mistake #1

RUN apt-get update && apt-get install -y everything  # Mistake #2

COPY . .  # Mistake #3

RUN pip install -r requirements.txt  # Mistake #4: no versions

CMD python train.py  # Mistake #5: runs as root

# 10GB image that worked on my machine but nowhere else
\`\`\`

### Phase 3: The Enlightened

My Dockerfile now:

\`\`\`dockerfile
# Multi-stage build because I'm not a barbarian
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04 AS builder

# Cache mount for apt because I value my time
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends \
    python3.10-dev \
    python3.10-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Virtual environment because we're not animals
RUN python3.10 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Cache mount for pip because bandwidth isn't free
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel

# Install dependencies separately for better caching
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Minimal runtime image
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# Copy only what we need
COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /usr/bin/python3.10 /usr/bin/python3.10

# Security theater (but actually important)
RUN useradd -m -u 1000 researcher
USER researcher

# Copy code as user
WORKDIR /home/researcher
COPY --chown=researcher:researcher . .

# Environment
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Entrypoint with signal handling
ENTRYPOINT ["python", "-u"]
CMD ["main.py"]
\`\`\`

## The Real Shit Nobody Tells You

### GPU Containers Are Their Own Circle of Hell

\`\`\`python
# The GPU compatibility matrix from hell
def will_it_work(cuda_version, driver_version, pytorch_version):
    """
    Nobody actually knows. We just try and pray.
    """
    compatibility_matrix = {
        (11.8, ">=450.80.02", "2.0.x"): "probably",
        (11.7, ">=450.80.02", "1.13.x"): "maybe",
        (11.6, ">=450.80.02", "1.12.x"): "if you're lucky",
        (11.3, ">=450.80.02", "1.11.x"): "lol good luck"
    }
    
    return compatibility_matrix.get(
        (cuda_version, driver_version, pytorch_version),
        "absolutely not"
    )
\`\`\`

### The Cache Dance

\`\`\`dockerfile
# Bad: Rebuilds everything when code changes
COPY . .
RUN pip install -r requirements.txt

# Good: Cached layers for dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Galaxy brain: BuildKit cache mounts
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    pip install -r requirements.txt
\`\`\`

### The "It Works in Docker But Not in Production" Special

\`\`\`yaml
# docker-compose.yml for local development
version: '3.8'
services:
  research:
    build: .
    volumes:
      - .:/workspace  # Live code reload
      - ~/.cache:/root/.cache  # Share cache with host
      - /mnt/data:/data  # Big data stays outside
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - WANDB_API_KEY=\${WANDB_API_KEY}
    runtime: nvidia
    shm_size: '32gb'  # PyTorch multiprocessing needs this
    stdin_open: true  # For debugging
    tty: true
\`\`\`

## My Production-Ready Research Setup

### The Master Orchestrator

\`\`\`python
# run_experiments.py
class ExperimentRunner:
    def __init__(self):
        self.gpu_queue = GPUQueue()
        self.results_db = ResultsDB()
        
    def run_hyperparameter_sweep(self, config):
        """Run 100 experiments without losing my mind"""
        
        experiments = []
        for params in self.generate_param_grid(config):
            exp_id = f"{config.name}_{hash(str(params))[:8]}"
            
            # Each experiment gets its own container
            container_spec = {
                'image': f'research:{config.version}',
                'name': exp_id,
                'command': ['python', 'train.py'],
                'environment': {
                    **params,
                    'EXPERIMENT_ID': exp_id,
                    'CUDA_DEVICE_ORDER': 'PCI_BUS_ID',
                },
                'mounts': [
                    # Read-only data
                    Mount('/data', config.data_path, type='bind', read_only=True),
                    # Experiment-specific outputs
                    Mount('/outputs', f'./results/{exp_id}', type='bind'),
                    # Shared cache
                    Mount('/cache', './cache', type='bind')
                ],
                'device_requests': [
                    DeviceRequest(
                        device_ids=[self.gpu_queue.get_next()],
                        capabilities=[['gpu']]
                    )
                ],
                # Resource limits
                'mem_limit': '32g',
                'memswap_limit': '32g',
                'cpu_quota': 400000,  # 4 CPUs
                'restart_policy': {'Name': 'on-failure', 'MaximumRetryCount': 3}
            }
            
            experiments.append(self.launch_container(container_spec))
        
        return self.monitor_experiments(experiments)
\`\`\`

### The "Oh Shit" Recovery System

\`\`\`python
class DisasterRecovery:
    """For when experiments go wrong at 3 AM"""
    
    def __init__(self):
        self.checkpoints = CheckpointManager()
        self.alerts = AlertSystem()
        
    def monitor_experiment(self, container_id):
        container = docker.from_env().containers.get(container_id)
        
        while container.status == 'running':
            # Check if it's still alive
            stats = container.stats(stream=False)
            
            # GPU fell off?
            if not self.check_gpu_visible(container):
                self.alerts.send("GPU DISAPPEARED AGAIN")
                self.attempt_gpu_recovery(container)
            
            # OOM incoming?
            mem_usage = stats['memory_stats']['usage']
            mem_limit = stats['memory_stats']['limit']
            if mem_usage / mem_limit > 0.95:
                self.alerts.send("OOM IMMINENT")
                self.emergency_checkpoint(container)
            
            # Training loss exploded?
            if self.detect_loss_explosion(container):
                self.alerts.send("LOSS = NAN, STOPPING")
                container.stop()
                self.rollback_to_last_checkpoint(container)
            
            time.sleep(60)
\`\`\`

## Container Patterns That Save Lives

### The Reproducibility Guarantee

\`\`\`python
# reproducibility_guard.py
class ReproducibilityGuard:
    def __init__(self):
        self.required_elements = [
            'fixed_random_seeds',
            'pinned_dependencies',
            'recorded_hardware_info',
            'git_commit_hash',
            'dataset_checksum'
        ]
    
    def validate_experiment(self, dockerfile, config):
        """Make sure this experiment can be reproduced in 5 years"""
        
        issues = []
        
        # Check Dockerfile
        if ':latest' in dockerfile:
            issues.append("NEVER use :latest tags")
        
        if 'pip install' in dockerfile and '==' not in dockerfile:
            issues.append("Pin your damn dependencies")
            
        # Check config
        if 'random_seed' not in config:
            issues.append("Set a random seed you monster")
            
        if not config.get('deterministic_algorithms'):
            issues.append("Enable deterministic algorithms")
            
        return len(issues) == 0, issues
\`\`\`

### The Development Container

\`\`\`dockerfile
# Dockerfile.dev - For interactive research
FROM research:base

# Development tools
RUN pip install ipython ipdb pytest black isort

# Jupyter for experiments
RUN pip install jupyter jupyterlab

# Keep container running for development
CMD ["tail", "-f", "/dev/null"]

# Run with:
# docker run -it --rm \
#   --gpus all \
#   -v $(pwd):/workspace \
#   -p 8888:8888 \
#   research:dev \
#   jupyter lab --ip=0.0.0.0 --allow-root
\`\`\`

## Lessons Learned the Hard Way

1. **Always tag your images with dates**: \`research:20240115\` not \`research:latest\`
2. **Cache everything cacheable**: Downloads, pip packages, model weights
3. **Test on a clean machine**: "Works in my container" is the new "works on my machine"
4. **Log everything**: When containers die, logs are all you have
5. **Plan for failure**: Containers will crash, GPUs will disappear, memory will run out

## The Emotional Journey

\`\`\`python
def containerization_emotional_stages():
    return [
        "Denial: I don't need containers",
        "Anger: Why won't this Dockerfile build?",
        "Bargaining: Maybe if I just use sudo...",
        "Depression: I've been debugging this for 12 hours",
        "Acceptance: Containers are life",
        "Enlightenment: I containerize my containerizers"
    ]
\`\`\`

## Your Container Starter Pack

1. **Start simple**: Get one experiment working in a container
2. **Add complexity gradually**: Multi-stage builds, caching, etc.
3. **Automate everything**: Container building, testing, deployment
4. **Document religiously**: Future you will thank present you
5. **Share your images**: Help others avoid your pain

Remember: Every hour spent setting up containers saves ten hours of "why doesn't this work on the cluster?"

Now if you'll excuse me, I need to debug why my container works perfectly locally but fails on the GPU cluster. It's always the CUDA driver version. Always.

*P.S. - If someone tells you they've never had a 10GB Docker image, they're lying or they've never used PyTorch.*`
}

async function createContainerizationContent() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  console.log('🚀 Creating containerization-research content...\n')
  
  try {
    console.log(`📝 Updating content for: ${containerizationContent.id}`)
    
    const updateStmt = db.prepare(`
      UPDATE topics 
      SET content_academic = ?, content_personal = ?
      WHERE id = ?
    `)
    
    const result = updateStmt.run(
      containerizationContent.academicContent,
      containerizationContent.personalContent,
      containerizationContent.id
    )
    
    if (result.changes > 0) {
      console.log(`   ✅ Successfully updated ${containerizationContent.id}`)
      
      // Export to markdown files
      const contentDir = path.join(
        process.cwd(),
        'src/data/roadmaps/ai-safety-researcher/content'
      )
      
      const academicPath = path.join(contentDir, `${containerizationContent.id}@${containerizationContent.id}-subtopic.md`)
      fs.writeFileSync(academicPath, containerizationContent.academicContent)
      
      const personalPath = path.join(contentDir, `${containerizationContent.id}@${containerizationContent.id}-subtopic.personal.md`)
      fs.writeFileSync(personalPath, containerizationContent.personalContent)
      
      console.log(`   📄 Exported to markdown files`)
    } else {
      console.log(`   ❌ Failed to update ${containerizationContent.id} - topic not found`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

// Run the script
createContainerizationContent()