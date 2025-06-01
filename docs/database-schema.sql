-- AI Safety Research Journey Database Schema
-- This schema replaces the large TypeScript files with a relational database
-- Benefits: Efficient queries, less token usage, better maintainability

-- =====================================================
-- JOURNEY STRUCTURE TABLES
-- =====================================================

-- Tiers (Foundation, Intermediate, Advanced, Expert)
CREATE TABLE tiers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT CHECK (level IN ('foundation', 'intermediate', 'advanced', 'expert')),
    description TEXT,
    estimated_duration TEXT,
    type TEXT CHECK (type IN ('linear', 'open-world')),
    position INTEGER NOT NULL DEFAULT 0, -- For ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tier prerequisites (many-to-many)
CREATE TABLE tier_prerequisites (
    tier_id TEXT REFERENCES tiers(id),
    prerequisite_id TEXT REFERENCES tiers(id),
    PRIMARY KEY (tier_id, prerequisite_id)
);

-- Skills gained per tier
CREATE TABLE tier_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier_id TEXT REFERENCES tiers(id),
    skill TEXT NOT NULL,
    position INTEGER DEFAULT 0
);

-- Career relevance per tier
CREATE TABLE tier_careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier_id TEXT REFERENCES tiers(id),
    career_path TEXT NOT NULL,
    position INTEGER DEFAULT 0
);

-- Modules within tiers
CREATE TABLE modules (
    id TEXT PRIMARY KEY,
    tier_id TEXT REFERENCES tiers(id),
    title TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT,
    assessment_type TEXT CHECK (assessment_type IN ('quiz', 'project', 'peer-review', 'self-assessment')),
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module learning objectives
CREATE TABLE module_objectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id TEXT REFERENCES modules(id),
    objective TEXT NOT NULL,
    position INTEGER DEFAULT 0
);

-- Module practical components
CREATE TABLE module_practicals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id TEXT REFERENCES modules(id),
    component TEXT NOT NULL,
    position INTEGER DEFAULT 0
);

-- Learning paths
CREATE TABLE learning_paths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Module to learning path mapping
CREATE TABLE module_paths (
    module_id TEXT REFERENCES modules(id),
    path_id TEXT REFERENCES learning_paths(id),
    PRIMARY KEY (module_id, path_id)
);

-- Topics within modules
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES modules(id),
    title TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    
    -- Content options
    roadmap_content_id TEXT, -- Link to existing roadmap content
    content_markdown TEXT, -- Direct markdown content
    has_journey_extras BOOLEAN DEFAULT FALSE,
    has_interactive_transition BOOLEAN DEFAULT FALSE,
    assessment_id TEXT, -- Legacy assessment ID
    
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional roadmap content IDs for topics
CREATE TABLE topic_additional_content (
    topic_id TEXT REFERENCES topics(id),
    content_id TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    PRIMARY KEY (topic_id, content_id)
);

-- Topic tags
CREATE TABLE topic_tags (
    topic_id TEXT REFERENCES topics(id),
    tag TEXT NOT NULL,
    PRIMARY KEY (topic_id, tag)
);

-- Topic prerequisites
CREATE TABLE topic_prerequisites (
    topic_id TEXT REFERENCES topics(id),
    prerequisite_id TEXT REFERENCES topics(id),
    PRIMARY KEY (topic_id, prerequisite_id)
);

-- Topic to learning path mapping
CREATE TABLE topic_paths (
    topic_id TEXT REFERENCES topics(id),
    path_id TEXT REFERENCES learning_paths(id),
    PRIMARY KEY (topic_id, path_id)
);

-- =====================================================
-- DEEP DIVES TABLES
-- =====================================================

-- Case studies
CREATE TABLE case_studies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    estimated_time TEXT,
    content_markdown TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experiments
CREATE TABLE experiments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    estimated_time TEXT,
    content_markdown TEXT,
    notebook_url TEXT, -- Link to Jupyter notebook
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Explorations
CREATE TABLE explorations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    estimated_time TEXT,
    content_markdown TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topic to deep dive relationships
CREATE TABLE topic_case_studies (
    topic_id TEXT REFERENCES topics(id),
    case_study_id TEXT REFERENCES case_studies(id),
    PRIMARY KEY (topic_id, case_study_id)
);

CREATE TABLE topic_experiments (
    topic_id TEXT REFERENCES topics(id),
    experiment_id TEXT REFERENCES experiments(id),
    PRIMARY KEY (topic_id, experiment_id)
);

CREATE TABLE topic_explorations (
    topic_id TEXT REFERENCES topics(id),
    exploration_id TEXT REFERENCES explorations(id),
    PRIMARY KEY (topic_id, exploration_id)
);

-- =====================================================
-- USER PROGRESS TABLES
-- =====================================================

