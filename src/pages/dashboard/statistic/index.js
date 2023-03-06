import { Table } from "antd";
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
import { Pie } from "react-chartjs-2";

export default function StatisticComp({ filter, statistic }) {
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
                label.push(value[i].name)
            }
            return label
        }
    }

    const getData = (value) => {
        if (value) {
            let qty = []
            for (let i = 0; i < value.length; i++) {
                qty.push(value[i].qty)
            }
            return qty
        }
    }

    const getPercentage = (value, data) => {
        if (value) {
            let percentage = 0
            let amount = 0
            for (let i = 0; i < data.length; i++) {
                amount = amount + Number(data[i].qty)
            }
            percentage = (Number(value) / Number(amount) * 100).toFixed(1)
            return percentage + "%"
        }
    }

    const htmlLegendPlugin = {
        id: "htmlLegend",
        afterUpdate(chart, args, options) {
            const ul = getOrCreateLegendList(chart, options.containerID);

            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }

            // Reuse the built-in legendItems generator
            const items = chart.options.plugins.legend.labels.generateLabels(chart);

            items.forEach((item, idx) => {
                const li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.fontSize = "13px";

                li.onclick = () => {
                    const { type } = chart.config;
                    if (type === "pie" || type === "doughnut") {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        chart.toggleDataVisibility(item.index);
                    } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    chart.update();
                };

                // Color box
                const box = document.createElement("div");
                const boxSpan = document.createElement("span");
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.marginRight = "10px";
                boxSpan.style.height = "15px";
                boxSpan.style.width = "15px";
                box.appendChild(boxSpan)

                // Text
                const textContainer = document.createElement("p");
                textContainer.style.color = "#000000D9";
                textContainer.style.margin = 0;
                textContainer.style.padding = 0;
                textContainer.style.textDecoration = item.hidden ? "line-through" : "";

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(box);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        }
    };

    const getOrCreateLegendList = (chart, id) => {
        const legendContainer = document.getElementById(id)
        let listContainer = legendContainer.querySelector("ul")
        if (!listContainer) {
            listContainer = document.createElement("ul")
            listContainer.style.paddingLeft = "1rem"

            legendContainer.appendChild(listContainer)
        }
        return listContainer
    }



    const generateColor = (datas) => {
        const colors = {
            "Transaksi Lainnya Finansial" : "#2560a8",
            "Overbooking" : "#1F8FE5",
            "Tarik Tunai" : "#9FE7F5",
            "Setor Tunai WIC" : "#429EBD",
            "Setoran Tunai" : "#053F5C",
            "Kliring" : "#f56a00",
            "RTGS" : "#ff9c38",
            "Payment BRIVA" : "#F8D981",
            "Cash Management System" : "#0F6360",
            "Layanan Fasilitas Cek/Bilyet Giro" : "#71B27E",
            "Registrasi Notifikasi (SMS/WA/EMAIL)" : "#DFF8CA",
            "Registrasi Internet Banking" : "#288994",
            "Pencairan Deposito" : "#FFCB9B",
            "Pencairan Cek/BG/Bilyet" : "#EE6C4D",
            "Penggantian Buku Tabungan" : "#E0FBFC",
            "Transaksi Lainnya Non Finansial" : "#98C1D9"
        }

        let res = [];
        for (const index in datas) {
            res.push(colors[datas[index].name])
        }

        return res;
    } 

    const generatePieChart = () => {
        let res = [];
        let total = [];

        for (const category in statistic) {
            const data = {
                labels: getLabel(statistic[category]),
                datasets: [
                    {
                        data: getData(statistic[category]),
                        backgroundColor: generateColor(statistic[category]),
                        borderColor: generateColor(statistic[category]),
                        borderWidth: 1
                    },
                ],
            }

            const options = {
                maintainAspectRatio: false,
                plugins: {
                    htmlLegend: {
                        // ID of the contaoner to put the legend in
                        containerID: "legend-container-" + category
                    },
                    legend: {
                        display: false,
                        // position: "right",
                    },
                    tooltip: {
                        titleFont: {
                            size: 11
                        },
                        bodyFont: {
                            size: 11
                        },
                        footerFont: {
                            size: 11 // there is no footer by default
                        },
                        displayColors: false,
                        callbacks: {
                            title: function () {
                                return ""
                            },
                            label: function (data) {
                                return data.label;
                            },
                            afterLabel: function (data) {
                                return "Persentase : " + getPercentage(data.raw, statistic[category]);
                            },
                            afterBody: function ([data]) {
                                return "Jumlah Transaksi : " + data.formattedValue;
                            },
                            beforeFooter: function ([data]) {
                                let [value] = statistic[category].filter(e => e.name === data.label)
                                if (Number(value.totalAmount) > 0) {
                                    return "    Nominal Transaksi : " + value.totalAmount.toLocaleString("en-US");
                                }
                            },
                        }
                    },
                }
            }

            let tempTotal = 0
            for (const index in statistic[category]) {
                tempTotal += statistic[category][index].qty
            }

            total.push({ key: category, category: category, total: tempTotal })

            res.push(
                <div className="col-lg-4 mb-4" key={category}>
                    <div className="mb-2 fw-bold" style={{ height: "4vh", fontSize: "1.3em" }}>{category}</div>
                    <div className="d-flex">
                        <div className="col-7" style={{ height: "17vh" }}>
                            <Pie
                                plugins={[htmlLegendPlugin]}
                                data={data}
                                options={options}
                            />
                        </div>
                        <div className="col-5">
                            <div id={"legend-container-" + category}></div>
                        </div>
                    </div>
                </div>
            )
        }

        let columnsTotal = [
            {
                title: "Kategori",
                dataIndex: "category",
                sorter: (a, b) => a.category.localeCompare(b.category),
            },
            {
                title: "Total",
                dataIndex: "total",
                align: "center",
                sorter: (a, b) => a.total - b.total,
            },
        ];

        if (Object.keys(statistic).length > 0) {
            res.push(
                <div className={(Object.keys(statistic).length % 3 === 0) ? "col-lg-4 mx-auto mb-4" : "col-lg-4 mb-4"} key="table">
                    <div className="mb-2 fw-bold" style={{ height: "4vh", fontSize: "1.3em" }}>Ringkasan</div>
                    <Table bordered size="small" dataSource={total} columns={columnsTotal} pagination={false} />
                </div>
            )
        }

        return res;
    }

    return (
        <div className="row mb-4" style={{ flexWrap: "wrap" }}>
            <div className="fw-bold text-dark mb-2" style={{ fontSize: "1.8em" }}>Statistik</div>
            {generatePieChart()}
        </div>
    )
}