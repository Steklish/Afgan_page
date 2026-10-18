import { Component, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: undefined });
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ 
            color: '#f87171', 
            background: 'rgba(24, 10, 10, 0.94)', 
            padding: '1.2rem 1.4rem', 
            borderRadius: '10px', 
            border: '1px solid rgba(239, 68, 68, 0.35)',
            maxWidth: '360px',
            textAlign: 'center',
            fontSize: '0.85rem',
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)'
          }}>
            <AlertCircle size={26} style={{ margin: '0 auto 0.5rem', display: 'block', color: '#ef4444' }} />
            <strong style={{ color: '#fee2e2', fontSize: '0.95rem' }}>
              {this.props.fallbackTitle || 'Файл ресурса не найден'}
            </strong>
            <p style={{ marginTop: '0.45rem', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.45' }}>
              {this.props.fallbackMessage || 'Проверьте путь к файлу в каталоге public/ или загрузите соответствующий ассет.'}
            </p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}
