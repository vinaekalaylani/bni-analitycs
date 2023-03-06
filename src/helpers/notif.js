import { notification } from "antd";

export default function notif(type, mssg, desc) {
    notification[type]({
        message: mssg,
        description: desc,
    });
}