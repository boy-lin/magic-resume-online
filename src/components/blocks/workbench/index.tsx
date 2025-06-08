"use client";

import { useEffect } from "react";
import { useRequest } from "ahooks";
import { useParams } from "next/navigation";

import { useResumeStore } from "@/store/useResumeStore";
import SkeletonCard from "@/components/ui-lab/skeleton-card";

import Editor from "./editor";

export function Workbench() {
  const { getResumeFullById } = useResumeStore();
  const activeResumeId = useResumeStore().activeResumeId;
  const paramId = String(useParams().id);

  const { error, loading } = useRequest(() => getResumeFullById(paramId), {});

  if (loading || !activeResumeId) {
    return <SkeletonCard />;
  }

  return <Editor />;
}
