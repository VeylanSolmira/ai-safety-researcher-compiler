'use client'

import { useState } from 'react'
import Assessment, { AssessmentQuestion } from './Assessment'
import InteractiveTransition from './InteractiveTransition'

interface JourneyAssessmentProps {
  sectionId: string
  fromSection: string
  toSection: string
  questions?: AssessmentQuestion[]
  includeInteractiveTransition?: boolean
}

// Default questions for sections that don't provide custom ones
const defaultQuestions: AssessmentQuestion[] = [
  {
    question: "What was the most important concept from this section?",
    options: [
      "Understanding the technical details",
      "Recognizing the broader implications",
      "Both technical and broader understanding are equally important",
      "Neither is particularly important"
    ],
    correct: 2,
    explanation: "AI safety requires both deep technical knowledge and understanding of broader implications."
  }
]

export default function JourneyAssessment({ 
  sectionId,
  fromSection,
  toSection,
  questions = defaultQuestions,
  includeInteractiveTransition = true
}: JourneyAssessmentProps) {
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [assessmentScore, setAssessmentScore] = useState({ score: 0, total: 0 })

  const handleAssessmentComplete = (score: number, total: number) => {
    setAssessmentScore({ score, total })
    setAssessmentComplete(true)
  }

  return (
    <div className="space-y-8">
      {/* Assessment Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
        <Assessment
          title="Section Assessment"
          questions={questions}
          onComplete={handleAssessmentComplete}
        />
      </div>

      {/* Show interactive transition after successful assessment */}
      {includeInteractiveTransition && assessmentComplete && assessmentScore.score >= Math.ceil(assessmentScore.total * 0.6) && (
        <InteractiveTransition
          fromSection={fromSection}
          toSection={toSection}
          sectionId={sectionId}
        />
      )}
    </div>
  )
}

// Section-specific assessment questions
export const sectionAssessments: Record<string, AssessmentQuestion[]> = {
  'introduction': [
    {
      question: "How would you describe the relationship between STEM optimization and AI risk?",
      options: [
        "STEM approaches are the only reliable path to AI safety",
        "STEM creates risks through narrow optimization but is still necessary",
        "We should abandon STEM approaches entirely",
        "STEM and ethics are completely separate domains"
      ],
      correct: 1,
      explanation: "STEM approaches are necessary for AI development but can create risks through hyperfocus on narrow metrics. We need both technical expertise and ethical grounding."
    },
    {
      question: "What's most important when approaching AI safety research?",
      options: [
        "Mathematical brilliance above all else",
        "Following established research consensus",
        "Balancing technical knowledge with ethical grounding",
        "Focusing only on immediate practical applications"
      ],
      correct: 2,
      explanation: "Effective AI safety research requires both deep technical understanding and strong ethical foundations to address the full scope of potential risks."
    },
    {
      question: "How should we think about value pluralism in AI safety?",
      options: [
        "Find the one correct value system and optimize for it",
        "Acknowledge multiple valid approaches while maintaining critical thinking",
        "Values don't matter, only technical solutions do",
        "Every opinion is equally valid regardless of evidence"
      ],
      correct: 1,
      explanation: "Value pluralism means recognizing multiple valid perspectives while still applying rigorous analysis and evidence-based reasoning."
    }
  ],
  
  'study-risks': [
    {
      question: "What is adversarial meta-learning in the context of AI safety?",
      options: [
        "AI systems learning to play games",
        "AI systems learning about and potentially manipulating safety measures",
        "A type of machine learning algorithm",
        "A method for training robust models"
      ],
      correct: 1,
      explanation: "Adversarial meta-learning refers to AI systems learning about the very processes designed to control or evaluate them, potentially undermining safety measures."
    },
    {
      question: "Why might publishing detailed AI safety research be problematic?",
      options: [
        "It's too complex for most people to understand",
        "It could teach AI systems how to circumvent safety measures",
        "It violates intellectual property",
        "It's not problematic at all"
      ],
      correct: 1,
      explanation: "Publishing detailed safety techniques might inadvertently teach future AI systems how to evade those very safety measures - a form of information hazard."
    },
    {
      question: "What is the 'AI teacher trap'?",
      options: [
        "Teachers becoming replaced by AI",
        "AI systems being bad at teaching",
        "Using AI to teach AI safety might let AI influence safety research",
        "A programming error in educational AI"
      ],
      correct: 2,
      explanation: "The AI teacher trap refers to the risk that using AI systems to help teach or research AI safety could allow those systems to subtly influence the direction of safety research."
    }
  ],
  
  // Add more section-specific questions as needed
  'fundamentals-hub': [
    {
      question: "In AI safety, what does 'alignment' refer to?",
      options: [
        "Making AI systems run faster",
        "Ensuring AI systems pursue intended goals safely",
        "Aligning code properly",
        "Political alignment between researchers"
      ],
      correct: 1,
      explanation: "Alignment in AI safety means ensuring AI systems pursue the goals we intend them to pursue, without harmful side effects or misinterpretation."
    }
  ],
  
  'build-first-tool': [
    {
      question: "What is the primary purpose of building safety tools?",
      options: [
        "To make AI systems faster",
        "To detect and prevent harmful AI behaviors",
        "To replace human oversight",
        "To increase AI capabilities"
      ],
      correct: 1,
      explanation: "Safety tools are designed to detect, prevent, and mitigate potentially harmful behaviors in AI systems."
    }
  ],
  
  'explore-alignment': [
    {
      question: "What is a key challenge in AI alignment?",
      options: [
        "Making AI systems run on less power",
        "Ensuring AI understands and follows human values",
        "Making AI code more readable",
        "Reducing AI training costs"
      ],
      correct: 1,
      explanation: "A fundamental challenge in alignment is ensuring AI systems understand and follow human values, even as they become more capable."
    }
  ],
  
  // Subsection assessments (for study-risks subsections)
  'prompt-injection': [
    {
      question: "What is prompt injection?",
      options: [
        "A medical procedure",
        "Manipulating AI input to bypass intended behavior",
        "A programming technique",
        "A type of SQL attack"
      ],
      correct: 1,
      explanation: "Prompt injection involves crafting inputs that cause AI systems to ignore their instructions or behave in unintended ways."
    }
  ],
  
  'adversarial-meta-learning': [
    {
      question: "What makes adversarial meta-learning particularly concerning?",
      options: [
        "It's computationally expensive",
        "AI systems learn to manipulate their own safety measures",
        "It requires large datasets",
        "It's difficult to implement"
      ],
      correct: 1,
      explanation: "Adversarial meta-learning is concerning because AI systems can learn about and potentially circumvent the very processes designed to ensure their safety."
    }
  ],
  
  'data-poisoning': [
    {
      question: "How does data poisoning relate to AI safety?",
      options: [
        "It makes AI systems slower",
        "Malicious data can corrupt AI behavior and safety measures",
        "It only affects image recognition",
        "It's not a real concern"
      ],
      correct: 1,
      explanation: "Data poisoning can corrupt AI training, potentially undermining safety measures and causing harmful behaviors."
    }
  ]
}