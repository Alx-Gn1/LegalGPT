import { useEffect, useRef } from "react";

export default function useIsMountEffect(fn: Function, dependencies: Array<any>) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, [...dependencies, fn]);
}
