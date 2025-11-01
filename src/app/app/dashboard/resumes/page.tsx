"use client";
import React, { startTransition, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePagination } from "ahooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TransitionOpacity } from "@/components/transition/opacity";
import { TransitionTopToBottom } from "@/components/transition/top-to-bottom";
import { TransitionBottomToTop } from "@/components/transition/bottom-to-top";
import { TransitionB2TScale } from "@/components/transition/b2t-scale";
import { TransitionSpringScale } from "@/components/transition/spring-scale";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PaginationLab from "@/components/ui-lab/pagination";
import useResumeListStore from "@/store/resume/useResumeListStore";

// 简历卡片组件
const ResumeCard: React.FC<{
  id: string;
  resume: any;
  viewMode: "grid" | "list";
  onEdit: (id: string) => void;
  onDelete: (resume: any) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}> = ({ id, resume, viewMode, onEdit, onDelete, onView, onDownload }) => {
  const renderOptions = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={() => onView(id)}>
            <Eye className="mr-2 h-4 w-4" />
            预览
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(id)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDownload(id)}>
            <Download className="mr-2 h-4 w-4" />
            下载
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(resume)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  if (viewMode === "list") {
    return (
      <Card className="group border transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {resume.title || "未命名简历"}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-sm">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
            </div>
            {renderOptions()}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {resume.templateId || "经典模板"}
              </Badge>
              {resume.isPublic && (
                <Badge variant="outline" className="text-xs">
                  公开
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(id)}
                className="text-xs"
              >
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(id)}
                className="text-xs"
              >
                预览
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid 视图
  return (
    <Card
      className={cn(
        "group border transition-all duration-200 h-[280px] flex flex-col relative",
        "hover:border-primary/50 hover:shadow-md",
        "dark:hover:border-primary dark:hover:bg-primary/5"
      )}
    >
      <div className="absolute top-4 right-4 z-10">{renderOptions()}</div>
      <CardContent className="relative flex-1 pt-6 text-center flex flex-col items-center">
        <motion.div
          className="mb-4 p-4 rounded-full bg-primary/10"
          whileHover={{ rotate: 90, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <FileText className="h-8 w-8 text-primary" />
        </motion.div>
        <CardTitle className="text-xl line-clamp-1 mb-2">
          {resume.title || "未命名简历"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
          </div>
        </CardDescription>
        <div className="mt-3 flex items-center justify-center space-x-1">
          <Badge variant="secondary" className="text-xs">
            {resume.templateId || "经典模板"}
          </Badge>
          {resume.isPublic && (
            <Badge variant="outline" className="text-xs">
              公开
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="outline"
            className="w-full text-sm"
            size="sm"
            onClick={() => onEdit(id)}
          >
            编辑
          </Button>
          <Button
            variant="outline"
            className="w-full text-sm"
            size="sm"
            onClick={() => onView(id)}
          >
            预览
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// 创建简历卡片
const CreateResumeCard: React.FC<{
  onClick: () => void;
  viewMode: "grid" | "list";
}> = ({ onClick, viewMode }) => {
  const t = useTranslations();

  if (viewMode === "list") {
    return (
      <Card className="border border-dashed cursor-pointer hover:border-primary/50 transition-all duration-200">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <motion.div
              className="mb-4 p-4 rounded-full bg-primary/10 mx-auto w-fit"
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">创建新简历</h3>
            <p className="text-sm text-muted-foreground">
              选择模板开始创建专业简历
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <Card
        className={cn(
          "relative border border-dashed cursor-pointer h-[280px] transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <CardContent className="flex-1 pt-6 text-center flex flex-col items-center justify-center">
          <motion.div
            className="mb-4 p-4 rounded-full bg-primary/10"
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-8 w-8 text-primary" />
          </motion.div>
          <CardTitle className="text-xl mb-2">创建新简历</CardTitle>
          <CardDescription className="text-sm">
            选择模板开始创建专业简历
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ResumeWorkbench = () => {
  const t = useTranslations();
  const router = useRouter();
  const { deleteResume, getResumeList } = useResumeListStore();
  const { resumes } = useResumeListStore();

  // 状态管理
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterStatus, setFilterStatus] = useState("all");

  const { error, loading, pagination, mutate } = usePagination(getResumeList, {
    defaultPageSize: 12,
    onError: (e) => {
      toast.error(e.message);
    },
  });

  // 过滤和排序简历列表
  const filteredResumes = useMemo(() => {
    let filtered = Object.entries(resumes);

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(
        ([id, resume]) =>
          resume.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resume.templateId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 状态过滤
    if (filterStatus !== "all") {
      filtered = filtered.filter(([id, resume]) => {
        if (filterStatus === "public") return resume.isPublic;
        if (filterStatus === "private") return !resume.isPublic;
        return true;
      });
    }

    // 排序
    filtered.sort(([, a], [, b]) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "updatedAt":
          return (
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [resumes, searchQuery, filterStatus, sortBy]);

  const handleCreateResume = () => {
    router.push("/app/dashboard/templates");
  };

  const handleEdit = (id: string) => {
    startTransition(() => {
      router.push(`/app/workbench/${id}`);
    });
  };

  const handleDelete = (resume: any) => {
    if (confirm("确定要删除这个简历吗？")) {
      deleteResume(resume);
      toast.success("简历已删除");
    }
  };

  const handleView = (id: string) => {
    router.push(`/app/resumes-preview/${id}`);
  };

  const handleDownload = (id: string) => {
    // TODO: 实现下载功能
    toast.info("下载功能开发中...");
  };

  return (
    <TransitionOpacity className="flex-1 space-y-6">
      {/* 页面头部 */}
      <TransitionTopToBottom className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("dashboard.resumes.myResume")}
            </h1>
            <p className="text-muted-foreground mt-1">
              管理您的简历，创建专业的求职材料
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button onClick={handleCreateResume} className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                {t("dashboard.resumes.create")}
              </Button>
            </motion.div>
          </div>
        </div>
      </TransitionTopToBottom>

      {/* 搜索和过滤工具栏 */}
      <TransitionBottomToTop className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索简历..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="public">公开</SelectItem>
                <SelectItem value="private">私有</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">创建时间</SelectItem>
                <SelectItem value="updatedAt">更新时间</SelectItem>
                <SelectItem value="title">标题</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TransitionBottomToTop>

      {/* 简历列表 */}
      <TransitionBottomToTop className="flex-1 w-full p-3 sm:p-6">
        <div
          className={cn(
            "gap-4",
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              : "flex flex-col space-y-4"
          )}
        >
          <AnimatePresence>
            {loading ? (
              // 加载骨架屏
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={cn(
                    "rounded-lg",
                    viewMode === "grid" ? "h-[280px]" : "h-[120px]"
                  )}
                />
              ))
            ) : filteredResumes.length > 0 ? (
              <>
                {/* 创建简历卡片 */}
                <CreateResumeCard
                  onClick={handleCreateResume}
                  viewMode={viewMode}
                />

                {/* 简历列表 */}
                {filteredResumes.map(([id, resume], index) => (
                  <TransitionB2TScale key={id} index={index}>
                    <ResumeCard
                      id={id}
                      resume={resume}
                      viewMode={viewMode}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                      onDownload={handleDownload}
                    />
                  </TransitionB2TScale>
                ))}
              </>
            ) : (
              // 空状态
              <Card className="border col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? "未找到匹配的简历" : "还没有简历"}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchQuery
                      ? "尝试调整搜索条件或筛选器"
                      : "创建您的第一个专业简历"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreateResume}>
                      <Plus className="mr-2 h-4 w-4" />
                      创建简历
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </TransitionBottomToTop>

      {/* 分页 */}
      {filteredResumes.length > 0 && (
        <TransitionBottomToTop>
          <PaginationLab {...pagination} />
        </TransitionBottomToTop>
      )}
    </TransitionOpacity>
  );
};

export default ResumeWorkbench; // Cursor
