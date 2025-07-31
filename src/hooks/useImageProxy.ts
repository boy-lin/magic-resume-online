import { useState, useEffect, useCallback } from "react";
import {
  getImageBase64,
  getImageInfo,
  getImageBlob,
  buildImageProxyUrl,
  type ImageProxyOptions,
  type ImageProxyResponse,
} from "@/utils/imageProxy";

interface UseImageProxyOptions extends Omit<ImageProxyOptions, "output"> {
  autoLoad?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseImageProxyReturn {
  data: string | null;
  info: ImageProxyResponse | null;
  blob: Blob | null;
  loading: boolean;
  error: Error | null;
  url: string;
  load: () => Promise<void>;
  loadBase64: () => Promise<void>;
  loadInfo: () => Promise<void>;
  loadBlob: () => Promise<void>;
  reset: () => void;
}

/**
 * 图片代理React Hook
 * 提供便捷的API来在React组件中使用图片代理服务
 */
export function useImageProxy(
  options: UseImageProxyOptions
): UseImageProxyReturn {
  const [data, setData] = useState<string | null>(null);
  const [info, setInfo] = useState<ImageProxyResponse | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { autoLoad = false, onSuccess, onError, ...proxyOptions } = options;
  const url = buildImageProxyUrl(proxyOptions);

  // 重置状态
  const reset = useCallback(() => {
    setData(null);
    setInfo(null);
    setBlob(null);
    setLoading(false);
    setError(null);
  }, []);

  // 加载base64数据
  const loadBase64 = useCallback(async () => {
    if (!proxyOptions.url) return;

    setLoading(true);
    setError(null);

    try {
      const base64Data = await getImageBase64(proxyOptions);
      setData(base64Data);
      onSuccess?.(base64Data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [proxyOptions, onSuccess, onError]);

  // 加载详细信息
  const loadInfo = useCallback(async () => {
    if (!proxyOptions.url) return;

    setLoading(true);
    setError(null);

    try {
      const imageInfo = await getImageInfo(proxyOptions);
      setInfo(imageInfo);
      onSuccess?.(imageInfo);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [proxyOptions, onSuccess, onError]);

  // 加载blob数据
  const loadBlob = useCallback(async () => {
    if (!proxyOptions.url) return;

    setLoading(true);
    setError(null);

    try {
      const blobData = await getImageBlob(proxyOptions);
      setBlob(blobData);
      onSuccess?.(blobData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [proxyOptions, onSuccess, onError]);

  // 通用加载方法（默认加载base64）
  const load = useCallback(async () => {
    await loadBase64();
  }, [loadBase64]);

  // 自动加载
  useEffect(() => {
    if (autoLoad && proxyOptions.url) {
      load();
    }
  }, [autoLoad, proxyOptions.url, load]);

  return {
    data,
    info,
    blob,
    loading,
    error,
    url,
    load,
    loadBase64,
    loadInfo,
    loadBlob,
    reset,
  };
}

/**
 * 图片组件Hook
 * 专门用于在img标签中使用
 */
export function useImageProxySrc(options: Omit<ImageProxyOptions, "output">) {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadImage = useCallback(async () => {
    if (!options.url) return;

    setLoading(true);
    setError(null);

    try {
      const imageUrl = buildImageProxyUrl(options);
      setSrc(imageUrl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return {
    src,
    loading,
    error,
    reload: loadImage,
  };
}

/**
 * 批量图片代理Hook
 */
export function useBatchImageProxy(optionsList: UseImageProxyOptions[]) {
  const [results, setResults] = useState<
    Array<{
      data: string | null;
      info: ImageProxyResponse | null;
      blob: Blob | null;
      loading: boolean;
      error: Error | null;
      url: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);

    const promises = optionsList.map(async (options, index) => {
      const { autoLoad, onSuccess, onError, ...proxyOptions } = options;
      const url = buildImageProxyUrl(proxyOptions);

      try {
        const base64Data = await getImageBase64(proxyOptions);
        return {
          data: base64Data,
          info: null,
          blob: null,
          loading: false,
          error: null,
          url,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        return {
          data: null,
          info: null,
          blob: null,
          loading: false,
          error,
          url,
        };
      }
    });

    const results = await Promise.all(promises);
    setResults(results);
    setLoading(false);
  }, [optionsList]);

  useEffect(() => {
    if (optionsList.length > 0) {
      loadAll();
    }
  }, [loadAll]);

  return {
    results,
    loading,
    reload: loadAll,
  };
}

/**
 * 使用示例：
 *
 * // 1. 基本使用
 * function MyComponent() {
 *   const { data, loading, error, load } = useImageProxy({
 *     url: "https://example.com/image.jpg",
 *     width: 300,
 *     height: 200,
 *     autoLoad: true
 *   });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (data) return <img src={data} alt="Image" />;
 *
 *   return <button onClick={load}>Load Image</button>;
 * }
 *
 * // 2. 图片组件使用
 * function ImageComponent() {
 *   const { src, loading, error } = useImageProxySrc({
 *     url: "https://example.com/image.jpg",
 *     width: 300,
 *     height: 200
 *   });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <img src={src} alt="Image" />;
 * }
 *
 * // 3. 批量加载
 * function BatchImageComponent() {
 *   const { results, loading } = useBatchImageProxy([
 *     { url: "https://example.com/image1.jpg", width: 300, height: 200 },
 *     { url: "https://example.com/image2.jpg", width: 300, height: 200 },
 *     { url: "https://example.com/image3.jpg", width: 300, height: 200 }
 *   ]);
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       {results.map((result, index) => (
 *         <img key={index} src={result.data || result.url} alt={`Image ${index}`} />
 *       ))}
 *     </div>
 *   );
 * }
 */
