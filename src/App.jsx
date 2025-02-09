// src/App.jsx
import React from 'react'
import TernaryPlot from './components/ternary-plot/TernaryPlot'
import './App.css'

const sampleData = {
  scores: [33.33, 33.33, 33.33], // Equal distribution for testing
  questions: {
    Q1: {
      text: "Sample Question 1",
      responses: [
        { id: "Q1R1", text: "Response 1", scores: [100, 0, 0] }
      ]
    }
  },
  responses: {
    q1_response: "Q1R1"
  }
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ternary Plot Test</h1>
        <TernaryPlot 
          analysisData={sampleData}
          questions={sampleData.questions}
          responses={sampleData.responses}
        />
      </div>
    </div>
  )
}

export default App