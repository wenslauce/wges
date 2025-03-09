import React, { useState, useEffect, useCallback } from "react";
import EnergyProduction from "./energy-production";
import BatteryStatus from "./battery-status";
import EnergyConsumption from "./energy-consumption";
import GridStatus from "./grid-status";
import RemoteControls from "./remote-controls";
import UserSettings from "./user-settings";
import WeatherForecast from "./weather-forecast";
import { generateMockEnergyData, getUpdatedData, EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import AlertsNotifications from "./alerts-notifications";

interface DashboardLayoutProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeSection: string;
  data?: EnergyData | null;
}

const DashboardLayout = ({ isDarkMode, toggleTheme, activeSection, data: externalData }: DashboardLayoutProps) => {
  const [data, setData] = useState<EnergyData>(externalData || generateMockEnergyData());
  const [updateInterval, setUpdateInterval] = useState<number>(5000); // 5 seconds default
  
  // Generate synchronized data
  const generateSynchronizedData = useCallback(() => {
    return generateMockEnergyData();
  }, []);
  
  // Update data with synchronized changes
  const updateData = useCallback(() => {
    setData(() => {
      // If external data is provided, use it
      if (externalData) {
        return externalData;
      }
      
      // Every 5 minutes (approximately), generate completely new data
      if (Math.random() < 0.03) {
        return generateSynchronizedData();
      }
      
      // Otherwise update existing data while maintaining synchronization
      return getUpdatedData();
    });
  }, [externalData, generateSynchronizedData]);
  
  // Update data when external data changes
  useEffect(() => {
    if (externalData) {
      setData(externalData);
    }
  }, [externalData]);
  
  // Simulate real-time data updates only if no external data is provided
  useEffect(() => {
    // If external data is provided, don't set up internal updates
    if (externalData) {
      return;
    }
    
    // Update data immediately on component mount
    setData(generateSynchronizedData());
    
    // Set up interval for regular updates
    const interval = setInterval(updateData, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval, updateData, generateSynchronizedData, externalData]);
  
  // Regenerate data when changing sections for a more dynamic feel
  useEffect(() => {
    setData(generateSynchronizedData());
  }, [activeSection, generateSynchronizedData]);
  
  // Adjust update frequency based on active section
  useEffect(() => {
    // More frequent updates for overview and production sections
    if (activeSection === 'overview' || activeSection === 'production') {
      setUpdateInterval(3000); // 3 seconds
    } else if (activeSection === 'battery' || activeSection === 'consumption') {
      setUpdateInterval(4000); // 4 seconds
    } else {
      setUpdateInterval(5000); // 5 seconds
    }
  }, [activeSection]);
  
  // Render different sections based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-3">
            {/* System Synchronization Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/5 border border-green-500/20 mb-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <h3 className="text-sm font-medium">System Status: Synchronized</h3>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Production: {data.currentProduction} kW</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Consumption: {data.consumption.current} kW</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Battery: {data.batteryStatus.level}%</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Grid: {data.gridStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {/* Main Overview Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="col-span-full xl:col-span-2 order-1"
              >
                <EnergyProduction data={data} />
              </motion.div>
              
              {/* Battery and Grid Status */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="col-span-1 order-2"
              >
                <BatteryStatus data={data} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="col-span-1 order-3"
              >
                <GridStatus data={data} />
              </motion.div>
              
              {/* Alerts and Remote Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="col-span-1 order-5 md:order-4"
              >
                <AlertsNotifications data={data} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="col-span-1 order-6 md:order-5"
              >
                <RemoteControls />
              </motion.div>
              
              {/* Energy Consumption */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="col-span-full xl:col-span-2 order-4 md:order-6"
              >
                <EnergyConsumption data={data} />
              </motion.div>
            </div>
          </div>
        );
      
      case 'production':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EnergyProduction data={data} />
          </motion.div>
        );
      
      case 'battery':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <BatteryStatus data={data} />
          </motion.div>
        );
      
      case 'consumption':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EnergyConsumption data={data} />
          </motion.div>
        );
      
      case 'weather':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WeatherForecast systemCapacityKW={10.5} />
          </motion.div>
        );
      
      case 'alerts':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertsNotifications data={data} />
          </motion.div>
        );
      
      case 'settings':
        return (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <UserSettings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </motion.div>
        );
      
      default:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {/* Main Overview Section */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="col-span-full xl:col-span-2 order-1"
              >
                <EnergyProduction data={data} />
              </motion.div>
              
              {/* Battery and Grid Status */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="col-span-1 order-2"
              >
                <BatteryStatus data={data} />
              </motion.div>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="col-span-1 order-3"
              >
                <GridStatus data={data} />
              </motion.div>
              
              {/* Alerts and Remote Controls */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="col-span-1 order-5 md:order-4"
              >
                <AlertsNotifications data={data} />
              </motion.div>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="col-span-1 order-6 md:order-5"
              >
                <RemoteControls />
              </motion.div>
              
              {/* Energy Consumption */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="col-span-full xl:col-span-2 order-4 md:order-6"
              >
                <EnergyConsumption data={data} />
              </motion.div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-3">
      {renderSection()}
    </div>
  );
};

export default DashboardLayout; 