'use client'

import { useState, useEffect } from 'react'

interface CompassValues {
  timeHorizon: number // 0 = near-term, 100 = long-term
  approach: number    // 0 = technical, 100 = governance
  focus: number      // 0 = capability, 100 = safety
}

export default function AISafetyCompass() {
  const [values, setValues] = useState<CompassValues>({
    timeHorizon: 50,
    approach: 50,
    focus: 50,
  })

  // Load saved values from localStorage on mount
  useEffect(() => {
    const savedValues = localStorage.getItem('aiSafetyCompassValues')
    if (savedValues) {
      try {
        setValues(JSON.parse(savedValues))
      } catch (error) {
        console.error('Failed to load compass values:', error)
      }
    }
  }, [])

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aiSafetyCompassValues', JSON.stringify(values))
  }, [values])

  const getRecommendations = () => {
    const recommendations = []
    
    // Time horizon recommendations
    if (values.timeHorizon > 70) {
      recommendations.push({
        type: 'focus',
        text: 'Alignment theory and existential safety',
        icon: '🎯'
      })
    } else if (values.timeHorizon < 30) {
      recommendations.push({
        type: 'focus',
        text: 'Current model safety and deployment practices',
        icon: '🛡️'
      })
    }
    
    // Approach recommendations
    if (values.approach > 70) {
      recommendations.push({
        type: 'path',
        text: 'AI governance frameworks and policy',
        icon: '⚖️'
      })
    } else if (values.approach < 30) {
      recommendations.push({
        type: 'path',
        text: 'Technical alignment solutions',
        icon: '🔧'
      })
    }
    
    // Focus recommendations
    if (values.focus > 70) {
      recommendations.push({
        type: 'methodology',
        text: 'Safety-first research methodologies',
        icon: '🦺'
      })
    } else if (values.focus < 30) {
      recommendations.push({
        type: 'methodology',
        text: 'Capability advancement with safety considerations',
        icon: '🚀'
      })
    }
    
    // Balanced approaches
    if (Math.abs(values.timeHorizon - 50) < 20 && 
        Math.abs(values.approach - 50) < 20 && 
        Math.abs(values.focus - 50) < 20) {
      recommendations.push({
        type: 'balanced',
        text: 'Well-rounded approach across multiple dimensions',
        icon: '⚖️'
      })
    }
    
    return recommendations
  }

  const getSuggestedPaths = () => {
    const paths = []
    
    if (values.approach < 40) {
      paths.push('Technical Safety Engineer')
    }
    if (values.approach > 60) {
      paths.push('Governance Practitioner')
    }
    if (values.focus > 60 && values.timeHorizon > 60) {
      paths.push('Alignment Researcher')
    }
    if (values.timeHorizon < 40 && values.focus < 60) {
      paths.push('Applied AI Safety Engineer')
    }
    
    if (paths.length === 0) {
      paths.push('Generalist - Explore All Paths')
    }
    
    return paths
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 my-8">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        🧭 Your AI Safety Research Compass
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Adjust the sliders to find your research orientation. Your preferences will be saved and used to personalize your learning journey.
      </p>
      
      <div className="space-y-6">
        {/* Time Horizon Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span className="text-blue-600 dark:text-blue-400">Near-term (1-5 years)</span>
            <span className="text-center text-gray-500">Time Horizon</span>
            <span className="text-purple-600 dark:text-purple-400">Long-term (10+ years)</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.timeHorizon}
            onChange={(e) => setValues({...values, timeHorizon: parseInt(e.target.value)})}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Approach Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span className="text-green-600 dark:text-green-400">Technical Solutions</span>
            <span className="text-center text-gray-500">Approach</span>
            <span className="text-yellow-600 dark:text-yellow-400">Governance & Policy</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.approach}
            onChange={(e) => setValues({...values, approach: parseInt(e.target.value)})}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Focus Slider */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span className="text-orange-600 dark:text-orange-400">Capability Research</span>
            <span className="text-center text-gray-500">Focus</span>
            <span className="text-red-600 dark:text-red-400">Safety Research</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.focus}
            onChange={(e) => setValues({...values, focus: parseInt(e.target.value)})}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
        <h3 className="font-semibold mb-4 text-lg">Your Profile Suggests:</h3>
        
        {getRecommendations().length > 0 ? (
          <ul className="space-y-3 mb-6">
            {getRecommendations().map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-2xl">{rec.icon}</span>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {rec.type}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300">{rec.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Adjust the sliders to see personalized recommendations
          </p>
        )}
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 text-sm text-gray-600 dark:text-gray-400">
            Suggested Learning Paths:
          </h4>
          <div className="flex flex-wrap gap-2">
            {getSuggestedPaths().map((path, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                {path}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
        Your preferences are automatically saved and will be used to tailor your learning experience
      </p>
    </div>
  )
}