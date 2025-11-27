"use client";
import {
  useEffect,
  useState,
  useMemo,
  startTransition,
  useLayoutEffect,
  useRef,
} from "react";
import { getUser } from "@/utils/supabase/queries";
import { initialState, appContext } from "@/hooks/app";
import { useAppStore } from "@/store/useApp";
type Props = {
  children: React.ReactNode;
};

/**
 *
 * @param param0
 * @returns
 */
export function InitDataProvider({ children }: Props) {
  const [state, setState] = useState(initialState);
  const { setUser, setUserLoading } = useAppStore();
  const userRef = useRef(null);

  useLayoutEffect(() => {
    if (userRef.current !== null) return;
    userRef.current = true;

    async function getUserAsync() {
      setUserLoading(1);
      const user = await getUser();
      console.log("user", user);
      setUserLoading(2);
      setUser(user);
    }

    getUserAsync();
  }, []);

  console.debug("aa Providers memoizedValue state", state);

  // if (state.userLoading !== 2)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader2Icon className="animate-spin" />
  //     </div>
  //   );

  return (
    <appContext.Provider
      value={{
        ...state,
        setState,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
