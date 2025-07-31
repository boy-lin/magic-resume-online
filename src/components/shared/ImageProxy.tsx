"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageProxy, useImageProxySrc } from "@/hooks/useImageProxy";
import {
  getImageBase64,
  getImageInfo,
  buildImageProxyUrl,
} from "@/utils/imageProxy";
import { toast } from "sonner";

interface ImageProxyDemoProps {
  defaultUrl?: string;
}

const ImageProxyDemo: React.FC<ImageProxyDemoProps> = ({
  defaultUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
}) => {
  const [imageUrl, setImageUrl] = useState(defaultUrl);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [blur, setBlur] = useState(0);
  const [rotate, setRotate] = useState(0);

  // 使用Hook获取base64数据
  const {
    data: base64Data,
    loading: base64Loading,
    error: base64Error,
    load: loadBase64,
  } = useImageProxy({
    url: imageUrl,
    width,
    height,
    quality,
    format,
    blur: blur > 0 ? blur : undefined,
    rotate: rotate > 0 ? rotate : undefined,
    autoLoad: false,
  });

  // 使用Hook获取图片src
  const {
    src,
    loading: srcLoading,
    error: srcError,
  } = useImageProxySrc({
    url: imageUrl,
    width,
    height,
    quality,
    format,
    blur: blur > 0 ? blur : undefined,
    rotate: rotate > 0 ? rotate : undefined,
  });

  // 手动获取详细信息
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const handleGetInfo = async () => {
    setInfoLoading(true);
    try {
      const info = await getImageInfo({
        url: imageUrl,
        width,
        height,
        quality,
        format,
        blur: blur > 0 ? blur : undefined,
        rotate: rotate > 0 ? rotate : undefined,
      });
      setImageInfo(info);
      toast.success("图片信息获取成功");
    } catch (error) {
      toast.error("获取图片信息失败");
      console.error(error);
    } finally {
      setInfoLoading(false);
    }
  };

  const handleCopyBase64 = async () => {
    if (base64Data) {
      try {
        await navigator.clipboard.writeText(base64Data);
        toast.success("Base64数据已复制到剪贴板");
      } catch (error) {
        toast.error("复制失败");
      }
    }
  };

  const handleCopyUrl = async () => {
    const url = buildImageProxyUrl({
      url: imageUrl,
      width,
      height,
      quality,
      format,
      blur: blur > 0 ? blur : undefined,
      rotate: rotate > 0 ? rotate : undefined,
    });

    try {
      await navigator.clipboard.writeText(url);
      toast.success("代理URL已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>图片代理服务演示</CardTitle>
          <CardDescription>
            演示如何使用图片代理服务获取跨域图片的base64数据
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 参数设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">图片URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="输入图片URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">宽度</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                min="1"
                max="2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">高度</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                min="1"
                max="2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quality">质量</Label>
              <Input
                id="quality"
                type="number"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value) || 80)}
                min="1"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">格式</Label>
              <select
                id="format"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as "jpeg" | "png" | "webp")
                }
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blur">模糊</Label>
              <Input
                id="blur"
                type="number"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value) || 0)}
                min="0"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rotate">旋转</Label>
              <Input
                id="rotate"
                type="number"
                value={rotate}
                onChange={(e) => setRotate(parseInt(e.target.value) || 0)}
                min="0"
                max="360"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={loadBase64} disabled={base64Loading}>
              {base64Loading ? "加载中..." : "获取Base64"}
            </Button>
            <Button onClick={handleGetInfo} disabled={infoLoading}>
              {infoLoading ? "获取中..." : "获取信息"}
            </Button>
            <Button onClick={handleCopyBase64} disabled={!base64Data}>
              复制Base64
            </Button>
            <Button onClick={handleCopyUrl} variant="outline">
              复制URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 结果显示 */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">预览</TabsTrigger>
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="info">信息</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>图片预览</CardTitle>
              <CardDescription>使用图片代理服务加载的图片</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 使用Hook的图片 */}
                <div>
                  <h4 className="font-medium mb-2">使用Hook加载的图片</h4>
                  {base64Loading ? (
                    <Skeleton className="w-[300px] h-[200px]" />
                  ) : base64Error ? (
                    <div className="text-red-500">
                      错误: {base64Error.message}
                    </div>
                  ) : base64Data ? (
                    <img
                      src={base64Data}
                      alt="Proxy Image"
                      className="max-w-full h-auto border rounded"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      点击&ldquo;获取Base64&rdquo;按钮加载图片
                    </div>
                  )}
                </div>

                {/* 直接使用URL的图片 */}
                <div>
                  <h4 className="font-medium mb-2">直接使用代理URL的图片</h4>
                  {srcLoading ? (
                    <Skeleton className="w-[300px] h-[200px]" />
                  ) : srcError ? (
                    <div className="text-red-500">错误: {srcError.message}</div>
                  ) : src ? (
                    <img
                      src={src}
                      alt="Proxy Image URL"
                      className="max-w-full h-auto border rounded"
                    />
                  ) : (
                    <div className="text-muted-foreground">正在加载...</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="base64" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Base64数据</CardTitle>
              <CardDescription>图片的base64编码数据</CardDescription>
            </CardHeader>
            <CardContent>
              {base64Loading ? (
                <Skeleton className="w-full h-[200px]" />
              ) : base64Error ? (
                <div className="text-red-500">错误: {base64Error.message}</div>
              ) : base64Data ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">长度: {base64Data.length}</Badge>
                    <Badge variant="outline">格式: {format}</Badge>
                  </div>
                  <textarea
                    value={base64Data}
                    readOnly
                    className="w-full h-[200px] p-2 border rounded text-xs font-mono"
                  />
                </div>
              ) : (
                <div className="text-muted-foreground">
                  点击&ldquo;获取Base64&rdquo;按钮获取数据
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>图片信息</CardTitle>
              <CardDescription>图片的详细信息和元数据</CardDescription>
            </CardHeader>
            <CardContent>
              {infoLoading ? (
                <Skeleton className="w-full h-[200px]" />
              ) : imageInfo ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">格式:</span>{" "}
                      {imageInfo.format}
                    </div>
                    <div>
                      <span className="font-medium">大小:</span>{" "}
                      {imageInfo.size} bytes
                    </div>
                    <div>
                      <span className="font-medium">原始URL:</span>{" "}
                      {imageInfo.originalUrl}
                    </div>
                    <div>
                      <span className="font-medium">已处理:</span>{" "}
                      {imageInfo.processed ? "是" : "否"}
                    </div>
                  </div>
                  <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                    {JSON.stringify(imageInfo, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  点击&ldquo;获取信息&rdquo;按钮获取详细信息
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>代理URL</CardTitle>
              <CardDescription>生成的图片代理服务URL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    参数数量:{" "}
                    {
                      Object.keys({
                        url: imageUrl,
                        width,
                        height,
                        quality,
                        format,
                        blur,
                        rotate,
                      }).length
                    }
                  </Badge>
                </div>
                <textarea
                  value={buildImageProxyUrl({
                    url: imageUrl,
                    width,
                    height,
                    quality,
                    format,
                    blur: blur > 0 ? blur : undefined,
                    rotate: rotate > 0 ? rotate : undefined,
                  })}
                  readOnly
                  className="w-full h-[100px] p-2 border rounded text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageProxyDemo; // Cursor
