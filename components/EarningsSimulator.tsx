
import React, { useState, useMemo } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EarningsSimulator: React.FC = () => {
  const [rate, setRate] = useState(6);
  const [numSpots, setNumSpots] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState<Record<string, boolean>>({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false,
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const { daily, weekly, monthly, yearly } = useMemo(() => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    let dailyHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (dailyHours < 0) {
      dailyHours += 24; // Handles overnight availability
    }

    if (dailyHours <= 0) return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };

    const activeDays = Object.values(daysOfWeek).filter(Boolean).length;
    const daily = numSpots * rate * dailyHours;
    const weekly = daily * activeDays;
    const monthly = weekly * 4.33; // Average weeks in a month
    const yearly = monthly * 12;
    return { daily, weekly, monthly, yearly };
  }, [rate, numSpots, daysOfWeek, startTime, endTime]);

  const toggleDay = (day: string) => {
    setDaysOfWeek(prev => ({...prev, [day]: !prev[day]}));
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl p-6 md:p-8 border border-slate-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Spots: <span className="font-bold text-purple-400">{numSpots}</span></label>
              <input type="range" min="1" max="10" value={numSpots} onChange={e => setNumSpots(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hourly Rate: <span className="font-bold text-purple-400">${rate}</span></label>
              <input type="range" min="3" max="9" value={rate} onChange={e => setRate(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${daysOfWeek[day] ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-300">From</label>
                <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-300">Until</label>
                <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
              </div>
            </div>
        </div>
        {/* Results */}
        <div className="bg-slate-900 rounded-lg p-6 flex flex-col justify-between h-full border border-slate-700">
            <div>
                <div className="grid grid-cols-3 divide-x divide-slate-700">
                    <div className="text-center px-2">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Daily</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(daily)}</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weekly</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(weekly)}</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(monthly)}</p>
                    </div>
                </div>
                 <p className="text-center text-xs text-slate-500 mt-3">* "Daily" earnings are per active day.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-md p-4 w-full text-center mt-6">
                <p className="text-sm font-medium text-purple-200">Potential Annual Earnings</p>
                <p className="text-4xl font-extrabold text-white mt-1">{formatCurrency(yearly)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSimulator;
