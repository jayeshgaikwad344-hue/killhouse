import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SpeederLoader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="speeder-container"
        >
          <div className="loader-speeder">
            <span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <div className="speeder-base">
              <span></span>
              <div className="speeder-face"></div>
            </div>
          </div>
          <div className="longfazers">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeederLoader;
