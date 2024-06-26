"use client";

import { useState, useCallback } from "react";
import { debounce } from "lodash";

function useDebouncedCallback(callback: any, delay: any) {
  const [debounceFn, setDebounceFn] = useState(() => callback);

  useCallback(() => {
    const debounced = debounce(callback, delay); // Assuming you have debounce function
    setDebounceFn(debounced);
  }, [callback, delay]);

  return debounceFn;
}

export default useDebouncedCallback;
