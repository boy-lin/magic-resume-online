import { ResumeData } from "@/types/resume";

export type ResumeListItemDTO = {
  id: string;
  title: string;
  created_at: string | Date;
  updated_at?: string | Date;
  template_id: string | null;
  is_public?: boolean;
};

export type ResumeListResponseDTO = {
  data: ResumeListItemDTO[];
  count: number;
};

export async function getResumesByUserIdPrisma(params: {
  current: number;
  pageSize: number;
}) {
  const searchParams = new URLSearchParams({
    current: String(params.current),
    pageSize: String(params.pageSize),
  });

  const res = await fetch(`/api/resumes?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resumes");
  }

  return res.json() as Promise<ResumeListResponseDTO>;
}

export async function upsertResumeByIdApi(resume: ResumeData) {
  const res = await fetch(`/api/resumes/${resume.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id: resume.id,
      title: resume.title,
      templateId: resume.templateId,
      globalSettings: resume.globalSettings,
      menuSections: resume.menuSections,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to upsert resume");
  }

  return res.json() as Promise<ResumeData>;
}

export async function deleteResumeByIdApi(id: string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete resume");
  }

  return res.json();
}

export async function getResumeByIdPrismaApi(id: string) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resume");
  }

  return res.json() as Promise<ResumeData>;
}
