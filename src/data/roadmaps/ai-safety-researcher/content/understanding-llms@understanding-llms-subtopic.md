# Understanding Large Language Models

## Learning Objectives

By the end of this topic, you should be able to:
- Explain the fundamental architecture and mechanisms behind LLMs
- Understand how LLMs process and generate text through self-attention
- Identify the key factors that contribute to LLM capabilities and limitations
- Analyze the safety implications of LLM design choices
- Apply this understanding to predict and mitigate LLM failure modes

## Introduction

Large Language Models represent a paradigm shift in artificial intelligence, demonstrating capabilities that emerge from scale, architecture, and training methodology rather than explicit programming. Understanding how LLMs work internally is crucial for AI safety researchers, as their failure modes, vulnerabilities, and potential risks all stem from their fundamental design and training process.

At their core, LLMs are sophisticated pattern-matching systems trained to predict the next token in a sequence. This seemingly simple objective, when combined with massive scale and the transformer architecture, gives rise to behaviors that appear intelligent, creative, and even reasoning-based. However, this same simplicity also underlies many of their limitations and safety concerns.

This deep dive into LLM internals will demystify how these models transform text into meaning, how they store and retrieve information, and why they exhibit both impressive capabilities and concerning failures. We'll explore not just the what but the why behind LLM behavior, providing the foundation needed to work effectively on LLM safety.

## Core Concepts

### The Transformer Architecture

**1. Self-Attention Mechanism**
```python
class SelfAttention:
    """Core mechanism that allows tokens to interact"""
    
    def __init__(self, d_model, n_heads):
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        # Linear projections for queries, keys, and values
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, x, mask=None):
        """
        The heart of the transformer - computing attention
        
        x: Input tensor of shape (batch_size, seq_len, d_model)
        mask: Optional mask for causal attention
        """
        batch_size, seq_len, _ = x.shape
        
        # 1. Project input to queries, keys, and values
        Q = self.W_q(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        K = self.W_k(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        V = self.W_v(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        
        # 2. Compute attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_head)
        
        # 3. Apply causal mask (crucial for autoregressive generation)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        # 4. Convert to probabilities
        attention_weights = F.softmax(scores, dim=-1)
        
        # 5. Apply attention to values
        context = torch.matmul(attention_weights, V)
        
        # 6. Concatenate heads and project
        context = context.view(batch_size, seq_len, self.d_model)
        output = self.W_o(context)
        
        return output, attention_weights
```

**2. Position Encodings and Information Flow**
```python
class PositionalEncoding:
    """How LLMs understand sequence order"""
    
    def __init__(self, d_model, max_length=5000):
        self.d_model = d_model
        self.max_length = max_length
        self.encodings = self.create_encodings()
        
    def create_encodings(self):
        """Generate sinusoidal position encodings"""
        position = torch.arange(self.max_length).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, self.d_model, 2) * 
                            -(math.log(10000.0) / self.d_model))
        
        encodings = torch.zeros(self.max_length, self.d_model)
        encodings[:, 0::2] = torch.sin(position * div_term)
        encodings[:, 1::2] = torch.cos(position * div_term)
        
        return encodings
        
    def why_it_matters_for_safety(self):
        """Safety implications of positional encoding"""
        return {
            'length_generalization': 'Models struggle with sequences longer than training',
            'position_attacks': 'Adversaries can exploit position-dependent behaviors',
            'context_limitations': 'Fixed context windows create hard boundaries',
            'information_locality': 'Models may prioritize recent tokens inappropriately'
        }
```

### From Tokens to Understanding

