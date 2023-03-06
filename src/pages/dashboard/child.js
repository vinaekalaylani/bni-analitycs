import moment from "moment";

import TransactionComp from "./transaction";
import StatisticComp from "./statistic";
import PerfomanceComp from "./perfomance";
import PerfomanceDetailComp from "./perfomance/detail";
import { Summary1Comp, Summary2Comp, Summary3Comp } from "./summary";

import { DatePicker, Select, Tabs } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ChildDashboard(props) {
    const { url, filter, setFilter, summary, statistic, transactions, perfomanceChart, perfomanceDetail } = props;

    const onChange = (name, value) => {
        if (name === "date" && (value[0] === "" && value[1] === "")) {
            let date = [moment(new Date(Date.now())).format("YYYY-MM-DD"), moment(new Date(Date.now())).format("YYYY-MM-DD")]
            setFilter({ ...filter, [name]: date })
        } else {
            setFilter({ ...filter, [name]: value })
        }
    }

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    }

    const getBranch = () => {
        let res = []
        const branch = JSON.parse(localStorage.getItem("branches"))
        for (let i = 0; i < branch.length; i++) {
            res.push(<Option key={i} value={branch[i].code}>{branch[i].name}</Option>)
        }
        return res
    }

    return (
        <div style={{ marginTop: "-10px" }}>
            <div className="row">
                <div className="col-md-4 text-dark fw-bold">
                    <div style={{ fontSize: "2em" }}>Customer Behavior Analytics</div>
                </div>
                <div className="col-md-4 d-flex flex-column my-3 my-md-0">
                    <div className="d-flex fw-bold">
                        <div className="col-6">Start Date</div>
                        <div className="col-6">End Date</div>
                    </div>
                    <RangePicker
                        className="w-100 my-auto"
                        disabledDate={disabledDate}
                        value={[moment(filter.date[0], "YYYY-MM-DD"), moment(filter.date[1], "YYYY-MM-DD")]}
                        onChange={(_, date) => onChange("date", date)}
                    />
                </div>
                <div className="col-md-4 d-flex flex-column">
                    <div className="fw-bold">Uker</div>
                    <Select
                        className="w-100 my-auto"
                        showSearch
                        value={filter.branch}
                        onChange={(e) => onChange("branch", e)}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        {localStorage.getItem("level") === "1" && (<Option value=""> All Branch</Option>)}
                        {getBranch()}
                    </Select>
                </div>
            </div>
            {/* Summary 1 */}
            <Summary1Comp summary={summary} perfomanceDetail={perfomanceDetail} filter={filter}/>
            {filter.branch === "" ? (
                <>
                    <div className="mt-4">
                        {/* Summary 3 */}
                        <Summary3Comp summary={summary} filter={filter} />
                    </div>
                    <div>
                        {/* Statistic Comp */}
                        <StatisticComp filter={filter} statistic={statistic} />
                    </div>
                </>
            ) : (
                <>
                    <div className="row mt-lg-4">
                        <div className="col-lg-9 order-1 order-lg-0">
                            {/* Statistic Comp */}
                            <StatisticComp filter={filter} statistic={statistic} />
                            {/* Perfomance Comp */}
                            <PerfomanceComp perfomanceChart={perfomanceChart} />
                        </div>
                        {/* Summary 2 */}
                        <Summary2Comp summary={summary} perfomanceDetail={perfomanceDetail} filter={filter} />
                    </div>
                    <div className="mt-4">
                        <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    key: "1",
                                    label: "Performa Frontliner",
                                    children: <PerfomanceDetailComp url={url} filter={filter} perfomanceDetail={perfomanceDetail} />,
                                },
                                {
                                    key: "2",
                                    label: "Detail Transaksi",
                                    children: <TransactionComp transactions={transactions} />,
                                }
                            ]}
                        />
                    </div>
                </>
            )}
        </div>
    )
}