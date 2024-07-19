import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import CustomButton from '../customButton/CustomButton';
import { CgArrowsExpandRight } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";

const StockChart2 = ({ timeframe, chartData, handleTimeframeChange }) => {
    const svgRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (chartData && chartData.length) {
            drawChart();
        }
    }, [chartData]);

    const drawChart = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); 

        // chart dimensions and margins
        const width = 1000;
        const height = 500;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        // Scales
        const x = d3.scaleUtc()
            .domain(d3.extent(chartData, d => new Date(d.date)))
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.close)])
            .range([height - marginBottom, marginTop]);

        const line = d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.close));

        const area = d3.area()
            .x(d => x(new Date(d.date)))
            .y0(y(0))
            .y1(d => y(d.close));

        // SVG container
        const svgElem = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        const defs = svgElem.append('defs');
        defs.append('linearGradient')
            .attr('id', 'areaGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%')
            .selectAll('stop')
            .data([
                { offset: '1%', color: '#4B40EE', opacity: 0.2 },
                { offset: '99%', color: '#4B40EE', opacity: 0 }
            ])
            .enter().append('stop')
            .attr('offset', d => d.offset)
            .attr('stop-color', d => d.color)
            .attr('stop-opacity', d => d.opacity);

        svgElem.append("path")
            .attr("fill", "url(#areaGradient)")
            .attr("d", area(chartData));

        svgElem.append("path")
            .attr("fill", "none")
            .attr("stroke", "#4B40EE")
            .attr("stroke-width", 1.5)
            .attr("d", line(chartData));

        svgElem.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        svgElem.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily close ($)"));

        // Vertical bars :
        if (chartData && chartData.length) {
            const yBar = d3.scaleLinear()
                .domain([0, d3.max(chartData, d => d.volume) * 8])
                .range([height - marginBottom, marginTop]);

            svgElem.selectAll(".bar")
                .data(chartData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(new Date(d.date)) - 2)
                .attr("y", d => yBar(d.volume))
                .attr("width", 4) 
                .attr("height", d => height - marginBottom - yBar(d.volume))
                .attr("fill", "#dedede");
        }

        // Add crosshair lines
        const crosshair = svgElem.append("g")
            .attr("class", "crosshair")
            .style("pointer-events", "none"); 

        crosshair.append("line")
            .attr("class", "crosshair-line-x")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,4");

        crosshair.append("line")
            .attr("class", "crosshair-line-y")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,4");


        const valueLabels = svgElem.append("g")
            .attr("class", "value-labels")
            .style("pointer-events", "none");

        const labelBackgroundX = valueLabels.append("rect")
            .attr("class", "label-background-x")
            .attr("fill", "black") 
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("ry", 3) 
            .attr("opacity", 0.8);

        const labelBackgroundY = valueLabels.append("rect")
            .attr("class", "label-background-y")
            .attr("fill", "black") 
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("opacity", 0.8);

        const labelX = valueLabels.append("text")
            .attr("class", "label-x")
            .attr("fill", "#fff") 
            .attr("font-size", "12px")
            .attr("text-anchor", "middle");

        const labelY = valueLabels.append("text")
            .attr("class", "label-y")
            .attr("fill", "#fff") 
            .attr("font-size", "12px")
            .attr("text-anchor", "middle");

        // Current price labels
        const currentPriceLabel = svgElem.append("g")
            .attr("class", "current-price")
            .style("pointer-events", "none"); 

        const currentPriceBackground = currentPriceLabel.append("rect")
            .attr("class", "current-price-background")
            .attr("fill", "#4B40EE") 
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("opacity", 1);

        const currentPriceText = currentPriceLabel.append("text")
            .attr("class", "current-price-text")
            .attr("fill", "white") 
            .attr("font-size", "12px")
            .attr("text-anchor", "middle"); 

        const lastDataPoint = chartData[chartData.length - 1];
        const lastX = x(new Date(lastDataPoint.date));
        const lastY = y(lastDataPoint.close);

        currentPriceText.text(`${lastDataPoint.close.toFixed(2)}`)
            .attr("x", lastX - 2)
            .attr("y", lastY - 10); 

        const padding = 12;
        const currentPriceBox = currentPriceText.node().getBBox();

        currentPriceBackground
            .attr("x", lastX - 14 - currentPriceBox.width - padding) 
            .attr("y", lastY - 14 - currentPriceBox.height - padding) 
            .attr("width", currentPriceBox.width + 4 * padding) 
            .attr("height", currentPriceBox.height + 2 * padding); 

        // Crosshair
        svgElem.on("mousemove", function (event) {
            const [mx, my] = d3.pointer(event);

            crosshair.select(".crosshair-line-x")
                .attr("x1", mx)
                .attr("x2", mx)
                .attr("y1", marginTop)
                .attr("y2", height - marginBottom);

            crosshair.select(".crosshair-line-y")
                .attr("x1", marginLeft)
                .attr("x2", width - marginRight)
                .attr("y1", my)
                .attr("y2", my);

            const dateText = d3.timeFormat('%Y-%m-%d')(x.invert(mx));
            const priceText = `${y.invert(my).toFixed(2)}`;

            labelX.attr("x", mx)
                .attr("y", height - marginBottom + 20)
                .attr("text-anchor", "middle") 
                .text(`${dateText}`);

            labelY.attr("x", width - marginRight) 
                .attr("y", my - 10)
                .attr("text-anchor", "end") 
                .text(priceText);

            const labelXBox = labelX.node().getBBox();
            labelBackgroundX.attr("x", labelXBox.x - 8) // 16px, 8px
                .attr("y", labelXBox.y - 8)
                .attr("width", labelXBox.width + 16) 
                .attr("height", labelXBox.height + 16);

            const labelYBox = labelY.node().getBBox();
            labelBackgroundY.attr("x", labelYBox.x - 8) 
                .attr("y", labelYBox.y - 8)
                .attr("width", labelYBox.width + 16) 
                .attr("height", labelYBox.height + 16);
        });

        svg.node().appendChild(svgElem.node());
    };

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            svgRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="flex flex-col items-center justify-center mt-4 w-full">
            <div className="flex flex-col items-start justify-center w-full h-full">
                <div className='flex w-[1020px] justify-between py-4'>
                    <div className='flex gap-4'>
                        <p
                            className='cursor-pointer flex gap-2 items-center'
                            onClick={toggleFullscreen}
                        ><CgArrowsExpandRight /> Fullscreen</p>
                        <p className='cursor-pointer flex gap-2 items-center'><IoMdAddCircleOutline /> Compare</p>
                    </div>
                    <div className='flex gap-2'>
                        {['1d', '3d', '1w', '1m', '6m', '1y', 'max'].map(period => (
                            <CustomButton
                                key={period}
                                variant={'primary'}
                                timeframe={period}
                                currentTimeframe={timeframe}
                                onClick={() => handleTimeframeChange(period)}
                            >
                                {period}
                            </CustomButton>
                        ))}
                    </div>
                </div>
                <svg ref={svgRef} width="1000" height="500"></svg>
            </div>
        </div>
    );
};

export default StockChart2;
