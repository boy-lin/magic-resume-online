import { useAppStore } from "@/store/useApp";
import { localGetResumeById } from "@/store/resume/utils.local";

export async function getResumeByIdPrismaApi(id: string) {
  const fetchRemote = async () => {
    const res = await fetch(`/api/resumes/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch resume");
    }

    return res.json();
  };

  const isRemote = Boolean(useAppStore.getState().user?.id);
  const { userLoading } = useAppStore.getState();

  if (isRemote) {
    try {
      return await fetchRemote();
    } catch (error) {
      console.error("Failed to fetch remote resume, fallback local:", error);
    }
  }

  if (userLoading !== 2) {
    try {
      return await fetchRemote();
    } catch {
      // ignore and fallback to local
    }
  }

  const localResume = await localGetResumeById(id);
  if (!localResume) {
    throw new Error("Failed to fetch resume");
  }

  return localResume;
}
