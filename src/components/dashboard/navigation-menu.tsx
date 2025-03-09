import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Zap, 
  Battery, 
  BarChart3, 
  Cloud, 
  Settings, 
  Bell, 
  X, 
  ChevronRight,
  Sun,
  Moon,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/lib/location-service";
import Image from "next/image";

interface NavigationMenuProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const NavigationMenu = ({ 
  isDarkMode, 
  toggleTheme, 
  activeSection, 
  setActiveSection,
  isMenuOpen,
  toggleMenu
}: NavigationMenuProps) => {
  const { location } = useUserLocation();
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
    { id: 'production', label: 'Energy Production', icon: <Zap size={16} /> },
    { id: 'battery', label: 'Battery Storage', icon: <Battery size={16} /> },
    { id: 'consumption', label: 'Energy Consumption', icon: <BarChart3 size={16} /> },
    { id: 'weather', label: 'Weather & Forecast', icon: <Cloud size={16} /> },
    { id: 'alerts', label: 'Alerts & Notifications', icon: <Bell size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];
  
  // Scroll to top when changing sections
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);
  
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}
      
      {/* Navigation Menu */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: isMenuOpen ? 0 : (window.innerWidth < 1024 ? -100 : 0), 
          opacity: isMenuOpen ? 1 : (window.innerWidth < 1024 ? 0 : 1) 
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 w-56 bg-background/90 backdrop-blur-md border-r p-2",
          "flex flex-col",
          "lg:sticky lg:translate-x-0 lg:opacity-100 lg:top-0 lg:h-screen",
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-3 mt-1 px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-purple-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <div className="bg-white dark:bg-white rounded-md px-2 py-0.5 shadow-sm border border-gray-100 relative w-24 h-5">
              <Image 
                src="/WGES-KE-NOR.png" 
                alt="WGES Kenya Norway Logo" 
                fill
                className="object-contain"
                style={{ filter: 'none' }}
              />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden h-6 w-6"
            onClick={toggleMenu}
          >
            <X size={14} />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2 px-2">
          {location.city}, {location.country}
        </div>
        
        <div className="px-1 py-1 mb-2 rounded-md bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs font-normal h-7 px-2"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <div className="flex items-center gap-2">
                <Sun size={14} className="text-amber-500" />
                <span>Light Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Moon size={14} className="text-indigo-400" />
                <span>Dark Mode</span>
              </div>
            )}
          </Button>
        </div>
        
        <div className="text-xs font-medium text-muted-foreground mb-1 px-2">
          MENU
        </div>
        
        <nav className="space-y-0.5 flex-1 px-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex items-center gap-2 w-full py-1.5 px-2 rounded-md text-left transition-colors text-xs",
                "hover:bg-accent/50",
                activeSection === item.id 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground"
              )}
              onClick={() => {
                setActiveSection(item.id);
                if (window.innerWidth < 1024) {
                  toggleMenu();
                }
              }}
            >
              <span className={cn(
                "flex items-center justify-center w-5 h-5 rounded-md",
                activeSection === item.id 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground"
              )}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {activeSection === item.id && (
                <ChevronRight size={12} className="ml-auto text-primary" />
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-2 border-t">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <span className="text-[10px] font-bold">WG</span>
              </div>
              <div>
                <p className="text-xs font-medium">W. Giertsen Energy</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Solar Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
      
      {/* Toggle Button for Large Screens */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-30 rounded-full shadow-md hidden lg:flex h-8 w-8 bg-background/80 backdrop-blur-sm"
        onClick={toggleMenu}
      >
        <PanelLeft size={16} />
      </Button>
    </>
  );
};

export default NavigationMenu; 