# Mechanistic Interpretability Practice

## Learning Objectives

- Understand what mechanistic interpretability is and why it matters for AI safety
- Learn core techniques: activation analysis, circuit discovery, and feature visualization
- Practice reverse engineering simple neural network behaviors
- Apply sparse autoencoders (SAEs) to decompose model representations
- Analyze transformer circuits and attention patterns in real models

## Introduction

Mechanistic interpretability is the art and science of reverse engineering neural networks - understanding not just what they do, but how they do it. Think of it as neuroscience for artificial minds: we open up the black box, trace the circuits, and map out the algorithms that emerge from billions of parameters.

This field, pioneered by researchers like Chris Olah at Anthropic and advanced by teams at Google DeepMind under Neel Nanda, represents one of our best hopes for understanding AI systems before they become too complex to comprehend. Unlike other interpretability methods that treat models as black boxes, mechanistic interpretability dives deep into the weights and activations to understand the actual computations being performed.

For AI safety, this matters enormously. If we can understand how models work internally, we can:
- Detect deceptive behaviors before deployment
- Identify when models are learning dangerous capabilities
- Build better oversight tools for advanced AI systems
- Design architectures that are inherently more interpretable

## Core Concepts

### 1. Circuits and Features

Neural networks learn to implement algorithms through **circuits** - connected pathways of neurons that perform specific computations. These circuits encode **features** - meaningful patterns in the data that the model has learned to detect and use.

**Key insight**: Models don't just memorize; they develop sophisticated algorithms. A vision model doesn't store pictures of cats - it learns edge detectors, texture analyzers, and shape recognizers that combine to identify cats.

**Practical approach**:
- Start with toy models where you can trace every connection
- Use activation maximization to find what makes neurons fire
- Look for motifs - repeated circuit patterns across different models
- Map out information flow from input to output

**Real example**: InceptionV1 contains dedicated neurons for detecting curves, car wheels, and even specific dog breeds. These aren't programmed - they emerge from training.

### 2. Superposition and Polysemanticity

Models face a fundamental challenge: they need to represent more features than they have neurons. The solution? **Superposition** - encoding multiple features in overlapping ways across neurons.

This leads to **polysemanticity** - individual neurons responding to multiple, seemingly unrelated concepts. A single neuron might activate for both "academia" and "the color purple" because the model rarely needs both simultaneously.

**Why this matters**:
- Makes interpretation much harder
- Suggests models have vast hidden capabilities
- Critical for understanding deception - features could hide in superposition
- May explain sudden capability jumps during training

**Current techniques**:
- Sparse autoencoders (SAEs) to decompose superposed representations
- Dictionary learning to find the "true" features
- Analyzing feature interactions and interference patterns

### 3. Transformer Mechanics

Modern language models are built on transformers, which have specific architectural properties we can exploit for interpretation:

**Attention heads** can be understood as:
- Information routing systems
- Pattern matchers (like "find the subject of this sentence")
- Copy mechanisms ("move this token forward")
- Induction heads that implement in-context learning

**MLP layers** typically:
- Store factual knowledge
- Implement more complex computations
- Act as memory banks that attention can query

**Residual streams** create:
- Information highways through the network
- Spaces where different components can read/write
- Compositional computation through vector addition

**Practical investigation**:
```python
# Analyze attention patterns
attention_pattern = model.get_attention_weights(input_ids)
# Look for interpretable heads
copy_heads = find_copy_patterns(attention_pattern)
induction_heads = find_induction_patterns(attention_pattern)
```

### 4. Probing and Intervention

Understanding requires both observation and experimentation:

**Probing techniques**:
- Linear probes to check if information is linearly decodable
- Causal probes that intervene to test necessity
- Logit lens to see predictions at each layer
- Activation patching to trace information flow

**Intervention methods**:
- Ablate components to test their function
- Activation steering to control model behavior
- Surgical edits to modify specific capabilities
- Circuit breaking to disable unwanted behaviors

**Example workflow**:
1. Identify interesting behavior (e.g., "model can do modular arithmetic")
2. Find which layers/heads are active during this task
3. Ablate components systematically
4. Trace critical paths through the network
5. Build minimal circuit that reproduces behavior

## Common Pitfalls

### 1. Confirmation Bias in Circuit Discovery
**Problem**: Finding circuits that match your hypothesis while missing the real mechanism.
**Solution**: Always test with adversarial examples and edge cases. If you think you've found an "addition circuit," try weird number formats, different bases, and word problems.

### 2. Over-Interpreting Individual Neurons
**Problem**: Assigning human-understandable concepts to neurons that actually encode complex, alien features.
**Solution**: Use multiple interpretation methods. If a neuron "detects dogs," verify with activation maximization, dataset examples, and causal interventions.

