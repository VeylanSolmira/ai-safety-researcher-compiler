# Research Project Management

The systems and practices for maintaining productive research momentum while avoiding burnout, lost work, and abandoned projects. Critical for translating AI safety insights into real impact.

## The Research Project Lifecycle

### 1. Inception (Days 1-3)
- Excitement is high
- Ideas flow freely
- Everything seems possible

### 2. Reality Check (Week 1-2)
- First obstacles appear
- Scope becomes clearer
- Initial approach often fails

### 3. The Grind (Weeks 2-8)
- Daily incremental progress
- Multiple dead ends
- Motivation fluctuates

### 4. Breakthrough or Pivot (Variable)
- Key insight emerges, or
- Fundamental flaw discovered
- Decision point reached

### 5. Consolidation (Final 20%)
- Clean up code
- Document findings
- Share with community

## Core Management Systems

### 1. Research Logs

**Daily Log Template:**
```markdown
# 2024-11-15

## Done Today
- Implemented attention probe for layers 10-12
- Found 73% accuracy on deception detection
- Discovered weird behavior in layer 11

## Key Insights
- Attention heads 11.3 and 11.7 seem specialized
- Performance drops sharply after layer 12

## Blockers
- GPU memory issues with batch size >32
- Need to understand why layer 11 is special

## Tomorrow
- Visualize attention patterns for head 11.3
- Try smaller model to test generalization
```

**Why It Works:**
- Externalizes memory
- Shows progress over time
- Helps others understand your work
- Invaluable for writing papers

### 2. Documentation Driven Development (DDD)

Start with documentation, not code:

```markdown
# Deception Detection Probe

## Goal
Detect when a model is being deceptive using internal activations.

## Method
1. Create dataset of honest/deceptive model outputs
2. Train linear probe on intermediate activations
3. Test generalization to new scenarios

## Expected Results
- 80%+ accuracy on held-out examples
- Clear identification of "deception circuits"

## Actual Results
[Fill in as you go]
```

### 3. Time Management Strategies

**The Research Pomodoro:**
- 45 min focused work
- 15 min log writing/planning
- Repeat 4x
- Long break: review and plan

**Weekly Rhythm:**
- Monday: Plan experiments
- Tue-Thu: Execute
- Friday: Analyze, document, share

**The 2-Hour Rule:**
If stuck for >2 hours:
1. Take a break
2. Explain problem to someone
3. Try different approach
4. Move to different task

## Managing Multiple Research Threads

### The Research Portfolio

Like an investment portfolio, diversify:

**High Risk/High Reward (20%)**
- Novel approaches
- Might not work
- Potential breakthrough

**Core Research (60%)**
- Clear path forward
- Likely to yield results
- Builds on proven ideas

**Quick Wins (20%)**
- Can finish in days
- Useful to community
- Maintains momentum

### Thread Switching Protocol

```python
def should_switch_threads():
    if current_thread.blocked_for_days > 2:
        return True
    if current_thread.energy_level < 0.3:
        return True
    if other_thread.has_new_insight:
        return True
    if current_thread.approaching_milestone:
        return False
    return False
```

## Information Management

### 1. Reference Organization

**Zotero/Mendeley Structure:**
```
- AI Safety/
  - Interpretability/
    - Mechanistic/
    - Probing Methods/
  - Alignment/
    - RLHF/
    - Constitutional AI/
```

**Paper Notes Template:**
```markdown
# [Paper Title]

## One-Line Summary
[What it does in plain English]

## Key Contribution
[The new thing this adds]

## Relevance to My Work
[Why I'm reading this]

## Technical Details
[Important equations, methods]

## Questions/Critiques
[What's unclear or questionable]
```

### 2. Code Organization

