import { motion } from "framer-motion";

interface TransitionB2TScaleProps
  extends React.ComponentProps<typeof motion.div> {
  index: number;
}

export const TransitionB2TScale = ({
  children,
  index,
  ...props
}: TransitionB2TScaleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
