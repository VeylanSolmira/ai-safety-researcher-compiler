# Iterative Research Design

The practice of making rapid progress through cycles of hypothesis, experiment, and revision. In AI safety, where the landscape changes quickly and problems are complex, iteration beats perfection.

## The Iteration Mindset

### Traditional vs. Iterative Research

**Traditional Academic Model:**
- Extensive literature review → Perfect hypothesis → Single major experiment → Publication
- Timeline: 6-24 months
- Risk: High (all eggs in one basket)

**Iterative Safety Research:**
- Quick literature scan → Rough hypothesis → Many small experiments → Continuous refinement
- Timeline: 2-8 weeks per cycle
- Risk: Low (fail fast, learn faster)

## The Core Loop

```
1. Hypothesize (1 day)
   ↓
2. Build Minimal Test (2-5 days)
   ↓
3. Run Experiment (1-3 days)
   ↓
4. Analyze & Decide (1 day)
   ↓
5. Pivot or Persevere
   ↑___________________|
```

## Iteration Strategies

### 1. The Ladder of Complexity
Start simple, add complexity only when needed:
- **Toy Model**: 2-state MDPs, linear models
- **Simplified Real**: MNIST, small transformers
- **Realistic Scale**: GPT-2 sized models
- **Production Scale**: Only if absolutely necessary

Example progression:
1. "Can we detect deception in a 2-player game?"
2. "Can we detect deception in a gridworld RL agent?"
3. "Can we detect deception in a language model on simple tasks?"
4. "Can we detect deception in GPT-4 on complex scenarios?"

### 2. The Build-Measure-Learn Cycle

**Build**: Create the minimum viable experiment
- Hack together a prototype
- Use existing tools/libraries
- Hardcode what you can
- Automate only the bottlenecks

**Measure**: Get data quickly
- Define metrics before building
- Automate data collection
- Visualize early and often
- Look for surprising results

**Learn**: Extract insights ruthlessly
- What did we expect vs. what happened?
- What's the most interesting failure?
- What would we do differently?
- What's the next most important question?

### 3. Fail-Fast Experimentation

**The 20% Rule**: If an approach doesn't show promise with 20% of the effort, it probably won't work with 100%.

**Kill Criteria** (defined in advance):
- No signal after X experiments
- Computational requirements > Y
- Core assumption proven false
- Better approach discovered

**Signs to Persevere**:
- Consistent incremental progress
- Unexpected interesting behaviors
- Clear path to improvement
- High potential impact if successful

## Research Momentum Techniques

### 1. The Daily Ship
- End each day with something runnable
- Even if it's broken, make it run
- "Works on my machine" > "theoretically optimal"

### 2. Research Logs
Keep a lightweight log:
```markdown
## 2024-11-15
**Tried**: Probe for deception using linear classifier on layer 12
**Result**: 65% accuracy (barely above random)
**Next**: Try attention patterns instead of activations
```

### 3. The Friday Demo
- Every Friday, demo something to a colleague
- Forces concrete progress
- Gets early feedback
- Maintains accountability

## Managing Multiple Threads

### The 70-20-10 Rule
- 70%: Main research thrust
- 20%: Promising tangent
- 10%: Wild ideas

### Thread Switching Triggers
Switch when:
- Waiting for compute
- Stuck for >2 days
- Energy/motivation low
- New insight makes other thread more promising

## Common Iteration Patterns

### 1. The Exploration Spiral
```
Broad survey (week 1)
    ↓
Pick 3 promising directions (week 2)
    ↓
Deep dive on best one (weeks 3-4)
    ↓
Publish/Share findings
    ↓
Use insights for next spiral
```

### 2. The Ablation Ladder
Start with everything, remove until it breaks:
- Full model works → What can we remove?
- Simplified model works → What's the minimal version?
- Minimal version fails → What's the critical component?

### 3. The Scaling Probe
- Start: "This works at scale 1"
- Test: Does it work at scale 10? 100? 1000?
- Find: Where does it break and why?

## Practical Tools

### 1. Experiment Tracking
Simple but effective:
```python
# experiments/exp_001_baseline.py
# experiments/exp_002_add_regularization.py
# experiments/exp_003_different_architecture.py
```

### 2. The Research Kanban
- **Backlog**: All ideas
- **This Week**: Current focus
- **In Progress**: Active experiments
- **Blocked**: Waiting on resources/feedback
- **Done**: Completed, documented

### 3. Version Control for Research
```bash
git commit -m "Exp 5: Tried transformer probe, 72% acc"
git tag "promising-direction-1"
git branch "explore-attention-patterns"
```

## Case Study: Iterating on Interpretability

**Week 1**: "Can we understand what models know?"
- Try activation maximization → Too noisy
- Try linear probes → Some signal
- Try attention visualization → Interesting patterns

**Week 2**: Focus on attention patterns
- Build tool to extract attention
- Find consistent patterns in similar inputs
- Notice anomaly in layer 7

**Week 3**: Deep dive on layer 7 anomaly
- Isolate behavior
- Test on multiple models
- Find it correlates with capability

**Week 4**: Write up findings
- Clean code
- Create visualizations
- Share with community

**Result**: New interpretability method discovered through iteration

## Balancing Speed and Rigor

### When to be Fast
- Exploring new ideas
- Building intuition
- Checking feasibility
- Personal projects

### When to be Careful
- Claims about safety
- Published results
- Shared code/tools
- Negative results about others' work

## Red Flags in Iteration

1. **No progress for 2 weeks** → Time to pivot
2. **Only negative results** → Question your assumptions
3. **Too many threads** → Focus on one
4. **Perfectionism creeping in** → Ship something
5. **Lost sight of why** → Revisit original motivation

## Action Plan

1. **Today**: Identify one research question you've been overthinking
2. **This Week**: Build the simplest possible test
3. **Next Week**: Run it, learn, and iterate
4. **This Month**: Complete 4 iteration cycles

Remember: In AI safety research, learning fast beats being right the first time. The field is moving too quickly for perfect planning.

## Resources

- [@article@Lean Startup Methodology Applied to Research](https://hbr.org/2013/05/why-the-lean-start-up-changes-everything) - Adapt startup principles to research
- [@video@How to Build Good Research Habits](https://www.youtube.com/watch?v=VZnMPJPOmNM) - Practical productivity tips
- [@article@The Importance of Stupidity in Scientific Research](https://journals.biologists.com/jcs/article/121/11/1771/30038/The-importance-of-stupidity-in-scientific-research) - Embracing productive failure
- [@course@Fast.ai's Practical Deep Learning](https://course.fast.ai/) - Example of iterative teaching/research