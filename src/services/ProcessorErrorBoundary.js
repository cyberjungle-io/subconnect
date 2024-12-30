import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ProcessorRegistry } from "./ProcessorRegistry";

class ProcessorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("ProcessorErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Here you could send to your error reporting service
    // Example: Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <FaExclamationTriangle />
            <h3 className="font-semibold">AI Assistant Error</h3>
          </div>
          <p className="text-sm text-red-600 mb-2">
            Something went wrong with the AI Assistant.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-xs text-red-500">
              <summary>Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <button
            className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 
                     text-red-700 rounded transition-colors"
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              // Optionally reload the processor registry
              if (window.processorRegistry) {
                window.processorRegistry = new ProcessorRegistry();
              }
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProcessorErrorBoundary;
