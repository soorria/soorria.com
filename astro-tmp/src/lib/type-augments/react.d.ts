import type * as _CSS from "csstype";

declare module "react" {
  interface CSSProperties {
    [customPropery: `--${string}`]: string;
  }
}
