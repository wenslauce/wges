import React, { useState, useRef, useEffect } from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertTriangle, Info, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AlertsNotificationsProps {
  data: EnergyData;
}

const AlertsNotifications = ({ data }: AlertsNotificationsProps) => {
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof data.alerts[0] | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const alertsContainerRef = useRef<HTMLDivElement>(null);

  // Update scroll information when alerts change
  useEffect(() => {
    if (alertsContainerRef.current) {
      const container = alertsContainerRef.current;
      setMaxScroll(container.scrollHeight - container.clientHeight);
      
      const handleScroll = () => {
        setScrollPosition(container.scrollTop);
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [data.alerts]);

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

  // Calculate if there are any critical alerts
  const hasCriticalAlerts = data.alerts.some(alert => alert.type === 'critical');

  return (
    <GlassCard 
      title="Alerts & Notifications"
      description="System alerts and important notifications"
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: hasCriticalAlerts ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              duration: 0.5,
              repeat: hasCriticalAlerts ? Infinity : 0,
              repeatType: "reverse",
              repeatDelay: 1
            }}
            className={cn(
              "p-2 rounded-full",
              hasCriticalAlerts 
                ? "bg-red-500/20 text-red-500" 
                : "bg-amber-400/20 text-amber-500"
            )}
          >
            <Bell size={20} />
          </motion.div>
          <div>
            <span className="font-medium">
              {data.alerts.length} {data.alerts.length === 1 ? 'Alert' : 'Alerts'}
            </span>
            {hasCriticalAlerts && (
              <p className="text-xs text-red-500">Critical attention required</p>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAllAlerts(true)}
          className="rounded-full px-3 text-xs"
        >
          View All
        </Button>
      </div>

      <div className="relative">
        {/* Custom scrollbar track */}
        <div className="absolute right-0 top-0 w-1 h-full rounded-full bg-gray-200/10 dark:bg-gray-800/20 z-10"></div>
        
        {/* Custom scrollbar thumb */}
        {maxScroll > 0 && (
          <motion.div 
            className="absolute right-0 w-1 rounded-full bg-primary/50 z-20"
            style={{ 
              top: `${(scrollPosition / maxScroll) * 100}%`,
              height: `${Math.max(10, (alertsContainerRef.current?.clientHeight || 0) / (alertsContainerRef.current?.scrollHeight || 1) * 100)}%`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Scroll indicator */}
        {maxScroll > 0 && scrollPosition < maxScroll && (
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-muted-foreground z-10"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
        
        {/* Alerts container with custom scrolling */}
        <div 
          ref={alertsContainerRef}
          className="space-y-3 max-h-[200px] overflow-y-auto pr-3 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <AnimatePresence>
            {data.alerts.slice(0, 5).map((alert, index) => (
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
                onClick={() => setSelectedAlert(alert)}
                whileHover={{ scale: 1.02, x: 2 }}
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
          
          {data.alerts.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2 rounded-lg bg-primary/5 backdrop-blur-sm border border-primary/10"
            >
              <p className="text-xs text-primary/80">
                + {data.alerts.length - 5} more alerts
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* All Alerts Dialog */}
      <Dialog open={showAllAlerts} onOpenChange={setShowAllAlerts}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>System Alerts</DialogTitle>
            <DialogDescription>
              All system alerts and notifications
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="relative">
              {/* Custom scrollbar track */}
              <div className="absolute right-0 top-0 w-1 h-full rounded-full bg-gray-200/10 dark:bg-gray-800/20"></div>
              
              <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4 pr-3 scrollbar-hide">
                {data.alerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border backdrop-blur-sm",
                      getAlertBgColor(alert.type),
                      "hover:shadow-md transition-all duration-200",
                      "flex items-start justify-between"
                    )}
                    whileHover={{ scale: 1.01, x: 2 }}
                  >
                    <div className="flex gap-2">
                      {getAlertIcon(alert.type)}
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="critical" className="relative">
              {/* Custom scrollbar track */}
              <div className="absolute right-0 top-0 w-1 h-full rounded-full bg-gray-200/10 dark:bg-gray-800/20"></div>
              
              <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4 pr-3 scrollbar-hide">
                {data.alerts.filter(alert => alert.type === 'critical').map((alert) => (
                  <motion.div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border backdrop-blur-sm",
                      getAlertBgColor(alert.type),
                      "hover:shadow-md transition-all duration-200",
                      "flex items-start justify-between"
                    )}
                    whileHover={{ scale: 1.01, x: 2 }}
                  >
                    <div className="flex gap-2">
                      {getAlertIcon(alert.type)}
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="warnings" className="relative">
              {/* Custom scrollbar track */}
              <div className="absolute right-0 top-0 w-1 h-full rounded-full bg-gray-200/10 dark:bg-gray-800/20"></div>
              
              <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4 pr-3 scrollbar-hide">
                {data.alerts.filter(alert => alert.type === 'warning').map((alert) => (
                  <motion.div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border backdrop-blur-sm",
                      getAlertBgColor(alert.type),
                      "hover:shadow-md transition-all duration-200",
                      "flex items-start justify-between"
                    )}
                    whileHover={{ scale: 1.01, x: 2 }}
                  >
                    <div className="flex gap-2">
                      {getAlertIcon(alert.type)}
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && getAlertIcon(selectedAlert.type)}
              {selectedAlert?.message}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert && formatTimestamp(selectedAlert.timestamp)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm">
              {selectedAlert?.type === 'warning' && "This is a warning alert that requires your attention but is not critical."}
              {selectedAlert?.type === 'critical' && "This is a critical alert that requires immediate attention."}
              {selectedAlert?.type === 'info' && "This is an informational alert for your awareness."}
            </p>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAlert(null)} className="rounded-full">Dismiss</Button>
              <Button className="rounded-full">Take Action</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default AlertsNotifications; 