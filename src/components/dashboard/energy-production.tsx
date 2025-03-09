import React from "react";
import GlassCard from "@/components/ui/glass-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";

interface EnergyProductionProps {
  data: EnergyData;
}

const EnergyProduction = ({ data }: EnergyProductionProps) => {
  return (
    <GlassCard 
      className="col-span-2 h-full"
      title="Solar Energy Production"
      description="Real-time energy generation and daily overview"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.1, 0.8],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="p-3 rounded-full bg-yellow-400/20 text-yellow-500"
            >
              <Sun size={24} />
            </motion.div>
            <div>
              <h3 className="text-3xl font-bold">{data.currentProduction} kW</h3>
              <p className="text-sm text-muted-foreground">Current Production</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-semibold">{data.totalProduction.today} kWh</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">{data.totalProduction.thisMonth} kWh</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">{data.totalProduction.thisYear} kWh</p>
              <p className="text-xs text-muted-foreground">This Year</p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={data.hourlyProduction}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(hour) => `${hour}:00`}
                stroke="#888"
                fontSize={12}
              />
              <YAxis 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `${value}kW`}
              />
              <Tooltip 
                formatter={(value) => [`${value} kW`, 'Production']}
                labelFormatter={(hour) => `${hour}:00`}
              />
              <defs>
                <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB13B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFB13B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="production" 
                stroke="#FFB13B" 
                fillOpacity={1}
                fill="url(#colorProduction)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Weather Impact: {data.weatherImpact.sunlightHours} hours of sunlight, {data.weatherImpact.cloudCover}% cloud cover</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default EnergyProduction; 