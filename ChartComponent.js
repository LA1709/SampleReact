import React, { useEffect, useRef, useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Chart from 'chart.js';
import { connect } from 'react-redux';
import { IoMdReorder } from 'react-icons/io'
import { AiOutlineEllipsis, AiFillDatabase} from 'react-icons/ai'

const ChartComponent = (props) => {
    let chartRef = useRef();
    let chart = useRef();
    let optionsRef = useRef();
    let dataRef = useRef();
    const [type, setType] = useState(props.defaultType);
    const [data, setData] = useState(props.recentChart?props.chart==="misc"?Object.keys(props.recentChart)[0]:'':'');
    const [showDailyData, setShowDailyData] = useState(false);

    const handleChange = (event) => {
        // Destroy previous charts
        // console.dir(event.target.id)
        setType(event.target.id);
    }
    
    const handleDataChange = (event) => {
        setData(event.target.id);
    }

    let differenceInData = {};

    let headings = {
        "basic": "Basic",
        "deliveryStatusses": "Delivery Status",
        "feedback": "Feedback",
        "misc": "Miscellaneous"
    }

    // if (props.recentChart && props.previousChart) {
    //     for (let key in props.recentChart.options) {
    //         let recentValue = props.recentChart.options[key];
    //         let previousValue = props.previousChart.options[key];

    //         let differenceArray = [];

    //         for (let i = 0; i < recentValue.length; i++) {
    //             differenceArray.push(recentValue[i] - previousValue[i]);
    //         }

    //         differenceInData = {
    //             ...differenceInData,
    //             [key]: differenceArray
    //         }
    //     }

        //console.log(differenceInData);
    // }

    useEffect(() => {
        if (chart.current !== undefined) {
            chart.current.destroy();
        }

        let bg;
        let datasets = [];
        let options = {
            title: {
                display: false,
                text: props.recentChart && props.chart
            },
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
        switch (type) {
            case 'pie':
            case 'doughnut':
                bg = props.recentChart && Object.keys(
                        props.chart==="misc"?props.recentChart[data]:props.recentChart
                    ).map(() => 
                        `rgba(${Math.floor(Math.random() * Math.floor(255))},
                        ${Math.floor(Math.random() * Math.floor(255))},
                        ${Math.floor(Math.random() * Math.floor(255))}, 0.7`
                    )
                options.legend = {
                    position: 'right'
                }
                options.scales.xAxes[0].gridLines = {
                    display: false
                }
                options.scales.yAxes[0].gridLines = {
                    display: false
                }
                options.scales.xAxes[0].ticks = {
                    display: false
                }
                options.scales.yAxes[0].ticks = {
                    display: false
                }
                break;
        }

        if (!showDailyData) {
            let datarr = props.recentChart && Object.entries(
                props.chart==="misc"?props.recentChart[data]:props.recentChart
            ).map((option) => {
                return option[1]
            })
            switch (type) {
                case 'bar':
                    bg = `rgba(${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, 0.7`;
                    break;

                case 'horizontalBar':
                    bg = `rgba(${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, 0.7`;
                    break;

                case 'line':
                    bg = `rgba(${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, 0.7`;
                    break;
            }
            datasets.push({
                label: "No.",
                data: datarr,
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: bg,
                hoverBackgroundColor: bg,
                fill: type === 'line' ? false : true
            })
        }
        else {
            datasets = differenceInData && Object.entries(differenceInData).map((option) => {
            // console.log(option);
                switch (type) {
                    case 'bar':
                    case 'horizontalBar':
                    case 'line':
                        bg = `rgba(${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, ${Math.floor(Math.random() * Math.floor(255))}, 0.7`;
                        break;
                }

                return {
                    label: option[0],
                    data: option[1],
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: bg,
                    hoverBackgroundColor: bg,
                    fill: false,
                }
            })
        }

        let chartData = {
            type: type,
            data: {
                labels: props.recentChart?props.chart==="misc"?
                    Object.keys(props.recentChart[data]):
                    Object.keys(props.recentChart):'',
                datasets: datasets
            },
            options: options
        }
        chart.current = new Chart(chartRef.current, chartData);
    }
    );

    return (
        <div className="bar">
            <div className="chart-nav">
                <div className="chart-handle">
                    <IoMdReorder className="icon" />
                </div>
                {props.recentChart && <h5>{headings[props.chart]}</h5>}
                <div className="chart-change">
                    {props.chart==="misc" && (
                        <div className="icon-wrapper" onClick={() => {
                            dataRef.current.classList.toggle('show')
                        }}>
                            <AiFillDatabase className="data-icon"/>
                        </div>
                    )}
                    <div className="icon-wrapper" onClick={() => {
                    optionsRef.current.classList.toggle('show')
                    }}>
                        <AiOutlineEllipsis className="icon" />
                    </div>
                </div>
                {props.chart==="misc" && (
                    <div className="options data-options" ref={dataRef}>
                        <li className="option-description">Choose Data</li>
                        {props.recentChart && Object.keys(props.recentChart).map(key => 
                            <li id={key} key={key} className="option" onClick={(e) => {
                                dataRef.current.classList.remove('show')
                                handleDataChange(e)
                            }}>{key}</li>
                        )}
                    </div>
                )}
                <div className="options chart-options" ref={optionsRef}>
                    <li className="option-description">Convert Chart</li>

                    <li id="bar" className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show')
                        handleChange(e)
                    }}>Bar</li>

                    <li id="doughnut" className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show')
                        handleChange(e)
                    }}>Doughnut</li>

                    <li id="pie" className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show')
                        handleChange(e)
                    }}>Pie</li>

                    <li id="horizontalBar" className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show')
                        handleChange(e)
                    }}>Horizontal Bar</li>

                    <li id="line" className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show')
                        handleChange(e)
                    }}>Line</li>

                    {/* <div className="divider" />
                    <li className="option" onClick={(e) => {
                        optionsRef.current.classList.remove('show');
                        setShowDailyData(!showDailyData);
                    }}>
                        {!showDailyData ? (
                            <span>Show last 24 hr data</span>
                        ) : (
                                <span>Show cumulative data</span>
                            )
                        }
                    </li> */}
                </div>
                {/* <Form className="type-select">
                    <FormGroup>
                        <Label for="chart-type">Select a campaign</Label>
                        <Input type="select" name="select-chart-type" id="chart-type" defaultValue="-1" onChange={handleChange}>
                            <option disabled value="-1">Change chart type</option>
                            <option value="bar">Bar</option>
                            <option value="doughnut">Doughnut</option>
                            <option value="pie">Pie</option>
                            <option value="line">Line</option>
                        </Input>
                    </FormGroup>
                </Form> */}
            </div>
            <canvas ref={chartRef} className="chart" id="myBarChart"></canvas>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        // recentChart: state.userStats.recentCharts && state.userStats.recentCharts[ownProps.chart],
        previousChart: state.userStats.previousCharts && state.userStats.previousCharts[ownProps.chart],
        recentChart: state.userStats.previousCharts && state.userStats.previousCharts[ownProps.chart]
    }
}

export default connect(mapStateToProps)(ChartComponent);