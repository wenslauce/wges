import React from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, AlertCircle } from "lucide-react";

interface SystemHealthProps {
  data: EnergyData;
}

const SystemHealth = ({ data }: SystemHealthProps) => {
  const { panels, inverter, battery, wiring } = data.systemHealth;
  
  // Get status icon based on health status
  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Get status color class based on health status
  const getStatusColorClass = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return "bg-green-500/10 border-green-500/20";
      case 'warning':
        return "bg-yellow-500/10 border-yellow-500/20";
      case 'critical':
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <GlassCard 
      className="h-full"
      title="System Health"
      description="Component status and maintenance alerts"
    >
      <div className="space-y-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColorClass(panels)}`}
        >
          <span className="font-medium">Solar Panels</span>
          {getStatusIcon(panels)}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColorClass(inverter)}`}
        >
          <span className="font-medium">Inverter</span>
          {getStatusIcon(inverter)}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColorClass(battery)}`}
        >
          <span className="font-medium">Battery System</span>
          {getStatusIcon(battery)}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColorClass(wiring)}`}
        >
          <span className="font-medium">Wiring</span>
          {getStatusIcon(wiring)}
        </motion.div>
        
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium">Alerts & Notifications</h4>
          <div className="space-y-2">
            {data.alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 border rounded-lg ${
                  alert.type === 'critical' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : alert.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  {alert.type === 'critical' 
                    ? <XCircle className="w-5 h-5 mt-0.5 text-red-500" />
                    : alert.type === 'warning'
                      ? <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-500" />
                      : <AlertCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  }
                  <div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SystemHealth; 