import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageBase64 } from "@/utils/imageProxy";

interface PropsType {
  style?: React.CSSProperties;
  className?: string;
  imageAttributes: React.ImgHTMLAttributes<HTMLImageElement>;
}

// 占位图组件
const PlaceholderImage = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      <ImageIcon className="h-1/3 w-1/3 opacity-50" />
    </div>
  );
};

export default function Base64(props: PropsType) {
  const { className } = props;
  const { src, alt, width, height, style, ...rest } = props.imageAttributes;
  const imgRef = useRef<HTMLImageElement>(null);

  const [base64Data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchImage = async (url: string) => {
    try {
      setLoading(true);
      setError(false);
      setBase64Data("");
      const base64 = await getImageBase64({
        url,
      });
      setBase64Data(base64);
    } catch (error) {
      console.error("图片加载失败:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (src) {
      fetchImage(src);
    }
  }, [src]);

  // 获取图片尺寸样式
  const imageStyle: React.CSSProperties = {
    ...style,
    ...(width && { width }),
    ...(height && { height }),
  };

  const containerStyle: React.CSSProperties = {
    ...props.style,
    ...(width && { width }),
    ...(height && { height }),
    minWidth: width || "auto",
    minHeight: height || "auto",
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={containerStyle}
    >
      {error ? (
        <PlaceholderImage
          className={cn("w-full h-full", className)}
          style={imageStyle}
          role="img"
          aria-label={alt || "图片加载失败"}
        />
      ) : loading ? (
        <div
          className="flex items-center justify-center bg-muted"
          style={imageStyle}
        >
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : base64Data ? (
        <img
          ref={imgRef}
          src={base64Data}
          alt={alt}
          style={imageStyle}
          width={width}
          height={height}
          onError={() => {
            setError(true);
          }}
          {...rest}
        />
      ) : (
        <PlaceholderImage
          className={cn("w-full h-full", className)}
          style={imageStyle}
          role="img"
          aria-label={alt || "图片占位符"}
        />
      )}
    </div>
  );
}
