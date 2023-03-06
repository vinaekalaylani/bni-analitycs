import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { convertStringTime, convertTime } from "../../../helpers/convertTime";

export default function PerfomanceComp(props) {
    const { perfomanceChart } = props;

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement
    );

    const getLabel = (value) => {
        if (value) {
            let label = []
            for (let i = 0; i < value.length; i++) {
                label.push(value[i].name + " (" + value[i].staffType + ")")
            }
            return label
        }
    }

    const getData = (value) => {
        if (value) {
            let data = { busy: [], idle: [] }
            for (let i = 0; i < value.length; i++) {
                data.busy.push(value[i].servingTime)
                data.idle.push(value[i].idleTime)
            }
            return data
        }
    }

    const data = {
        labels: getLabel(perfomanceChart),
        datasets: [
            {
                label: "Layanan",
                data: getData(perfomanceChart).busy,
                backgroundColor: "#1890ff",
            },
            {
                label: "Idle",
                data: getData(perfomanceChart).idle,
                backgroundColor: "#f56a00",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
                text: "Chart.js Bar Chart",
            },
            tooltip: {
                callbacks: {
                    label: function (data) {
                        return convertStringTime(data.raw);
                    }
                }
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return convertTime(value)
                    }
                }
            }
        }
    };

    return (
        <div>
            <div className="fw-bold text-dark" style={{ fontSize: "1.8em" }}>Performa</div>
            <div style={{ height: "35vh" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}