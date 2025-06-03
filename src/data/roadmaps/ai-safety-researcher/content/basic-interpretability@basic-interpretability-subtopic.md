# Basic Interpretability

## Learning Objectives

By the end of this topic, you should be able to:
- Understand what neural network interpretability means and why it matters
- Apply basic interpretability techniques to analyze model behavior
- Visualize and interpret attention patterns in transformer models
- Use tools for model introspection and analysis
- Identify the limitations of current interpretability methods

## Introduction

Interpretability in AI refers to our ability to understand how and why AI systems make the decisions they do. As AI systems become more powerful and are deployed in critical applications, the need to peer inside the "black box" becomes increasingly urgent. Without interpretability, we cannot verify that AI systems are safe, aligned with human values, or free from harmful biases.

The field of interpretability seeks to bridge the gap between the mathematical operations performed by neural networks and human-understandable concepts. This is not merely an academic exercise - it's a crucial component of AI safety.

## Core Concepts

### What is Interpretability?

Interpretability encompasses several related but distinct goals:

1. **Transparency**: Understanding internal mechanisms
2. **Explainability**: Providing human-understandable reasons
3. **Predictability**: Anticipating model behavior
4. **Accountability**: Enabling responsibility assignment

### Levels of Interpretability

**Global Interpretability**: Understanding overall model behavior
- What features are important?
- What patterns has it learned?
- How does it organize information?

**Local Interpretability**: Understanding specific decisions
- Why this particular output?
- What influenced this decision?
- How would changes affect output?

### Key Techniques

#### 1. Attention Visualization

```python
import torch
import matplotlib.pyplot as plt
import seaborn as sns

def visualize_attention(model, tokenizer, text):
    # Tokenize input
    inputs = tokenizer(text, return_tensors='pt')
    
    # Get model outputs with attention
    with torch.no_grad():
        outputs = model(**inputs, output_attentions=True)
    
    # Extract attention weights
    attention = outputs.attentions[-1]  # Last layer
    attention = attention.squeeze().mean(dim=0)  # Average over heads
    
    # Plot
    tokens = tokenizer.convert_ids_to_tokens(inputs['input_ids'][0])
    plt.figure(figsize=(10, 8))
    sns.heatmap(attention.numpy(), 
                xticklabels=tokens,
                yticklabels=tokens,
                cmap='Blues')
    plt.title('Attention Pattern Visualization')
    plt.tight_layout()
    plt.show()
```

#### 2. Feature Attribution

```python
def integrated_gradients(model, input_ids, baseline_ids, target_idx, steps=50):
    # Create interpolation between baseline and input
    alphas = torch.linspace(0, 1, steps)
    
    gradients = []
    for alpha in alphas:
        # Interpolate
        interpolated = baseline_ids + alpha * (input_ids - baseline_ids)
        interpolated = interpolated.long()
        
        # Forward pass
        interpolated.requires_grad_(True)
        output = model(interpolated)
        
        # Backward pass
        output[0, target_idx].backward()
        
        gradients.append(interpolated.grad.clone())
    
    # Integrated gradients
    integrated_grads = torch.stack(gradients).mean(dim=0)
    attribution = (input_ids - baseline_ids) * integrated_grads
    
    return attribution
```

#### 3. Probing Classifiers

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

def probe_hidden_states(hidden_states, labels, layer_idx):
    """
    Train a probe to decode information from hidden states
    """
    # Extract representations from specific layer
    X = hidden_states[layer_idx].reshape(len(labels), -1)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, labels, test_size=0.2, random_state=42
    )
    
    # Train probe
    probe = LogisticRegression(max_iter=1000)
    probe.fit(X_train, y_train)
    
    # Evaluate
    train_acc = probe.score(X_train, y_train)
    test_acc = probe.score(X_test, y_test)
    
    return {
        'layer': layer_idx,
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'probe': probe
    }
