import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSummary } from "../../store/actions/summary";
import { setStatistic } from "../../store/actions/statistic";
import { setTransactions } from "../../store/actions/transaction";
import { setPerfomance, setPerfomanceDetail } from "../../store/actions/perfomance";

import { LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Layout, Avatar, Dropdown, Image } from "antd";
const { Header } = Layout;

export default function HeaderComp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const last_login = localStorage.getItem("login_time");
    const username = localStorage.getItem("username");
    const level = localStorage.getItem("level");

    const handleLogout = () => {
        dispatch(setSummary({}));
        dispatch(setStatistic({}));
        dispatch(setTransactions([]));
        dispatch(setPerfomance([]));
        dispatch(setPerfomanceDetail([]));

        localStorage.removeItem("username")
        localStorage.removeItem("level")
        localStorage.removeItem("login_time")
        localStorage.removeItem("branches")
        localStorage.removeItem("token")
        localStorage.removeItem("expired_token")

        localStorage.setItem("last_login", last_login)
        navigate("/login")
    }

    function getLevel () {
        let res

        if (level === "2") res = "Cabang"
        else if (level === "1") res = "Pusat"

        return res;
    }

    const items = [
        {
            key: "1",
            label: username,
        },
        {
            key: "2",
            label: getLevel(),
        },
        {
            type: "divider",
        },
        {
            key: "3",
            icon: <LogoutOutlined />,
            danger: true,
            label: "Logout",
            onClick: handleLogout
        },
    ]

    return (
        <Header className="position-fixed w-100 d-flex justify-content-between" style={{ zIndex: "1", backgroundColor: "#005e6a" }}>
            <div className="logo">
                <Image width={100} src="./assets/images/bni-white.png" />
            </div>
            <Dropdown menu={{ items }} placement="bottomRight">
                <div className="text-white">
                    <Avatar style={{ backgroundColor: "#f56a00" }} > {username[0].toUpperCase()} </Avatar>
                    <span className="mx-2">{username}</span>
                    <DownOutlined />
                </div>
            </Dropdown>
        </Header>
    )
}