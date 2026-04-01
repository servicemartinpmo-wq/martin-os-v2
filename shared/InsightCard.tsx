import { motion } from "motion/react";

export const InsightCard = ({ type, situation, diagnosis, recommendation, priority }: {
  type: string;
  situation: string;
  diagnosis: string;
  recommendation: string;
  priority: number;
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-laminated relative overflow-hidden"
      style={{ borderLeft: `4px solid ${priority > 80 ? '#EF4444' : '#10B981'}` }}
    >
      {/* Chrome Texture Overlay */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold tracking-widest text-navy-900 uppercase">{type}</span>
        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
          <span className="text-[10px] font-bold">{priority}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{situation}</h3>
      <p className="text-sm text-gray-600 mb-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100 italic">
        "Diagnosis: {diagnosis}"
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          <p className="text-sm font-medium text-gray-800">{recommendation}</p>
        </div>
      </div>
      
      {/* Rim Lighting Effect */}
      <div className="absolute bottom-0 right-0 h-16 w-16 bg-teal-400/5 blur-2xl rounded-full" />
    </motion.div>
  );
};