```

### Mechanistic Interpretability

A deeper approach that aims to understand the algorithms implemented by neural networks:

```python
class CircuitAnalyzer:
    def __init__(self, model):
        self.model = model
        self.activations = {}
        
    def register_hooks(self):
        """Register forward hooks to capture activations"""
        def get_activation(name):
            def hook(module, input, output):
                self.activations[name] = output.detach()
            return hook
        
        for name, module in self.model.named_modules():
            module.register_forward_hook(get_activation(name))
    
    def analyze_circuit(self, input_ids, circuit_type='induction'):
        """Analyze specific computational circuits"""
        self.model(input_ids)
        
        if circuit_type == 'induction':
            # Look for attention heads that attend to previous occurrences
            return self._find_induction_heads()
        elif circuit_type == 'copy':
            # Look for direct token copying behavior
            return self._find_copy_heads()
    
    def _find_induction_heads(self):
        # Analysis logic for induction heads
        # This is where the real mechanistic work happens
        pass
```

## Practical Interpretability Tools

### Building an Interpretability Dashboard

```python
class InterpretabilityDashboard:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.results = {}
    
    def analyze_text(self, text):
        # Tokenize
        inputs = self.tokenizer(text, return_tensors='pt')
        
        # Get all intermediates
        outputs = self.model(**inputs, 
                           output_attentions=True,
                           output_hidden_states=True)
        
        # Collect analyses
        self.results['attention'] = self._analyze_attention(outputs.attentions)
        self.results['hidden_states'] = self._analyze_hidden(outputs.hidden_states)
        self.results['logits'] = self._analyze_logits(outputs.logits)
        
        return self.results
    
    def visualize_results(self):
        # Create comprehensive visualization
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # Attention patterns
        self._plot_attention(axes[0, 0])
        
        # Hidden state evolution
        self._plot_hidden_evolution(axes[0, 1])
        
        # Logit lens
        self._plot_logit_lens(axes[1, 0])
        
        # Feature importance
        self._plot_feature_importance(axes[1, 1])
        
        plt.tight_layout()
        plt.show()
```

## Limitations and Challenges

### 1. Scalability
- Methods don't scale to large models
- Computational cost is prohibitive
- Human bandwidth is limited

### 2. Faithfulness
- Explanations may not reflect true reasoning
- Post-hoc explanations can mislead
- Confirmation bias in interpretation

### 3. Complexity
- Billions of parameters resist simple explanation
- Emergent behaviors from interactions
- Non-linear relationships

## Practical Exercise

**Build Your Own Interpretability Tool**

1. Choose a small transformer model (GPT-2 small recommended)
2. Implement attention visualization
3. Add feature attribution
4. Create interactive interface
5. Test on various inputs
6. Document interesting findings

**Starter Code**:
```python
# Your interpretability toolkit starter
class MyInterpretabilityTool:
    def __init__(self, model_name='gpt2'):
        self.model = AutoModel.from_pretrained(model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    def analyze(self, text):
        # Your implementation here
        pass
    
    def visualize(self):
        # Your visualization here
        pass

# Test it
tool = MyInterpretabilityTool()
results = tool.analyze("The capital of France is")
tool.visualize()
```

## Further Reading

- "A Mathematical Framework for Transformer Circuits" by Anthropic
- "Zoom In: An Introduction to Circuits" by Olah et al.
- "Attention is All You Need" - Original transformer paper
- "The Building Blocks of Interpretability" by Distill
- "Towards Automated Circuit Discovery" by Conmy et al.

## Connections

- **Prerequisites**: [How LLMs Actually Work](how-llms-work), [Build Your First Safety Tool](build-first-safety-tool)
- **Related Topics**: [Mechanistic Interpretability Practice](mechanistic-interp), [AI Debugging Frameworks](debugging-tools)
- **Advanced Topics**: [Novel Circuit Discovery](circuit-discovery), [Scalable Interpretability Methods](scalable-interpretability)
- **Tools**: TransformerLens, CircuitsVis, Captum, InterpretML