import { motion } from "framer-motion";

interface TransitionBottomToTopProps
  extends React.ComponentProps<typeof motion.div> {}

export const TransitionBottomToTop = ({
  children,
  ...props
}: TransitionBottomToTopProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