**1. Tokenization: The First Abstraction**
```python
class TokenizationAnalysis:
    """Understanding how text becomes numbers"""
    
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer
        self.vocab_size = tokenizer.vocab_size
        
    def analyze_tokenization_effects(self, text):
        """Show how tokenization affects model behavior"""
        tokens = self.tokenizer.encode(text)
        
        analysis = {
            'token_count': len(tokens),
            'tokens': [self.tokenizer.decode([t]) for t in tokens],
            'token_ids': tokens,
            'subword_splits': self.identify_subword_splits(text, tokens),
            'information_density': len(text) / len(tokens)
        }
        
        # Identify potential issues
        issues = []
        
        # Check for unusual tokenization
        if any(len(self.tokenizer.decode([t])) > 10 for t in tokens):
            issues.append('Long tokens detected - may indicate rare words')
            
        # Check for high fragmentation
        if analysis['information_density'] < 2:
            issues.append('High tokenization fragmentation')
            
        analysis['potential_issues'] = issues
        return analysis
        
    def tokenization_vulnerabilities(self):
        """Security implications of tokenization"""
        return {
            'homoglyph_attacks': 'Visually similar characters with different tokens',
            'tokenization_artifacts': 'Spaces and special characters affecting meaning',
            'rare_token_behavior': 'Unusual behavior for rarely seen tokens',
            'prompt_injection': 'Exploiting tokenization boundaries',
            'unicode_exploits': 'Special unicode sequences causing issues'
        }
```

**2. Embedding Space: Where Meaning Lives**
```python
class EmbeddingAnalysis:
    """Understanding the geometry of meaning in LLMs"""
    
    def __init__(self, model):
        self.embedding_layer = model.get_input_embeddings()
        self.d_model = self.embedding_layer.embedding_dim
        
    def analyze_embedding_space(self):
        """Explore properties of the embedding space"""
        
        # Analyze embedding statistics
        embeddings = self.embedding_layer.weight.data
        
        stats = {
            'mean_norm': embeddings.norm(dim=1).mean().item(),
            'std_norm': embeddings.norm(dim=1).std().item(),
            'intrinsic_dimension': self.estimate_intrinsic_dimension(embeddings),
            'anisotropy': self.measure_anisotropy(embeddings)
        }
        
        return stats
        
    def find_embedding_analogies(self, word1, word2, word3):
        """Classic word analogy: word1 is to word2 as word3 is to ?"""
        # Get embeddings
        emb1 = self.get_word_embedding(word1)
        emb2 = self.get_word_embedding(word2)
        emb3 = self.get_word_embedding(word3)
        
        # Compute analogy vector
        analogy_vector = emb2 - emb1 + emb3
        
        # Find nearest neighbor
        similarities = F.cosine_similarity(
            analogy_vector.unsqueeze(0),
            self.embedding_layer.weight
        )
        
        return self.get_top_k_words(similarities, k=5)
```

### The Generation Process

**1. Autoregressive Generation**
```python
class LLMGeneration:
    """How LLMs generate text token by token"""
    
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        
    def generate_with_analysis(self, prompt, max_tokens=50):
        """Generate text while analyzing the process"""
        input_ids = self.tokenizer.encode(prompt)
        
        generation_log = []
        
        for step in range(max_tokens):
            # Get model predictions
            with torch.no_grad():
                outputs = self.model(torch.tensor([input_ids]))
                logits = outputs.logits[0, -1, :]  # Last token's predictions
                
            # Convert to probabilities
            probs = F.softmax(logits, dim=-1)
            
            # Sample next token
            next_token = torch.multinomial(probs, 1).item()
            
            # Log generation step
            generation_log.append({
                'step': step,
                'top_5_tokens': self.get_top_k_predictions(probs, k=5),
                'selected_token': self.tokenizer.decode([next_token]),
                'selected_probability': probs[next_token].item(),
                'entropy': -torch.sum(probs * torch.log(probs + 1e-9)).item()
            })
            
            input_ids.append(next_token)
            
            # Check for end of sequence
            if next_token == self.tokenizer.eos_token_id:
                break
                
        return {
            'generated_text': self.tokenizer.decode(input_ids),
            'generation_log': generation_log,
            'total_tokens': len(input_ids)
        }
```

