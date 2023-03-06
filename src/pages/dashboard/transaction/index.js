import { useState } from "react";
import { CSVLink } from "react-csv";

import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";

export default function TransactionComp(props) {
    const { transactions } = props;

    const [filter, setFilter] = useState("");
    const [dataReport, setDataReport] = useState([...transactions]);

    const getFilter = (category) => {
        let arr = [];
        let res = [];

        transactions.forEach(el => arr.push(el[category]));

        for (const index in arr) {
            if (!res.find(el => el.value === arr[index])) {
                res.push({ text: arr[index], value: arr[index] })
            }
        }

        return res;
    }

    const headers = [
        { label: "Dilayani oleh", key: "servedBy" },
        { label: "Kategori", key: "qCategory" },
        { label: "Transaksi", key: "transaction" },
        { label: "No Antrian", key: "queueNoStr" },
        { label: "Waktu Mulai", key: "startTime" },
        { label: "Waktu Selesai", key: "endTime" },
        { label: "Durasi", key: "duration" },
        { label: "Status", key: "status" },
    ];

    const columns = [
        {
            title: "Dilayani oleh",
            dataIndex: "servedBy",
            filterSearch: true,
            filters: getFilter("servedBy"),
            onFilter: (value, record) => record.servedBy === value,
            sorter: (a, b) => a.servedBy.localeCompare(b.servedBy),
        },
        {
            title: "Kategori",
            dataIndex: "qCategory",
            filterSearch: true,
            filters: getFilter("qCategory"),
            onFilter: (value, record) => record.qCategory === value,
        },
        {
            title: "Transaksi",
            dataIndex: "transaction",
            filterSearch: true,
            filters: getFilter("transaction"),
            onFilter: (value, record) => record.transaction === value,
        },
        {
            title: "No Antrian",
            dataIndex: "queueNoStr",
            sorter: (a, b) => a.queueNoStr.localeCompare(b.queueNoStr),
        },
        {
            title: "Waktu Mulai",
            dataIndex: "startTime",
            sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        },
        {
            title: "Waktu Selesai",
            dataIndex: "endTime",
            sorter: (a, b) => a.endTime.localeCompare(b.endTime),
        },
        {
            title: "Durasi Layanan",
            dataIndex: "duration",
            sorter: (a, b) => a.duration.localeCompare(b.duration),
        },
        {
            title: "Durasi Waktu Tunggu",
            dataIndex: "waitingTime",
            sorter: (a, b) => a.waitingTime.localeCompare(b.waitingTime),
        },
        {
            title: "Status",
            dataIndex: "status",
            filterSearch: true,
            filters: getFilter("status"),
            onFilter: (value, record) => record.status === value,
        },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between mb-2">
                <div className="col-md-5 col-lg-3">
                    <Input
                        autoComplete="off"
                        allowClear
                        name="wild"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        prefix={<SearchOutlined className="me-1" />}
                        placeholder="Search by Dilayani oleh or No Antrian"
                    />
                </div>
                <CSVLink
                    filename="data.csv"
                    data={dataReport.filter((el) =>
                        el.queueNoStr.toLowerCase().includes(filter.toLowerCase()) ||
                        (el.servedBy && el.servedBy.toLowerCase().includes(filter.toLowerCase()))
                    )}
                    headers={headers}>
                    <Button icon={<DownloadOutlined />}>Export</Button>
                </CSVLink>
            </div>
            <Table
                columns={columns} scroll={{ x: 750 }}
                dataSource={[
                    ...transactions.filter((el) =>
                        el.queueNoStr.toLowerCase().includes(filter.toLowerCase()) ||
                        (el.servedBy && el.servedBy.toLowerCase().includes(filter.toLowerCase()))
                    )
                ].map((el, idx) => ({ key: idx, ...el }))}
                onChange={(pagination, filter, sorter, extra) => {
                    setDataReport(extra.currentDataSource)
                }}
            />
        </div>
    )
}