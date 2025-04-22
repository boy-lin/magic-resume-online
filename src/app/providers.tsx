"use client";
import {
  Suspense,
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
} from "react";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/toasts/toaster";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";

const initialState = {
  userLoading: 0,
  user: null,
};

const appContext = createContext<any>(initialState);

export const useAppContext = () => useContext(appContext);

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AppProvider({ children }: Props) {
  const [state, setState] = useState(initialState);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  );

  useEffect(() => {
    async function getUserAsync() {
      const user = await getUser(createClient());
      console.debug("User", user);
      setState((s) => ({ ...s, user, userLoading: 1 }));
    }
    getUserAsync();
  }, []);

  // console.debug("Providers memoizedValue.state", memoizedValue.state);

  return (
    <appContext.Provider value={memoizedValue}>{children}</appContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  console.debug("Providers render");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="magic-resume-theme"
    >
      <AppProvider>{children}</AppProvider>
      <Analytics />
      <Suspense>
        <Toaster />
      </Suspense>
    </ThemeProvider>
  );
}
