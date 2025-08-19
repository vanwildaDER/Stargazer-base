import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  time: string;
  bets: number;
}

const BetsPerMinuteWidget: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentBets, setCurrentBets] = useState<number>(150000);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const generateFakeData = (existingData: DataPoint[], newValue: number): DataPoint[] => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    const newData = [...existingData, { time: timeString, bets: newValue }];
    
    return newData.slice(-20);
  };

  const generateRandomBetsValue = (): number => {
    return Math.floor(100000 + Math.random() * 100000);
  };

  useEffect(() => {
    const initializeData = () => {
      const initialData: DataPoint[] = [];
      const now = new Date();
      
      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3000);
        const timeString = time.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
        initialData.push({
          time: timeString,
          bets: generateRandomBetsValue()
        });
      }
      
      setData(initialData);
      setCurrentBets(initialData[initialData.length - 1].bets);
      setIsLoading(false);
    };

    initializeData();

    const interval = setInterval(() => {
      const newBetsValue = generateRandomBetsValue();
      setCurrentBets(newBetsValue);
      setData(prevData => generateFakeData(prevData, newBetsValue));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                    border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-300
                    focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
         role="article" aria-labelledby="bets-per-minute-title">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg" aria-hidden="true">
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 id="bets-per-minute-title" className="font-semibold text-secondary-900 dark:text-secondary-100">
            Bets per Minute
          </h3>
          {isLoading ? (
            <div className="flex items-center space-x-2 mt-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" aria-hidden="true"></div>
              <span className="text-sm text-secondary-500" aria-live="polite">Loading...</span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400" aria-live="polite">
              {currentBets.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      {!isLoading && (
        <div className="h-24 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="time" 
                hide 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                hide 
                domain={['dataMin - 10000', 'dataMax + 10000']}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [formatTooltipValue(value), 'Bets']}
                labelStyle={{ color: 'white' }}
              />
              <Line 
                type="monotone" 
                dataKey="bets" 
                stroke="#9333ea" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: '#9333ea' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BetsPerMinuteWidget;