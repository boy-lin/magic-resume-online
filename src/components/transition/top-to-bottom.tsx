import { motion } from "framer-motion";

interface TransitionTopToBottomProps
  extends React.ComponentProps<typeof motion.div> {}

export const TransitionTopToBottom = ({
  children,
  ...props
}: TransitionTopToBottomProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
