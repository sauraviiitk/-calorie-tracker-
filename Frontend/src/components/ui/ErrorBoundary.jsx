import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-error-container text-on-error-container p-8 rounded-2xl max-w-lg w-full">
            <span className="material-symbols-outlined text-[48px] mb-4">error</span>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm opacity-90 mb-6">
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-on-error-container text-error-container rounded-xl font-medium transition-transform hover:scale-105 active:scale-95"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-black/10 p-4 rounded-xl overflow-auto text-xs font-mono">
                <p className="font-bold text-error">{this.state.error.toString()}</p>
                <pre className="mt-2 opacity-70">{this.state.errorInfo?.componentStack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
