export async function getResumeByIdPrismaApi(id: string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resume");
  }

  return res.json();
}

