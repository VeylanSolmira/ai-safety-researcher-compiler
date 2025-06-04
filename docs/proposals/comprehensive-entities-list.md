# Comprehensive AI Safety Entities List

## Overview
This document provides a comprehensive list of researchers, organizations, and platforms that should be included in the AI Safety Research Compiler's entities database. The list is organized by type and includes descriptions and relevant metadata for each entity.

## Current Database Status
- **Total entities**: 43 active
- **Researchers**: 27
- **Organizations**: 13  
- **Platforms**: 3

## Researchers to Add

### High Priority Researchers (Not Currently in Database)

#### From Major AI Labs
1. **Dario Amodei** (Anthropic) - CEO, AI safety and alignment
2. **Daniela Amodei** (Anthropic) - President, AI safety operations
3. **Chris Olah** (Anthropic) - Interpretability research
4. **Catherine Olsson** (Anthropic) - AI safety research
5. **Sam McCandlish** (Anthropic) - Technical AI safety
6. **Jared Kaplan** (Anthropic) - Scaling laws and safety
7. **Jan Leike** (formerly OpenAI) - Alignment team lead
8. **Ilya Sutskever** (formerly OpenAI) - Chief Scientist
9. **John Schulman** (OpenAI) - RL and alignment
10. **Lilian Weng** (OpenAI) - Safety research
11. **Shane Legg** (DeepMind) - Co-founder, AGI safety
12. **Demis Hassabis** (DeepMind) - CEO, AGI safety
13. **Pushmeet Kohli** (DeepMind) - AI safety
14. **Victoria Krakovna** (DeepMind) - AI safety research
15. **Rohin Shah** (DeepMind) - AI alignment

#### Academic Researchers
16. **Stuart Russell** (UC Berkeley) - AI safety pioneer
17. **Pieter Abbeel** (UC Berkeley) - Robotics and AI safety
18. **Max Tegmark** (MIT) - FLI founder
19. **Dylan Hadfield-Menell** (MIT) - Value alignment
20. **Nick Bostrom** (Oxford) - Existential risk
21. **Toby Ord** (Oxford) - Existential risk

#### Independent Researchers
22. **Dan Hendrycks** (CAIS) - Safety benchmarks
23. **Ajeya Cotra** (Open Philanthropy) - AI timelines
24. **Adam Gleave** (UC Berkeley) - Adversarial policies
25. **Jacob Steinhardt** (UC Berkeley) - AI robustness
26. **Allan Dafoe** (DeepMind) - AI governance
27. **Helen Toner** (Georgetown) - AI policy
28. **Miles Brundage** (OpenAI) - AI policy
29. **Collin Burns** (UC Berkeley) - Interpretability
30. **John Wentworth** (Independent) - Natural abstractions
31. **Steve Byrnes** (Independent) - Brain-like AGI safety

## Organizations to Add

### Research Organizations
1. **Center for AI Safety (CAIS)** - Reducing societal-scale AI risks
2. **Conjecture** - AI alignment and interpretability
3. **FAR AI** - AI safety research and incubation
4. **Apollo Research** - Deception and interpretability
5. **Timaeus** - Developmental interpretability
6. **Ought** - AI-assisted research and oversight

### Academic Institutions
7. **Center for Human-Compatible AI (CHAI)** - UC Berkeley
8. **Cambridge Centre for Existential Risk (CSER)** - Cambridge University
9. **MIT AI Alignment** - MIT

### Governance Organizations
10. **Centre for the Governance of AI (GovAI)** - AI governance research
11. **AI Now Institute** - Social implications of AI
12. **Partnership on AI** - Multi-stakeholder governance
13. **Institute for AI Policy and Strategy (IAPS)** - Policy research

### Funding Organizations
14. **Open Philanthropy** - Major AI safety funder
15. **Survival and Flourishing Fund** - Existential risk funding
16. **Long-Term Future Fund** - EA Funds

### Community Organizations
17. **AI Safety Camp** - Training programs
18. **AI Safety Support** - Career support
19. **EleutherAI** - Open-source AI with safety focus
20. **Apart Research** - Research hackathons

## Platforms to Add

### Educational Platforms
1. **MATS Program** - ML Alignment Theory Scholars (update existing)
2. **SERI ML Alignment** - Summer research program
3. **BlueDot Impact** - AI safety fundamentals courses
4. **AGI Safety Fundamentals** - Introductory courses
5. **ARENA** - Alignment Research Engineer Accelerator

### Research/Publication Platforms
6. **arXiv AI Safety** - Preprint repository section
7. **Distill.pub** - Interactive ML research
8. **AI Safety Papers Database** - Curated paper collection

### Tools and Benchmarks
9. **OpenAI Evals** - Safety evaluation framework
10. **TruthfulQA** - Truthfulness benchmark
11. **Elicit** (by Ought) - AI research assistant

### Media Platforms
12. **Import AI Newsletter** - Weekly AI developments
13. **The Gradient** - AI research magazine
14. **80,000 Hours Podcast** - Career and impact podcast
15. **AXRP** - AI X-risk Research Podcast

### Career Platforms
16. **80,000 Hours Job Board** - High-impact careers
17. **Alignment Jobs** - Specialized AI alignment positions
18. **EA Jobs** - Effective altruism job board

### Conference Platforms
19. **NeurIPS AI Safety Workshop** - Annual workshop
20. **EA Global** - Conference series
21. **ICML Safety Workshop** - Safety-focused workshop

## Implementation Notes

### For Researchers
- Include affiliation in properties
- Add research areas as tags
- Link to relevant topics they work on
- Include personal_note for unique contributions

### For Organizations
- Include founding year in properties
- Add focus areas as tags
- Link to topics they research
- Include key initiatives in description

### For Platforms
- Include platform type in properties
- Add target audience as tags
- Link to relevant educational topics
- Include access information (free/paid) in properties

## Priority Order for Implementation

1. **Immediate Priority**: Add missing major lab researchers (Anthropic, OpenAI, DeepMind leadership)
2. **High Priority**: Add key academic researchers and major research organizations
3. **Medium Priority**: Add educational platforms and funding organizations
4. **Lower Priority**: Add media platforms and conference platforms

## Tags to Use

### For Researchers
- `technical-safety`, `governance`, `interpretability`, `alignment`, `policy`, `philosophy`, `ml-theory`, `robustness`, `benchmarks`

### For Organizations
- `research`, `funding`, `education`, `governance`, `community`, `academic`, `non-profit`, `industry-lab`

### For Platforms
- `education`, `research`, `community`, `tools`, `media`, `careers`, `conferences`, `newsletters`

## Next Steps

1. Create a script to batch import these entities
2. Establish entity-topic relationships for each
3. Add relevant properties and metadata
4. Create a maintenance process for keeping entities current
5. Consider adding a "last_verified" field to track data freshness