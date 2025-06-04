# Flagged Citations for Manual Review

Generated: 2025-06-03

This document contains all citations that were automatically flagged as unverified. Each citation needs manual review to:
1. Verify if it's a real paper/work
2. Find the correct link/reference
3. Update the content with proper citations

## High-Priority Citations (Well-Known Works)

### 1. "Superintelligence" (2014)
- **Topics**: Prerequisites & Foundations (academic & personal)
- **Type**: Book by Nick Bostrom
- **Action**: This is a book, not a paper. Consider adding ISBN or book link
- **Suggested Fix**: Link to book website or publisher
- Exec: Link to Wikipedia article

### 2. "Attention is All You Need" (2017)
- **Topic**: How LLMs Actually Work
- **Type**: Famous Transformer paper by Vaswani et al.
- **Action**: Add arXiv link
- **Suggested Fix**: https://arxiv.org/abs/1706.03762
- Exec: Suggested

### 3. Bostrom (2014), Christian (2020), Russell (2019)
- **Topic**: Why AI Safety Matters
- **Type**: Author citations likely referring to books
- **Action**: Clarify if these are books or papers
- **Suggested Fixes**:
  - Bostrom: "Superintelligence: Paths, Dangers, Strategies"
  - Christian: "The Alignment Problem"
  - Russell: "Human Compatible"
- Exec: Wikipedia for all

### 4. Amodei et al. (2016)
- **Topic**: Why AI Safety Matters
- **Type**: Likely "Concrete Problems in AI Safety"
- **Action**: Add arXiv link
- **Suggested Fix**: https://arxiv.org/abs/1606.06565
- Exec: Change name to Concrete Problems in AI Safety and arxiv link

## Organization/Company Citations

### 5. Google (2021), Meta (2023), Anthropic (2024)
- **Topic**: Real-time Safety Monitoring
- **Type**: Company research references
- **Action**: Find specific papers or blog posts
- **Note**: These may refer to safety reports or blog posts rather than papers
Exec:
  Google (2021) -> Breck et al. (2017). "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction." Google Research. https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/
  Meta (2023) -> "A Guide to Monitoring Machine Learning Models in Production" - NVIDIA (2023) https://developer.nvidia.com/blog/a-guide-to-monitoring-machine-learning-models-in-production/
  Anthropic (2024) -> "Activating AI Safety Level 3 Protections" https://www.anthropic.com/news/activating-asl3-protections

### 6. Microsoft's Tay Chatbot (2016)
- **Topic**: Why AI Safety Matters
- **Type**: Historical incident
- **Action**: Add news article or case study link
- Exec: Wikipedia article

### 7. Uber's Fatal Self-Driving Car Accident (2018)
- **Topic**: Why AI Safety Matters
- **Type**: Historical incident
- **Action**: Add news article or NTSB report link
- Exec: Wikipedia

## Academic Papers Needing Verification

### 8. "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications" (2023)
- **Topic**: Prompt Injection Attacks
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2302.12173

### 9. "Universal and Transferable Adversarial Attacks on Aligned Language Models" (2023)
- **Topics**: Prompt Injection Attacks, Jailbreak Techniques
- **Action**: Verify and add link (appears multiple times)
Exec: https://arxiv.org/abs/2307.15043

### 10. "Prompt Injection Attacks and Defenses in LLM-Integrated Applications" (2024)
- **Topic**: Prompt Injection Attacks
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2310.12815 and change title

### 11. "Jailbreaking Black Box Large Language Models in Twenty Queries" (2024)
- **Topic**: Jailbreak Techniques
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2310.08419

### 12. "Multi-Turn Jailbreak Attacks: Strategies and Defenses" (2024)
- **Topic**: Jailbreak Techniques
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2408.15221 and change title

### 13. "LLM Jailbreaking: A Comprehensive Survey" (2024)
- **Topic**: Jailbreak Techniques
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2407.04295 and change title

### 14. "Evaluating Large Language Models: A Comprehensive Survey" (2024)
- **Topic**: Safety Evaluation Methods
- **Action**: Verify and add link
Exec: https://arxiv.org/abs/2310.19736 and change year

### 15. "Statistical Methods for AI Safety Evaluation" (2024)
- **Topic**: Safety Evaluation Methods
- **Action**: Verify and add link
Exec: https://ojs.aaai.org/index.php/AIES/article/view/31717 and change title

### 16. "OpenAI's Approach to External Red Teaming" (2024)
- **Topic**: Red Teaming Fundamentals
- **Action**: Likely a blog post or report, not academic paper
Exec: https://arxiv.org/pdf/2503.16431

### 17. Brundage et al. (2018)
- **Topic**: The AI Risk Landscape
- **Action**: Likely "The Malicious Use of Artificial Intelligence"
Exec: https://arxiv.org/abs/1802.07228

## Unclear/Fragment Citations

### 18. Nature (2023)
- **Topic**: Containerization for Research
- **Type**: Journal reference
- **Action**: Find specific article
Exec: remove

### 19. "idea" (work reference)
- **Topic**: Problem Decomposition & Scoping
- **Type**: Fragment from "study from idea"
- **Action**: Review context and fix sentence
Exec: this is a false positive

### 20. "major" (work reference)
- **Topic**: Red Teaming Fundamentals
- **Type**: Fragment from "research from major"
- **Action**: Review context and fix sentence
Exec: remove

### 21. "different" (work reference)
- **Topic**: Paradigm-Driven Research
- **Type**: Fragment from "research from different"
- **Action**: Review context and fix sentence
Exec: remove

### 22. "Techniques" (2024)
- **Topic**: Jailbreak Techniques
- **Type**: Unclear citation
- **Action**: Review context and identify proper reference
Exec: false positive (I manually removed)

## Recommendations

1. **Prioritize well-known works** - Start with easily verifiable citations like "Attention is All You Need"
2. **Convert book references** - Change author-year citations to proper book references where appropriate
3. **Add incident reports** - Link to official reports for historical AI incidents
4. **Check 2024 papers** - Many 2024 citations may be preprints or not yet published
5. **Fix fragments** - Review context for single-word citations and correct the sentences

## Next Steps

1. Create a script to automatically update known citations with verified links
2. Manually review each topic's context for unclear citations
3. Consider adding a citation style guide to ensure consistency
4. Set up a process for ongoing citation verification as new content is added