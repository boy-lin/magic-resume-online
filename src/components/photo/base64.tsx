import * as React from "react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageBase64 } from "@/utils/imageProxy";

interface PropsType {
  className?: string;
  imageAttributes: React.ImgHTMLAttributes<HTMLImageElement>;
}

export default function Base64(props: PropsType) {
  const { className } = props;
  const { src, ...rest } = props.imageAttributes;

  const [base64Data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImage = async (url: string) => {
    try {
      if (!url) {
        setLoading(false);
        setError("");
        setBase64Data("");
        return;
      }

      if (url.startsWith("data:image/")) {
        setLoading(false);
        setError("");
        setBase64Data(url);
        return;
      }

      setLoading(true);
      setError("");
      setBase64Data("");
      const base64 = await getImageBase64({
        url,
      });
      setBase64Data(base64);
    } catch (error) {
      setError(`图片加载失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage(String(src || ""));
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
