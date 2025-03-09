import React, { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnergyConsumptionProps {
  data: EnergyData;
}

const EnergyConsumption = ({ data }: EnergyConsumptionProps) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Format consumption breakdown data for pie chart
  const consumptionBreakdownData = [
    { name: 'Appliances', value: data.consumption.breakdown.appliances, color: '#8884d8' },
    { name: 'HVAC', value: data.consumption.breakdown.hvac, color: '#82ca9d' },
    { name: 'Lights', value: data.consumption.breakdown.lights, color: '#ffc658' },
    { name: 'Other', value: data.consumption.breakdown.other, color: '#ff8042' }
  ];
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Get appliance-specific data
  const getApplianceData = () => {
    return [
      { name: 'Refrigerator', value: 15, color: '#8884d8' },
      { name: 'Washing Machine', value: 10, color: '#82ca9d' },
      { name: 'Dishwasher', value: 8, color: '#ffc658' },
      { name: 'Oven', value: 12, color: '#ff8042' },
      { name: 'Microwave', value: 5, color: '#0088fe' },
      { name: 'TV', value: 7, color: '#00C49F' },
      { name: 'Computer', value: 8, color: '#FFBB28' },
      { name: 'Other', value: 35, color: '#FF8042' }
    ];
  };
  
  // Get HVAC-specific data
  const getHVACData = () => {
    return [
      { name: 'Heating', value: 45, color: '#ff8042' },
      { name: 'Cooling', value: 35, color: '#0088fe' },
      { name: 'Ventilation', value: 20, color: '#00C49F' }
    ];
  };
  
  // Get lighting-specific data
  const getLightingData = () => {
    return [
      { name: 'Living Room', value: 25, color: '#ffc658' },
      { name: 'Kitchen', value: 20, color: '#8884d8' },
      { name: 'Bedrooms', value: 30, color: '#82ca9d' },
      { name: 'Bathroom', value: 10, color: '#ff8042' },
      { name: 'Outdoor', value: 15, color: '#0088fe' }
    ];
  };
  
  return (
    <GlassCard 
      title="Energy Consumption"
      description="Real-time energy usage and analytics"
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
            className="p-2 rounded-full bg-purple-400/20 text-purple-500"
          >
            <Zap size={20} />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">{data.consumption.current} kW</h3>
            <p className="text-xs text-muted-foreground">Current Consumption</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <Tabs 
        defaultValue="breakdown" 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown" className="text-xs sm:text-sm">Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={consumptionBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {consumptionBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Consumption']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {consumptionBreakdownData.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => toggleSection(item.name)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.value}%</p>
                    </div>
                    {expandedSection === item.name ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col">
              {expandedSection === 'Appliances' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">Appliances Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      data={getApplianceData()}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {getApplianceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Refrigerator and oven are your highest energy consumers.
                  </p>
                </div>
              )}
              
              {expandedSection === 'HVAC' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">HVAC Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={getHVACData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {getHVACData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Heating accounts for nearly half of your HVAC energy usage.
                  </p>
                </div>
              )}
              
              {expandedSection === 'Lights' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">Lighting Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      data={getLightingData()}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lighting accounts for a significant portion of your energy usage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default EnergyConsumption;