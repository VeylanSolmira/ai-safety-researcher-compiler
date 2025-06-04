-- Check if all mentors are migrated to entities
SELECT 'Mentors not in entities:' as check_type;
SELECT m.id, m.name, m.organization_id, m.biography, m.email, m.website
FROM mentors m
LEFT JOIN entities e ON e.name = m.name
WHERE e.id IS NULL;

-- Check mentor_topics vs entity_topics
SELECT '---' as separator;
SELECT 'Mentor topics not in entity_topics:' as check_type;
SELECT mt.mentor_id, mt.topic_id, m.name as mentor_name
FROM mentor_topics mt
JOIN mentors m ON m.id = mt.mentor_id
LEFT JOIN entities e ON e.name = m.name
LEFT JOIN entity_topics et ON et.entity_id = e.id AND et.topic_id = mt.topic_id
WHERE et.entity_id IS NULL;

-- Check if research areas are in properties
SELECT '---' as separator;
SELECT 'Checking research areas migration:' as check_type;
SELECT 
    m.name,
    COUNT(DISTINCT mra.area) as areas_in_old_table,
    CASE 
        WHEN json_extract(e.properties, '$.researchAreas') IS NOT NULL 
        THEN json_array_length(json_extract(e.properties, '$.researchAreas'))
        ELSE 0
    END as areas_in_properties
FROM mentors m
LEFT JOIN mentor_research_areas mra ON mra.mentor_id = m.id
LEFT JOIN entities e ON e.name = m.name
GROUP BY m.id, m.name, e.properties
HAVING areas_in_old_table > 0;

-- Check what data might be lost
SELECT '---' as separator;
SELECT 'Unique data in mentor tables:' as check_type;
SELECT 'Qualifications:' as data_type, COUNT(*) as count FROM mentor_qualifications;
SELECT 'Research topics:' as data_type, COUNT(*) as count FROM mentor_research_topics;
SELECT 'Research areas:' as data_type, COUNT(*) as count FROM mentor_research_areas;
