# Containerization for Research

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

```python
# The nightmare scenario without containers:
# Researcher A's environment
# Python 3.8.5, PyTorch 1.9.0, CUDA 11.1, numpy 1.19.2
result_a = train_model(data)  # Loss: 0.023

# Researcher B trying to reproduce
# Python 3.8.10, PyTorch 1.9.0, CUDA 11.3, numpy 1.19.5  
result_b = train_model(data)  # Loss: 0.157

# Different results, same code!
```

Containers solve this by freezing the entire environment:

```dockerfile
FROM pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime

# Lock every dependency
RUN pip install --no-cache-dir     numpy==1.19.2     transformers==4.18.0     wandb==0.12.16

# Even system libraries are fixed
RUN apt-get update && apt-get install -y     libgl1-mesa-glx=20.3.5-1     libglib2.0-0=2.66.8-1

COPY . /workspace
WORKDIR /workspace

# Anyone running this gets EXACTLY the same environment
CMD ["python", "train.py"]
```

### Docker Fundamentals for Researchers

#### Creating Research-Grade Dockerfiles

```dockerfile
# Multi-stage build for efficiency
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04 AS builder

# Install Python and build dependencies
RUN apt-get update && apt-get install -y     python3.10     python3.10-dev     python3-pip     git     wget     && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3.10 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip &&     pip install --no-cache-dir -r requirements.txt

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
HEALTHCHECK --interval=5m --timeout=3s     CMD python -c "import torch; assert torch.cuda.is_available()"

CMD ["python", "main.py"]
```

#### Managing GPU Resources

```yaml
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
```

### Advanced Container Patterns

#### Experiment Orchestration

```python
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
```

#### Security Isolation for Untrusted Models

```dockerfile
# Dockerfile for running potentially dangerous models
FROM python:3.10-slim

# Security hardening
RUN apt-get update && apt-get install -y     libseccomp2     && rm -rf /var/lib/apt/lists/*

# Create isolated user with minimal permissions
RUN useradd -m -u 1000 -s /bin/bash untrusted &&     mkdir -p /home/untrusted/model &&     chown -R untrusted:untrusted /home/untrusted

# Install dependencies as root
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt &&     rm /tmp/requirements.txt

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
```

### Container Registry Best Practices

```yaml
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
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and Test Container
        run: |
          # Build with cache
          docker buildx build             --cache-from type=registry,ref=ghcr.io/${{ github.repository }}:buildcache             --cache-to type=registry,ref=ghcr.io/${{ github.repository }}:buildcache,mode=max             --tag ghcr.io/${{ github.repository }}:test             --load             .
          
          # Run tests in container
          docker run --rm ghcr.io/${{ github.repository }}:test pytest tests/
          
      - name: Build Multi-Platform Images
        if: github.event_name == 'push'
        run: |
          docker buildx build             --platform linux/amd64,linux/arm64             --tag ghcr.io/${{ github.repository }}:latest             --tag ghcr.io/${{ github.repository }}:$(date +%Y%m%d)             --push             .
```

### Development Workflow Integration

```python
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
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localEnv:HOME}/.cache,target=/home/researcher/.cache,type=bind"
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
```

## Practical Implementation

### Building a Research Platform

```python
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
```

### Performance Optimization

```dockerfile
# Optimized Dockerfile for large models
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04 AS runtime

# Use BuildKit cache mounts for pip
# syntax=docker/dockerfile:1.4

# Optimize apt installations
RUN --mount=type=cache,target=/var/cache/apt     apt-get update && apt-get install -y     python3.10     python3-pip     && rm -rf /var/lib/apt/lists/*

# Cache pip downloads
RUN --mount=type=cache,target=/root/.cache/pip     pip install torch==2.0.1+cu118     -f https://download.pytorch.org/whl/torch_stable.html

# Use cache mounts for model downloads
RUN --mount=type=cache,target=/root/.cache/huggingface     python -c "from transformers import AutoModel;     AutoModel.from_pretrained('bert-base-uncased')"

# Copy only necessary files
COPY src/ /app/src/
COPY configs/ /app/configs/

WORKDIR /app

# Optimize Python
ENV PYTHONUNBUFFERED=1
ENV PYTHONOPTIMIZE=1

CMD ["python", "-m", "src.main"]
```

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

- "Best Practices for Scientific Computing in Containers" - **⚠️ UNVERIFIED CITATION** "Nature" (2023) [author-year] _Could not find a reliable source for this citation_
- "Docker for Data Science" - Joshua Cook
- "Reproducible Machine Learning with Docker" - MLOps Community
- "Container Security for ML Workloads" - NVIDIA Developer Blog
- "Singularity vs Docker for HPC" - Comparison guide

## Connections

- **Prerequisites**: [Version Control](version-control), [Distributed Systems](distributed-systems)
- **Related Topics**: [Distributed Training Systems](distributed-training), [Safety API Design](safety-apis)
- **Advanced Topics**: [Kubernetes for ML](kubernetes-ml), [Container Orchestration](container-orchestration)
- **Tools**: Docker, Singularity, Podman, Container registries (DockerHub, GHCR, ACR)