import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui";

type Props = { children: ReactNode; onRetry?: () => void };
type State = { error: Error | null };

/** Catches render errors so hash navigation does not blank #root. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("DSC panel error", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="dsc-shell" style={{ padding: 24 }}>
          <p className="dsc-honesty">Something went wrong loading this view.</p>
          <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-md)" }}>
            {this.state.error.message}
          </p>
          <div className="dsc-chip-row" style={{ marginTop: 12 }}>
            <Button
              primary
              onClick={() => {
                this.setState({ error: null });
                this.props.onRetry?.();
              }}
            >
              Retry
            </Button>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