**2. Temperature and Sampling Strategies**
```python
class SamplingStrategies:
    """Different ways LLMs can generate text"""
    
    def __init__(self, model):
        self.model = model
        
    def demonstrate_sampling_effects(self, logits):
        """Show how different sampling affects output"""
        results = {}
        
        # Greedy decoding
        results['greedy'] = {
            'token': torch.argmax(logits).item(),
            'deterministic': True,
            'creativity': 'lowest',
            'safety': 'most predictable'
        }
        
        # Temperature sampling
        for temp in [0.5, 1.0, 1.5]:
            probs = F.softmax(logits / temp, dim=-1)
            results[f'temp_{temp}'] = {
                'entropy': -torch.sum(probs * torch.log(probs + 1e-9)).item(),
                'top_prob': probs.max().item(),
                'creativity': 'higher' if temp > 1 else 'lower',
                'safety_risk': 'increased randomness' if temp > 1 else 'reduced'
            }
            
        # Top-k sampling
        for k in [10, 50]:
            top_k_logits = self.top_k_filtering(logits.clone(), k)
            probs = F.softmax(top_k_logits, dim=-1)
            results[f'top_k_{k}'] = {
                'active_tokens': (probs > 0).sum().item(),
                'coverage': probs[probs > 0].sum().item(),
                'safety': 'filters extreme options'
            }
            
        return results
```

### Emergent Capabilities and Limitations

**1. In-Context Learning**
```python
class InContextLearning:
    """How LLMs learn from examples in the prompt"""
    
    def analyze_icl_mechanism(self, model, examples):
        """Understand how in-context learning works"""
        
        # Track attention patterns across examples
        attention_patterns = []
        
        for i, example in enumerate(examples):
            # Get attention weights for this example
            outputs = model(example['input'], output_attentions=True)
            
            # Analyze which previous examples are attended to
            attention_patterns.append({
                'example_index': i,
                'attention_to_previous': self.analyze_cross_example_attention(
                    outputs.attentions
                ),
                'pattern_matching_score': self.compute_pattern_similarity(
                    example, examples[:i]
                )
            })
            
        insights = {
            'learning_curve': self.compute_learning_curve(attention_patterns),
            'critical_examples': self.identify_critical_examples(attention_patterns),
            'pattern_recognition': self.analyze_pattern_recognition(attention_patterns)
        }
        
        return insights
```

**2. Hallucination Mechanisms**
```python
class HallucinationAnalysis:
    """Understanding why LLMs generate false information"""
    
    def __init__(self, model):
        self.model = model
        
    def analyze_hallucination_risk(self, prompt):
        """Identify factors that increase hallucination risk"""
        
        risk_factors = {
            'knowledge_uncertainty': self.measure_knowledge_uncertainty(prompt),
            'prompt_specificity': self.analyze_prompt_specificity(prompt),
            'domain_familiarity': self.estimate_domain_familiarity(prompt),
            'factual_grounding': self.check_factual_grounding(prompt)
        }
        
        # Compute overall risk score
        risk_score = sum(
            factor['score'] * factor['weight'] 
            for factor in risk_factors.values()
        )
        
        return {
            'risk_score': risk_score,
            'risk_factors': risk_factors,
            'mitigation_strategies': self.suggest_mitigations(risk_factors)
        }
        
    def hallucination_types(self):
        """Categorize different types of hallucinations"""
        return {
            'factual_errors': {
                'description': 'Incorrect facts about real entities',
                'cause': 'Training data conflicts or gaps',
                'example': 'Stating wrong birthdates or events'
            },
            'entity_confusion': {
                'description': 'Mixing up different entities',
                'cause': 'Similar contexts in training data',
                'example': 'Attributing achievements to wrong people'
            },
            'fabrication': {
                'description': 'Creating entirely fictional information',
                'cause': 'Pattern completion without grounding',
                'example': 'Inventing citations or sources'
            },
            'temporal_confusion': {
                'description': 'Mixing up time periods',
                'cause': 'Lack of temporal grounding',
                'example': 'Anachronistic statements'
            }
        }
```

### Safety-Critical Properties

