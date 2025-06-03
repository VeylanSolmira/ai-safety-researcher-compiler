# How LLMs Actually Work

## Learning Objectives

By the end of this topic, you should be able to:
- Understand the transformer architecture and its key components
- Explain how attention mechanisms enable language understanding
- Trace the flow of information through an LLM
- Comprehend training processes including pretraining and fine-tuning
- Identify key factors that influence model behavior and capabilities

## Introduction

Large Language Models (LLMs) have revolutionized AI, but their inner workings remain opaque to many. Understanding how these models actually function—from their architectural foundations to their training processes—is essential for anyone working in AI safety. This knowledge helps us predict model behavior, identify potential failure modes, and develop better safety measures.

At their core, LLMs are sophisticated pattern-matching systems built on the transformer architecture. They learn statistical relationships in text data and use these patterns to generate responses. However, this simple description belies the complexity of how billions of parameters work together to produce coherent, contextually appropriate text.

## Core Concepts

### The Transformer Architecture

The transformer, **⚠️ UNVERIFIED CITATION** "Attention is All You Need" [paper-mention] _Could not find a reliable source for this citation_ (2017), revolutionized NLP by replacing recurrent architectures with attention mechanisms.

\`\`\`python
class TransformerBlock:
    def __init__(self, d_model, n_heads, d_ff):
        self.attention = MultiHeadAttention(d_model, n_heads)
        self.feed_forward = FeedForward(d_model, d_ff)
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
    
    def forward(self, x):
        # Self-attention with residual connection
        attn_out = self.attention(self.norm1(x))
        x = x + attn_out
        
        # Feed-forward with residual connection
        ff_out = self.feed_forward(self.norm2(x))
        x = x + ff_out
        
        return x
\`\`\`

Key components:
1. **Attention Mechanisms**: Allow the model to focus on relevant parts of the input
2. **Feed-Forward Networks**: Process information at each position
3. **Residual Connections**: Enable training of deep networks
4. **Layer Normalization**: Stabilize training

### Attention Mechanisms Explained

Attention is the core innovation that makes transformers powerful:

\`\`\`python
def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: Queries (what information am I looking for?)
    K: Keys (what information do I have?)
    V: Values (the actual information content)
    """
    d_k = Q.shape[-1]
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # Apply mask if provided (for causal attention)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # Convert to probabilities
    attention_weights = torch.softmax(scores, dim=-1)
    
    # Apply attention to values
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights
\`\`\`

Multi-head attention allows the model to attend to different aspects simultaneously:

\`\`\`python
class MultiHeadAttention:
    def __init__(self, d_model, n_heads):
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        self.W_q = Linear(d_model, d_model)
        self.W_k = Linear(d_model, d_model)
        self.W_v = Linear(d_model, d_model)
        self.W_o = Linear(d_model, d_model)
    
    def forward(self, x):
        batch_size, seq_len, d_model = x.shape
        
        # Project to Q, K, V
        Q = self.W_q(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        K = self.W_k(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        V = self.W_v(x).view(batch_size, seq_len, self.n_heads, self.d_head)
        
        # Transpose for attention computation
        Q = Q.transpose(1, 2)  # [batch, heads, seq_len, d_head]
        K = K.transpose(1, 2)
        V = V.transpose(1, 2)
        
        # Compute attention
        attn_output, _ = scaled_dot_product_attention(Q, K, V)
        
        # Concatenate heads
        attn_output = attn_output.transpose(1, 2).contiguous()
        attn_output = attn_output.view(batch_size, seq_len, d_model)
        
        # Final projection
        output = self.W_o(attn_output)
        
        return output
\`\`\`

### From Tokens to Understanding

The journey from text to model understanding:

\`\`\`python
class LLMPipeline:
    def __init__(self, vocab_size, d_model, n_layers):
        self.tokenizer = Tokenizer(vocab_size)
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model)
        self.transformer_blocks = nn.ModuleList([
            TransformerBlock(d_model) for _ in range(n_layers)
        ])
        self.output_projection = nn.Linear(d_model, vocab_size)
    
    def forward(self, text):
        # 1. Tokenization: Text → Token IDs
        token_ids = self.tokenizer.encode(text)
        
        # 2. Embedding: Token IDs → Vectors
        embeddings = self.embedding(token_ids)
        
        # 3. Add positional information
        embeddings = self.positional_encoding(embeddings)
        
        # 4. Process through transformer layers
        hidden_states = embeddings
        for block in self.transformer_blocks:
            hidden_states = block(hidden_states)
        
        # 5. Project to vocabulary
        logits = self.output_projection(hidden_states)
        
        return logits
\`\`\`

### Training Process

#### Pretraining: Learning Language Patterns

\`\`\`python
def pretrain_llm(model, text_corpus, num_epochs):
    optimizer = AdamW(model.parameters())
    
    for epoch in range(num_epochs):
        for batch in text_corpus:
            # Prepare input and target
            input_ids = batch[:-1]  # All tokens except last
            target_ids = batch[1:]  # All tokens except first
            
            # Forward pass
            logits = model(input_ids)
            
            # Compute loss (next token prediction)
            loss = cross_entropy(logits.view(-1, vocab_size), 
                               target_ids.view(-1))
            
            # Backward pass
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()
            
            # Model learns to predict next token given context
\`\`\`

#### Fine-tuning: Specializing Behavior

\`\`\`python
def fine_tune_for_safety(model, safety_dataset):
    # Freeze most parameters
    for param in model.parameters():
        param.requires_grad = False
    
    # Only train final layers
    for param in model.transformer_blocks[-2:].parameters():
        param.requires_grad = True
    
    optimizer = AdamW(filter(lambda p: p.requires_grad, model.parameters()))
    
    for prompt, safe_response, unsafe_response in safety_dataset:
        # Compute loss that encourages safe responses
        safe_loss = -log_likelihood(model(prompt), safe_response)
        unsafe_loss = log_likelihood(model(prompt), unsafe_response)
        
        total_loss = safe_loss + unsafe_loss
        
        total_loss.backward()
        optimizer.step()
        optimizer.zero_grad()
\`\`\`

### Emergent Capabilities

As models scale, they develop capabilities not explicitly trained:

\`\`\`python
def analyze_emergent_capabilities(model_sizes, capability_tests):
    results = {}
    
    for size in model_sizes:
        model = load_model(size)
        results[size] = {}
        
        for test_name, test_func in capability_tests.items():
            score = test_func(model)
            results[size][test_name] = score
            
            # Check for emergence (sudden capability jump)
            if size > 1 and results[size][test_name] > 2 * results[size//10][test_name]:
                print(f"Emergent capability detected: {test_name} at {size} parameters")
    
    return results
\`\`\`

### Information Flow and Processing

Understanding how information flows through the model:

\`\`\`python
class InformationFlowAnalyzer:
    def trace_information_flow(self, model, input_text, target_token_idx):
        # Hook into attention weights
        attention_patterns = []
        
        def attention_hook(module, input, output):
            attention_patterns.append(output[1])  # attention weights
        
        # Register hooks
        handles = []
        for block in model.transformer_blocks:
            handle = block.attention.register_forward_hook(attention_hook)
            handles.append(handle)
        
        # Forward pass
        model(input_text)
        
        # Analyze how information about target token propagates
        information_flow = self.analyze_attention_patterns(
            attention_patterns, target_token_idx
        )
        
        # Clean up hooks
        for handle in handles:
            handle.remove()
        
        return information_flow
\`\`\`

## Key Factors Influencing Model Behavior

### 1. Training Data Distribution
\`\`\`python
def analyze_training_influence(model, test_prompts):
    influences = {}
    
    for prompt in test_prompts:
        # Get model's response
        response = model.generate(prompt)
        
        # Estimate training data influence
        influences[prompt] = {
            'perplexity': calculate_perplexity(model, prompt),
            'confidence': get_prediction_confidence(model, prompt),
            'likely_seen_similar': perplexity < threshold
        }
    
    return influences
\`\`\`

### 2. Model Scale and Architecture
- Larger models → More capabilities but also more unpredictability
- Deeper models → Better abstraction but harder to interpret
- Wider models → More capacity but diminishing returns

### 3. Attention Patterns and Context
\`\`\`python
def visualize_context_influence(model, text, position):
    # Get attention weights for specific position
    _, attention_weights = model.forward_with_attention(text)
    
    # Average across heads and layers
    avg_attention = attention_weights.mean(dim=[0, 1])
    
    # Show which previous tokens most influence current position
    context_influence = avg_attention[position, :position]
    
    return context_influence
\`\`\`

## Practical Understanding Exercise

Build intuition by implementing a tiny transformer:

\`\`\`python
class TinyTransformer:
    """
    A minimal transformer to understand core concepts
    Hidden size: 64, Heads: 4, Layers: 2
    """
    def __init__(self):
        self.d_model = 64
        self.n_heads = 4
        self.n_layers = 2
        self.vocab_size = 1000
        
        # Initialize components
        self.embedding = nn.Embedding(self.vocab_size, self.d_model)
        self.blocks = nn.ModuleList([
            TransformerBlock(self.d_model, self.n_heads, self.d_model * 4)
            for _ in range(self.n_layers)
        ])
        self.ln_final = LayerNorm(self.d_model)
        self.lm_head = nn.Linear(self.d_model, self.vocab_size)
    
    def forward(self, input_ids):
        # Token embeddings
        x = self.embedding(input_ids)
        
        # Add positional embeddings
        positions = torch.arange(len(input_ids))
        x = x + self.positional_embedding(positions)
        
        # Process through transformer blocks
        for block in self.blocks:
            x = block(x)
        
        # Final layer norm
        x = self.ln_final(x)
        
        # Project to vocabulary
        logits = self.lm_head(x)
        
        return logits

# Train on simple sequences to see patterns emerge
tiny_model = TinyTransformer()
train_on_simple_patterns(tiny_model)
analyze_learned_patterns(tiny_model)
\`\`\`

## Common Misconceptions

1. **"LLMs understand language like humans"**
   - Reality: They learn statistical patterns, not meaning

2. **"Bigger is always better"**
   - Reality: Scale brings capabilities and new failure modes

3. **"LLMs have intentionality"**
   - Reality: They're sophisticated pattern matchers

4. **"Training determines all behavior"**
   - Reality: Emergent behaviors surprise even creators

## Further Reading

- "Attention Is All You Need" - The original transformer paper
- "Language Models are Few-Shot Learners" (GPT-3) - Scale and emergence
- "A Mathematical Framework for Transformer Circuits" - Mechanistic understanding
- "Training Compute-Optimal Large Language Models" - Scaling laws
- "Emergent Abilities of Large Language Models" - Capability jumps

## Connections

- **Next Topics**: [When Training Goes Wrong](training-failure-modes), [Basic Interpretability](basic-interpretability)
- **Advanced Topics**: [Mechanistic Interpretability Practice](mechanistic-interp), [Understanding Hallucinations](understanding-hallucinations)
- **Applications**: [Build Your First Safety Tool](build-first-safety-tool), [Safety Evaluation Methods](safety-evaluation-101)