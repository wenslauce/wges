"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/dashboard/header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import NavigationMenu from "@/components/dashboard/navigation-menu";
import { motion, AnimatePresence } from "framer-motion";
import { generateMockEnergyData, EnergyData } from "@/lib/data";
import { Zap, Server, Database, Wifi, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Loading steps - wrapped in useMemo to avoid dependency array changes
  const loadingSteps = useMemo(() => [
    { id: 0, text: "Initializing system...", icon: <Server className="h-5 w-5" />, duration: 1500 },
    { id: 1, text: "Connecting to energy grid...", icon: <Wifi className="h-5 w-5" />, duration: 1800 },
    { id: 2, text: "Loading solar data...", icon: <Zap className="h-5 w-5" />, duration: 1600 },
    { id: 3, text: "Syncing database...", icon: <Database className="h-5 w-5" />, duration: 2000 },
    { id: 4, text: "System ready", icon: <CheckCircle2 className="h-5 w-5" />, duration: 1000 }
  ], []);
  
  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Loading sequence
  useEffect(() => {
    if (!isMounted) return;
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const nextStep = loadingSteps[loadingStep];
        const stepDuration = nextStep?.duration || 1500;
        const increment = 100 / (stepDuration / 50); // Update every 50ms
        return Math.min(prev + increment, 100);
      });
    }, 50);
    
    // Step sequence
    const timeout = setTimeout(() => {
      if (loadingStep < loadingSteps.length - 1) {
        setLoadingStep(prev => prev + 1);
        setLoadingProgress(0);
      } else {
        // Final step - complete loading
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }, loadingSteps[loadingStep]?.duration || 1500);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [loadingStep, isMounted, loadingSteps]);
  
  // Set initial theme based on system preference and initialize data
  useEffect(() => {
    try {
      setIsMounted(true);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
      
      // Generate initial energy data
      setEnergyData(generateMockEnergyData());
      
      // Set up interval to update energy data
      const interval = setInterval(() => {
        setEnergyData(generateMockEnergyData());
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error setting theme:', error);
      // Ensure we have a default theme
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Avoid hydration mismatch
  if (!isMounted) {
    return null;
  }
  
  // Loading screen
  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${
        isDarkMode 
          ? 'from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'from-blue-50 via-white to-blue-50 text-gray-900'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md px-8 py-10 rounded-2xl backdrop-blur-md bg-white text-gray-900 border border-white/20 shadow-xl"
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2 relative h-14 w-48">
              <Image 
                src="/WGES-KE-NOR.png" 
                alt="WGES Kenya Norway Logo" 
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Energy Management System</p>
          </div>
          
          <div className="space-y-6">
            {loadingSteps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: loadingStep >= step.id ? 1 : 0.3,
                  y: 0
                }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center"
              >
                <motion.div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    loadingStep > step.id 
                      ? 'bg-green-500/20 text-green-500' 
                      : loadingStep === step.id 
                        ? 'bg-blue-500/20 text-blue-500 animate-pulse' 
                        : 'bg-gray-300/50 text-gray-400'
                  }`}
                >
                  {step.icon}
                </motion.div>
                <span className={`ml-3 text-sm ${
                  loadingStep > step.id 
                    ? 'text-green-600' 
                    : loadingStep === step.id 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-400'
                }`}>
                  {step.text}
                </span>
                {loadingStep === step.id && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    className="ml-auto h-1 bg-blue-500/50 rounded-full"
                    style={{ width: `${loadingProgress}%`, maxWidth: '30%' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${(loadingStep / (loadingSteps.length - 1)) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              {Math.round((loadingStep / (loadingSteps.length - 1)) * 100)}% Complete
            </p>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`mt-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          © 2025 W. Giertsen Energy Solutions
        </motion.p>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen bg-gradient-to-br ${
          isDarkMode 
            ? 'from-gray-900 via-gray-800 to-gray-900 text-white' 
            : 'from-blue-50 via-white to-blue-50 text-gray-900'
        }`}
      >
        <div className="flex h-screen overflow-hidden">
          <NavigationMenu 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
          />
          
          <div className="flex-1 flex flex-col overflow-auto">
            <Header 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
              toggleMenu={toggleMenu}
              isMenuOpen={isMenuOpen}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              data={energyData}
            />
            
            <main className="flex-1 p-2 md:p-3 overflow-auto">
              <div className="container mx-auto">
                <DashboardLayout 
                  toggleTheme={toggleTheme} 
                  isDarkMode={isDarkMode} 
                  activeSection={activeSection}
                  data={energyData}
                />
              </div>
            </main>
            
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="py-2 text-center text-xs text-muted-foreground border-t"
            >
              <p>© 2025 W. Giertsen Energy Solutions. All rights reserved.</p>
              <p className="mt-0.5">Real-time solar monitoring and energy management system</p>
            </motion.footer>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
