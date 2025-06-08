import { motion } from "framer-motion";

interface TransitionSpringScaleProps
  extends React.ComponentProps<typeof motion.div> {}

export const TransitionSpringScale = ({
  children,
  ...props
}: TransitionSpringScaleProps) => {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
