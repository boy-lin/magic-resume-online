import { Reorder } from "framer-motion";

/**
 * 自定义 Reorder 组件
 * 统一动画设置，便于全局管理
 */
export const CustomReorder = {
  Group: ({ children, ...props }: any) => (
    <Reorder.Group
      {...props}
      layout={false}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </Reorder.Group>
  ),

  Item: ({ children, ...props }: any) => (
    <Reorder.Item
      {...props}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
      }}
    >
      {children}
    </Reorder.Item>
  ),
};

export default CustomReorder;