```
project/
├── experiments/
│   ├── exp_001_baseline.py
│   ├── exp_002_improved.py
│   └── logs/
├── src/
│   ├── models/
│   ├── data/
│   └── utils/
├── notebooks/
│   ├── exploration.ipynb
│   └── visualizations.ipynb
├── results/
│   ├── figures/
│   └── checkpoints/
├── docs/
│   ├── README.md
│   └── findings.md
└── requirements.txt
```

### 3. Reproducibility Checklist

- [ ] Random seeds set
- [ ] Dependencies versioned
- [ ] Data source documented
- [ ] Key parameters logged
- [ ] Results reproducible
- [ ] Code runnable by others

## Knowing When to Pivot vs. Persevere

### Pivot Signals
1. **No progress for 2 weeks** despite different approaches
2. **Fundamental assumption proven wrong**
3. **Someone else solved it better**
4. **Computational requirements unrealistic**
5. **Lost belief in impact**

### Persevere Signals
1. **Consistent incremental progress**
2. **Each failure teaches something**
3. **Clear next steps exist**
4. **Unique position to solve**
5. **High potential impact**

### The Pivot Process
1. **Document lessons learned**
2. **Archive (don't delete) current work**
3. **Extract reusable components**
4. **Share negative results**
5. **Apply insights to new direction**

## Collaboration Management

### Working with Others

**Clear Ownership:**
```markdown
## Project: Deception Detection

### Alice (Lead)
- Probe implementation
- Main experiments

### Bob (Support)
- Dataset creation
- Visualization tools

### Carol (Advisor)
- Weekly guidance
- Paper review
```

**Communication Protocol:**
- Daily: Quick Slack updates
- Weekly: 30-min sync meeting
- Monthly: Deep technical review

### Sharing Early and Often

**Internal Milestones:**
- Week 2: Share approach with team
- Week 4: Present initial results
- Week 6: Circulate draft writeup
- Week 8: Polish for public release

## Common Pitfalls and Solutions

### 1. Scope Creep
**Problem**: Project grows beyond original intent
**Solution**: Keep a "Future Work" document

### 2. Perfectionism
**Problem**: Endless polishing without shipping
**Solution**: Set hard deadlines for "good enough"

### 3. Lost Context
**Problem**: Forget why decisions were made
**Solution**: Decision log with rationales

### 4. Burnout
**Problem**: Pushing too hard for too long
**Solution**: Enforce breaks, celebrate small wins

### 5. Isolation
**Problem**: Working alone in the dark
**Solution**: Regular check-ins, working sessions

## Tools and Resources

### Project Management Tools
- **Notion/Obsidian**: Knowledge management
- **GitHub Projects**: Task tracking
- **Weights & Biases**: Experiment tracking
- **Slack/Discord**: Collaboration

### Productivity Techniques
- **GTD for Research**: Capture → Clarify → Organize → Review
- **PARA Method**: Projects, Areas, Resources, Archives
- **Timeboxing**: Fixed time for open-ended tasks

## The Research Sustainability Framework

### Daily Minimums
- 1 experiment run
- 1 paragraph written
- 1 figure created
- 1 idea logged

### Weekly Goals
- 1 shareable insight
- 1 technical discussion
- 1 process improvement
- 1 break from screens

### Monthly Reflection
- What worked well?
- What was frustrating?
- What would I do differently?
- What am I excited about?

## Action Items

1. **Today**: Set up a research log (even just a text file)
2. **This Week**: Organize your current project using the structure above
3. **This Month**: Complete one project from start to finish using these methods

Remember: Good research project management isn't about rigid process—it's about sustainable progress on hard problems.

## Resources

- [@book@Deep Work by Cal Newport](https://www.calnewport.com/books/deep-work/) - Focus in a distracted world
- [@article@How to Be a Modern Scientist](https://jeffleek.com/book/) - Modern research workflows
- [@video@The Missing Semester of Your CS Education](https://missing.csail.mit.edu/) - Practical research tools
- [@article@Ten Simple Rules for Effective Computational Research](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003506) - PLOS Computational Biology guide