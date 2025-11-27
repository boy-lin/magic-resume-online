export async function publicResumeByIdApi(id: string, isPublic: boolean) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ isPublic }),
  });

  if (!res.ok) {
    throw new Error("Failed to update resume public state");
  }

  return res.json();
}

export async function setPublicResumeByIdApi(id: string, publicPassword: string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ publicPassword }),
  });

  if (!res.ok) {
    throw new Error("Failed to update resume password");
  }

  return res.json();
}

