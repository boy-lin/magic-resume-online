import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropsType {
  className?: string;
  imageAttributes: React.ImgHTMLAttributes<HTMLImageElement>;
}

export default function Base64(props: PropsType) {
  const { className } = props;
  const { src, ...rest } = props.imageAttributes;
  const imgRef = useRef(null);

  const [base64Data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageLoad = () => {
    if (imgRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 设置 canvas 尺寸与图片一致
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;

      // 在 canvas 上绘制图片
      ctx.drawImage(imgRef.current, 0, 0);

      // 将图片转换为 Base64 格式
      const dataURL = canvas.toDataURL("image/png");
      setBase64Data(dataURL);
    }
  };

  const handleError = (err) => {
    setError(`图片加载失败: ${err.message}`);
    setLoading(false);
  };

  const fetchImage = (url) => {
    setLoading(true);
    setError("");
    setBase64Data("");

    // 创建新的 Image 对象
    const img = new Image();
    img.crossOrigin = "anonymous"; // 处理跨域图片
    img.onload = () => {
      imgRef.current = img;
      handleImageLoad();
      setLoading(false);
    };
    img.onerror = handleError;
    img.src = url;
  };

  useEffect(() => {
    fetchImage(src);
  }, [src]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {error ? (
        <span>{error}</span>
      ) : loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <img src={base64Data} {...rest} />
      )}
    </div>
  );
}
