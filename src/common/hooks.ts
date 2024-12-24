import { useMediaQuery } from "@mantine/hooks";
import { breakpoints, globalMediaQueriesType } from "./styles";

export function useGlobalMediaQuery(): globalMediaQueriesType {
  const xs = useMediaQuery(`(max-width: ${breakpoints.xs}px)`) ?? false;
  const sm = useMediaQuery(`(max-width: ${breakpoints.sm}px)`) ?? false;
  const md = useMediaQuery(`(max-width: ${breakpoints.md}px)`) ?? false;
  const lg = useMediaQuery(`(max-width: ${breakpoints.lg}px)`) ?? false;
  const xl = useMediaQuery(`(max-width: ${breakpoints.xl}px)`) ?? false;
  const larger_than_xl =
    useMediaQuery(`(min-width: ${breakpoints.xl}px)`) ?? false;

  return { xs, sm, md, lg, xl, larger_than_xl };
}

import { useEffect } from "react";
import { Module } from "@/features/grading/types";

export const usePreventPageRefresh = (modules: Module[]) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (modules.length > 0) {
        event.preventDefault();
        event.returnValue = ""; // Standard for modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [modules.length]);
};
