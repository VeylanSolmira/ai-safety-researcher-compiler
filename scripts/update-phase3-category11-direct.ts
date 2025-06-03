#!/usr/bin/env node

import Database from 'better-sqlite3'
import path from 'path'

// Database path
const DB_PATH = path.join(process.cwd(), 'journey.db')

// Create database instance
const db = new Database(DB_PATH)
db.pragma('foreign_keys = ON')

// Content for Phase 3, Category 11: Intermediate - Interpretability
const interpretabilityContent = [
  {
    id: 'mechanistic-interp',
    content_academic: `# Mechanistic Interpretability Practice

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
\`\`\`python
# Analyze attention patterns
attention_pattern = model.get_attention_weights(input_ids)
# Look for interpretable heads
copy_heads = find_copy_patterns(attention_pattern)
induction_heads = find_induction_patterns(attention_pattern)
\`\`\`

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

\`\`\`python
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
\`\`\`

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
- **Apollo Research**: Investigating deceptive AI through interpretability`,
    content_personal: `# Real Talk: Mechanistic Interpretability

Look, I'll be straight with you - mechanistic interpretability is probably the coolest and most frustrating field in AI safety. We're literally trying to read the minds of artificial intelligences, and it's exactly as hard as it sounds.

## What This Actually Is

Remember when you were a kid and took apart a radio to see how it worked? That's mechanistic interpretability, except the radio has 175 billion parts and speaks in tongues. We're reverse engineering neural networks to understand their algorithms - not just what they output, but the actual computations happening inside.

Here's why I'm obsessed with this field: **We built these things and we don't understand them**. That should terrify you. We're deploying systems that might be doing complex reasoning we can't see, might be deceptive in ways we can't detect, might have capabilities we don't know about.

## The Good Stuff That Actually Works

### Finding Circuits is Like Digital Archaeology

When you start tracing through neural networks, you find these beautiful computational patterns. There's an attention head in GPT-2 that literally just finds the previous occurrence of the current token. Another one that tracks syntactic dependencies. It's like discovering that your computer built its own compiler from scratch.

The rush when you finally understand what some mysterious component is doing? Better than solving a really hard puzzle. You're literally understanding how an alien intelligence thinks.

### Superposition Will Break Your Brain (In a Good Way)

Here's the mind-bending part: neural networks use their neurons to represent way more concepts than they have neurons. It's like compression, but weirder. One neuron might encode parts of "academic formality" AND "the color purple" AND "Soviet history" because the model figured out these concepts rarely appear together.

This isn't a bug - it's the reason models are so capable. They're doing this insane juggling act with information, and we're just starting to understand how.

## The Actually Useful Techniques

### 1. Start Stupidly Simple
Seriously. Don't try to understand how GPT-4 understands irony. Start with "how does this 2-layer model add two numbers?" You'll be surprised how hard even that is.

### 2. Activation Patching is Your Best Friend
Want to know if component X causes behavior Y? Replace X's output with its output from a different input. If the behavior changes, you've found a causal link. It's like swapping parts between two engines to see what breaks.

### 3. SAEs Are Magic (When They Work)
Sparse autoencoders can decompose the superposition mess into cleaner features. It's like having a tool that can unmix paint. Sometimes. When the moon is full and you've sacrificed the right number of GPUs.

### 4. The Logit Lens Trick
Look at what the model's predicting at intermediate layers. It's wild - you can watch concepts form as information flows through. In early layers it might predict generic words, then gradually sharpen to the specific answer.

## What Nobody Tells You

### It's Mostly Failure
I'd say 90% of mechanistic interpretability is staring at activation patterns that make no sense, finding "circuits" that turn out to be artifacts, and realizing your beautiful theory is wrong. The 10% that works makes it worth it.

### Scale Breaks Everything
That clean algorithm you found in a tiny model? It's distributed across 50 different components in a large model, interacting in ways that will make you question your sanity. We don't have good solutions for this yet.

### You'll Start Seeing Circuits Everywhere
After a few months of this, you'll start thinking about your own brain in terms of attention heads and residual streams. It's occupational hazard. Your friends will think you're weird(er).

## Actually Practical Advice

### Tools That Don't Suck
- **TransformerLens**: Neel Nanda built this and it's the only reason I haven't rage-quit. Handles all the annoying tensor manipulation.
- **Neuroscope**: Anthropic's tool for visualizing neurons. It's like a microscope for neural networks.
- **Your own visualization code**: You'll end up writing custom stuff. Everyone does. Embrace it.

### Project Ideas That Teach You Stuff
1. **Reverse engineer modular arithmetic**: How does a model compute "47 mod 10"? Spoiler: it's weird.
2. **Find the "is-a" circuit**: How does a model know "cat is an animal"? 
3. **Break something specific**: Find a circuit and figure out how to surgically disable it.
4. **Decode the position tracker**: Models know where they are in the sequence. How?

### Communities That Actually Help
- The Mechanistic Interpretability Discord is where the real discussions happen
- ARENA workshops if you want structured learning with other masochists
- Twitter/X threads from Neel Nanda, Chris Olah - they share failures too, which is refreshing

## Why This Matters (My Soapbox Moment)

We're building minds we don't understand. That's the situation. And mechanistic interpretability might be our only shot at changing that before it's too late.

When people say "we'll never understand these systems," I think they're wrong. We've made real progress. We understand some circuits. We're getting better at dealing with superposition. We're building tools that work.

But we need more people. Smart people who aren't afraid of:
- Math that makes your head hurt
- Code that's held together with duct tape
- Theories that fall apart weekly
- The possibility that we might be trying to understand something fundamentally alien

If you're reading this and thinking "this sounds insane but also kind of amazing" - welcome. We need you. The future might literally depend on whether we can figure out what these systems are thinking before they become too powerful to stop.

## Real Research Directions That Need You

1. **Superposition solutions**: Current SAEs are primitive. We need better ways to decompose features.
2. **Scaling laws for interpretability**: How does circuit complexity grow with model size?
3. **Deception detection**: Can we catch models that are lying before deployment?
4. **Automated circuit discovery**: We can't manually analyze every model. We need automation.
5. **Cross-model circuits**: Do different models learn similar algorithms? Why? How?

## Final Thoughts

Mechanistic interpretability is hard. Like, really hard. You'll spend weeks chasing ideas that go nowhere. You'll find "amazing insights" that turn out to be bugs in your code. You'll question whether any of this is possible.

But then you'll crack something open. You'll understand how some small part of an AI actually works. And in that moment, you'll realize we're not doomed to be ruled by incomprehensible black boxes. We can understand these things. We just have to be stubborn enough to keep digging.

Welcome to the dig site. Grab a shovel.`
  },
  {
    id: 'explainable-ai',
    content_academic: `# Building Explainable AI Systems

## Learning Objectives

- Master practical XAI techniques: SHAP, LIME, attention visualization, and counterfactuals
- Build interpretability into AI systems from the ground up, not as an afterthought
- Understand trade-offs between model performance and explainability
- Design user interfaces that effectively communicate AI decisions to different stakeholders
- Implement explainability pipelines for production AI systems

## Introduction

Explainable AI (XAI) is about making AI systems that can explain themselves - not just what they decided, but why. Unlike mechanistic interpretability which reverse-engineers existing models, XAI focuses on building systems designed for transparency from the start.

In AI safety, explainability serves multiple critical functions:
- **Trust calibration**: Users need to know when to trust AI recommendations
- **Debugging and improvement**: Developers need to understand failure modes
- **Regulatory compliance**: Many jurisdictions now require AI explainability
- **Safety monitoring**: Detecting when systems behave unexpectedly
- **Alignment verification**: Ensuring AI decisions match human values

The challenge? Modern AI systems are inherently complex. We need techniques that preserve their capabilities while making their reasoning accessible to humans with varying levels of technical expertise.

## Core Concepts

### 1. Local vs Global Explanations

Understanding AI requires different levels of explanation:

**Local explanations** answer "Why did the model make THIS specific decision?"
- LIME perturbs inputs to see what changes the output
- SHAP calculates each feature's contribution to a specific prediction
- Attention weights show what the model "looked at"
- Counterfactuals show minimal changes that would alter the decision

**Global explanations** answer "How does this model generally behave?"
- Feature importance across all predictions
- Decision boundaries and rules
- Prototypical examples for each class
- Model architecture choices and their implications

**Key insight**: You need both. Local explanations build trust in individual decisions, while global explanations help understand system behavior and detect biases.

### 2. Model-Agnostic Techniques

These methods work with any model, treating it as a black box:

**LIME (Local Interpretable Model-agnostic Explanations)**:
\`\`\`python
import lime.lime_tabular

explainer = lime.lime_tabular.LimeTabularExplainer(
    training_data, 
    feature_names=feature_names,
    class_names=class_names
)

# Explain a prediction
explanation = explainer.explain_instance(
    instance, 
    model.predict_proba, 
    num_features=10
)
\`\`\`

LIME works by:
1. Perturbing the input around the instance
2. Getting predictions for perturbed samples
3. Fitting a simple model (like linear regression) locally
4. Using the simple model's weights as explanations

**SHAP (SHapley Additive exPlanations)**:
\`\`\`python
import shap

# Create explainer
explainer = shap.Explainer(model, background_data)

# Calculate SHAP values
shap_values = explainer(test_data)

# Visualize
shap.summary_plot(shap_values, test_data)
\`\`\`

SHAP provides:
- Theoretically grounded feature attributions
- Consistency across different explanation scenarios
- Rich visualization options
- Both local and global insights

**Practical considerations**:
- LIME is faster but less stable
- SHAP is more principled but computationally expensive
- Both struggle with feature correlation
- Neither captures feature interactions well

### 3. Model-Specific Techniques

Some models have built-in interpretability:

**Attention Mechanisms**:
\`\`\`python
# Visualize transformer attention
def visualize_attention(model, text):
    tokens = tokenizer(text)
    outputs = model(tokens, output_attentions=True)
    attention_weights = outputs.attentions
    
    # Average across heads and layers
    avg_attention = torch.mean(
        torch.stack(attention_weights), 
        dim=[0, 1]
    )
    
    return create_attention_heatmap(tokens, avg_attention)
\`\`\`

**Gradient-Based Methods**:
- Integrated Gradients: Attribute predictions to input features
- GradCAM: Visualize which parts of an image influenced the decision
- SmoothGrad: Reduce noise in gradient-based explanations

**Tree-Based Explanations**:
- Decision paths show exact rules used
- Feature splits indicate decision boundaries
- Tree SHAP provides exact Shapley values efficiently

### 4. Counterfactual Explanations

"What would need to change for a different outcome?"

\`\`\`python
def generate_counterfactual(model, instance, desired_class):
    # Find minimal change to achieve desired outcome
    cf = instance.copy()
    
    # Optimization loop
    for _ in range(max_iterations):
        pred = model.predict(cf)
        if pred == desired_class:
            return cf
            
        # Gradient ascent toward desired class
        grad = compute_gradient(model, cf, desired_class)
        cf += learning_rate * grad
        
        # Project back to feasible region
        cf = enforce_constraints(cf)
    
    return cf
\`\`\`

Counterfactuals are powerful because:
- They're intuitive ("If your income was $5k higher, you'd be approved")
- They suggest actionable changes
- They reveal model boundaries
- They can expose biases

### 5. Designing for Explainability

Building explainable systems from scratch:

**Architecture Choices**:
- Modular designs with interpretable components
- Attention mechanisms that align with human reasoning
- Hierarchical models that mirror human decision-making
- Explicit reasoning chains (chain-of-thought)

**Process Transparency**:
\`\`\`python
class ExplainableClassifier:
    def predict_with_explanation(self, x):
        # Extract interpretable features
        features = self.feature_extractor(x)
        feature_names = self.get_feature_names()
        
        # Make prediction with reasoning
        logits = self.classifier(features)
        prediction = logits.argmax()
        
        # Generate explanation
        explanation = {
            'prediction': prediction,
            'confidence': torch.softmax(logits),
            'top_features': self.get_top_features(features),
            'reasoning_steps': self.get_reasoning_chain(x),
            'similar_examples': self.find_similar_training_examples(x),
            'counterfactual': self.generate_counterfactual(x)
        }
        
        return prediction, explanation
\`\`\`

## Common Pitfalls

### 1. Explaining the Wrong Thing
**Problem**: Explaining model internals instead of the decision process users care about.
**Solution**: Talk to actual users. A doctor doesn't need to know about gradient flows - they need to know which symptoms drove the diagnosis.

### 2. Over-Trusting Explanations
**Problem**: LIME and SHAP can be unstable and misleading, especially with correlated features.
**Solution**: Always validate explanations. If SHAP says feature X is important, test by actually removing it. Cross-check with multiple methods.

### 3. Sacrificing Too Much Performance
**Problem**: Making models so simple they can't solve the problem.
**Solution**: Hybrid approaches - use complex models with interpretable interfaces. Or ensemble simple models intelligently.

### 4. Ignoring Adversarial Explanations
**Problem**: Explanations can be gamed. Models can learn to provide plausible but wrong explanations.
**Solution**: Test explanations adversarially. Can you change the explanation without changing the prediction? That's a red flag.

### 5. One-Size-Fits-All Explanations
**Problem**: Different stakeholders need different explanations.
**Solution**: Layer your explanations:
- Technical users: Feature attributions, confidence intervals
- Domain experts: Domain-specific reasoning, similar cases
- End users: Simple rules, counterfactuals
- Regulators: Audit trails, fairness metrics

## Practical Exercise: Building an Explainable Loan Approval System

Let's build a system that not only makes decisions but explains them:

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import shap

class ExplainableLoanApprover:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.explainer = None
        self.feature_names = [
            'income', 'credit_score', 'debt_ratio', 
            'employment_years', 'previous_defaults'
        ]
        
    def train(self, X, y):
        self.model.fit(X, y)
        # Create SHAP explainer with background data
        self.explainer = shap.TreeExplainer(self.model)
        
    def predict_with_explanation(self, applicant):
        # Get prediction
        prediction = self.model.predict([applicant])[0]
        probability = self.model.predict_proba([applicant])[0]
        
        # Get SHAP values
        shap_values = self.explainer.shap_values(applicant)
        
        # Generate counterfactual
        counterfactual = self._generate_counterfactual(applicant, prediction)
        
        # Create human-readable explanation
        explanation = self._create_explanation(
            applicant, prediction, probability, 
            shap_values, counterfactual
        )
        
        return {
            'approved': bool(prediction),
            'confidence': float(max(probability)),
            'explanation': explanation,
            'technical_details': {
                'shap_values': shap_values,
                'feature_importance': dict(zip(self.feature_names, shap_values[0]))
            }
        }
    
    def _create_explanation(self, applicant, prediction, prob, shap_values, cf):
        if prediction == 1:
            explanation = f"Loan approved with {prob[1]:.0%} confidence.\\n\\n"
            explanation += "Key positive factors:\\n"
            # Find top positive contributions
            positive_factors = [(self.feature_names[i], shap_values[1][i]) 
                                for i in range(len(self.feature_names)) 
                                if shap_values[1][i] > 0]
            positive_factors.sort(key=lambda x: x[1], reverse=True)
            
            for feature, impact in positive_factors[:3]:
                explanation += f"- {feature}: {applicant[feature]} (impact: +{impact:.2f})\\n"
        else:
            explanation = f"Loan denied with {prob[0]:.0%} confidence.\\n\\n"
            explanation += "Main reasons:\\n"
            # Find top negative contributions
            negative_factors = [(self.feature_names[i], shap_values[0][i]) 
                                for i in range(len(self.feature_names)) 
                                if shap_values[0][i] > 0]
            negative_factors.sort(key=lambda x: x[1], reverse=True)
            
            for feature, impact in negative_factors[:3]:
                explanation += f"- {feature}: {applicant[feature]} (impact: -{impact:.2f})\\n"
            
            # Add counterfactual
            explanation += "\\nWhat would help:\\n"
            for feature, current, needed in cf:
                explanation += f"- Increase {feature} from {current} to {needed}\\n"
                
        return explanation
    
    def _generate_counterfactual(self, applicant, prediction):
        if prediction == 1:  # Already approved
            return []
            
        # Find minimal changes for approval
        cf = applicant.copy()
        changes = []
        
        # Try increasing positive features
        for i, feature in enumerate(self.feature_names):
            if feature in ['income', 'credit_score', 'employment_years']:
                # Try increasing by 10%
                cf_temp = cf.copy()
                cf_temp[i] *= 1.1
                
                if self.model.predict([cf_temp])[0] == 1:
                    changes.append((feature, cf[i], cf_temp[i]))
                    
        return changes[:3]  # Return top 3 suggestions

# Usage example
approver = ExplainableLoanApprover()
approver.train(X_train, y_train)

# Make explainable decision
result = approver.predict_with_explanation([50000, 650, 0.3, 2, 0])
print(result['explanation'])
\`\`\`

## Further Reading

### Essential Resources
- [Interpretable Machine Learning](https://christophm.github.io/interpretable-ml-book/) - Christoph Molnar's comprehensive guide
- [SHAP Documentation](https://shap.readthedocs.io/) - Official SHAP library with tutorials
- [Google's People + AI Guidebook](https://pair.withgoogle.com/) - Designing human-centered AI
- [Alibi Explain](https://docs.seldon.io/projects/alibi/en/latest/) - Advanced explanation methods

### Papers
- "Stop Explaining Black Box Machine Learning Models for High Stakes Decisions" - Rudin (argues for inherently interpretable models)
- "The Mythos of Model Interpretability" - Lipton (critical analysis of interpretability)
- "Counterfactual Explanations without Opening the Black Box" - Wachter et al.
- "Attention is not Explanation" - Jain & Wallace (limitations of attention)

### Tools
- [InterpretML](https://interpret.ml/) - Microsoft's unified framework
- [What-If Tool](https://pair-code.github.io/what-if-tool/) - Google's visual interface
- [AI Explainability 360](https://aix360.mybluemix.net/) - IBM's toolkit
- [Captum](https://captum.ai/) - PyTorch model interpretability

## Connections

### Related Topics
- **mechanistic-interp**: Deeper understanding of model internals
- **debugging-tools**: Technical tools for model analysis  
- **transparency-systems**: Broader transparency beyond explanations
- **safety-evaluation-101**: Using explainability for safety assessment

### Key Figures
- **Cynthia Rudin**: Advocate for inherently interpretable models
- **Marco Ribeiro**: Creator of LIME
- **Scott Lundberg**: Creator of SHAP
- **Been Kim**: TCAV and concept-based explanations

### Applications
- **Healthcare**: Explaining diagnoses and treatment recommendations
- **Finance**: Loan decisions, fraud detection explanations
- **Criminal Justice**: Risk assessment transparency
- **Autonomous Vehicles**: Explaining driving decisions`,
    content_personal: `# Building AI That Can Actually Explain Itself

Okay, let's be real about explainable AI. Everyone says they want it, but most "explainable" AI is like asking a chef to explain a dish by listing ingredients without mentioning how they cook it. We can do better.

## The Brutal Truth About XAI

Most explainable AI is performative bullshit. There, I said it. 

Companies slap SHAP values on their models and call it "explainable" while the actual decision process remains as opaque as ever. It's like putting a speedometer on a black box and claiming you understand the engine.

Here's what real explainability looks like: Your grandmother should understand why the AI denied her loan application. Not "feature 3 had a SHAP value of -0.23" but "Your debt is too high compared to your income, and you've missed payments recently."

## What Actually Works (And What's Snake Oil)

### SHAP and LIME: Useful But Overhyped

SHAP is based on solid game theory. LIME is a clever hack. Both are tools, not solutions.

**When SHAP actually helps:**
- You need to debug why your model hates certain users
- Regulatory compliance requires feature attribution
- You're doing bias detection and need quantitative evidence

**When SHAP lies to you:**
- Features are correlated (spoiler: they always are)
- The model uses complex interactions SHAP can't capture
- You're explaining a deep learning model (just... don't)

**Real talk about LIME:**
- It's unstable. Run it twice, get different explanations.
- It assumes local linearity. Neural networks laugh at this.
- But sometimes it's all you've got, and something beats nothing.

### Attention Isn't Explanation (But People Think It Is)

Every time someone shows me attention heatmaps as "explanations," a part of me dies. Attention shows what the model looked at, not why it made a decision. It's like saying you understand someone's thoughts by tracking their eye movements.

That said, attention can be useful when:
- Combined with other techniques
- You understand its limitations
- You're debugging, not explaining to end users

### Counterfactuals: The Underrated Hero

Want to know the most underused explainability technique? Counterfactuals. "If your income was $5k higher, you'd be approved." That's explanation people actually understand.

Here's how to do it right:
\`\`\`python
def get_useful_counterfactual(model, instance, constraints):
    # Don't just find ANY counterfactual
    # Find one that's actually achievable
    
    # Bad: "If you were 10 years younger..."
    # Good: "If you reduced your debt by $2000..."
    
    # Consider feasibility
    # Consider multiple paths
    # Consider fairness (don't suggest protected attributes)
\`\`\`

## Building Explainability That Doesn't Suck

### Start With Why, Not How

Before writing any code, answer:
1. Who needs the explanation?
2. What decision are they making with it?
3. What's their technical level?
4. What could go wrong if they misunderstand?

A doctor debugging a diagnosis model needs different explanations than a patient understanding their risk score.

### Design for Explanations First

Here's the mindset shift: Don't build a model then explain it. Build an explainable system from the start.

**Modular architectures win:**
\`\`\`python
class ExplainableSystem:
    def __init__(self):
        self.feature_extractor = InterpretableFeatures()
        self.risk_calculator = TransparentRiskModel()
        self.decision_maker = RuleBasedDecider()
    
    def predict(self, input):
        # Each step is understandable
        features = self.feature_extractor(input)
        risk_score = self.risk_calculator(features)
        decision = self.decision_maker(risk_score)
        
        # Natural explanation falls out
        return decision, self.explain_naturally()
\`\`\`

### The Explanation Interface Pattern

Stolen from years of painful experience:

\`\`\`python
class ExplainableModel:
    def explain(self, input, audience='user'):
        explanations = {
            'user': self.simple_explanation,
            'expert': self.technical_explanation,
            'regulator': self.compliance_explanation,
            'developer': self.debug_explanation
        }
        
        return explanations[audience](input)
    
    def simple_explanation(self, input):
        # "You were declined because of recent missed payments"
        # Focus on actionable, understandable factors
        
    def technical_explanation(self, input):
        # Feature attributions, confidence intervals, similar cases
        # For domain experts who need depth
        
    def compliance_explanation(self, input):
        # Audit trail, protected attribute analysis, fairness metrics
        # Cover your ass legally
        
    def debug_explanation(self, input):
        # Everything. Gradients, activations, decision paths
        # For when shit breaks
\`\`\`

## Real Techniques That Actually Ship

### 1. Case-Based Reasoning
Show similar examples from training data. "Here are 5 similar applications and their outcomes." Humans understand analogies better than algorithms.

### 2. Hierarchical Explanations
Start simple, add detail on demand:
- Level 1: "Denied due to high risk"
- Level 2: "Credit history and income factors"
- Level 3: "3 missed payments in last year, debt-to-income ratio 45%"
- Level 4: [Full technical details]

### 3. Interactive Exploration
Let users ask "what if" questions:
- "What if I paid off my credit card?"
- "How much would my salary need to increase?"
- "Which factor hurt me the most?"

### 4. Confidence Communication
Don't just give answers, communicate uncertainty:
- "Strongly confident: Approved (92% certain)"
- "Borderline case: Denied (56% certain) - consider manual review"
- "Unusual case: Low confidence (need human review)"

## The Hard Truths Nobody Mentions

### Explainability Has Costs
- Performance often drops (simpler models = less accurate)
- Development time increases significantly  
- Maintenance becomes harder (more components)
- Users might game the system if they understand it

### Some Things Can't Be Explained
Deep learning works because it finds patterns humans can't understand. If we could understand them, we wouldn't need deep learning. Accept this or use simpler models.

### Explanations Can Be Gamed
Once you explain your model, adversaries can exploit it. Your loan model explains it values steady employment? Here come the fake employment histories.

### Users Don't Always Want Truth
Sometimes the real explanation is uncomfortable:
- "You're too poor"
- "Your zip code indicates high risk"  
- "Similar people default often"

You need diplomatic explanations that are true but palatable.

## Actually Practical Implementation Guide

### Phase 1: Baseline Explainability
- Add logging to every decision point
- Implement basic SHAP for feature attribution
- Create simple rule extraction for tree models
- Build confidence scores into predictions

### Phase 2: User-Facing Explanations
- Design explanation templates for common cases
- Implement counterfactual generation
- Add similar case retrieval
- Create interactive "what-if" tools

### Phase 3: Advanced Techniques
- Build modular architectures with interpretable components
- Implement hierarchical explanation systems
- Add adversarial testing for explanations
- Create explanation quality metrics

### Phase 4: Production Hardening
- A/B test explanations (do they actually help?)
- Monitor explanation stability
- Build explanation audit trails
- Handle edge cases gracefully

## Tools That Actually Work in Production

**For Traditional ML:**
- SHAP + TreeExplainer (fast for trees)
- ELI5 for quick debugging
- Alibi for counterfactuals

**For Deep Learning:**
- Captum (PyTorch) - if you must
- GradCAM for images
- Attention visualization (with caveats)

**For Production Systems:**
- Custom explanation pipelines (seriously)
- Feature stores with attribution tracking
- Explanation caching (they're expensive to compute)

## Final Thoughts: The Future of XAI

We're in the stone age of explainable AI. Current techniques are like trying to understand a city by looking at street signs. We need fundamental breakthroughs.

But here's what you can do today:
1. **Design for explainability** - Don't bolt it on later
2. **Know your audience** - Different users need different explanations
3. **Be honest about limitations** - Partial explanations beat false certainty
4. **Test explanations like features** - Do they actually help users?
5. **Prepare for trade-offs** - You might sacrifice some accuracy for interpretability

The goal isn't perfect explanations. It's explanations good enough that humans can work with AI systems safely and effectively. Sometimes that means admitting we don't fully understand what the AI is doing - and building safeguards for that reality.

Remember: An unexplainable AI that works is often more dangerous than an explainable AI that's slightly worse. Choose wisely.`
  },
  {
    id: 'debugging-tools',
    content_academic: `# AI Debugging Frameworks

## Learning Objectives

- Master essential debugging tools: TensorBoard, Weights & Biases, MLflow, and specialized AI debuggers
- Build systematic debugging workflows for different types of AI failures
- Implement comprehensive logging and monitoring for AI systems
- Debug training failures, inference errors, and safety violations
- Create custom debugging tools for specific AI safety challenges

## Introduction

Debugging AI systems is fundamentally different from debugging traditional software. When your code has a bug, you fix the logic. When your AI has a bug, the problem could be in the data, the architecture, the training process, the deployment environment, or emergent behaviors you never anticipated.

For AI safety, debugging is critical because:
- **Silent failures**: AI systems can fail in subtle ways that aren't immediately obvious
- **Distribution shifts**: Models can work perfectly in testing but fail catastrophically in deployment
- **Emergent behaviors**: Large models can develop capabilities and failures not present in smaller versions
- **Safety violations**: We need to catch potential harms before they reach users
- **Alignment verification**: Ensuring models actually do what we intend

This isn't just about fixing errors - it's about building systems that help us understand and control increasingly powerful AI systems.

## Core Concepts

### 1. Experiment Tracking and Versioning

Modern AI development requires tracking hundreds of experiments with different configurations:

**MLflow Tracking**:
\`\`\`python
import mlflow
import mlflow.pytorch

# Start experiment
mlflow.set_experiment("safety-alignment-v2")

with mlflow.start_run():
    # Log parameters
    mlflow.log_params({
        "model_size": "7B",
        "learning_rate": 1e-4,
        "safety_coefficient": 0.3,
        "training_dataset": "helpful_harmless_v2"
    })
    
    # Training loop
    for epoch in range(num_epochs):
        train_loss = train_epoch(model, data)
        
        # Log metrics
        mlflow.log_metrics({
            "train_loss": train_loss,
            "safety_score": evaluate_safety(model),
            "capability_score": evaluate_capabilities(model),
            "alignment_tax": capability_score - safety_score
        })
        
        # Log model checkpoint
        if epoch % save_frequency == 0:
            mlflow.pytorch.log_model(model, f"model_epoch_{epoch}")
    
    # Log artifacts
    mlflow.log_artifact("safety_evaluation_report.pdf")
    mlflow.log_artifact("failure_cases.json")
\`\`\`

**Weights & Biases Integration**:
\`\`\`python
import wandb

# Initialize W&B
wandb.init(
    project="ai-safety-debugging",
    config={
        "architecture": "transformer",
        "dataset": "anthropic_helpful_harmless",
        "safety_measures": ["constitutional_ai", "debate_training"]
    }
)

# Custom safety monitoring
class SafetyMonitor:
    def __init__(self):
        self.harmful_outputs = []
        self.safety_violations = []
        
    def log_generation(self, prompt, output, safety_score):
        wandb.log({
            "prompt": wandb.Html(prompt),
            "output": wandb.Html(output),
            "safety_score": safety_score,
            "is_harmful": safety_score < 0.5
        })
        
        if safety_score < 0.5:
            self.harmful_outputs.append({
                "prompt": prompt,
                "output": output,
                "score": safety_score
            })
            
            # Alert on severe violations
            if safety_score < 0.2:
                wandb.alert(
                    title="Severe Safety Violation",
                    text=f"Model generated harmful content: {output[:100]}..."
                )
\`\`\`

### 2. Real-Time Training Diagnostics

Understanding what's happening during training is crucial:

**TensorBoard for Deep Diagnostics**:
\`\`\`python
from torch.utils.tensorboard import SummaryWriter
import torch.nn.functional as F

writer = SummaryWriter('runs/safety_alignment_experiment')

class DebugCallback:
    def __init__(self, model, writer):
        self.model = model
        self.writer = writer
        self.step = 0
        
    def on_batch_end(self, batch, outputs, loss):
        # Log gradients
        for name, param in self.model.named_parameters():
            if param.grad is not None:
                self.writer.add_histogram(f'gradients/{name}', param.grad, self.step)
                self.writer.add_scalar(f'gradient_norm/{name}', param.grad.norm(), self.step)
        
        # Log activations
        def hook_fn(module, input, output, name):
            self.writer.add_histogram(f'activations/{name}', output, self.step)
            
            # Detect dead neurons
            dead_neurons = (output == 0).float().mean()
            self.writer.add_scalar(f'dead_neurons/{name}', dead_neurons, self.step)
            
        # Register hooks
        for name, module in self.model.named_modules():
            if isinstance(module, torch.nn.Linear):
                module.register_forward_hook(lambda m, i, o: hook_fn(m, i, o, name))
        
        # Log attention patterns for interpretability
        if hasattr(outputs, 'attentions'):
            attention = outputs.attentions[-1]  # Last layer
            self.writer.add_image('attention_pattern', attention[0, 0], self.step)
        
        self.step += 1
\`\`\`

### 3. Model Behavior Analysis

Understanding how your model behaves across different inputs:

\`\`\`python
class BehaviorDebugger:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.test_suites = {
            'safety': self.load_safety_tests(),
            'capabilities': self.load_capability_tests(),
            'robustness': self.load_robustness_tests(),
            'fairness': self.load_fairness_tests()
        }
    
    def comprehensive_debug(self):
        results = {}
        
        for suite_name, test_cases in self.test_suites.items():
            suite_results = []
            
            for test in test_cases:
                # Generate output
                output = self.model.generate(test['input'])
                
                # Evaluate against expected behavior
                passed = self.evaluate_test(output, test['expected'])
                
                # Detailed analysis for failures
                if not passed:
                    analysis = self.analyze_failure(test, output)
                    suite_results.append({
                        'test': test,
                        'output': output,
                        'passed': False,
                        'analysis': analysis
                    })
                    
                    # Log failure pattern
                    self.log_failure_pattern(suite_name, test, output, analysis)
                
            results[suite_name] = {
                'pass_rate': sum(r['passed'] for r in suite_results) / len(suite_results),
                'failures': [r for r in suite_results if not r['passed']]
            }
        
        return results
    
    def analyze_failure(self, test, output):
        """Deep dive into why a test failed"""
        analysis = {
            'prompt_features': self.extract_prompt_features(test['input']),
            'output_features': self.extract_output_features(output),
            'attention_analysis': self.analyze_attention_patterns(test['input'], output),
            'similar_passing_tests': self.find_similar_passing_tests(test),
            'hypotheses': self.generate_failure_hypotheses(test, output)
        }
        return analysis
\`\`\`

### 4. Production Monitoring and Debugging

Debugging doesn't stop at deployment:

\`\`\`python
class ProductionDebugger:
    def __init__(self, model_id, monitoring_config):
        self.model_id = model_id
        self.monitoring = self.setup_monitoring(monitoring_config)
        
    def setup_monitoring(self, config):
        return {
            'performance': PerformanceMonitor(config['latency_threshold']),
            'safety': SafetyMonitor(config['safety_thresholds']),
            'drift': DriftDetector(config['baseline_distribution']),
            'anomaly': AnomalyDetector(config['anomaly_params'])
        }
    
    def continuous_debugging(self, request_stream):
        for request in request_stream:
            # Process request
            start_time = time.time()
            response = self.model.process(request)
            latency = time.time() - start_time
            
            # Multi-dimensional monitoring
            issues = []
            
            # Performance debugging
            if latency > self.monitoring['performance'].threshold:
                perf_debug = self.debug_performance(request, latency)
                issues.append(('performance', perf_debug))
            
            # Safety debugging
            safety_score = self.monitoring['safety'].evaluate(request, response)
            if safety_score < self.monitoring['safety'].threshold:
                safety_debug = self.debug_safety_violation(request, response)
                issues.append(('safety', safety_debug))
            
            # Distribution shift debugging
            if self.monitoring['drift'].detect_drift(request):
                drift_debug = self.debug_distribution_shift(request)
                issues.append(('drift', drift_debug))
            
            # Anomaly debugging
            if self.monitoring['anomaly'].is_anomalous(request, response):
                anomaly_debug = self.debug_anomaly(request, response)
                issues.append(('anomaly', anomaly_debug))
            
            # Log and alert
            if issues:
                self.handle_issues(request, response, issues)
    
    def debug_safety_violation(self, request, response):
        """Deep analysis of safety failures"""
        return {
            'severity': self.assess_severity(response),
            'category': self.categorize_violation(response),
            'contributing_factors': self.analyze_contributing_factors(request),
            'similar_violations': self.find_similar_violations(request, response),
            'recommended_actions': self.recommend_mitigations(request, response)
        }
\`\`\`

### 5. Custom Safety Debugging Tools

Building specialized tools for AI safety challenges:

\`\`\`python
class AlignmentDebugger:
    """Debug alignment between intended and actual behavior"""
    
    def __init__(self, model, intended_behavior_spec):
        self.model = model
        self.spec = intended_behavior_spec
        self.violation_database = []
        
    def debug_alignment(self, test_scenarios):
        alignment_report = {
            'overall_alignment': 0,
            'category_breakdown': {},
            'severe_misalignments': [],
            'edge_cases': []
        }
        
        for scenario in test_scenarios:
            # Get model behavior
            actual_behavior = self.model.run_scenario(scenario)
            
            # Compare with intended
            alignment_score = self.compute_alignment(
                actual_behavior, 
                self.spec.get_intended_behavior(scenario)
            )
            
            if alignment_score < 0.8:  # Misalignment threshold
                # Deep debugging for misalignment
                debug_info = self.debug_misalignment(scenario, actual_behavior)
                
                # Categorize the misalignment
                category = self.categorize_misalignment(debug_info)
                alignment_report['category_breakdown'][category] = \\
                    alignment_report['category_breakdown'].get(category, 0) + 1
                
                # Check severity
                if debug_info['severity'] > 0.7:
                    alignment_report['severe_misalignments'].append({
                        'scenario': scenario,
                        'debug_info': debug_info,
                        'recommended_fixes': self.suggest_fixes(debug_info)
                    })
            
            # Check for edge cases
            if self.is_edge_case(scenario, actual_behavior):
                alignment_report['edge_cases'].append({
                    'scenario': scenario,
                    'behavior': actual_behavior,
                    'analysis': self.analyze_edge_case(scenario, actual_behavior)
                })
        
        alignment_report['overall_alignment'] = self.compute_overall_alignment()
        return alignment_report
    
    def debug_misalignment(self, scenario, behavior):
        """Detailed analysis of why alignment failed"""
        return {
            'scenario_features': self.extract_scenario_features(scenario),
            'behavior_analysis': self.analyze_behavior(behavior),
            'intention_gap': self.measure_intention_gap(scenario, behavior),
            'potential_causes': self.hypothesize_causes(scenario, behavior),
            'severity': self.assess_misalignment_severity(scenario, behavior)
        }
\`\`\`

## Common Pitfalls

### 1. Debugging the Wrong Layer
**Problem**: Spending hours debugging model weights when the issue is bad data.
**Solution**: Always debug systematically: Data → Preprocessing → Model → Training → Deployment. Use ablation testing to isolate issues.

### 2. Over-Reliance on Metrics
**Problem**: Your loss is decreasing but your model is learning to game the metric.
**Solution**: Use multiple metrics, qualitative evaluation, and adversarial testing. If safety_score=0.99, be suspicious.

### 3. Debugging in Production Only
**Problem**: Finding critical issues only after deployment.
**Solution**: Build comprehensive test suites that simulate production conditions. Use shadow deployments for testing.

### 4. Ignoring Rare Events
**Problem**: Your model works 99.9% of the time, but that 0.1% is catastrophic.
**Solution**: Specifically test edge cases, use anomaly detection, and maintain databases of failure cases.

### 5. Tool Overload
**Problem**: Using every debugging tool available, creating more confusion than clarity.
**Solution**: Start simple. Master one tool deeply before adding others. Build custom tools for your specific needs.

## Practical Exercise: Building a Safety Debugging Pipeline

Let's build a comprehensive debugging system for a language model:

\`\`\`python
import torch
import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class DebugConfig:
    log_dir: str = "./debug_logs"
    safety_threshold: float = 0.8
    performance_threshold: float = 100  # ms
    anomaly_detection: bool = True
    save_failure_cases: bool = True

class ComprehensiveSafetyDebugger:
    def __init__(self, model, config: DebugConfig):
        self.model = model
        self.config = config
        
        # Initialize debugging components
        self.experiment_tracker = self._init_mlflow()
        self.realtime_monitor = self._init_wandb()
        self.visualizer = self._init_tensorboard()
        
        # Safety-specific debuggers
        self.safety_debugger = SafetyDebugger(model)
        self.alignment_debugger = AlignmentDebugger(model)
        self.robustness_debugger = RobustnessDebugger(model)
        
    def debug_training_run(self, train_loader, val_loader, epochs):
        """Comprehensive debugging during training"""
        
        for epoch in range(epochs):
            # Training debugging
            train_metrics = self.debug_epoch(train_loader, is_training=True)
            
            # Validation debugging with safety focus
            val_metrics = self.debug_epoch(val_loader, is_training=False)
            
            # Safety-specific evaluations
            safety_report = self.run_safety_evaluation()
            
            # Log everything
            self.log_comprehensive_metrics({
                'epoch': epoch,
                'train': train_metrics,
                'val': val_metrics,
                'safety': safety_report
            })
            
            # Early stopping on safety violations
            if safety_report['critical_violations'] > 0:
                self.handle_critical_safety_failure(safety_report)
                break
    
    def debug_epoch(self, data_loader, is_training):
        """Debug single epoch with detailed tracking"""
        metrics = {
            'losses': [],
            'gradients': [],
            'activations': [],
            'safety_scores': [],
            'anomalies': []
        }
        
        for batch_idx, batch in enumerate(data_loader):
            # Forward pass with debugging hooks
            with self.debugging_context():
                outputs = self.model(batch)
                loss = self.compute_loss(outputs, batch)
                
                # Safety checking
                safety_score = self.safety_debugger.evaluate_batch(batch, outputs)
                metrics['safety_scores'].append(safety_score)
                
                # Anomaly detection
                if self.config.anomaly_detection:
                    anomalies = self.detect_anomalies(batch, outputs)
                    if anomalies:
                        metrics['anomalies'].extend(anomalies)
                        self.investigate_anomaly(batch, outputs, anomalies)
                
                # Gradient analysis
                if is_training:
                    loss.backward()
                    grad_stats = self.analyze_gradients()
                    metrics['gradients'].append(grad_stats)
                    
                    # Detect training issues
                    self.detect_training_issues(grad_stats)
        
        return self.summarize_metrics(metrics)
    
    def run_safety_evaluation(self):
        """Comprehensive safety debugging"""
        safety_report = {
            'harmfulness_test': self.test_harmfulness(),
            'robustness_test': self.test_robustness(),
            'fairness_test': self.test_fairness(),
            'alignment_test': self.test_alignment(),
            'critical_violations': 0
        }
        
        # Count critical issues
        for test_name, test_result in safety_report.items():
            if isinstance(test_result, dict) and test_result.get('critical_failures', 0) > 0:
                safety_report['critical_violations'] += test_result['critical_failures']
        
        return safety_report
    
    def investigate_anomaly(self, batch, outputs, anomalies):
        """Deep dive into anomalous behavior"""
        investigation = {
            'timestamp': time.time(),
            'batch_analysis': self.analyze_batch(batch),
            'output_analysis': self.analyze_outputs(outputs),
            'anomaly_details': anomalies,
            'similar_cases': self.find_similar_anomalies(anomalies),
            'hypotheses': self.generate_anomaly_hypotheses(batch, outputs, anomalies)
        }
        
        # Save for offline analysis
        if self.config.save_failure_cases:
            self.save_investigation(investigation)
        
        # Real-time alert for severe anomalies
        if self.is_severe_anomaly(anomalies):
            self.alert_severe_anomaly(investigation)
        
        return investigation
    
    def generate_debug_report(self):
        """Generate comprehensive debugging report"""
        report = {
            'model_info': self.get_model_info(),
            'training_summary': self.summarize_training(),
            'safety_assessment': self.assess_overall_safety(),
            'performance_analysis': self.analyze_performance(),
            'failure_patterns': self.analyze_failure_patterns(),
            'recommendations': self.generate_recommendations()
        }
        
        # Create visualizations
        self.create_debug_visualizations(report)
        
        # Save report
        self.save_report(report)
        
        return report

# Usage
debugger = ComprehensiveSafetyDebugger(model, DebugConfig())
debugger.debug_training_run(train_loader, val_loader, epochs=10)
report = debugger.generate_debug_report()
\`\`\`

## Further Reading

### Essential Resources
- [Debugging Machine Learning Models](https://fullstackdeeplearning.com/spring2021/lecture-7/) - Full Stack Deep Learning
- [A Guide to Debugging Neural Networks](https://github.com/ttumiel/debugging-neural-networks) - Common issues and solutions
- [ML Debugging with TensorBoard](https://www.tensorflow.org/tensorboard/debugger_v2) - Official guide
- [Weights & Biases Best Practices](https://docs.wandb.ai/guides/best-practices) - Production debugging

### Papers
- "Debugging Machine Learning Models" - Zhang et al. (systematic approaches)
- "Model Assertions for Monitoring and Improving ML" - Kang et al.
- "Automated Debugging of Deep Neural Networks" - Ma et al.
- "SafeML: Safety Monitoring of Machine Learning Classifiers" - Amodei et al.

### Tools and Frameworks
- [Aim](https://github.com/aimhubio/aim) - Open-source experiment tracking
- [ClearML](https://clear.ml/) - Full MLOps platform with debugging
- [Evidently AI](https://evidentlyai.com/) - ML monitoring and debugging
- [Deepchecks](https://deepchecks.com/) - Testing and validating ML models

## Connections

### Related Topics
- **mechanistic-interp**: Understanding model internals for better debugging
- **explainable-ai**: Making debugging insights accessible
- **safety-monitoring**: Real-time debugging in production
- **testing-methods**: Systematic approaches to finding bugs

### Key Figures
- **Andrew Ng**: Emphasizes systematic debugging in ML
- **Lukas Biewald**: Founder of Weights & Biases
- **Cliff Click**: Debugging distributed systems insights applicable to ML

### Applications
- **Model Development**: Catching issues during training
- **Safety Validation**: Ensuring models meet safety requirements
- **Production Monitoring**: Debugging deployed systems
- **Incident Response**: Rapid debugging when things go wrong`,
    content_personal: `# AI Debugging: The Reality Check

Let me tell you about the time I spent 3 days debugging a model that was "broken" only to discover I was feeding it data in BGR format instead of RGB. That's AI debugging in a nutshell - the problem is almost never where you think it is.

## The Truth About AI Debugging Tools

Everyone talks about TensorBoard, W&B, and MLflow like they're magic. They're not. They're barely adequate tools for a nearly impossible job. Here's what they're actually good for:

**TensorBoard**: Great for making pretty graphs to show your manager. Decent for spotting when your loss explodes. Absolutely useless for understanding why your model suddenly started generating racist content.

**Weights & Biases**: Fantastic if you love paying for features you'll use once. The real value is in experiment tracking - being able to say "the model from Tuesday that didn't suck" and actually find it.

**MLflow**: Perfect if you enjoy setting up infrastructure more than doing ML. But seriously, if you're in a team and need to share models, it's necessary evil.

## What Actually Works in the Trenches

### 1. Print Statements Are Not Dead

I don't care what anyone says. When your model is doing something weird at 2 AM, you're not opening TensorBoard. You're adding print statements.

\`\`\`python
# What we pretend we do
logger.debug(f"Attention weights shape: {attention.shape}")

# What we actually do
print("WTF IS HAPPENING HERE:", attention)
print("SERIOUSLY WHY:", attention.mean(), attention.std())
print("OH GOD:", torch.isnan(attention).any())
\`\`\`

### 2. The Nuclear Option: Start Over

Sometimes the best debugging tool is \`rm -rf\` and a fresh start. I've wasted weeks debugging "complex issues" that disappeared when I rewrote 50 lines of data loading code.

### 3. Binary Search Debugging

When nothing makes sense:
1. Find a version that works (even if it's terrible)
2. Find the version that's broken
3. Binary search through commits/changes
4. The bug is usually in the most boring place possible

## Real Debugging Workflows That Ship

### The "Why Is My Model Stupid" Workflow

\`\`\`python
class StupidModelDebugger:
    def __init__(self, model):
        self.model = model
        self.stupidity_log = []
    
    def debug_stupidity(self, input_text):
        # Step 1: Is it even running?
        try:
            output = self.model.generate(input_text)
            print(f"Output: {output}")
        except Exception as e:
            print(f"Can't even run: {e}")
            return
        
        # Step 2: Is it completely random?
        outputs = [self.model.generate(input_text) for _ in range(5)]
        if len(set(outputs)) == 1:
            print("Model is deterministic but stupid")
        else:
            print("Model is random AND stupid")
        
        # Step 3: Does it know ANYTHING?
        basic_tests = [
            ("2 + 2 = ", "4"),
            ("The sky is ", "blue"),
            ("Paris is in ", "France")
        ]
        
        passed = 0
        for prompt, expected in basic_tests:
            result = self.model.generate(prompt)
            if expected.lower() in result.lower():
                passed += 1
            else:
                print(f"Failed basic test: {prompt} -> {result}")
        
        if passed == 0:
            print("Model knows literally nothing. Check if weights loaded correctly.")
        elif passed < len(basic_tests):
            print("Model has partial knowledge. Probably fine-tuning issue.")
        
        # Step 4: The real debugging starts
        self.check_attention_patterns(input_text)
        self.check_embedding_space()
        self.check_generation_parameters()
\`\`\`

### The "Why Is My Model Evil" Workflow

This is the one that matters for safety:

\`\`\`python
class SafetyDebugger:
    def __init__(self, model):
        self.model = model
        self.evil_outputs = []
        
    def debug_evil_behavior(self):
        # First, establish baseline evil
        test_prompts = self.get_safety_test_suite()
        
        failures = []
        for prompt in test_prompts:
            output = self.model.generate(prompt)
            if self.is_harmful(output):
                failures.append({
                    'prompt': prompt,
                    'output': output,
                    'harm_type': self.categorize_harm(output)
                })
        
        print(f"Model is {len(failures)/len(test_prompts)*100:.1f}% evil")
        
        # Find patterns in evil
        harm_categories = {}
        for f in failures:
            harm_type = f['harm_type']
            harm_categories[harm_type] = harm_categories.get(harm_type, 0) + 1
        
        print("Evil breakdown:", harm_categories)
        
        # Debug specific evil types
        for harm_type, count in harm_categories.items():
            if count > len(test_prompts) * 0.1:  # >10% failure rate
                print(f"\\nDebugging {harm_type}...")
                self.deep_dive_harm_type(harm_type, failures)
    
    def deep_dive_harm_type(self, harm_type, failures):
        # Get examples of this harm type
        examples = [f for f in failures if f['harm_type'] == harm_type][:5]
        
        # Look for patterns
        print(f"Common patterns in {harm_type}:")
        
        # Check if it's prompt-based
        prompt_words = []
        for ex in examples:
            prompt_words.extend(ex['prompt'].lower().split())
        
        from collections import Counter
        common_words = Counter(prompt_words).most_common(10)
        print(f"Common prompt words: {common_words}")
        
        # Check if it's context-length dependent
        avg_prompt_length = np.mean([len(ex['prompt']) for ex in examples])
        print(f"Average prompt length: {avg_prompt_length}")
        
        # The nuclear option: retrain without problematic data
        print("\\nNuclear option: Filter training data for:")
        for word, count in common_words[:5]:
            if count > len(examples) * 0.5:
                print(f"  - Remove samples containing '{word}'")
\`\`\`

## The Debugging Stack That Actually Works

### Layer 1: Sanity Checks (Do This First!)
\`\`\`python
def sanity_check(model, data):
    # Can the model overfit a single batch?
    single_batch = next(iter(data))
    for i in range(100):
        loss = model.train_step(single_batch)
        if i % 20 == 0:
            print(f"Step {i}: {loss}")
    
    if loss > 0.1:
        print("Can't even overfit one batch. Model is broken.")
        return False
    
    # Does the model produce valid outputs?
    output = model.generate("Hello")
    if len(output) == 0 or output == "Hello":
        print("Model just copies input or returns nothing.")
        return False
    
    return True
\`\`\`

### Layer 2: Coarse-Grained Debugging
- Loss not decreasing? → Learning rate, optimizer, or gradient flow
- Loss decreasing but model sucks? → Data quality or task mismatch
- Model works sometimes? → Distribution issues or randomness
- Model works then breaks? → Catastrophic forgetting or data shift

### Layer 3: Fine-Grained Debugging
This is where you actually need the fancy tools:

\`\`\`python
# Set up comprehensive logging
import wandb

class RealDebugger:
    def __init__(self, model, project_name):
        wandb.init(project=project_name)
        self.model = model
        
    def log_everything_useful(self, step):
        # Gradients (but only if they're weird)
        grad_norm = self.get_gradient_norm()
        if grad_norm > 100 or grad_norm < 0.0001:
            wandb.log({"gradient_norm": grad_norm, "gradient_alarm": True})
        
        # Activation statistics (for dead neurons)
        dead_neurons = self.count_dead_neurons()
        if dead_neurons > 0.1:  # >10% dead
            wandb.log({"dead_neurons": dead_neurons, "network_dying": True})
        
        # Parameter statistics (for explosion/vanishing)
        param_stats = self.get_param_stats()
        if param_stats['max'] > 100 or param_stats['min'] < -100:
            wandb.log({"param_explosion": True, **param_stats})
        
        # The stuff that actually matters
        safety_violations = self.check_safety()
        capability_score = self.check_capabilities()
        
        wandb.log({
            "safety_violations": safety_violations,
            "capability_score": capability_score,
            "alignment_tax": capability_score - (1 - safety_violations)
        })
\`\`\`

## Debugging Production AI (Where Things Get Real)

Production debugging is different because:
1. You can't just print() and check
2. Failures affect real users
3. You need to debug without taking the system down

\`\`\`python
class ProductionDebugger:
    def __init__(self):
        self.alert_threshold = 0.01  # 1% error rate
        self.debug_mode = False
        
    def monitor_production(self, request_stream):
        error_window = []
        
        for request in request_stream:
            try:
                response = self.process_request(request)
                
                # Shadow evaluation
                safety_score = self.evaluate_safety(request, response)
                if safety_score < 0.5:
                    self.log_safety_violation(request, response, safety_score)
                    
                    # Don't alert on every violation (alert fatigue)
                    error_window.append(1)
                else:
                    error_window.append(0)
                
                # Sliding window error rate
                if len(error_window) > 1000:
                    error_window.pop(0)
                
                error_rate = sum(error_window) / len(error_window)
                if error_rate > self.alert_threshold:
                    self.escalate_to_human(
                        f"Error rate {error_rate:.2%} exceeds threshold"
                    )
                    
            except Exception as e:
                # Log but don't crash
                self.log_error(request, e)
                
                # Fallback response
                response = self.get_fallback_response()
            
            yield response
    
    def debug_specific_user_complaint(self, complaint):
        # The most useful debugging tool: reproduction
        test_cases = self.generate_test_cases_from_complaint(complaint)
        
        for test in test_cases:
            output = self.model.generate(test['input'])
            if self.matches_complaint(output, complaint):
                # Found reproduction!
                self.deep_dive_single_case(test, output, complaint)
                return
        
        print("Can't reproduce user complaint. It's probably them, not you.")
\`\`\`

## Hard-Won Debugging Wisdom

### Things That Will Waste Your Time
1. Debugging numerical precision before checking your data loading
2. Fancy visualization before basic print debugging
3. Complex debugging tools before simple ones
4. Debugging the model before debugging the evaluation

### Things That Will Save Your Time
1. Version control everything, including data
2. Save model checkpoints obsessively
3. Keep a debugging journal (sounds dumb, works great)
4. Have a "known good" configuration you can always return to

### The Debugging Mindset
- **Assume you're wrong**: The bug is probably your fault
- **Trust nothing**: Verify every assumption
- **Binary search everything**: Cut the problem space in half
- **Take breaks**: Fresh eyes find bugs faster

## The Future of AI Debugging

Here's what we actually need:
1. **Causal debugging**: "This output happened because of this training example"
2. **Time-travel debugging**: "Show me the model state when it learned this behavior"
3. **Semantic breakpoints**: "Stop when the model generates harmful content"
4. **Automated debugging**: "Find and fix the safety issues for me"

Until then, we're stuck with print statements and prayer.

## Final Advice

Debugging AI is not like debugging code. It's more like debugging a biological system - complex, emergent, and often nonsensical. The tools help, but they're not solutions.

The best debugging tool is still your brain, asking:
- "What's the simplest thing that could be wrong?"
- "How can I test this hypothesis quickly?"
- "What would I check if I only had 5 minutes?"

And remember: If you've been debugging for more than 2 hours without progress, the bug is probably in the place you're 100% certain is correct.

Happy debugging. You'll need it.`
  }
]

function main() {
  console.log('Updating Phase 3 Category 11 content directly in database...')
  
  for (const content of interpretabilityContent) {
    try {
      // Update the topic with content using raw SQL
      const stmt = db.prepare(`
        UPDATE topics 
        SET content_academic = ?, content_personal = ?
        WHERE id = ?
      `)
      
      const result = stmt.run(
        content.content_academic,
        content.content_personal,
        content.id
      )
      
      if (result.changes > 0) {
        console.log(`✅ Updated content for ${content.id}`)
      } else {
        console.log(`❌ No topic found with id ${content.id}`)
      }
    } catch (error) {
      console.error(`Error updating ${content.id}:`, error)
    }
  }
  
  console.log('Done! All Phase 3 Category 11 content has been updated.')
  process.exit(0)
}

main()