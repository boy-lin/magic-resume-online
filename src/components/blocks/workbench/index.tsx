"use client";

import { useRequest } from "ahooks";
import { useParams } from "next/navigation";

import { useResumeStore } from "@/store/useResumeStore";
import SkeletonCard from "@/components/ui-lab/skeleton-card";

import Editor from "./editor";
import { toast } from "sonner";
import ShowError from "@/components/error/show";

export function Workbench() {
  const { getResumeFullById } = useResumeStore();
  const activeResumeId = useResumeStore().activeResumeId;
  const paramId = String(useParams().id);

  const { error, loading } = useRequest(() => getResumeFullById(paramId), {
    onError: (e) => {
      toast.error(e.message);
    },
  });

  if (error) return <ShowError error={error} />;

  if (loading || !activeResumeId) {
    return <SkeletonCard />;
  }

  return <Editor />;
}
