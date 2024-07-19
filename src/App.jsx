
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatStartDate } from './common/formatStartDate';
import { formatFinalDate } from './common/formatFinalDate';
import CustomTabList from './components/tabList/CustomTabList';

function App() {
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY

  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('6m');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return formatFinalDate(now, 180); // 6 months ago
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return formatStartDate(now); // Current date
  });


  useEffect(() => {
    const getDailyEODData = async () => {
      console.log("API called");
      try {
        const res = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/NVDA?from=${startDate}&to=${endDate}&apikey=${API_KEY}`);
        const historicalData = res.data.historical.map(entry => ({
          ...entry,
          volume: entry.volume / 10000000
        }));
        // console.log("Fetched data:", historicalData);
        setChartData(historicalData.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        console.log(err);
      }
    };
    getDailyEODData();
  }, [timeframe, endDate, startDate]);

  const handleTimeframeChange = (newTimeframe) => {
    const now = new Date();
    setTimeframe(newTimeframe);

    if (newTimeframe === '1d') {
      setStartDate(formatFinalDate(now, 1));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === '3d') {
      setStartDate(formatFinalDate(now, 3));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === '7d') {
      setStartDate(formatFinalDate(now, 7));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === '1m') {
      setStartDate(formatFinalDate(now, 30));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === '6m') {
      setStartDate(formatFinalDate(now, 180));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === '1y') {
      setStartDate(formatFinalDate(now, 365));
      setEndDate(formatStartDate(now));
    } else if (newTimeframe === 'max') {
      setStartDate('2000-01-01');
      setEndDate(formatStartDate(now));
    }
  };

  const lastDataPoint = chartData[chartData.length - 1];
  const firstDataPoint = chartData[0];
  // Calculate the difference
  const difference = Math.abs((firstDataPoint?.open - firstDataPoint?.close).toFixed(2));
  // Calculate the percentage change
  let percentageChange = (((lastDataPoint?.close - firstDataPoint?.close) / firstDataPoint?.close) * 100).toFixed(2);
  percentageChange = percentageChange < 0 ? percentageChange.substring(1) : percentageChange;
  // Determine the sign for the difference
  const sign = lastDataPoint?.close > firstDataPoint?.close ? '+' : '-';
  const rateOfReturn = `${sign}${difference} (${percentageChange}%)`;


  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] mt-10">
      <div className="flex flex-col items-start justify-start w-[1200px] h-full">

        <div className={`flex flex-col gap-4 items-start w-full `}>
          <div className='flex gap-2'>
            <p className="text-6xl">{lastDataPoint?.close}</p>
            <p className="text-xl text-[#b4b4b4]">USD</p>
          </div>
          <p className={`${(lastDataPoint?.close - firstDataPoint?.close) < 0 ? 'text-[red]' : 'text-[#2bc242]'}`}>{rateOfReturn}</p>
        </div>

        <CustomTabList
          timeframe={timeframe}
          chartData={chartData}
          lastDataPoint={lastDataPoint}
          handleTimeframeChange={handleTimeframeChange}
        />

      </div>

    </div>
  );
}

export default App;

