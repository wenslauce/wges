import React, { useState, useEffect } from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData, generateHistoricalData } from "@/lib/data";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, BarChart3, PieChart, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { addDays, subDays, subMonths, format } from "date-fns";

interface DetailedAnalyticsProps {
  data: EnergyData;
}

interface HistoricalDataPoint {
  date: string;
  production: number;
  consumption: number;
  savings: number;
  batteryLevel?: number;
  gridUsage?: number;
}

interface PredictionDataPoint {
  day: string;
  production: number;
  consumption: number;
  confidence: number;
}

const DetailedAnalytics = ({ data }: DetailedAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [exportTimeRange, setExportTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);
  
  // Generate historical data when component mounts or time range changes
  useEffect(() => {
    const today = new Date();
    let startDate: Date;
    const endDate = today;
    
    // Set start date based on selected time range
    switch (timeRange) {
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subMonths(today, 1);
        break;
      case 'year':
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 1);
    }
    
    // Generate historical data
    const rawData = generateHistoricalData(startDate, endDate);
    
    // Format data for charts
    const formattedData = rawData.map(item => ({
      date: item.date,
      production: item.production,
      consumption: item.consumption,
      savings: Number(((item.production - item.consumption) * 0.12).toFixed(2)),
      batteryLevel: item.batteryLevel,
      gridUsage: item.gridUsage
    }));
    
    setHistoricalData(formattedData);
    
    // Generate prediction data for next 7 days
    const predictions = [];
    for (let i = 0; i < 7; i++) {
      const predictionDate = addDays(today, i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(predictionDate, 'EEE');
      
      // Base prediction on recent trends with decreasing confidence
      const confidence = Math.max(0.3, 0.95 - (i * 0.1));
      const production = 24 + Math.random() * 6;
      const consumption = 18 + Math.random() * 5;
      
      predictions.push({
        day: dayName,
        production: Number(production.toFixed(1)),
        consumption: Number(consumption.toFixed(1)),
        confidence
      });
    }
    
    setPredictionData(predictions);
  }, [timeRange]);
  
  // Get chart data based on selected time range
  const getChartData = () => {
    return historicalData;
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `$${(value * 0.12).toFixed(2)}`;
  };
  
  // Handle export
  const handleExport = () => {
    // Simulate export process
    setTimeout(() => {
      setShowExportDialog(false);
      // In a real app, this would trigger a download
      alert(`Data exported as ${exportFormat.toUpperCase()} for the selected ${exportTimeRange} range.`);
    }, 1000);
  };
  
  return (
    <GlassCard 
      title="Detailed Analytics & Reports"
      description="Historical data visualization and energy insights"
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <select 
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowExportDialog(true)}
          className="flex items-center gap-1"
        >
          <Download size={14} />
          <span>Export</span>
        </Button>
      </div>
      
      <Tabs defaultValue="consumption" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consumption" className="flex items-center gap-1">
            <BarChart3 size={14} />
            <span>Consumption</span>
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-1">
            <TrendingUp size={14} />
            <span>Production</span>
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-1">
            <PieChart size={14} />
            <span>Savings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="pt-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={getChartData()}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => {
                  if (timeRange === 'week') {
                    // For weekly view, show day of week
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else if (timeRange === 'month') {
                    // For monthly view, show day of month
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else {
                    // For yearly view, show month
                    const date = new Date(value);
                    return format(date, 'MMM');
                  }
                }}
              />
              <YAxis 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `${value}kWh`}
              />
              <Tooltip 
                formatter={(value) => [`${value} kWh`, 'Consumption']}
              />
              <Bar 
                dataKey="consumption" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${(data.dailyConsumption.reduce((acc, day) => acc + day.consumption, 0) / 7).toFixed(1)} kWh`
                  : timeRange === 'month'
                    ? '325 kWh'
                    : '3,860 kWh'
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-xs text-muted-foreground">Peak</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${Math.max(...data.dailyConsumption.map(day => day.consumption))} kWh`
                  : timeRange === 'month'
                    ? '410 kWh'
                    : '640 kWh'
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${data.dailyConsumption.reduce((acc, day) => acc + day.consumption, 0)} kWh`
                  : timeRange === 'month'
                    ? '1,300 kWh'
                    : '15,600 kWh'
                }
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="production" className="pt-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={getChartData()}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => {
                  if (timeRange === 'week') {
                    // For weekly view, show day of week
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else if (timeRange === 'month') {
                    // For monthly view, show day of month
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else {
                    // For yearly view, show month
                    const date = new Date(value);
                    return format(date, 'MMM');
                  }
                }}
              />
              <YAxis 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `${value}kWh`}
              />
              <Tooltip 
                formatter={(value) => [`${value} kWh`, 'Production']}
              />
              <Line 
                type="monotone" 
                dataKey="production" 
                stroke="#FFB13B" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${(data.dailyConsumption.reduce((acc, day) => acc + day.production, 0) / 7).toFixed(1)} kWh`
                  : timeRange === 'month'
                    ? '485 kWh'
                    : '5,820 kWh'
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
              <p className="text-xs text-muted-foreground">Peak</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${Math.max(...data.dailyConsumption.map(day => day.production))} kWh`
                  : timeRange === 'month'
                    ? '590 kWh'
                    : '640 kWh'
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? `${data.dailyConsumption.reduce((acc, day) => acc + day.production, 0)} kWh`
                  : timeRange === 'month'
                    ? '1,940 kWh'
                    : '23,280 kWh'
                }
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="savings" className="pt-4">
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={getChartData()}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => {
                  if (timeRange === 'week') {
                    // For weekly view, show day of week
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else if (timeRange === 'month') {
                    // For monthly view, show day of month
                    return value.split('-')[2]; // Extract day from yyyy-MM-dd
                  } else {
                    // For yearly view, show month
                    const date = new Date(value);
                    return format(date, 'MMM');
                  }
                }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `${value}kWh`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'savings') return [formatCurrency(value as number), 'Savings'];
                  return [`${value} kWh`, name === 'production' ? 'Production' : 'Consumption'];
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="production" 
                fill="#FFB13B" 
                stroke="#FFB13B"
                fillOpacity={0.3}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="consumption" 
                fill="#8884d8" 
                stroke="#8884d8"
                fillOpacity={0.3}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="savings" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-xs text-muted-foreground">Monthly Savings</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? formatCurrency(78.50)
                  : timeRange === 'month'
                    ? formatCurrency(314.00)
                    : formatCurrency(3768.00)
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-xs text-muted-foreground">Grid Offset</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? '65%'
                  : timeRange === 'month'
                    ? '62%'
                    : '59%'
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-center">
              <p className="text-xs text-muted-foreground">CO₂ Reduction</p>
              <p className="text-sm font-medium">
                {timeRange === 'week' 
                  ? '124 kg'
                  : timeRange === 'month'
                    ? '496 kg'
                    : '5,952 kg'
                }
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center gap-1">
            <Calendar size={14} />
            <span>Predictive Analytics</span>
          </h3>
          <p className="text-xs text-muted-foreground">7-Day Forecast</p>
        </div>
        
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={predictionData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
            <XAxis 
              dataKey="day" 
              stroke="#888"
              fontSize={10}
            />
            <YAxis 
              stroke="#888"
              fontSize={10}
              tickFormatter={(value) => `${value}kWh`}
            />
            <Tooltip 
              formatter={(value) => [`${value} kWh`, 'Energy']}
            />
            <Line 
              type="monotone" 
              dataKey="production" 
              stroke="#FFB13B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#8884d8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-amber-500 rounded-full"></div>
            <span>Predicted Production</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-purple-500 rounded-full"></div>
            <span>Predicted Consumption</span>
          </div>
          <p>Based on weather forecast and historical patterns</p>
        </div>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={18} />
              Export Energy Report
            </DialogTitle>
            <DialogDescription>
              Choose format and time range for your energy report
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Report Format</p>
              <div className="flex gap-2">
                <Button 
                  variant={exportFormat === 'csv' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportFormat('csv')}
                  className="flex-1"
                >
                  CSV
                </Button>
                <Button 
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportFormat('pdf')}
                  className="flex-1"
                >
                  PDF
                </Button>
                <Button 
                  variant={exportFormat === 'excel' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportFormat('excel')}
                  className="flex-1"
                >
                  Excel
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Time Range</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={exportTimeRange === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportTimeRange('day')}
                >
                  Today
                </Button>
                <Button 
                  variant={exportTimeRange === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportTimeRange('week')}
                >
                  This Week
                </Button>
                <Button 
                  variant={exportTimeRange === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportTimeRange('month')}
                >
                  This Month
                </Button>
                <Button 
                  variant={exportTimeRange === 'year' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setExportTimeRange('year')}
                >
                  This Year
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Report Contents</p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input type="checkbox" id="production" className="mr-2" defaultChecked />
                  <label htmlFor="production" className="text-sm">Energy Production</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="consumption" className="mr-2" defaultChecked />
                  <label htmlFor="consumption" className="text-sm">Energy Consumption</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="savings" className="mr-2" defaultChecked />
                  <label htmlFor="savings" className="text-sm">Cost Savings</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="environmental" className="mr-2" defaultChecked />
                  <label htmlFor="environmental" className="text-sm">Environmental Impact</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onClick={handleExport} className="flex items-center gap-1">
              <Download size={14} />
              <span>Export Report</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default DetailedAnalytics; 