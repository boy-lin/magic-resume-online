"use client";

import { useRequest } from "ahooks";
import { useParams } from "next/navigation";

import { useResumeStore } from "@/store/resume/useResumeStore";
import SkeletonCard from "@/components/ui-lab/skeleton-card";
import { shallow } from "zustand/shallow";

import Editor from "./editor";
import { toast } from "sonner";
import ShowError from "@/components/error/show";

export function Workbench() {
  const { getResumeFullById } = useResumeStore(
    (state) => ({
      getResumeFullById: state.getResumeFullById,
    }),
    shallow,
  );
  const params = useParams<{ id?: string | string[] }>();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { error, loading } = useRequest(() => getResumeFullById(paramId!), {
    ready: Boolean(paramId),
    refreshDeps: [paramId],
    onError: (e) => {
      toast.error(e.message);
    },
  });

  if (!paramId) return <ShowError error={new Error("Missing resume id")} />;

  if (error) return <ShowError error={error} />;

  if (loading) {
    return <SkeletonCard />;
  }

  return <Editor />;
}
