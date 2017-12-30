import * as React from "react";

export function IntervalEnhance<P>(ComposedComponent: React.ComponentClass<P>) {
  return class extends React.Component<any, any> {
    static displayName = "ComponentEnhancedWithIntervalHOC";

    interval: number;

    constructor(props: any) {
      super(props);
      this.state = {
        seconds: 0
      };
    }

    componentDidMount() {
      this.interval = setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    tick() {
      this.setState({
        seconds: this.state.seconds + 2
      });
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };
}
