import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";

export const InputName = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="inline-block">
      <input
        name="title"
        ref={inputRef}
        className={cn(
          "bg-transparent focus:outline-dashed pb-1 w-auto min-w-[1ch] max-w-[20ch]"
        )}
        style={{ width: `${Math.max(inputValue.length + 3, 1)}ch` }}
        type="text"
        value={inputValue}
        onChange={handleInput}
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
