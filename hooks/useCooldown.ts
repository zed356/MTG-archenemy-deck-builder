import { useEffect, useRef } from "react";

const useCooldown = (duration: number) => {
  const cooldownRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = () => {
    cooldownRef.current = true;
    timeoutRef.current = setTimeout(() => {
      cooldownRef.current = false;
    }, duration);
  };

  const resetCooldown = () => {
    cooldownRef.current = false;
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

  return { isOnCooldown: cooldownRef.current, startCooldown, resetCooldown };
};

export default useCooldown;
