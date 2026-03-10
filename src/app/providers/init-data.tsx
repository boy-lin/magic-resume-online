"use client";
import { useState, useEffect, useRef } from "react";
import { getUser } from "@/lib/service/queries";
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

  useEffect(() => {
    if (userRef.current !== null) return;
    userRef.current = true;
    setUserLoading(1);

    async function getUserAsync() {
      try {
        const user = await getUser();
        console.log("user", user);
        if (!user) throw new Error("User not found");
        setUser(user);
        setUserLoading(2);
      } catch (error) {
        setUserLoading(3);
      }
    }

    getUserAsync();
  }, []);

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
