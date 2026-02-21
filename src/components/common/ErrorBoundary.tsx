import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
          <h3 className="mb-1 text-sm font-bold text-red-400">
            {this.props.fallbackTitle ?? '오류가 발생했습니다'}
          </h3>
          <p className="mb-3 text-xs text-[var(--color-text-secondary)]">
            {this.state.error?.message ?? '알 수 없는 오류'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 rounded-md bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