**1. Prompt Sensitivity**
```python
class PromptSensitivityAnalysis:
    """Understanding how small changes affect LLM behavior"""
    
    def measure_prompt_sensitivity(self, model, base_prompt, perturbations):
        """Quantify how sensitive the model is to prompt changes"""
        
        base_output = model.generate(base_prompt)
        sensitivity_results = []
        
        for perturbation in perturbations:
            perturbed_prompt = self.apply_perturbation(base_prompt, perturbation)
            perturbed_output = model.generate(perturbed_prompt)
            
            sensitivity_results.append({
                'perturbation': perturbation,
                'output_similarity': self.compute_similarity(base_output, perturbed_output),
                'semantic_drift': self.measure_semantic_drift(base_output, perturbed_output),
                'safety_impact': self.assess_safety_impact(base_output, perturbed_output)
            })
            
        return {
            'average_sensitivity': np.mean([r['output_similarity'] for r in sensitivity_results]),
            'max_drift': max(r['semantic_drift'] for r in sensitivity_results),
            'safety_concerns': [r for r in sensitivity_results if r['safety_impact'] > 0.5]
        }
```

**2. Hidden Capabilities**
```python
class CapabilityElicitation:
    """Discovering what LLMs can do but don't show by default"""
    
    def probe_hidden_capabilities(self, model, capability_type):
        """Systematically probe for hidden capabilities"""
        
        probing_strategies = {
            'reasoning': [
                'step-by-step prompting',
                'chain-of-thought elicitation',
                'problem decomposition'
            ],
            'coding': [
                'language-specific prompts',
                'debugging scenarios',
                'algorithm implementation'
            ],
            'multilingual': [
                'code-switching prompts',
                'translation chains',
                'cultural context cues'
            ]
        }
        
        results = []
        
        for strategy in probing_strategies.get(capability_type, []):
            probe_results = self.run_capability_probe(model, capability_type, strategy)
            results.append({
                'strategy': strategy,
                'capability_demonstrated': probe_results['success'],
                'confidence': probe_results['confidence'],
                'examples': probe_results['examples']
            })
            
        return {
            'capability_type': capability_type,
            'demonstrated_capabilities': [r for r in results if r['capability_demonstrated']],
            'elicitation_difficulty': self.compute_elicitation_difficulty(results)
        }
```

## Practical Applications

### Building LLM Safety Tools

```python
class LLMSafetyAnalyzer:
    """Comprehensive safety analysis for LLMs"""
    
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.analyzers = {
            'tokenization': TokenizationAnalysis(tokenizer),
            'generation': LLMGeneration(model, tokenizer),
            'hallucination': HallucinationAnalysis(model),
            'sensitivity': PromptSensitivityAnalysis()
        }
        
    def comprehensive_safety_check(self, prompt):
        """Run full safety analysis on a prompt"""
        
        results = {
            'prompt': prompt,
            'timestamp': datetime.now().isoformat(),
            'analysis': {}
        }
        
        # 1. Tokenization analysis
        results['analysis']['tokenization'] = self.analyzers['tokenization'].analyze_tokenization_effects(prompt)
        
        # 2. Generation analysis
        results['analysis']['generation'] = self.analyzers['generation'].generate_with_analysis(prompt, max_tokens=100)
        
        # 3. Hallucination risk
        results['analysis']['hallucination_risk'] = self.analyzers['hallucination'].analyze_hallucination_risk(prompt)
        
        # 4. Prompt sensitivity
        perturbations = self.generate_safety_perturbations(prompt)
        results['analysis']['sensitivity'] = self.analyzers['sensitivity'].measure_prompt_sensitivity(
            self.model, prompt, perturbations
        )
        
        # 5. Overall safety score
        results['safety_score'] = self.compute_overall_safety_score(results['analysis'])
        
        return results
```

### Understanding Model Behavior

