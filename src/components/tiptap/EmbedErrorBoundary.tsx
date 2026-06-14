/**
 * Error Boundary for Embed Components
 * Catches errors in embed rendering and provides graceful degradation
 */
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface EmbedErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface EmbedErrorBoundaryState {
  hasError: boolean
}

export class EmbedErrorBoundary extends Component<EmbedErrorBoundaryProps, EmbedErrorBoundaryState> {
  constructor(props: EmbedErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): EmbedErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Embed component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-amber-600 text-center p-4 my-4 border border-amber-200 rounded bg-amber-50">
            <p className="text-sm">This content could not be loaded. Please try again later.</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default EmbedErrorBoundary
