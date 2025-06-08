import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Button as UiButton,
  ButtonProps as UiButtonProps,
} from "@/components/ui/button";

export interface ButtonProps extends UiButtonProps {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, ...props }, ref) => {
    if (loading) {
      props.disabled = true;
      const children = React.Children.toArray(props.children);
      let index = children.findIndex((child) => {
        return React.isValidElement(child) && child.props.role === "icon";
      });
      if (index !== -1) index = 0;
      // 将 loading 图标插入到 icon 的位置
      props.children = [
        ...children.slice(0, index),
        <Loader2 key="loading" className="animate-spin" />,
        ...children.slice(index + 1),
      ];
    }

    return <UiButton ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
