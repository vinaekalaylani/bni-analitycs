import { ConvertMinutes } from "../../../helpers/convertTime";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faHourglassEnd, faHourglassStart, faUniversalAccess, faUserGroup, faUserPen, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FieldTimeOutlined, ClockCircleOutlined, BranchesOutlined } from "@ant-design/icons";


export function Summary1Comp({ summary, perfomanceDetail, filter }) {
    const getTopTeller = (value) => {
        if (value) {
            let max = 0
            let teller = ""
            for (let i = 0; i < value.length; i++) {
                if (value[i].completeQueue > max) {
                    max = value[i].completeQueue
                    teller = value[i].name
                }
            }
            return teller
        }
    }

    return (
        <div className="row mt-3">
            <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                <div className="p-4 fw-bold d-flex border">
                    <div>
                        <div style={{ fontSize: "2.4vh" }}>{ConvertMinutes(summary?.AVG_SERVING_TIME)}</div>
                        <div style={{ fontSize: "1.3vh" }}>Rata-rata Waktu Pelayanan</div>
                    </div>
                    <div className="ms-auto my-auto">
                        <FieldTimeOutlined className="text-primary" style={{ fontSize: "6vh" }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                <div className="p-4 fw-bold d-flex border">
                    <div>
                        <div style={{ fontSize: "2.4vh" }}>{ConvertMinutes(summary?.AVG_IDLE_TIME)}</div>
                        <div style={{ fontSize: "1.3vh" }}>Rata-rata Waktu Idle</div>
                    </div>
                    <div className="ms-auto my-auto">
                        <ClockCircleOutlined style={{ fontSize: "5.1vh", color: "#f56a00" }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                <div className="p-4 fw-bold d-flex border">
                    <div>
                        <div style={{ fontSize: "2.4vh" }}>{perfomanceDetail && perfomanceDetail.length > 0 ? getTopTeller(perfomanceDetail) : "-"}</div>
                        <div style={{ fontSize: "1.3vh" }}>Top Frontliner</div>
                    </div>
                    <div className="ms-auto my-auto">
                        <FontAwesomeIcon icon={faCrown} style={{ fontSize: "5vh", color: "#fab641" }} />
                    </div>
                </div>
            </div>
            {filter.branch === "" ? (
                <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                    <div className="p-4 fw-bold d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{JSON.parse(localStorage.getItem("branches")).length}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Cabang</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <BranchesOutlined className="text-primary" style={{ fontSize: "5.8vh" }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-md-6 col-lg-3 mb-3 mb-lg-0">
                    <div className="p-4 fw-bold d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_COMPLETED ? summary.QUEUE_COMPLETED : "0"}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Antrian Selesai</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <FontAwesomeIcon icon={faHourglassEnd} style={{ fontSize: "5vh", color: "#005e6a" }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Summary2Comp({ summary, perfomanceDetail, filter }) {
    const getCategoryFrontliner = () => {
        const categories = {
            "Teller": [],
            "CS": [],
            "UB": []
        };

        let res = [];

        for (const index in perfomanceDetail) {
            let name = perfomanceDetail[index].name

            if (name.includes(filter.branch)) {
                name = name.replaceAll(filter.branch, "")

                if ((Number(name) >= 51 && Number(name) <= 65) || perfomanceDetail[index].name === "0206256" || perfomanceDetail[index].name === "0206198") {
                    categories["Teller"].push(perfomanceDetail[index])
                } else if ((Number(name) >= 41 && Number(name) <= 49) || perfomanceDetail[index].name === "0206260") {
                    categories["CS"].push(perfomanceDetail[index])
                } else if ((Number(name) >= 160 && Number(name) <= 180) || perfomanceDetail[index].name === "02062742") {
                    categories["UB"].push(perfomanceDetail[index])
                }
            }
        }


        for (const category in categories) {
            res.push(
                <div key={category} className="col-md-6 col-lg-12">
                    <div className="p-4 fw-bold mb-4 d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{categories[category].length}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Aktif {category}</div>
                        </div>
                        <div className="ms-auto my-auto">
                            {category === "Teller" && <FontAwesomeIcon icon={faUserTie} className="text-primary" style={{ fontSize: "5vh" }} />}
                            {category === "CS" && <FontAwesomeIcon icon={faUserPen} className="text-primary" style={{ fontSize: "5vh" }} />}
                            {category === "UB" && <FontAwesomeIcon icon={faUniversalAccess} className="text-primary" style={{ fontSize: "5.8vh" }} />}
                        </div>
                    </div>
                </div>
            )
        }

        return res
    }

    return (
        <div className="col-lg-3">
            <div className="row">
                <div className="col-md-6 col-lg-12">
                    <div className="p-4 fw-bold mb-4 d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_NOSHOW ? summary.QUEUE_NOSHOW : "0"}</div>
                            <div style={{ fontSize: "1.3vh" }}>Antrian belum dilayani</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <FontAwesomeIcon icon={faHourglassStart} style={{ fontSize: "5vh", color: "#DB4040" }} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-12">
                    <div className="p-4 fw-bold mb-4 d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_TOTAL ? summary.QUEUE_TOTAL : "0"}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Antrian</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <FontAwesomeIcon icon={faUserGroup} className="text-primary" style={{ fontSize: "5vh" }} />
                        </div>
                    </div>
                </div>
                {/* Total Frontliner */}
                {getCategoryFrontliner()}
            </div>
        </div>
    )
}

export function Summary3Comp({ summary, filter }) {
    return (
        <div className="row">
            <div className="col-md-6 col-lg-4">
                <div className="p-4 fw-bold mb-4 d-flex border">
                    <div>
                        <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_TOTAL ? summary.QUEUE_TOTAL : "0"}</div>
                        <div style={{ fontSize: "1.3vh" }}>Total Antrian</div>
                    </div>
                    <div className="ms-auto my-auto">
                        <FontAwesomeIcon icon={faUserGroup} className="text-primary" style={{ fontSize: "5vh" }} />
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <div className="p-4 fw-bold mb-4 d-flex border">
                    <div>
                        <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_NOSHOW ? summary.QUEUE_NOSHOW : "0"}</div>
                        <div style={{ fontSize: "1.3vh" }}>Antrian belum dilayani</div>
                    </div>
                    <div className="ms-auto my-auto">
                        <FontAwesomeIcon icon={faHourglassStart} style={{ fontSize: "5vh", color: "#DB4040" }} />
                    </div>
                </div>
            </div>
            {filter.branch === "" ? (
                <div className="col-md-6 col-lg-4">
                    <div className="p-4 fw-bold mb-4 d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{summary.QUEUE_COMPLETED ? summary.QUEUE_COMPLETED : "0"}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Antrian Selesai</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <FontAwesomeIcon icon={faHourglassEnd} style={{ fontSize: "5vh", color: "#005e6a" }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-md-6 col-lg-4">
                    <div className="p-4 fw-bold mb-4 d-flex border">
                        <div>
                            <div style={{ fontSize: "2.4vh" }}>{JSON.parse(localStorage.getItem("branches")).length}</div>
                            <div style={{ fontSize: "1.3vh" }}>Total Cabang</div>
                        </div>
                        <div className="ms-auto my-auto">
                            <BranchesOutlined className="text-primary" style={{ fontSize: "5.8vh" }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}