"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";

const ResumesList = () => {
  return <ResumeWorkbench />;
};

const ResumeWorkbench = () => {
  const t = useTranslations();
  const {
    resumes,
    setActiveResume,
    deleteResume,
    createResume,
    updateResumeList,
  } = useResumeStore();
  const router = useRouter();

  useEffect(() => {
    updateResumeList();
  }, []);

  const handleCreateResume = async () => {
    const newId = await createResume(null);
    setActiveResume(newId);
  };

  console.debug("resumes:", resumes);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 space-y-6"
    >
      <motion.div
        className="px-4 sm:px-6 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t("dashboard.resumes.myResume")}
        </h1>
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleCreateResume}
              variant="default"
              className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("dashboard.resumes.create")}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 w-full p-3 sm:p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={handleCreateResume}
          >
            <Card
              className={cn(
                "relative border border-dashed cursor-pointer h-[260px] transition-all duration-200",
                "hover:border-gray-400 hover:bg-gray-50",
                "dark:hover:border-primary dark:hover:bg-primary/10"
              )}
            >
              <CardContent className="flex-1 pt-6 text-center flex flex-col items-center justify-center">
                <motion.div
                  className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-primary/10"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-8 w-8 text-gray-600 dark:text-primary" />
                </motion.div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  {t("dashboard.resumes.newResume")}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                  {t("dashboard.resumes.newResumeDescription")}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {Object.entries(resumes).map(([id, resume], index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "group border transition-all duration-200 h-[260px] flex flex-col",
                    "hover:border-gray-400 hover:bg-gray-50",
                    "dark:hover:border-primary dark:hover:bg-primary/10"
                  )}
                >
                  <CardContent className="relative flex-1 pt-6 text-center flex flex-col items-center">
                    <motion.div
                      className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-primary/10"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText className="h-8 w-8 text-gray-600 dark:text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl line-clamp-1 text-gray-900 dark:text-gray-100">
                      {resume.title || "未命名简历"}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {t("dashboard.resumes.created")}
                      <span className="ml-2">
                        {new Date(resume.createdAt).toLocaleDateString()}
                        {/* {dayjs(resume.createdAt, "MM-DD-YYYY")} */}
                      </span>
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-sm hover:bg-gray-100 dark:border-primary/50 dark:hover:bg-primary/10"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveResume(id);
                            router.push(`/app/workbench/${id}`);
                          }}
                        >
                          {t("common.edit")}
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(resume);
                          }}
                        >
                          {t("common.delete")}
                        </Button>
                      </motion.div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumesList;
