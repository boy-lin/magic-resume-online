import { useGrammarStore } from "@/store/useGrammarStore";
import type { GrammarError } from "@/store/useGrammarStore";

export type { GrammarError };

export const useGrammarCheck = () => {
  const {
    errors,
    isChecking,
    selectedErrorIndex,
    checkGrammar,
    clearErrors,
    selectError,
  } = useGrammarStore();

  return {
    errors,
    isChecking,
    selectedErrorIndex,
    checkGrammar,
    clearErrors,
    selectError,
  };
};
