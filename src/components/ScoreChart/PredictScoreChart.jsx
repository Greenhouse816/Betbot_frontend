/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getRaceHorseScores } from "../../apis";
import { getDateString } from "../../utils";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  cornerRadius: 10,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      beginAtZero: true,
      ticks: {
        color: "#667085",
      },
      border: {
        color: "#667085",
      },
    },
    y: {
      grid: {
        display: true,
        color: "#98A2B3",
        offset: false,
      },
      border: {
        dash: [5, 5],
        color: "#667085",
        offset: 5
      },
      ticks: {
        color: "#667085",
      },
    },
  },
};

const Dropdown = () => {

    const [val, setVal] = useState (1)
    const [selected, setSelected] = useState (false)
    
    return (
        <div className="relative w-full flex flex-col items-center">
            <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className='text-black-2 w-full text-ellipsis overflow-hidden font-medium rounded-md text-sm px-4 tracking-wide text-center inline-flex items-center justify-center leading-8'
                type="button"
                onClick={()=>setSelected(!selected)}
            >
                {val}
                <svg
                    className="w-2.5 h-2.5 ml-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="#6F6E84"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            <div
                id="dropdown"
                className={
                    selected
                        ? `z-20 bg-v3-primary border absolute border-primary divide-y divide-gray-100 rounded-lg shadow bg-white mt-8 overflow-y-auto max-h-[500px]`
                        : `hidden`
                }
                style={{ width: `${100}px` }}
            >
                { Array.from({length: 10}).map ((_, idx) => 
                <ul
                    className={`py-2 text-sm text-v3-primary font-medium dark:text-gray-200`}
                    aria-labelledby="dropdownButton"
                    key={idx}
                >
                    <li onClick={() => {setVal (idx + 1); setSelected(false)}}>
                        <a className="flex flex-row items-center px-4 py-2 hover:bg-dropdown cursor-pointer">
                            {idx + 1}
                        </a>
                    </li>
                </ul>
                )}
            </div>
        </div>
    )
}

const PredictScoreChart = ({ startDate, venue, number, condition, height }) => {
  const [scores, setScores] = useState ()
  const [labels, setLabels] = useState ()
  const [data, setData] = useState ()

  const initialize = useCallback(async() => {
    if (startDate === undefined) return
    
    if (number > 0 && venue !== "") {
        try {
            const resp = await getRaceHorseScores(getDateString(startDate), venue, number, condition)
            
            setScores (resp)
        } catch (e) {
            console.log (e)
        }
    }
}, [startDate, venue, number, condition])

    useEffect(() => {
        initialize ()
    }, [initialize])

    useEffect (() => {
        if (!scores || (scores && Object.keys(scores).length == 0)) return
        const tmpLabels = Object.keys(scores)
        setLabels (tmpLabels)
        const tmpData = {
            labels: tmpLabels,
            datasets: [
            {
                label: "",
                data: Object.keys(scores).map((horseName) => (scores[horseName]).toFixed(2)),
                borderWidth: 0,
                backgroundColor: "#2E90FA",
                borderRadius: 10,
                borderOffset: 50
            },
            ],
        };
        setData (tmpData)
    }, [scores])
    
    let plugins = [
        {
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.save();
                var xAxis = chart.scales["x"];

                // eslint-disable-next-line react/prop-types
                var barArray = chart.getDatasetMeta(data.datasets.length - 1).data

                xAxis.ticks.forEach((v, i) => {
                    try {
                        const { x, y } = barArray[v.value];
                        var value = 0;
                        for (let d of chart.data.datasets) {
                            value += Number(d.data[v.value]);
                        }
                        ctx.textAlign = "center";
                        ctx.font = "12px Arial";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(value, x - 15, y + 4);
                    } catch (e) {
                        console.log("afterDraw call failed", e.message)
                    }
                });
                ctx.restore();

            },
        },
    ];

    return (
        <div className="flex flex-col bg-grey-4 w-full border rounded-[10px] border-grey-2" >
            <div className="grid grid-cols-12 border-b border-grey-2">
                <div className="flex flex-row items-center p-5 text-black-2 text-xl font-bold leading-6 col-span-2">Form Score</div>
                <div className="col-span-10 grid grid-cols-17 border-l border-grey-2">
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Barrier</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Weight</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Class</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">AVG$</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Career/F</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Career/W</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Career/P</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Condition</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Distance</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Track</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Jockey</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Trainer</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Settling</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">600m</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Speed</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Lst/Fn</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6 border-b border-grey-2">Lst/Mgn</div>
                        <div className="text-center p-5 text-black-1 text-sm font-normal leading-6">
                            <Dropdown />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
            {
                data && height > 0 &&
                <div className="py-6 px-6 w-full"  style={{height: height === 0? 300: height}}>
                <Bar options={options} data={data} plugins={plugins}/>
                </div>
            }
            {
                (!data || height === 0) &&
                <div className="h-[490px] p-5">
                <Skeleton
                    baseColor="#EAECF0"
                    style={{ height: 450 }}
                    highlightColor="#D9D9D9"
                />
                </div>
            }
            </div>
        </div>
    );
};

export default PredictScoreChart;
