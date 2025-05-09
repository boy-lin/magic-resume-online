"use client";
import { useEffect, useState, useMemo } from "react";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { initialState, appContext } from "@/hooks/app";

type Props = {
  children: React.ReactNode;
};

/**
 *
 * @param param0
 * @returns
 */
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
    if (memoizedValue.state.userLoading >= 1) return;
    async function getUserAsync() {
      setState((s) => ({ ...s, userLoading: 1 }));
      const user = await getUser(createClient());
      console.debug("User", user);
      setState((s) => ({ ...s, user, userLoading: 2 }));
    }
    getUserAsync();
  }, []);

  console.debug(
    "Providers memoizedValue.state",
    memoizedValue.state.userLoading
  );

  return (
    <appContext.Provider value={memoizedValue}>{children}</appContext.Provider>
  );
}
