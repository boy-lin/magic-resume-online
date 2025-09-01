import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRef } from "react";

export const InputName = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };
  return (
    <div className="inline-block">
      <input
        name="title"
        ref={inputRef}
        className={cn("flex-1 bg-transparent focus:outline-dashed pb-1")}
        type="text"
        defaultValue={value}
        onBlur={handleBlur}
      />

      <Pencil
        size={16}
        className="text-primary"
        onClick={() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }}
      />
    </div>
  );
};
