import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Pencil } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <GraduationCap className="w-24 h-24 text-yellow-400" />

            <motion.div
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -right-14 -top-2"
            >
              <BookOpen className="w-12 h-12 text-blue-400" />
            </motion.div>

            <motion.div
              animate={{
                y: [5, -5, 5],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.75,
              }}
              className="absolute -left-10 top-4"
            >
              <Pencil className="w-10 h-10 text-green-400" />
            </motion.div>
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Loading your global opportunities..
        </h2>

        <div className="flex justify-center items-center space-x-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="w-4 h-4 bg-blue-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
