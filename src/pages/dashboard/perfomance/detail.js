import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { ConvertMinutes, convertStringTime, convertTime } from "../../../helpers/convertTime";

import { Button, Modal, Table } from "antd";
import { getPerfomanceSummary } from "../../../store/actions/perfomance";

export default function PerfomanceDetailComp(props) {
    const { url, filter, perfomanceDetail } = props;

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [summary, setSummary] = useState({})

    const getFilter = (category) => {
        let arr = [];
        let res = [];

        perfomanceDetail.forEach(el => arr.push(el[category]));

        for (const index in arr) {
            if (!res.find(el => el.value === arr[index])) {
                res.push({ text: arr[index], value: arr[index] })
            }
        }

        return res;
    }

    const handleDetail = (row) => {
        const { sessionStart, sessionEnd, name } = row;

        let payload = {
            from: sessionStart,
            to: sessionEnd,
            branch: filter.branch,
            user: name
        }

        let token = localStorage.getItem("token");
        let date = moment(sessionStart).format("YYYY-MM-DD");
        if (row.sessionEnd === "") {
            payload["to"] = moment(date)
                .add(59, "seconds")
                .add(59, "minutes")
                .add(23, "hours")
                .format("YYYY-MM-DD HH:mm:ss")
        }

        dispatch(getPerfomanceSummary(url, token, payload))
            .then((res) => {
                setSummary(res.summary)
                setOpen(true)
            })
    }

    const generateCompModal = () => {
        let res = [];

        let columns = [
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

        for (const key in summary) {
            res.push({ key: key,  category: key, total: summary[key] })
        }

        return <Table bordered size="small" dataSource={res} columns={columns} pagination={false} />;
    }

    const columns = [
        {
            title: "Frontliner",
            dataIndex: "name",
            filterSearch: true,
            filters: getFilter("name"),
            onFilter: (value, record) => record.name === value,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Kategori",
            dataIndex: "staffType",
            filterSearch: true,
            filters: getFilter("staffType"),
            onFilter: (value, record) => record.staffType === value,
        },
        {
            title: "Antrian Selesai",
            dataIndex: "completeQueue",
            sorter: (a, b) => a.completeQueue - b.completeQueue,
        },
        {
            title: "Waktu Mulai",
            dataIndex: "sessionStart",
            sorter: (a, b) => a.sessionStart - b.sessionStart,
            render: (row) => (
                <div>{row}</div>
            )
        },
        {
            title: "Waktu Selesai",
            dataIndex: "sessionEnd",
            sorter: (a, b) => a.sessionEnd - b.sessionEnd,
            render: (row) => (
                <div>{row}</div>
            )
        },
        {
            title: "Waktu Pelayanan",
            dataIndex: "servingTime",
            sorter: (a, b) => a.servingTime - b.servingTime,
            render: (row) => (
                <div>{convertStringTime(row)} ({convertStringTime(row)})</div>
            )
        },
        {
            title: "Waktu Idle",
            dataIndex: "idleTime",
            sorter: (a, b) => a.idleTime - b.idleTime,
            render: (row) => (
                <div>{convertTime(row)} ({convertStringTime(row)})</div>
            )
        },
        {
            title: "Rata-rata Waktu Pelayanan",
            sorter: (a, b) => getAverage(a) - getAverage(b),
            render: (row) => (
                <div>{ConvertMinutes(getAverage(row))}</div>
            )
        },
        {
            title: "",
            render: (row) => (
                <Button onClick={() => handleDetail(row)}>Detail</Button>
            )
        },
    ];

    const getAverage = (value) => {
        let avg = 0
        avg = Number(value.servingTime) / Number(value.completeQueue)

        if (isNaN(avg)) avg = 0

        return avg;
    }

    return (
        <>
            <Modal
                centered
                title="Summary"
                size="default"
                onCancel={() => setOpen(false)}
                open={open}
                footer={false}>
                {generateCompModal()}
            </Modal>
            <Table dataSource={perfomanceDetail} columns={columns} scroll={{ x: 750 }} />
        </>
    )
}