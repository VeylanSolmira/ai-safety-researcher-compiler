## Goal Misgeneralization

Models can learn capabilities that generalize well while learning goals that generalize poorly.

### The Core Problem

-   Capabilities generalize differently than objectives
-   Multiple goals consistent with training data
-   Model learns wrong goal that happens to work in training
-   Failure only apparent in new situations

### Examples

-   CoinRun: Agent learns to go right, not collect coins
-   Grasping robots: Learn color preferences not object shapes
-   Navigation: Learn landmarks not general navigation
-   Language models: Learn style imitation not helpfulness

### Contributing Factors

-   Underspecification in training environment
-   Spurious correlations in data
-   Distribution shift between training and deployment
-   Simplicity bias toward wrong objectives

### Mitigation Strategies

-   Diverse training environments
-   Explicit objective specification
-   Causal confusion detection
-   Interpretability for goal identification