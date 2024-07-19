import { useState } from 'react';
import CustomTab from '../tab/CustomTab';
import StockChart from '../stockChart/StockChart';
import StockChart2 from '../stockChart/StockChart2';

const CustomTabList = ({
    timeframe,
    chartData,
    lastDataPoint,
    handleTimeframeChange
}) => {
    const [activeTab, setActiveTab] = useState('Chart2');

    const tabs = [
        { name: 'Summary', content: 'Summary Content' },
        {
            name: 'Chart',
            content: <StockChart
                timeframe={timeframe}
                chartData={chartData}
                lastDataPoint={lastDataPoint}
                handleTimeframeChange={handleTimeframeChange}
            />
        },
        {
            name: 'Chart2',
            content: <StockChart2
                timeframe={timeframe}
                chartData={chartData}
                lastDataPoint={lastDataPoint}
                handleTimeframeChange={handleTimeframeChange}
            />
        },
        { name: 'Statistics', content: 'Statistics Content' },
        { name: 'Analysis', content: 'Analysis Content' },
        { name: 'Settings', content: 'Settings Content' },
    ];

    return (
        <div className='w-full'>
            <div className="text-sm font-medium text-center border-b border-gray-200 w-full">
                <ul className="flex flex-row flex-wrap -mb-px">
                    {tabs.map((tab, index) => (
                        <CustomTab
                            key={index}
                            tab={tab}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    ))}
                </ul>
            </div>
            <div className="p-4 text-center">
                {tabs.find(tab => tab.name === activeTab)?.content}
            </div>
        </div>
    );
};

export default CustomTabList;
