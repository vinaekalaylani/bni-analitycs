import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import HeaderComp from "../../components/header";
import FooterComp from "../../components/footer";

import { getSummary, setSummary } from "../../store/actions/summary";
import { getStatistic, setStatistic } from "../../store/actions/statistic";
import { getTransactions, setTransactions } from "../../store/actions/transaction";
import { getPerfomance, getPerfomanceChart, setPerfomance, setPerfomanceChart, setPerfomanceDetail } from "../../store/actions/perfomance";

import { Card, Layout, Spin } from "antd";
import moment from "moment";
const { Content } = Layout;

export default function MainLayout(props) {
    const { children, url, reloadTime } = props;

    const token = localStorage.getItem("token");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { statistic } = useSelector(state => state.statistic);
    const { summary, isLoading } = useSelector(state => state.summary);
    const { transactions } = useSelector(state => state.transaction);
    const { perfomance, perfomanceChart, perfomanceDetail } = useSelector(state => state.perfomance);

    const [filter, setFilter] = useState({
        date: [moment(new Date(Date.now())).format("YYYY-MM-DD"), moment(new Date(Date.now())).format("YYYY-MM-DD")],
        branch: localStorage.getItem("level") !== "1" ? JSON.parse(localStorage.getItem("branches"))[0].code : ""
    })

    const getData = useCallback(() => {
        if (new Date(Date.now()) < new Date(localStorage.getItem("expired_token"))) {
            if (url) {
                dispatch(getSummary(url, token, filter))
                    .then(() => { })
                    .catch((err) => console.log(err))
                dispatch(getStatistic(url, token, filter))
                    .then(() => { })
                    .catch((err) => console.log(err))
                dispatch(getPerfomance(url, token, filter))
                    .then(() => { })
                    .catch((err) => console.log(err))
                dispatch(getPerfomanceChart(url, token, filter))
                    .then(() => { })
                    .catch((err) => console.log(err))
                dispatch(getTransactions(url, token, filter))
                    .then(() => { })
                    .catch((err) => console.log(err))
            }
        } else {
            dispatch(setSummary({}));
            dispatch(setStatistic({}));
            dispatch(setTransactions([]));
            dispatch(setPerfomance([]));
            dispatch(setPerfomanceChart([]));
            dispatch(setPerfomanceDetail([]));

            let last_login = localStorage.getItem("login_time");

            localStorage.removeItem("user");
            localStorage.removeItem("level");
            localStorage.removeItem("login_time");
            localStorage.removeItem("branches");
            localStorage.removeItem("token");
            localStorage.removeItem("expired_token");
            localStorage.setItem("last_login", last_login);
            navigate("/login");
        }
    }, [dispatch, navigate, url, token, filter]);

    useEffect(() => {
        getData()

        const timer = setInterval(() => {
            getData();
        }, reloadTime === 0 ? 60000 : reloadTime);

        return () => {
            clearInterval(timer);
        };
    }, [getData, reloadTime])

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <HeaderComp />
            <Content className="mt-5">
                <div className="d-flex flex-column">
                    <div style={{ backgroundColor: "#005e6a", height: "300px", marginBottom: "-280px" }} ></div>
                    <Card className="col-11 col-md-10 mx-auto ">
                        <div className="d-flex flex-column">
                            <Spin spinning={isLoading} size="large" tip="Loading...">
                                {children(getData, filter, setFilter, summary, statistic, transactions, perfomance, perfomanceChart, perfomanceDetail)}
                            </Spin>
                        </div>
                    </Card>
                </div>
            </Content>
            <FooterComp />
        </Layout>
    )
}