-- User profiles (for future auth)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User journey progress
CREATE TABLE user_progress (
    user_id TEXT REFERENCES users(id),
    current_tier_id TEXT REFERENCES tiers(id),
    current_module_id TEXT REFERENCES modules(id),
    current_topic_id TEXT REFERENCES topics(id),
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    last_activity_type TEXT,
    last_activity_id TEXT,
    last_activity_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Completed items tracking
CREATE TABLE user_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    item_type TEXT CHECK (item_type IN ('tier', 'module', 'topic', 'case_study', 'experiment', 'exploration')),
    item_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- in minutes
    score REAL, -- For assessments
    UNIQUE (user_id, item_type, item_id)
);

-- User choices for open-world tiers
CREATE TABLE user_choices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    tier_id TEXT REFERENCES tiers(id),
    choice_key TEXT NOT NULL,
    choice_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RESOURCES TABLES (CBAI Mentors, etc.)
-- =====================================================

-- Organizations
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('university', 'research-lab', 'company', 'think-tank', 'government')),
    description TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentors
CREATE TABLE mentors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_id TEXT REFERENCES organizations(id),
    biography TEXT,
    email TEXT,
    website TEXT,
    quick_eval_rating TEXT, -- Personal evaluation
    quick_eval_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentor topics
CREATE TABLE mentor_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mentor_id TEXT REFERENCES mentors(id),
    topic TEXT NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0
);

-- Mentor qualifications
CREATE TABLE mentor_qualifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mentor_id TEXT REFERENCES mentors(id),
    qualification TEXT NOT NULL,
    position INTEGER DEFAULT 0
);

-- Mentor research areas
CREATE TABLE mentor_research_areas (
    mentor_id TEXT REFERENCES mentors(id),
    area TEXT NOT NULL,
    PRIMARY KEY (mentor_id, area)
);

-- Research topics (different from journey topics)
CREATE TABLE research_topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('interpretability', 'alignment', 'governance', 'control', 'evaluation', 'formal-methods', 'policy')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentor to research topic mapping
CREATE TABLE mentor_research_topics (
    mentor_id TEXT REFERENCES mentors(id),
    research_topic_id TEXT REFERENCES research_topics(id),
    PRIMARY KEY (mentor_id, research_topic_id)
);

-- Research topic to journey topic mapping
CREATE TABLE research_journey_mapping (
    research_topic_id TEXT REFERENCES research_topics(id),
    journey_topic_id TEXT REFERENCES topics(id),
    PRIMARY KEY (research_topic_id, journey_topic_id)
);

-- =====================================================
-- ROADMAP CONTENT TABLES
-- =====================================================

-- Store roadmap content separately for efficiency
CREATE TABLE roadmap_content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content_markdown TEXT,
    content_personal_markdown TEXT, -- Personal mode version
    metadata JSON, -- Store any additional metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSESSMENT TABLES
-- =====================================================

-- Assessment questions
CREATE TABLE assessment_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id TEXT NOT NULL, -- Groups questions together
    question TEXT NOT NULL,
    correct_option INTEGER NOT NULL,
    explanation TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment options
CREATE TABLE assessment_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER REFERENCES assessment_questions(id),
    option_text TEXT NOT NULL,
    position INTEGER NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_modules_tier ON modules(tier_id);
CREATE INDEX idx_topics_module ON topics(module_id);
CREATE INDEX idx_user_completions_user ON user_completions(user_id);
CREATE INDEX idx_user_completions_item ON user_completions(item_type, item_id);
CREATE INDEX idx_mentors_org ON mentors(organization_id);
CREATE INDEX idx_topic_tags_tag ON topic_tags(tag);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Complete topic information with module and tier
CREATE VIEW v_topic_details AS
SELECT 
    t.id AS topic_id,
    t.title AS topic_title,
    t.description AS topic_description,
    t.difficulty,
    t.estimated_time,
    m.id AS module_id,
    m.title AS module_title,
    tr.id AS tier_id,
    tr.title AS tier_title,
    tr.level AS tier_level
FROM topics t
JOIN modules m ON t.module_id = m.id
JOIN tiers tr ON m.tier_id = tr.id;

-- View: Mentor details with organization
CREATE VIEW v_mentor_details AS
SELECT 
    m.id AS mentor_id,
    m.name AS mentor_name,
    m.biography,
    m.quick_eval_rating,
    o.id AS org_id,
    o.name AS org_name,
    o.type AS org_type
FROM mentors m
LEFT JOIN organizations o ON m.organization_id = o.id
WHERE m.is_active = TRUE;

-- View: User progress summary
CREATE VIEW v_user_progress_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    COUNT(DISTINCT CASE WHEN uc.item_type = 'tier' THEN uc.item_id END) AS tiers_completed,
    COUNT(DISTINCT CASE WHEN uc.item_type = 'module' THEN uc.item_id END) AS modules_completed,
    COUNT(DISTINCT CASE WHEN uc.item_type = 'topic' THEN uc.item_id END) AS topics_completed,
    SUM(uc.time_spent) AS total_time_spent,
    up.current_tier_id,
    up.current_module_id,
    up.current_topic_id
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_completions uc ON u.id = uc.user_id
GROUP BY u.id;