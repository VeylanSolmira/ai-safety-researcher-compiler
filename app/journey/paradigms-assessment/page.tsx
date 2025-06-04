'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { AssessmentState, AssessmentQuestion, AssessmentResult } from '@/lib/paradigms-assessment';

export default function ParadigmsAssessmentPage() {
  const [state, setState] = useState<AssessmentState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Start a new assessment
  const startAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/paradigms-assessment', {
        method: 'POST',
      });
      const data = await response.json();
      setState(data.state);
      setCurrentQuestion(data.nextQuestion);
      setResult(null);
      setSelectedOption(null);
    } catch (error) {
      console.error('Failed to start assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit an answer
  const submitAnswer = async () => {
    if (!state || !currentQuestion || !selectedOption) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/paradigms-assessment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          questionId: currentQuestion.id,
          optionId: selectedOption,
        }),
      });
      
      const data = await response.json();
      setState(data.state);
      
      if (data.isComplete) {
        setResult(data.result);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(data.nextQuestion);
        setSelectedOption(null);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start assessment on mount
  useEffect(() => {
    startAssessment();
  }, []);

  // Render result
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/journey" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Back to Journey
                </Link>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Paradigm Assessment Results
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Paradigm Fingerprint</h1>
            </div>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{result.explanation}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(result.confidence)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Primary Paradigms</h2>
                <div className="space-y-3">
                  {result.primaryParadigms.map((paradigm, index) => (
                    <div key={paradigm.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {index + 1}. {paradigm.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(paradigm.probability * 100)}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{paradigm.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h2>
                <div className="space-y-2">
                  {Object.entries(result.paradigmProfile.categories)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([category, weight]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${weight * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {Math.round(weight * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Suggested Learning Path</h2>
                <div className="grid grid-cols-2 gap-3">
                  {result.suggestedTopics.map(topic => (
                    <button 
                      key={topic} 
                      className="flex items-center justify-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="mr-2">🎯</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={startAssessment}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Take Assessment Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render question
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/journey" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Journey
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Safety Paradigm Assessment
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Discover Your Paradigm
            </h2>
            {state && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Question {state.questionsAsked + 1} of ~10-15
              </span>
            )}
          </div>
          
          {state && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(state.questionsAsked / 15) * 100}%` }}
                />
              </div>
            </div>
          )}

          {currentQuestion ? (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                {currentQuestion.text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">{option.text}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={submitAnswer}
                  disabled={!selectedOption || loading}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    !selectedOption || loading
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Next'}
                  <ChevronRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading assessment...</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About This Assessment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This assessment identifies your "paradigm fingerprint" - the mental models and frameworks 
            you use when thinking about AI safety. Understanding your paradigms helps you recognize 
            your biases, communicate better with researchers who think differently, and discover 
            new perspectives that might enhance your work.
          </p>
        </div>
      </main>
    </div>
  );
}