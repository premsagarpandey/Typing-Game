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
      console.error('[Typlix ErrorBoundary Caught]:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-white">Application Exception Intercepted</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              A runtime anomaly was caught and neutralized by the Typlix Defense Shield. No game data was compromised.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              Restart Secure Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
