import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error boundary caught:', error, info)
  }

  public render() {
    if (this.state.hasError) {
      return <div className='p-6 text-center text-sm text-red-600'>Something went wrong.</div>
    }

    return this.props.children
  }
}
