# Unified Journey Structure (After Upsert)

## Summary of Changes
- **Before**: 4 tiers, 19 modules, 71 topics
- **After**: 4 tiers, 24 modules, 113 topics (+42 from roadmap)
- **New Modules**: 5 (Research Methods, AI Agents & Tool Use, Multi-Agent Systems, AI Safety Community, Testing & Evaluation)

## Visual Structure

```
🎓 Foundation Tier
├── 📚 Core Foundations [EXPANDED]
│   ├── Prerequisites & Foundations ✓
│   ├── Ethics & Philosophy ✓
│   ├── Types of AI Systems Overview 🆕
│   ├── Understanding Large Language Models 🆕
│   └── How LLMs are Trained 🆕
│
├── 🛡️ Safety Fundamentals [EXPANDED]
│   ├── AI Risk Fundamentals ✓
│   ├── The Control Problem 🆕
│   ├── AI Agency and Autonomy 🆕
│   ├── AI Situational Awareness 🆕
│   ├── The Impenetrability Problem 🆕
│   └── Existential Risk ✓
│
├── 🔧 ML Fundamentals ✓
└── 🔍 Intro to Interpretability ✓

🚀 Intermediate Tier
├── 🏗️ ML Engineering for Safety [EXPANDED]
│   ├── Scaling Laws ✓
│   ├── Training Dynamics ✓
│   ├── Containerization for Research 🆕
│   ├── Advanced Git for Research 🆕
│   └── Distributed Training Systems 🆕
│
├── 🔬 Research Methods [NEW MODULE] 🆕
│   ├── Problem Decomposition 🆕
│   ├── Iterative Research Design 🆕
│   ├── Research Project Management 🆕
│   └── Core Research Methodology 🆕
│
├── 🤖 AI Agents & Tool Use [NEW MODULE] 🆕
│   ├── Agent Architectures & Design 🆕
│   ├── Agent Safety Fundamentals 🆕
│   ├── Agent Evaluation & Testing 🆕
│   └── Human-Agent Interaction 🆕
│
├── 🧪 Testing & Evaluation [NEW MODULE] 🆕
│   ├── White Box Testing Methods 🆕
│   ├── Black Box Testing Methods 🆕
│   ├── Grey Box Testing Methods 🆕
│   ├── Transparency in AI Systems 🆕
│   └── Safety Benchmarks ✓
│
├── 🎯 Practical AI Safety ✓
├── 🤝 Advanced Alignment Concepts ✓
└── 🌐 AI Governance Foundations ✓

⚡ Advanced Tier
├── 🧠 Advanced Training [NEW MODULE] 🆕
│   ├── Pretraining at Scale 🆕
│   ├── Advanced Fine-tuning Techniques 🆕
│   └── Understanding Hallucinations 🆕
│
├── 👥 Multi-Agent & Complex Systems [NEW MODULE] 🆕
│   ├── Multi-Agent Coordination 🆕
│   ├── Emergent Agent Behaviors 🆕
│   ├── Agent Ecosystems & Economics 🆕
│   └── Teacher vs Trainer Paradigms 🆕
│
├── 🏛️ AI Safety Community [EXPANDED]
│   ├── Key Figures in AI Safety 🆕
│   ├── Neel Nanda's Contributions 🆕
│   ├── Yoshua Bengio's Work 🆕
│   ├── Constellation Organization 🆕
│   └── Fund for Alignment Research 🆕
│
├── 🔍 Advanced Interpretability ✓
├── 🎯 Alignment Research ✓
├── 🛡️ Advanced Red Teaming ✓
└── 🏛️ Policy & Strategy ✓

🏆 Expert Tier
├── 🔬 Cutting-Edge Research ✓
├── ⚔️ Security & Adversarial [EXPANDED]
│   ├── Adversarial Robustness ✓
│   ├── AI Systems Security 🆕
│   └── Disrupting AI Safety Research 🆕
│
├── 🌍 Global Coordination ✓
└── 🎓 Research Leadership ✓
```

## Key Improvements

### 1. Better Organization
- **Research Methods** gets its own module (was scattered)
- **Testing & Evaluation** consolidated in one place
- **Multi-Agent Systems** grouped together
- **AI Safety Community** brings together people/orgs

### 2. Complete Coverage
- All fundamental concepts (Control, Agency, etc.)
- All technical skills (Docker, Git, etc.)
- All testing approaches (White/Black/Grey box)
- Historical context (Key figures, organizations)

### 3. Logical Progression
- Foundation: Learn what AI systems are
- Intermediate: Learn how to research them
- Advanced: Deep dive into specific areas
- Expert: Lead research and coordination

## Export Compatibility

Each topic will maintain:
- `roadmapContentId` - Links to existing content
- `roadmapPosition` - Original x,y coordinates
- `roadmapStyle` - Visual styling
- `exportToRoadmap` - Flag for inclusion

This allows us to:
1. Use journey structure as primary interface
2. Export to roadmap.json format when needed
3. Maintain visual roadmap representation
4. Keep roadmaps.sh compatibility

## Migration Benefits

1. **No More Divergence** - Single source of truth
2. **Better Discovery** - All content findable via journey
3. **Clearer Learning Path** - Logical module grouping
4. **Maintains Flexibility** - Can still export to any format
5. **Future-Proof** - Easy to add new content

The unified structure provides a complete, well-organized curriculum while maintaining backward compatibility with the visual roadmap format.