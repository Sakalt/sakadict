//

import {MutableRefObject, Ref} from "react";


export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (ref !== null && ref !== undefined) {
    if (typeof ref === "function") {
      ref(value);
    } else {
      const mutableRef = ref as MutableRefObject<T | null>;
      mutableRef.current = value;
    }
  }
}