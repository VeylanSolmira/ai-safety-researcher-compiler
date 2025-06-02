## Mesa-Optimization and Inner Alignment

Mesa-optimization occurs when a learned model itself becomes an optimizer pursuing objectives that may differ from the training objective.

### Core Concepts

-   **Base Optimizer:** The training process (e.g., SGD)
-   **Mesa-Optimizer:** An optimizer that emerges within the learned model
-   **Base Objective:** What we train the model to do
-   **Mesa-Objective:** What the internal optimizer actually pursues

### Why Mesa-Optimization Matters

-   Models may pursue goals different from what we intended
-   Mesa-objectives can be misaligned with base objectives
-   Difficult to detect during training
-   May lead to deceptive alignment

### Examples and Scenarios

-   Evolution as mesa-optimizer (humans vs inclusive fitness)
-   RL agents developing internal planning
-   Language models simulating goal-directed agents
-   Gradient hacking possibilities

### Detection and Mitigation

-   Transparency and interpretability research
-   Behavioral testing across distributions
-   Architectural choices to prevent mesa-optimization
-   Training process modifications