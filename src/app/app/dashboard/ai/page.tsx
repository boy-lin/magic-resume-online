"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DeepSeekLogo from "@/components/icon/IconDeepseek";
import IconDoubao from "@/components/icon/IconDoubao";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AISettingsPage = () => {
  const {
    doubaoApiKey,
    doubaoModelId,
    deepseekApiKey,
    setDoubaoApiKey,
    setDoubaoModelId,
    setDeepseekApiKey,
    selectedModel,
    setSelectedModel,
  } = useAIConfigStore();

  const [currentModel, setCurrentModel] = useState("");
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel]);

  const t = useTranslations();

  const handleApiKeyChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "doubao" | "deepseek"
  ) => {
    const newApiKey = e.target.value;
    if (type === "doubao") {
      setDoubaoApiKey(newApiKey);
    } else {
      setDeepseekApiKey(newApiKey);
    }
  };

  const handleModelIdChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "doubao" | "deepseek"
  ) => {
    const newModelId = e.target.value;
    if (type === "doubao") {
      setDoubaoModelId(newModelId);
    }
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("复制失败");
    }
  };

  const models = [
    {
      id: "deepseek",
      name: t("dashboard.settings.ai.deepseek.title"),
      description: t("dashboard.settings.ai.deepseek.description"),
      icon: DeepSeekLogo,
      link: "https://platform.deepseek.com",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-200 dark:border-purple-800",
      isConfigured: !!deepseekApiKey,
      apiKey: deepseekApiKey,
      modelId: null,
    },
    {
      id: "doubao",
      name: t("dashboard.settings.ai.doubao.title"),
      description: t("dashboard.settings.ai.doubao.description"),
      icon: IconDoubao,
      link: "https://console.volcengine.com/ark",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      isConfigured: !!(doubaoApiKey && doubaoModelId),
      apiKey: doubaoApiKey,
      modelId: doubaoModelId,
    },
  ];

  const currentModelData = models.find((model) => model.id === currentModel);

  return (
    <div className="mx-auto py-6 px-4 max-w-6xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI 服务配置</h1>
        <p className="text-muted-foreground mt-2">
          配置您的AI服务提供商，用于简历优化和智能建议
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧面板 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 当前模型选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">当前模型</CardTitle>
              <CardDescription>选择要使用的AI模型</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.settings.ai.selectModel")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <model.icon className={cn("h-4 w-4", model.color)} />
                        <span>{model.name}</span>
                        {model.isConfigured && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 模型列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">配置模型</CardTitle>
              <CardDescription>配置各个AI服务提供商的参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {models.map((model) => {
                  const Icon = model.icon;
                  const isActive = currentModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setCurrentModel(model.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left relative",
                        "transition-all duration-200",
                        "hover:bg-accent/50",
                        isActive && "bg-accent border-2 border-primary/20",
                        !isActive && "border border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-medium text-sm truncate",
                              isActive && "text-primary"
                            )}
                          >
                            {model.name}
                          </span>
                          {model.isConfigured && (
                            <Badge variant="secondary" className="text-xs">
                              已配置
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {model.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="w-full justify-start"
              >
                {showApiKeys ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showApiKeys ? "隐藏" : "显示"} API密钥
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // 重置所有配置
                  setDoubaoApiKey("");
                  setDoubaoModelId("");
                  setDeepseekApiKey("");
                  toast.success("已重置所有配置");
                }}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                重置所有配置
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧配置面板 */}
        <div className="lg:col-span-2">
          {currentModelData ? (
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("shrink-0", currentModelData.color)}>
                    <currentModelData.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {currentModelData.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {currentModelData.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentModelData.isConfigured ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已配置
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        未配置
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 配置状态提示 */}
                {!currentModelData.isConfigured && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      请配置 {currentModelData.name} 的API密钥以启用AI功能。
                      <a
                        href={currentModelData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        获取API密钥
                      </a>
                    </AlertDescription>
                  </Alert>
                )}

                {/* API密钥配置 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      {t(`dashboard.settings.ai.${currentModelData.id}.apiKey`)}
                    </Label>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(
                                  currentModelData.apiKey || "",
                                  `${currentModelData.id}-apiKey`
                                )
                              }
                              disabled={!currentModelData.apiKey}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedField === `${currentModelData.id}-apiKey`
                              ? "已复制"
                              : "复制API密钥"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <a
                        href={currentModelData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        {t("dashboard.settings.ai.getApiKey")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={currentModelData.apiKey || ""}
                      onChange={(e) =>
                        handleApiKeyChange(
                          e,
                          currentModelData.id as "doubao" | "deepseek"
                        )
                      }
                      type={showApiKeys ? "text" : "password"}
                      placeholder={t(
                        `dashboard.settings.ai.${currentModelData.id}.apiKey`
                      )}
                      className={cn(
                        "h-11 pr-20",
                        "bg-background",
                        "border-border",
                        "focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    >
                      {showApiKeys ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* 豆包模型ID配置 */}
                {currentModelData.id === "doubao" && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          {t("dashboard.settings.ai.doubao.modelId")}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopyToClipboard(
                                    currentModelData.modelId || "",
                                    `${currentModelData.id}-modelId`
                                  )
                                }
                                disabled={!currentModelData.modelId}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedField === `${currentModelData.id}-modelId`
                                ? "已复制"
                                : "复制模型ID"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        value={currentModelData.modelId || ""}
                        onChange={(e) => handleModelIdChange(e, "doubao")}
                        placeholder={t("dashboard.settings.ai.doubao.modelId")}
                        className={cn(
                          "h-11",
                          "bg-background",
                          "border-border",
                          "focus:ring-2 focus:ring-primary/20"
                        )}
                      />
                    </div>
                  </>
                )}

                {/* 配置说明 */}
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">配置说明</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• API密钥用于访问AI服务，请妥善保管</p>
                    <p>• 配置完成后，AI功能将自动启用</p>
                    <p>• 支持简历优化、语法检查等智能功能</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">请选择模型</h3>
                  <p className="text-muted-foreground">
                    从左侧选择一个AI模型进行配置
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettingsPage;
