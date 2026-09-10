import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Prevent sensitive information leakage to console in production
    if (import.meta.env.DEV) {
      console.error('[Typlix Error]:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
          <div className="max-w-sm w-full border border-neutral-800 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-lg font-semibold text-neutral-100">Something went wrong</h2>
            <p className="text-neutral-500 text-xs leading-relaxed">
              An unexpected error occurred. Your data is safe.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-neutral-100 text-neutral-900 text-sm font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