### 3. Ignoring Superposition
**Problem**: Assuming clean, monosemantic features when reality is messier.
**Solution**: Always consider that observed behaviors might be side effects of superposed features. Use SAEs or other decomposition methods.

### 4. Scale Blindness
**Problem**: Techniques that work on small models failing catastrophically on larger ones.
**Solution**: Test insights on progressively larger models. What's a clean circuit in a 1M parameter model might be distributed across hundreds of components in a 1B parameter model.

### 5. Missing Contextual Computation
**Problem**: Analyzing components in isolation when they work together.
**Solution**: Study information flow between components. Attention heads often work in groups, with early heads setting up information for later ones.

## Practical Exercise: Reverse Engineering a Simple Behavior

Let's reverse engineer how a small transformer performs the task: "Complete the pattern: A B A B A ?"

```python
# Step 1: Set up your model and tools
import torch
from transformer_lens import HookedTransformer
import numpy as np

model = HookedTransformer.from_pretrained("gpt2-small")

# Step 2: Create test inputs
test_prompts = [
    "A B A B A",
    "X Y X Y X",
    "1 2 1 2 1",
    "cat dog cat dog cat"
]

# Step 3: Analyze attention patterns
def analyze_pattern_completion(model, prompt):
    # Tokenize and run
    tokens = model.to_tokens(prompt)
    logits, cache = model.run_with_cache(tokens)
    
    # Look for copy patterns in attention
    attention_patterns = cache["pattern", :]  # shape [layer, head, seq, seq]
    
    # Find heads that attend to positions 2 steps back
    copy_heads = []
    for layer in range(model.cfg.n_layers):
        for head in range(model.cfg.n_heads):
            attn = attention_patterns[layer, head, -1, :]  # last token's attention
            if attn[-3] > 0.5:  # attending to position 2 steps back
                copy_heads.append((layer, head))
    
    return copy_heads, cache

# Step 4: Test interventions
def test_ablation(model, prompt, layer, head):
    # Run with and without the head
    def ablate_head(pattern, hook):
        pattern[:, head, :, :] = 0
        return pattern
    
    clean_logits = model(prompt)
    ablated_logits = model.run_with_hooks(
        prompt,
        fwd_hooks=[(f"blocks.{layer}.attn.hook_pattern", ablate_head)]
    )
    
    # Compare predictions
    clean_pred = model.tokenizer.decode(clean_logits.argmax(-1))
    ablated_pred = model.tokenizer.decode(ablated_logits.argmax(-1))
    
    return clean_pred, ablated_pred

# Step 5: Build understanding
# - Which heads implement the copy pattern?
# - Do they work alone or together?
# - What happens in non-periodic patterns?
# - Can we find the "period detection" circuit?
```

## Further Reading

### Essential Papers
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) - Anthropic's foundational work
- [Progress Measures for Grokking via Mechanistic Interpretability](https://arxiv.org/abs/2301.05217) - Neel Nanda's rigorous analysis
- [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html) - Understanding feature superposition
- [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html) - How models learn from examples

### Tools and Resources
- [TransformerLens](https://github.com/neelnanda-io/TransformerLens) - Neel Nanda's interpretability library
- [Neuroscope](https://neuroscope.io/) - Anthropic's neuron visualization platform  
- [CircuitsVis](https://github.com/alan-cooney/CircuitsVis) - Interactive attention pattern visualization
- [SAELens](https://github.com/jbloomAus/SAELens) - Tools for training sparse autoencoders

### Courses and Tutorials
- [ARENA Mechanistic Interpretability](https://www.perfectlynormal.co.uk/arena-mi) - Comprehensive practical course
- [Neel Nanda's 200 Concrete Problems](https://docs.google.com/document/d/1WONBzNqfKIxERejrrPlQMyKqg7z1xy-l0WJMGGf56xg/edit) - Research ideas
- [AI Safety Fundamentals: Interpretability](https://aisafetyfundamentals.com/alignment-course/) - Structured learning path

## Connections

### Related Topics
- **basic-interpretability**: Foundation concepts before diving into mechanistic work
- **debugging-tools**: Practical frameworks for model analysis
- **agent-architectures**: Understanding how interpretability applies to agent systems
- **safety-evaluation-101**: Using interpretability for safety assessments

### Key Figures
- **Chris Olah**: Pioneer of neural network interpretability at Anthropic
- **Neel Nanda**: Leading mechanistic interpretability research at DeepMind
- **Catherine Olsson**: Anthropic researcher on interpretability and safety
- **Nelson Elhage**: Core contributor to transformer circuits work

### Organizations
- **Anthropic**: Leading interpretability research with published circuits work
- **DeepMind**: Neel Nanda's team advancing mechanistic understanding
- **Redwood Research**: Applying interpretability to alignment research
- **Apollo Research**: Investigating deceptive AI through interpretability