import { motion } from "framer-motion";

interface TransitionLeftToRightProps
  extends React.ComponentProps<typeof motion.div> {}

export const TransitionLeftToRight = ({
  children,
  ...props
}: TransitionLeftToRightProps) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      // exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
