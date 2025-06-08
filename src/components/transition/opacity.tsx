import { motion } from "framer-motion";

interface TransitionOpacityProps
  extends React.ComponentProps<typeof motion.div> {}

export const TransitionOpacity = ({
  children,
  ...props
}: TransitionOpacityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
