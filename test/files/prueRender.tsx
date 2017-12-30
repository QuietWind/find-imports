import * as React from "react";
import { is } from "immutable";

// function diffValue(a: any, b: any) {
//   if (typeof a === "function" || typeof b === "function") {
//     return true;
//   } else if (!is(Map(a), Map(b))) {
//     return false;
//   }

//   return true;
// }

// function diffEqual(a: Object, b: Object) {
//   // is 只是针对 immutable collection 对象
//   for (const key in a) {
//     if (!diffValue(a[key], b[key])) {
//       return false;
//     }
//   }

//   return true;
// }

export function PrueRender<P>(ComposedComponent: React.ComponentClass<P>) {
  class PrueRenderHoc extends React.Component<any, any> {
    static displayName = "PrueRenderHOC";

    shouldComponentUpdate(nextProps: any = {}, nextState: any = {}) {
      const thisProps = this.props || {};
      const thisState = this.state || {};

      nextProps = nextProps || {};
      nextState = nextState || {};

      if (
        Object.keys(thisProps).length !== Object.keys(nextProps).length ||
        Object.keys(thisState).length !== Object.keys(nextState).length
      ) {
        return true;
      }

      for (const key in nextProps) {
        if (!is(thisProps[key], nextProps[key])) {
          return true;
        }
      }

      for (const key in nextState) {
        if (
          thisState[key] !== nextState[key] ||
          !is(thisState[key], nextState[key])
        ) {
          return true;
        }
      }
      return false;
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return PrueRenderHoc;
}

export default PrueRender;
