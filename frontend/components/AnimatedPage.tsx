import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

interface AnimatedRoutesProps {
  children: React.ReactNode;
}

export const AnimatedPage: React.FC<AnimatedRoutesProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
};

export const AnimatedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <React.Fragment key={location.pathname}>
        {children}
      </React.Fragment>
    </AnimatePresence>
  );
};
