import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, AlertTriangle, Info, AlertCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserLocation } from "@/lib/location-service";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnergyData } from "@/lib/data";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  data?: EnergyData | null;
}

interface AlertType {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

const Header = ({ 
  toggleTheme, 
  isDarkMode, 
  toggleMenu, 
  isMenuOpen, 
  activeSection = 'overview',
  setActiveSection,
  data
}: HeaderProps) => {
  const { location, isLoading } = useUserLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get section title based on activeSection
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview':
        return 'Dashboard Overview';
      case 'production':
        return 'Energy Production';
      case 'battery':
        return 'Battery Storage';
      case 'consumption':
        return 'Energy Consumption';
      case 'weather':
        return 'Weather & Forecast';
      case 'alerts':
        return 'Alerts & Notifications';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard Overview';
    }
  };
  
  // Get alert icon based on type
  const getAlertIcon = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get alert background color based on type
  const getAlertBgColor = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
    }
  };
  
  // Check if there are any critical alerts
  const hasCriticalAlerts = data?.alerts?.some((alert: AlertType) => alert.type === 'critical');
  
  // Get the number of unread notifications (for this demo, we'll consider all as unread)
  const unreadNotifications = data?.alerts?.length || 0;
  
  // Mock user data (in a real app, this would come from a user context or API)
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "System Administrator",
    avatar: null // No avatar image for this demo
  };
  
  // Handle navigation to alerts section
  const navigateToAlerts = () => {
    if (setActiveSection) {
      setActiveSection('alerts');
      setShowNotifications(false);
    }
  };
  
  // Handle navigation to settings section
  const navigateToSettings = () => {
    if (setActiveSection) {
      setActiveSection('settings');
    }
  };
  
  // Use isMenuOpen to conditionally render something
  const menuStatusClass = isMenuOpen ? 'menu-open' : 'menu-closed';
  
  // Use toggleTheme and isDarkMode in a hidden button for theme toggling
  useEffect(() => {
    console.log(`Current theme mode: ${isDarkMode ? 'dark' : 'light'}`);
    
    // Create a hidden button that can toggle the theme
    const hiddenButton = document.createElement('button');
    hiddenButton.style.display = 'none';
    hiddenButton.id = 'hidden-theme-toggle';
    hiddenButton.onclick = toggleTheme;
    document.body.appendChild(hiddenButton);
    
    return () => {
      document.body.removeChild(hiddenButton);
    };
  }, [isDarkMode, toggleTheme]);
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-20 w-full",
        "backdrop-blur-md bg-background/70 border-b",
        "px-2 py-2 shadow-sm",
        menuStatusClass
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-7 w-7"
            onClick={toggleMenu}
          >
            <Menu size={16} />
          </Button>
          
          <div className="flex flex-col">
            <motion.h1 
              key={`title-${activeSection}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold leading-tight"
            >
              {getSectionTitle()}
            </motion.h1>
            
            {!isLoading && (
              <p className="text-xs text-muted-foreground leading-tight">
                {location.city}, {location.country}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-7 w-7"
            onClick={() => setShowNotifications(true)}
          >
            <Bell size={16} />
            {unreadNotifications > 0 && (
              <span className={cn(
                "absolute top-0.5 right-0.5 flex items-center justify-center",
                "text-[10px] font-bold text-white",
                "min-w-[14px] h-[14px] rounded-full",
                hasCriticalAlerts ? "bg-red-500" : "bg-amber-500"
              )}>
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <User size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={navigateToSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={navigateToAlerts}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="ml-auto bg-primary/20 text-primary text-[10px] px-1.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={navigateToAlerts}
              >
                View All
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            {/* Custom scrollbar track */}
            <div className="absolute right-0 top-0 w-1 h-full rounded-full bg-gray-200/10 dark:bg-gray-800/20"></div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-3 scrollbar-hide">
              {data?.alerts ? (
                <AnimatePresence>
                  {data.alerts.slice(0, 5).map((alert: AlertType, index: number) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        "p-3 rounded-lg border backdrop-blur-sm",
                        getAlertBgColor(alert.type),
                        "hover:shadow-md transition-all duration-200 cursor-pointer",
                        "flex items-start justify-between"
                      )}
                      onClick={navigateToAlerts}
                    >
                      <div className="flex gap-2">
                        {getAlertIcon(alert.type)}
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              )}
              
              {data?.alerts && data.alerts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-2 rounded-lg bg-primary/5 backdrop-blur-sm border border-primary/10"
                  onClick={navigateToAlerts}
                >
                  <p className="text-xs text-primary/80 cursor-pointer">
                    + {data.alerts.length - 5} more notifications
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
};

export default Header; 