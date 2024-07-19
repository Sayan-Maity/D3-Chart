import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, Label, ResponsiveContainer, Cross } from 'recharts';
import CustomButton from '../customButton/CustomButton';

const StockChart = ({
    timeframe,
    chartData,
    lastDataPoint,
    handleTimeframeChange

}) => {


    return (
        <div className="flex flex-col items-center justify-center mt-4 w-full overflow-y-auto">
            <div className="flex flex-col items-start justify-center w-full h-full">

                <div className='flex w-[1020px] justify-between py-4'>
                    <div className='flex gap-4'>
                        <p>Fullscreen</p>
                        <p>Compare</p>
                    </div>
                    <div className='flex gap-2'>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'1d'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('1d')}
                            >1d</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'3d'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('3d')}
                            
                            >3d</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'1w'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('1w')}
                            
                            >1w</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'1m'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('1m')}
                            
                            >1m</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'6m'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('6m')}

                            >6m</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'1y'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('1y')}
                            >1y</CustomButton>
                        <CustomButton
                            variant={'primary'}
                            timeframe={'max'}
                            currentTimeframe={timeframe}
                            onClick={() => handleTimeframeChange('max')}
                        >max</CustomButton>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%" style={{backgroundColor: "red"}}>
                    <ComposedChart
                        width={500}
                        height={400}
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" scale="band" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                    </ComposedChart>
                </ResponsiveContainer>
                <ComposedChart
                    width={1000}
                    height={400}
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="1%" stopColor="#4B40EE" stopOpacity={0.1} />
                            <stop offset="99%" stopColor="#4B40EE" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="date" scale="band" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#4B40EE"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                    />
                    <Bar
                        dataKey="volume"
                        barSize={5}
                        fill="#dedede"
                    />
                    {lastDataPoint && (
                        <ReferenceDot
                            x={lastDataPoint?.date}
                            y={lastDataPoint?.close}
                            r={5}
                            fill="#4B40EE"
                            stroke="none"
                            isFront={true}
                        >
                            <Label value={`${lastDataPoint.close}`} position="top" fill="#4B40EE" />
                        </ReferenceDot>
                    )}
                </ComposedChart>
            </div>

        </div >
    )
}

export default StockChart
