import { FieldType } from "@/types/resume";
import { cn, formatDate } from "@/lib/utils";

export const FieldComponent = ({
  item,
  style,
  className,
}: {
  item: FieldType;
  style?: React.CSSProperties;
  className?: string;
}) => {
  if (item.type === "text") {
    return (
      <div className={cn(className)} style={style}>
        {item.value}
      </div>
    );
  } else if (item.type === "textarea") {
    return (
      <div
        className={cn(className)}
        style={style}
        dangerouslySetInnerHTML={{ __html: item.value }}
      />
    );
  } else if (item.type === "email") {
    return (
      <a
        href={`mailto:${item.value}`}
        className={cn(className, "underline")}
        style={style}
        target="_blank"
      >
        {item.value}
      </a>
    );
  } else if (item.type === "link") {
    return (
      <a
        href={item.value}
        target="_blank"
        className={cn(className, "underline")}
        style={style}
      >
        {item.value}
      </a>
    );
  } else if (item.type === "phone") {
    return (
      <a
        href={`tel:${item.value}`}
        className={cn(className, "underline")}
        style={style}
        target="_blank"
      >
        {item.value}
      </a>
    );
  } else if (item.type === "date") {
    return <span style={style}>{formatDate(new Date(item.value))}</span>;
  }
  return <span style={style}>{item.value}</span>;
};
