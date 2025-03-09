import React from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { Zap, ZapOff, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface GridStatusProps {
  data: EnergyData;
}

const GridStatus = ({ data }: GridStatusProps) => {
  const isConnected = data.gridStatus === "connected";
  const isExportingToGrid = isConnected && data.currentProduction > data.consumption.current;
  
  return (
    <GlassCard 
      className="h-full"
      title="Grid Status"
      description="Connection to the national grid"
    >
      <div className="flex flex-col items-center justify-center h-full py-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1.1, 0.8],
            rotate: isConnected ? [0, 5, 0, -5, 0] : 0
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className={`p-6 rounded-full ${
            isConnected ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
          }`}
        >
          {isConnected ? <Zap size={32} /> : <ZapOff size={32} />}
        </motion.div>
        
        <h3 className="mt-4 text-xl font-bold">
          {isConnected ? "Connected" : "Disconnected"}
        </h3>
        
        {isConnected && (
          <div className="flex flex-col items-center mt-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
              {isExportingToGrid ? (
                <>
                  <ArrowUpFromLine className="w-5 h-5 text-green-400" />
                  <span>Exporting to Grid</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-5 h-5 text-blue-400" />
                  <span>Importing from Grid</span>
                </>
              )}
            </div>
            
            <p className="mt-4 text-sm text-center text-muted-foreground">
              {isExportingToGrid 
                ? `Exporting ${(data.currentProduction - data.consumption.current).toFixed(1)} kW to the grid` 
                : `Drawing ${(data.consumption.current - data.currentProduction).toFixed(1)} kW from the grid`}
            </p>
          </div>
        )}
        
        {!isConnected && (
          <div className="p-3 mt-6 text-sm text-center rounded-lg bg-yellow-500/10 text-yellow-500">
            <p>System is running on battery power</p>
            <p className="mt-1 text-muted-foreground">
              Estimated backup time: {data.batteryStatus.backupHours} hours
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default GridStatus; 