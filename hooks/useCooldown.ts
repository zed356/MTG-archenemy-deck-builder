import { useEffect, useRef, useState } from "react";

const useCooldown = (duration: number) => {
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // can specify a custom duration during runtime, otherwise use default on creation of the hook
  const startCooldown = (customDuration = duration, onCooldownEnd?: () => void) => {
    if (isOnCooldown) return;

    setIsOnCooldown(true);
    timeoutRef.current = setTimeout(() => {
      setIsOnCooldown(false);

      // If a callback is provided, call it
      if (onCooldownEnd) {
        onCooldownEnd();
      }
    }, customDuration);
  };

  const resetCooldown = () => {
    setIsOnCooldown(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isOnCooldown, startCooldown, resetCooldown };
};

export default useCooldown;
