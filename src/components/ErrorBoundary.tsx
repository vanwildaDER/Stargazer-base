import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service (implement as needed)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-red-200 dark:border-red-800">
            <div className="text-center">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-4">
                System Error Detected
              </h1>
              
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                The Stargazer platform encountered an unexpected error. Our technical team has been notified.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border">
                  <summary className="cursor-pointer text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Technical Details (Development Only)
                  </summary>
                  <div className="text-xs text-red-700 dark:text-red-300 font-mono overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div className="mb-2">
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  aria-label="Retry loading the component"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>Retry</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  aria-label="Return to dashboard home"
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;