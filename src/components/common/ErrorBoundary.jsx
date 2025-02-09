// src/components/common/ErrorBoundary.jsx
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4 border border-red-300 rounded">
          <h2 className="font-bold mb-2">Something went wrong</h2>
          <pre className="text-sm">{this.state.error?.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}