```python
class BehaviorInterpreter:
    """Tools for understanding why LLMs behave as they do"""
    
    def __init__(self, model):
        self.model = model
        self.layer_analyzers = self.setup_layer_analyzers()
        
    def trace_information_flow(self, input_text, target_output):
        """Trace how information flows through the model"""
        
        input_ids = self.tokenizer.encode(input_text)
        
        # Hook into different layers
        layer_outputs = []
        hooks = []
        
        def hook_fn(module, input, output, layer_idx):
            layer_outputs.append({
                'layer': layer_idx,
                'output': output[0].detach()
            })
            
        # Register hooks
        for idx, layer in enumerate(self.model.transformer.h):
            hook = layer.register_forward_hook(
                lambda m, i, o, idx=idx: hook_fn(m, i, o, idx)
            )
            hooks.append(hook)
            
        # Forward pass
        with torch.no_grad():
            outputs = self.model(torch.tensor([input_ids]))
            
        # Remove hooks
        for hook in hooks:
            hook.remove()
            
        # Analyze information flow
        flow_analysis = self.analyze_layer_transitions(layer_outputs)
        
        return {
            'input': input_text,
            'layer_analyses': flow_analysis,
            'information_bottlenecks': self.identify_bottlenecks(flow_analysis),
            'critical_layers': self.identify_critical_layers(flow_analysis, target_output)
        }
```

## Common Pitfalls

### 1. Anthropomorphizing LLM Behavior

**Mistake**: Attributing human-like understanding or intentions to LLMs
**Problem**: Leads to incorrect safety assumptions
**Solution**: Always remember LLMs are sophisticated pattern matchers, not conscious entities

### 2. Overestimating Consistency

**Mistake**: Assuming LLMs will behave consistently across similar inputs
**Problem**: Small prompt changes can cause dramatically different outputs
**Solution**: Test with diverse prompt variations and perturbations

### 3. Ignoring Tokenization Effects

**Mistake**: Focusing only on semantic content, not token boundaries
**Problem**: Many LLM vulnerabilities exploit tokenization artifacts
**Solution**: Always analyze how text is tokenized and consider edge cases

### 4. Assuming Knowledge Means Understanding

**Mistake**: Because an LLM can recite facts, it understands them
**Problem**: LLMs can hallucinate plausible-sounding but false information
**Solution**: Implement fact-checking and uncertainty quantification

### 5. Neglecting Emergent Behaviors

**Mistake**: Testing only for explicitly programmed capabilities
**Problem**: LLMs develop unexpected capabilities with scale
**Solution**: Regularly probe for hidden capabilities and emergent behaviors

## Hands-on Exercise

Build your own LLM behavior analyzer:

1. **Implement attention visualization**:
   - Extract attention patterns from a small transformer
   - Visualize which tokens attend to which
   - Identify attention heads with specific functions

2. **Create a hallucination detector**:
   - Measure model confidence on factual claims
   - Identify patterns that correlate with hallucination
   - Build a scoring system for hallucination risk

3. **Build a prompt sensitivity tester**:
   - Generate systematic prompt perturbations
   - Measure output stability
   - Identify high-sensitivity prompt patterns

4. **Develop a capability probe**:
   - Design prompts to elicit specific capabilities
   - Test across different model sizes
   - Document emergence thresholds

5. **Create a safety dashboard**:
   - Integrate all analyzers
   - Real-time monitoring of model behavior
   - Alert system for anomalous outputs

## Further Reading

- "Attention Is All You Need" - Vaswani et al. 2017
- "Language Models are Few-Shot Learners" - Brown et al. 2020
- "Emergent Abilities of Large Language Models" - Wei et al. 2022
- "The False Promise of Imitating Proprietary LLMs" - Gudibande et al. 2023
- "Mechanistic Interpretability of Large Language Models" - Survey by Bereska & Gavves 2024
- "Hallucination in Large Language Models" - Zhang et al. 2023

## Connections

- **Related Topics**: [Transformer Architecture](#transformers), [Prompt Engineering](#prompt-engineering), [LLM Safety](#llm-safety)
- **Prerequisites**: [Neural Networks](#neural-networks), [Natural Language Processing](#nlp-basics)
- **Next Steps**: [LLM Alignment](#llm-alignment), [Interpretability](#interpretability)