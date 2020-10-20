import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../components/page/Page';
// import DataStudio from '../components/DataStudio';
// import { Alert } from 'reactstrap';
// import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import BarChart from '../components/charts/BarChart';
import HorizontalStackedChart from '../components/charts/HorizontalStackedChart';
import DoughnutChart from '../components/charts/DoughnutChart';
import { getRecentCharts, getPreviousCharts } from '../redux/clientinfo/user-stats.actions';
import { getActiveCampaigns } from '../redux/campaigns/campaigns.actions';
import { Form, FormGroup, Label, Input, Col, Container, Row } from 'reactstrap';
import '../styles/components/_user-stats-charts.scss';
import { Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css';
import ChartComponent from '../components/charts/ChartComponent';
import '../styles/card.scss';
import SmallStats from '../components/charts/StatsCard';
const fileDownload = require('js-file-download');


const UserStats = ({ getRecentCharts, getPreviousCharts, getActiveCampaigns, activeCampaigns, charts, chartData, smallStats }) => {
    const [campaign, setCampaign] = useState(null);

    const ReactGridLayout = WidthProvider(ResponsiveGridLayout);

    // useEffect(() => {
    //     getRecentCharts(campaign);
    // }, [getRecentCharts, campaign]);

    useEffect(() => {
        getPreviousCharts(campaign);
    }, [getPreviousCharts, campaign]);

    useEffect(() => {
        getActiveCampaigns();
    }, [getActiveCampaigns]);

    const handleChange = (event) => {
        // Destroy previous charts
        setCampaign(event.target.value);
    }
    const handleDownload = () => {
        fileDownload(JSON.stringify(chartData), 'charts.json');
      }
    const width = 6
    const height = width * 1.4;

    const layout = [
        { i: 'a', x: 0, y: 0, w: width, h: height, isResizable: false },
        { i: 'b', x: 6, y: 0, w: width, h: height, isResizable: false },
        { i: 'c', x: 0, y: 10, w: width, h: height, isResizable: false },
        { i: 'd', x: 6, y: 10, w: width, h: height, isResizable: false }
    ];

    const layoutSm = [
        { i: 'a', x: 0, y: 0, w: width - 2, h: height - 3, isResizable: false },
        { i: 'b', x: 6, y: 0, w: width - 2, h: height - 3, isResizable: false },
        { i: 'c', x: 0, y: 10, w: width - 2, h: height - 3, isResizable: false },
        { i: 'd', x: 6, y: 10, w: width - 2, h: height - 3, isResizable: false }
    ];

     console.log(chartData);


    // if (charts) {
    return (
        <Page
            className="Audience"
            title="Audience"
            breadcrumbs={[{ name: `Audience`, active: false }]}
        >
            
            <Form style={{
                width: '45vw',
                maxWidth: '400px'
            }}>
                <FormGroup>
                    <Label for="exampleSelect">Select a campaign</Label>
                    <Input type="select" name="select" id="exampleSelect" defaultValue="-1" onChange={handleChange}>
                        <option disabled value="-1">Select a campaign</option>
                        {
                            activeCampaigns && activeCampaigns.map((c) => {
                                return (
                                    <option key={c} value={c}>{c}</option>
                                )
                            })
                        }
                    </Input>
                </FormGroup>
            </Form>



            {/* <LineChart /> */}
            {
                campaign &&
                <>
                    {/* <Container fluid={true}>
                        <Row>
                            {smallStats && smallStats.map((stats, idx) => (
                                <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                                    <SmallStats
                                        id={`small-stats-${idx}`}
                                        variation="1"
                                        chartData={stats.datasets}
                                        chartLabels={stats.chartLabels}
                                        label={stats.label}
                                        value={stats.value}
                                        percentage={stats.percentage}
                                        increase={stats.increase}
                                        decrease={stats.decrease}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Container> */}
                    {/*<div>
                          <Button color="warning" onClick={() => handleDownload()} style={{ marginLeft: "auto" }}>Download</Button>

                    </div>*/}
                    <ReactGridLayout
                        className="layout charts-container"
                        layouts={{
                            lg: layout,
                            md: layout,
                            sm: layoutSm,
                            xs: layoutSm,
                            xxs: layoutSm
                        }}
                        draggableHandle=".chart-handle"
                        breakpoints={{ lg: 1080, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={40}
                    >
                        <div key="a" className="chart-container">
                            <ChartComponent defaultType='horizontalBar' chart='basic' />
                        </div>
                        <div key="b" className="chart-container">
                            <ChartComponent defaultType='bar' chart='deliveryStatuses' />
                        </div>
                        <div key="c" className="chart-container">
                            <ChartComponent defaultType='doughnut' chart='feedback' />
                        </div>
                        <div key="d" className="chart-container">
                            <ChartComponent defaultType='bar' chart='misc' />
                        </div>
                    </ReactGridLayout>
                </>
            }
            {/* <PieChart /> */}

        </Page>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        charts: state.userStats.charts && state.userStats.charts[ownProps.chart],
        activeCampaigns: state.campaigns.activeCampaigns,
        chartData :   state.userStats.previousCharts 
    }
}

const mapDispatchToProps = (dispatch) => ({
    getRecentCharts: (campaign) => {
        dispatch(getRecentCharts(campaign));
    },
    getPreviousCharts: (campaign) => {
        dispatch(getPreviousCharts(campaign));
    },
    getActiveCampaigns: () => {
        dispatch(getActiveCampaigns());
    }
})

UserStats.defaultProps = {
    smallStats: [
        {
            label: "Impressions",
            value: 45612,
            percentage: "159%",
            increase: true,
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [197, 624, 3721, 17575, 45612]
                }
            ]
        },
        {
            label: "Reach",
            value: 27503,
            percentage: "92%",
            increase: true,
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [154, 316, 3206, 14280, 27503]
                }
            ]
        },
        {
            label: "Profile Views",
            value: 30,
            percentage: "41%",
            increase: false,
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [8, 76, 15, 51, 30]
                }
            ]
        },
        {
            label: "Follower Count",
            value: 5,
            percentage: "37%",
            increase: true,
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [2, 6, 4, 8, 5]
                }
            ]
        },
        {
            label: "Website Clicks",
            value: 2,
            percentage: "100%",
            increase: true,
            // decrease: true,
            chartLabels: [null, null, null, null, null],
            attrs: { md: "4", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [0, 2, 5, 1, 2]
                }
            ]
        }

    ],
    chartStats: [
        {
            labels: [],
            datasets: [
                {
                    label: 'Impressions',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                },
                {
                    label: 'Reach',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(237,206,69,0.4)',
                    borderColor: 'rgba(237,206,69,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(237,206,69,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(237,206,69,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                }
            ]
        }

    ],

    genderStats: [
        {
            datasets: [{
                data: [4034, 1276, 17],
                labels: ["Male", "Female", "Unknown"],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            },
            {
                data: [32, 1439, 2052, 332, 77, 23, 25, 12, 327, 674, 183, 52, 16, 12, 0, 4, 7, 6, 0, 0, 0],
                labels: ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                ],

            }
            ]
        }

    ],
    chartOptions: [{
        responsive: true,
        // title: {
        //     display : true,
        //     text: "This is Title",
        //     position:'bottom'
        // },
        tooltips: {
            backgroundColor: "grey",
            callbacks: {
                label: function (tooltipItem, data) {
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    var index = tooltipItem.index;
                    return dataset.labels[index] + ': ' + dataset.data[index];
                },
            }
        }

    }]
};

export default connect(mapStateToProps, mapDispatchToProps)(UserStats);