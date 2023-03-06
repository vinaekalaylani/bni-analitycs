import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { maskingPwd } from "../../helpers/masking";
import { login } from "../../store/actions";
import notif from "../../helpers/notif";

import { UserOutlined, UnlockOutlined } from "@ant-design/icons";
import { Layout, Input, Button, Image } from "antd";

export default function LoginLayout(props) {
    const { url } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [input, setInput] = useState({ username: "", password: "" });

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInput(prevInput => ({ ...prevInput, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = { username: input.username, password: maskingPwd(input.password) };
        dispatch(login(url, payload))
            .then((data) => {
                if (data.branches && data.branches.length > 0) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("level", data.userType);
                    localStorage.setItem("username", input.username);
                    localStorage.setItem("expired_token", data.tokenExpiry);
                    localStorage.setItem("branches", JSON.stringify(data.branches));
                    localStorage.setItem("login_time", moment(new Date(Date.now())).format("YYYY-MM-DD HH:mm"));
                    navigate("/");
                } else {
                    notif("error", "Error", "No Branch is assigned to this Account.");
                }
            })
            .catch(({ errorMssg }) => {
                notif("error", "Error", errorMssg);
            })
    };

    return (
        <Layout className="d-flex align-items-center justify-content-center vh-100">
            <div className="col-10 col-md-6 col-xl-3 p-5 bg-white" style={{ borderRadius: "8px" }}>
                <form onSubmit={handleSubmit} autoComplete="off" >
                    <div className="text-center mb-5">
                        <div className="mb-2">
                            <Image width={200} src="./assets/images/bni.png" />
                        </div>
                        <div className="fs-12px text-dark">Enter your credentials to access your account.</div>
                    </div>

                    <Input
                        autoFocus
                        prefix={<UserOutlined style={{ color: "#E28869" }} className="mx-2" />}
                        className="text-primary mb-4 border-radius-5"
                        size="large"
                        name="username"
                        value={input.username}
                        onChange={handleInput}
                        placeholder="Enter you username"
                    />

                    <Input.Password
                        prefix={<UnlockOutlined style={{ color: "#E28869" }} className="mx-2" />}
                        className="text-primary mb-4 border-radius-5"
                        size="large"
                        name="password"
                        value={input.password}
                        onChange={handleInput}
                        placeholder="Enter your password"
                    />

                    <Button className="w-100 border-radius-5" type="primary" htmlType="submit">
                        Sign In
                    </Button>
                </form>
            </div>
        </Layout>
    )
}