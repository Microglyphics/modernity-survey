// src/App.jsx
import React from 'react'
import TernaryPlot from './components/ternary-plot/TernaryPlot'
import { testSurveyResult, getPlotData } from './data/testData'
import './App.css'

function App() {
  const plotData = getPlotData(testSurveyResult);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Survey Result Display</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Raw Scores:</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>PreModern (n1): {testSurveyResult.n1}</div>
            <div>Modern (n2): {testSurveyResult.n2}</div>
            <div>PostModern (n3): {testSurveyResult.n3}</div>
          </div>
        </div>
        <TernaryPlot 
          analysisData={{
            scores: plotData.scores,
            plotCoordinates: {
              x: plotData.plot_x,
              y: plotData.plot_y
            }
          }}
          responses={{
            q1_response: testSurveyResult.q1_response,
            q2_response: testSurveyResult.q2_response,
            q3_response: testSurveyResult.q3_response,
            q4_response: testSurveyResult.q4_response,
            q5_response: testSurveyResult.q5_response,
            q6_response: testSurveyResult.q6_response
          }}
        />
      </div>
    </div>
  )
}

export default App