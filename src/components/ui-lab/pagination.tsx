"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
interface PaginationLabProps {
  current: number;
  pageSize: number;
  total: number;
  totalPage: number;
  onChange: (current: number, pageSize: number) => void;
  changeCurrent: (current: number) => void;
  changePageSize: (pageSize: number) => void;
}
const PaginationLab = (props: PaginationLabProps) => {
  const { current = 1, totalPage } = props;
  const onChangeCurrent = props.changeCurrent || (() => {});
  const disabledPrev = current <= 1;
  const disabledNext = current >= totalPage;

  const t = useTranslations("common.pagination");

  return (
    <Pagination>
      <PaginationContent className="gap-4">
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={disabledPrev}
            onClick={() => onChangeCurrent(current - 1)}
            className="cursor-pointer"
          >
            <ArrowLeft />
            <span>{t("prev")}</span>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <span>{current}</span>
          <span>/</span>
          <span className="text-foreground/60">{totalPage}</span>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={disabledNext}
            onClick={() => onChangeCurrent(current + 1)}
            className="cursor-pointer"
          >
            <span>{t("next")}</span>
            <ArrowRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationLab;
