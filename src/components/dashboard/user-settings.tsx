import React, { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { 
  User, 
  Settings, 
  Bell, 
  Layout, 
  Shield, 
  Moon, 
  Sun, 
  LogOut,
  Mail,
  Phone,
  AlertCircle,
  AlertTriangle,
  Info,
  Wrench,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface UserSettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const UserSettings = ({ isDarkMode, toggleTheme }: UserSettingsProps) => {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showLayoutDialog, setShowLayoutDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [userName, setUserName] = useState("Wenslauce Chengo");
  const [userEmail, setUserEmail] = useState("hello@wenslauce.com");
  const [alertPreferences, setAlertPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    critical: true,
    warnings: true,
    info: true,
    maintenance: true,
    performance: true,
    savings: false
  });
  const [layoutPreferences, setLayoutPreferences] = useState({
    showBattery: true,
    showProduction: true,
    showConsumption: true,
    showGrid: true,
    showHealth: true,
    showAlerts: true,
    showRemote: true,
    showAnalytics: true
  });
  
  return (
    <GlassCard 
      title="User Settings & Preferences"
      description="Customize your dashboard experience"
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          onClick={() => setShowProfileDialog(true)}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-2">
            <User size={24} />
          </div>
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            onClick={toggleTheme}
          >
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-500 mb-1">
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <p className="text-xs font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
            onClick={() => setShowLayoutDialog(true)}
          >
            <div className="p-2 rounded-full bg-green-500/20 text-green-500 mb-1">
              <Layout size={18} />
            </div>
            <p className="text-xs font-medium">Layout</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20"
            onClick={() => setShowAlertsDialog(true)}
          >
            <div className="p-2 rounded-full bg-red-500/20 text-red-500 mb-1">
              <Bell size={18} />
            </div>
            <p className="text-xs font-medium">Alerts</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
          >
            <div className="p-2 rounded-full bg-blue-500/20 text-blue-500 mb-1">
              <Shield size={18} />
            </div>
            <p className="text-xs font-medium">Security</p>
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-purple-500" />
            <div>
              <p className="text-sm font-medium">System Preferences</p>
              <p className="text-xs text-muted-foreground">Units, language, and regional settings</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            Configure
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-amber-500" />
            <div>
              <p className="text-sm font-medium">Notification Settings</p>
              <p className="text-xs text-muted-foreground">
                {alertPreferences.email && 'Email'} 
                {alertPreferences.push && ', Push'} 
                {alertPreferences.sms && ', SMS'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            Manage
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2">
            <LogOut size={18} className="text-red-500" />
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-muted-foreground">Log out of your account</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white relative">
                <User size={32} />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                >
                  <Settings size={12} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value="••••••••"
                readOnly
              />
              <Button variant="link" size="sm" className="h-6 p-0 text-xs">
                Change Password
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowProfileDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Layout Dialog */}
      <Dialog open={showLayoutDialog} onOpenChange={setShowLayoutDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dashboard Layout</DialogTitle>
            <DialogDescription>
              Customize which widgets appear on your dashboard
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showProduction" 
                  checked={layoutPreferences.showProduction}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showProduction: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showProduction" className="text-sm font-medium">
                  Energy Production
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showBattery" 
                  checked={layoutPreferences.showBattery}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showBattery: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showBattery" className="text-sm font-medium">
                  Battery Status
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showConsumption" 
                  checked={layoutPreferences.showConsumption}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showConsumption: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showConsumption" className="text-sm font-medium">
                  Energy Consumption
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showGrid" 
                  checked={layoutPreferences.showGrid}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showGrid: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showGrid" className="text-sm font-medium">
                  Grid Status
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showHealth" 
                  checked={layoutPreferences.showHealth}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showHealth: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showHealth" className="text-sm font-medium">
                  System Health
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showAlerts" 
                  checked={layoutPreferences.showAlerts}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showAlerts: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showAlerts" className="text-sm font-medium">
                  Alerts & Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showRemote" 
                  checked={layoutPreferences.showRemote}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showRemote: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showRemote" className="text-sm font-medium">
                  Remote Controls
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showAnalytics" 
                  checked={layoutPreferences.showAnalytics}
                  onChange={(e) => setLayoutPreferences({...layoutPreferences, showAnalytics: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showAnalytics" className="text-sm font-medium">
                  Detailed Analytics
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Layout Arrangement</p>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="default">Default Layout</option>
                <option value="production">Production Focused</option>
                <option value="consumption">Consumption Focused</option>
                <option value="compact">Compact View</option>
                <option value="expanded">Expanded View</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLayoutDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowLayoutDialog(false)}>Save Layout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Alert Preferences</DialogTitle>
            <DialogDescription>
              Configure how and when you receive system alerts
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="channels" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channels">Notification Channels</TabsTrigger>
              <TabsTrigger value="types">Alert Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="channels" className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="emailAlerts" 
                      checked={alertPreferences.email}
                      onChange={(e) => setAlertPreferences({...alertPreferences, email: e.target.checked})}
                      className="rounded border-gray-300 mr-2"
                    />
                    <Button variant="outline" size="sm" className="h-7">
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-purple-500/20 text-purple-500">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Browser and mobile app</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="pushAlerts" 
                      checked={alertPreferences.push}
                      onChange={(e) => setAlertPreferences({...alertPreferences, push: e.target.checked})}
                      className="rounded border-gray-300 mr-2"
                    />
                    <Button variant="outline" size="sm" className="h-7">
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="smsAlerts" 
                      checked={alertPreferences.sms}
                      onChange={(e) => setAlertPreferences({...alertPreferences, sms: e.target.checked})}
                      className="rounded border-gray-300 mr-2"
                    />
                    <Button variant="outline" size="sm" className="h-7">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="types" className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-red-500/20 text-red-500">
                      <AlertCircle size={16} />
                    </div>
                    <p className="text-sm font-medium">Critical Alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="criticalAlerts" 
                    checked={alertPreferences.critical}
                    onChange={(e) => setAlertPreferences({...alertPreferences, critical: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                      <AlertTriangle size={16} />
                    </div>
                    <p className="text-sm font-medium">Warning Alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="warningAlerts" 
                    checked={alertPreferences.warnings}
                    onChange={(e) => setAlertPreferences({...alertPreferences, warnings: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                      <Info size={16} />
                    </div>
                    <p className="text-sm font-medium">Informational Alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="infoAlerts" 
                    checked={alertPreferences.info}
                    onChange={(e) => setAlertPreferences({...alertPreferences, info: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-purple-500/20 text-purple-500">
                      <Wrench size={16} />
                    </div>
                    <p className="text-sm font-medium">Maintenance Alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="maintenanceAlerts" 
                    checked={alertPreferences.maintenance}
                    onChange={(e) => setAlertPreferences({...alertPreferences, maintenance: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                      <TrendingUp size={16} />
                    </div>
                    <p className="text-sm font-medium">Performance Alerts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="performanceAlerts" 
                    checked={alertPreferences.performance}
                    onChange={(e) => setAlertPreferences({...alertPreferences, performance: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
                      <DollarSign size={16} />
                    </div>
                    <p className="text-sm font-medium">Savings Opportunities</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="savingsAlerts" 
                    checked={alertPreferences.savings}
                    onChange={(e) => setAlertPreferences({...alertPreferences, savings: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlertsDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowAlertsDialog(false)}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default UserSettings; 
