import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeAssessment, 
  updateProbabilities, 
  selectNextQuestion,
  generateResult,
  isAssessmentComplete,
  type AssessmentState 
} from '@/lib/paradigms-assessment';

// POST /api/paradigms-assessment
// Start a new assessment
export async function POST(request: NextRequest) {
  try {
    const initialState = initializeAssessment();
    const firstQuestion = selectNextQuestion(initialState);
    
    return NextResponse.json({
      state: initialState,
      nextQuestion: firstQuestion,
      isComplete: false
    });
  } catch (error) {
    console.error('Error initializing assessment:', error);
    return NextResponse.json(
      { error: 'Failed to initialize assessment' },
      { status: 500 }
    );
  }
}

// PUT /api/paradigms-assessment
// Submit an answer and get the next question or result
export async function PUT(request: NextRequest) {
  try {
    const { state, questionId, optionId } = await request.json();
    
    if (!state || !questionId || !optionId) {
      return NextResponse.json(
        { error: 'Missing required fields: state, questionId, optionId' },
        { status: 400 }
      );
    }
    
    // Update state with the answer
    const updatedState = updateProbabilities(state as AssessmentState, questionId, optionId);
    
    // Check if assessment is complete
    if (isAssessmentComplete(updatedState)) {
      const result = generateResult(updatedState);
      return NextResponse.json({
        state: updatedState,
        isComplete: true,
        result
      });
    }
    
    // Get next question
    const nextQuestion = selectNextQuestion(updatedState);
    
    return NextResponse.json({
      state: updatedState,
      nextQuestion,
      isComplete: false
    });
  } catch (error) {
    console.error('Error processing assessment answer:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
}

// GET /api/paradigms-assessment/questions
// Get all available questions (for preview/testing)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get('preview') === 'true';
  
  if (!preview) {
    return NextResponse.json(
      { error: 'Preview mode required' },
      { status: 403 }
    );
  }
  
  // Import and return the questions for preview
  const { ASSESSMENT_QUESTIONS, PARADIGMS } = await import('@/lib/paradigms-assessment');
  
  return NextResponse.json({
    questions: ASSESSMENT_QUESTIONS,
    paradigms: PARADIGMS.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description
    }))
  });
}