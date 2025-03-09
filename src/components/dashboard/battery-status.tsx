import React from "react";
import GlassCard from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { Battery, BatteryCharging, Clock } from "lucide-react";

interface BatteryStatusProps {
  data: EnergyData;
}

const BatteryStatus = ({ data }: BatteryStatusProps) => {
  const { level, backupHours, chargeRate, cycleCount, health } = data.batteryStatus;
  
  // Determine battery status color
  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Determine battery icon
  const BatteryIcon = data.gridStatus === "connected" && chargeRate > 0 
    ? BatteryCharging 
    : Battery;

  return (
    <GlassCard 
      className="h-full"
      title="Battery Storage"
      description="Current status and backup capacity"
    >
      <div className="flex flex-col items-center justify-center py-2">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: [0.9, 1, 0.9],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className={`relative flex items-center justify-center w-32 h-32 mb-4 rounded-full ${getBatteryColor(level)} bg-opacity-10`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.1"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${level * 2.83}, 283`}
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="z-10 flex flex-col items-center">
            <BatteryIcon className="w-8 h-8" />
            <span className="text-2xl font-bold">{level}%</span>
          </div>
        </motion.div>
        
        <div className="grid w-full grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Backup Time</span>
            </div>
            <span className="text-xl font-semibold">{backupHours} hrs</span>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 mb-1">
              <BatteryCharging className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Charge Rate</span>
            </div>
            <span className="text-xl font-semibold">{chargeRate} kW</span>
          </div>
        </div>
        
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Battery Health</span>
            <span className="text-sm font-medium">{health}%</span>
          </div>
          <Progress value={health} className="h-2" />
        </div>
        
        <div className="w-full mt-4 text-sm text-center text-muted-foreground">
          <p>Cycle Count: {cycleCount}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default BatteryStatus; 