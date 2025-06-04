# MATS 2025 Mentor Data Extraction Plan

## Overview
The mats-1.txt file contains rich structured data about MATS 2025 mentors. This document outlines a comprehensive plan for extracting, organizing, and utilizing this information.

## Data Structure Analysis

Each mentor entry contains:
1. **Name** - Full name of the mentor
2. **Title & Organization** - Position and affiliation (comma-separated)
3. **Research Area** - Primary area of focus (Interpretability, Governance, Oversight/control, etc.)
4. **Location** (optional) - Geographic location
5. **Stream Details** - Collaborative mentorship information (e.g., "Alex Turner, Alex Cloud - 8.0")
6. **Personal Website** (optional) - URL
7. **About Section** - Detailed bio including:
   - Academic background
   - Research experience
   - Notable achievements
   - Past mentorship outcomes
   - Specific research interests

## Extractable Data Points

### 1. Basic Information
- [x] Name
- [x] Title/Position
- [x] Organization/Institution
- [x] Research area
- [x] Location
- [x] Personal website

### 2. Stream & Collaboration Data
- [ ] Primary mentor name
- [ ] Co-mentors (from stream details)
- [ ] Stream score/rating (the "8.0" values)
- [ ] Collaborative relationships graph

### 3. Academic & Professional Background
- [ ] Educational background (PhD institutions, advisors)
- [ ] Previous positions
- [ ] Years of experience
- [ ] Academic lineage/advisors

### 4. Research Interests & Expertise
- [ ] Primary research focus
- [ ] Secondary research areas
- [ ] Specific techniques/methods
- [ ] Notable papers/contributions

### 5. Mentorship Track Record
- [ ] Past MATS cohorts participated in
- [ ] Notable mentee outputs
- [ ] Number of mentees
- [ ] Success stories

### 6. Geographic & Institutional Networks
- [ ] Location clusters (SF Bay Area, London, etc.)
- [ ] Institution affiliations
- [ ] Remote vs in-person availability

### 7. Tags & Categories
- [ ] Research area tags
- [ ] Seniority level (Professor, PhD Student, etc.)
- [ ] Industry vs academia
- [ ] Company affiliations (Google DeepMind, Anthropic, etc.)

## Implementation Plan

### Phase 1: Enhanced Data Extraction
```typescript
interface EnhancedMentor {
  // Basic info
  id: string;
  name: string;
  title: string;
  organization: string;
  researchArea: string;
  location?: string;
  website?: string;
  
  // Stream data
  streamScore?: number;
  streamMentors: string[];
  isPrimaryMentor: boolean;
  coMentors: string[];
  
  // Parsed bio data
  education: {
    degree: string;
    institution: string;
    year?: string;
    advisor?: string;
  }[];
  
  previousPositions: string[];
  notableOutputs: string[];
  researchInterests: string[];
  
  // Metadata
  seniorityLevel: 'professor' | 'research_scientist' | 'phd_student' | 'independent';
  sector: 'academia' | 'industry' | 'nonprofit' | 'independent';
  companies: string[]; // Extracted company affiliations
}
```

### Phase 2: Relationship Mapping
- Create mentor-to-mentor collaboration network
- Map institutional relationships
- Track advisor-student relationships
- Build co-mentorship graphs

### Phase 3: Content Enhancement
- Auto-generate mentor profile pages
- Create research area clustering
- Build expertise matching system
- Generate collaboration recommendations

### Phase 4: Integration Points

#### A. Entity System
- Store in entities table with enhanced properties
- Create mentor-specific views
- Enable filtering by all extracted attributes

#### B. Topic Connections
- Link mentors to relevant journey topics
- Create "Learn from experts" sections
- Add mentor perspectives to topics

#### C. External Resources
- Auto-populate MATS 2025 resource page
- Create mentor directory with filters
- Generate research area guides

#### D. Search & Discovery
- Enable mentor search by expertise
- Create "Find a mentor" tool
- Build expertise matching algorithm

## Detailed Extraction Patterns

### 1. Education Extraction
```regex
PhD from/at ([A-Za-z\s]+)
([A-Za-z\s]+) from ([A-Za-z\s]+)
advised by ([A-Za-z\s]+)
```

### 2. Position History
```regex
Previously at ([A-Za-z\s,]+)
Former ([A-Za-z\s]+) at ([A-Za-z\s]+)
was a ([A-Za-z\s]+) at ([A-Za-z\s]+)
```

### 3. Notable Outputs
- Papers in quotes
- "Highlighted outputs from past streams:"
- Numbered lists of achievements
- MATS cohort references

### 4. Company Affiliations
- Google DeepMind
- Anthropic
- OpenAI
- Redwood Research
- Academic institutions

## Database Schema Extensions

### Properties JSON Structure
```json
{
  "title": "Research Scientist",
  "organization": "Google DeepMind",
  "research_areas": ["Interpretability", "Mechanistic Interpretability"],
  "location": "SF Bay Area",
  "personal_website": "example.com",
  "stream_score": 8.0,
  "co_mentors": ["John Doe", "Jane Smith"],
  "education": [
    {
      "degree": "PhD",
      "institution": "MIT",
      "year": "2020",
      "advisor": "Prof. X"
    }
  ],
  "previous_positions": ["Postdoc at Stanford"],
  "notable_outputs": ["Paper 1", "Paper 2"],
  "seniority_level": "research_scientist",
  "sector": "industry",
  "companies": ["Google DeepMind"],
  "mentorship_history": {
    "cohorts": ["MATS 3.0", "MATS 4.0"],
    "mentee_count": 12,
    "highlighted_outputs": ["Steering vectors paper"]
  }
}
```

## Automation Opportunities

1. **Profile Generation**: Auto-generate comprehensive mentor profiles
2. **Expertise Matching**: Match topics to mentor expertise
3. **Network Visualization**: Create interactive collaboration networks
4. **Research Area Pages**: Generate pages for each research area with relevant mentors
5. **Institution Pages**: Create pages for major institutions with their mentors
6. **Geographic Hubs**: Show mentorship opportunities by location

## Next Steps

1. Implement enhanced parser with all extraction patterns
2. Create comprehensive test suite for edge cases
3. Build visualization components for mentor networks
4. Integrate with existing topic and resource systems
5. Create mentor profile template pages
6. Implement search and filtering capabilities

## Expected Outcomes

- Complete mentor database with 50+ data points per mentor
- Interconnected knowledge graph of AI safety researchers
- Enhanced resource discovery for students
- Automated content generation for mentor-related pages
- Rich filtering and search capabilities
- Network analysis insights for collaboration patterns