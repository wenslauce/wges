import React, { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { Power, Smartphone, ToggleLeft, Zap, Clock, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface RemoteControlsProps {
  data: EnergyData;
}

const RemoteControls = ({ data }: RemoteControlsProps) => {
  const [showPowerDialog, setShowPowerDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'restarting'>('online');
  const [batteryMode, setBatteryMode] = useState<'auto' | 'conserve' | 'optimize'>('auto');
  const [peakHours, setPeakHours] = useState({ start: 17, end: 21 }); // 5pm to 9pm
  
  // Simulate system restart
  const handleSystemRestart = () => {
    setSystemStatus('restarting');
    setShowPowerDialog(false);
    
    // Simulate restart process
    setTimeout(() => {
      setSystemStatus('online');
    }, 5000);
  };
  
  // Simulate system shutdown
  const handleSystemShutdown = () => {
    setSystemStatus('offline');
    setShowPowerDialog(false);
  };
  
  return (
    <GlassCard 
      title="Remote Monitoring & Controls"
      description="Manage your energy system remotely"
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full ${
              systemStatus === 'online' 
                ? 'bg-green-500/20 text-green-500' 
                : systemStatus === 'restarting'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-red-500/20 text-red-500'
            } mb-2`}
            onClick={() => setShowPowerDialog(true)}
          >
            <Power size={24} />
          </motion.div>
          <p className="text-sm font-medium">System Status</p>
          <p className={`text-xs ${
            systemStatus === 'online' 
              ? 'text-green-500' 
              : systemStatus === 'restarting'
                ? 'text-amber-500'
                : 'text-red-500'
          }`}>
            {systemStatus === 'online' ? 'Online' : systemStatus === 'restarting' ? 'Restarting...' : 'Offline'}
          </p>
          
          {systemStatus === 'restarting' && (
            <div className="w-full mt-2">
              <Progress value={45} className="h-1" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-purple-500/20 text-purple-500 mb-2"
            onClick={() => setShowLoadDialog(true)}
          >
            <Zap size={24} />
          </motion.div>
          <p className="text-sm font-medium">Load Management</p>
          <p className="text-xs text-muted-foreground">
            {batteryMode === 'auto' ? 'Automatic' : batteryMode === 'conserve' ? 'Conservation Mode' : 'Performance Mode'}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-blue-500" />
            <div>
              <p className="text-sm font-medium">Mobile App Sync</p>
              <p className="text-xs text-muted-foreground">Last synced: 2 minutes ago</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw size={14} className="mr-1" /> Sync Now
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            <div>
              <p className="text-sm font-medium">Peak Hours</p>
              <p className="text-xs text-muted-foreground">{peakHours.start}:00 - {peakHours.end}:00</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Settings size={14} className="mr-1" /> Configure
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
          <div className="flex items-center gap-2">
            <ToggleLeft size={18} className="text-green-500" />
            <div>
              <p className="text-sm font-medium">Smart Scheduling</p>
              <p className="text-xs text-muted-foreground">Optimizing for cost savings</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Settings size={14} className="mr-1" /> Adjust
          </Button>
        </div>
      </div>
      
      {/* Power Control Dialog */}
      <Dialog open={showPowerDialog} onOpenChange={setShowPowerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>System Power Controls</DialogTitle>
            <DialogDescription>
              Safely manage your energy system power state
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-green-500" />
                <p className="text-sm font-medium">Restart System</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSystemRestart}
                disabled={systemStatus === 'restarting'}
              >
                Restart
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2">
                <Power size={18} className="text-red-500" />
                <p className="text-sm font-medium">Shutdown System</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSystemShutdown}
                disabled={systemStatus === 'offline'}
              >
                Shutdown
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Note: System restart may take up to 5 minutes to complete. During this time, energy monitoring will be temporarily unavailable.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPowerDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Load Management Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Load Management Settings</DialogTitle>
            <DialogDescription>
              Configure battery usage and peak demand preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="battery" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="battery">Battery Mode</TabsTrigger>
              <TabsTrigger value="peak">Peak Hours</TabsTrigger>
            </TabsList>
            
            <TabsContent value="battery" className="space-y-4 py-4">
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  batteryMode === 'auto' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-500/5 border-blue-500/10'
                }`}
                onClick={() => setBatteryMode('auto')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={18} className="text-blue-500" />
                  <p className="font-medium">Automatic Mode</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  System automatically balances between battery usage and grid power based on conditions
                </p>
              </div>
              
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  batteryMode === 'conserve' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-500/5 border-green-500/10'
                }`}
                onClick={() => setBatteryMode('conserve')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-green-500" />
                  <p className="font-medium">Conservation Mode</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Prioritizes battery longevity by minimizing deep discharges
                </p>
              </div>
              
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  batteryMode === 'optimize' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-500/5 border-purple-500/10'
                }`}
                onClick={() => setBatteryMode('optimize')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-purple-500" />
                  <p className="font-medium">Performance Mode</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maximizes use of battery power to reduce grid dependency
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="peak" className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Peak Hours Configuration</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Set your utility's peak demand hours to optimize battery usage during high-rate periods
                </p>
                
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs mb-1">Start Time</p>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={peakHours.start}
                      onChange={(e) => setPeakHours({...peakHours, start: parseInt(e.target.value)})}
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <p className="text-xs mb-1">End Time</p>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={peakHours.end}
                      onChange={(e) => setPeakHours({...peakHours, end: parseInt(e.target.value)})}
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs mb-1">Peak Hours Strategy</p>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="battery">Use Battery Power Only</option>
                    <option value="minimize">Minimize Grid Usage</option>
                    <option value="balance">Balance Battery/Grid</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowLoadDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default RemoteControls; 