import { 
    SET_IS_ERROR,
    SET_IS_LOADING,
    SET_STATISTIC,
} from "../../action-types/statistic";
import axios from "axios";

export function setIsLoading(payload) {
    return {
        type: SET_IS_LOADING,
        payload,
    };
}

export function setIsError(payload) {
    return {
        type: SET_IS_ERROR,
        payload,
    };
}

export function setStatistic(payload) {
    return {
        type: SET_STATISTIC,
        payload,
    };
}

// FUNCTION GET, POST, PUT
export function getStatistic(url, token, filter) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios({
                method: "GET",
                url: url + "/bri-fs-app/api/cems/web/report/transactionType?token=" + token + "&from=" + filter.date[0] + "&to=" + filter.date[1] + "&branch=" + filter.branch,
            })
                .then(({ data }) => {
                    if (data.errorCode === "1000") {
                        const datas = data.transactionTypes

                        const res = {};
                        for (const index in datas) {
                            let category = datas[index].category;
                            category = category.replaceAll("Finance-Desktop", "Finance - Desktop")
                            category = category.replaceAll("Finance", "Finansial")

                            if (category.includes("Desktop")) category = category.replaceAll("Desktop", "") + " eForm Tablet"
                            else if (!category.includes("Layanan Khusus")) category = category + " BRIQue"

                            if (!res[category]) res[category] = [];

                            res[category].push(datas[index])
                        }
                        
                        dispatch(setStatistic(res))
                        resolve()
                    } else if (data.errorCode === "9406" || data.errorCode === "9000") {
                        dispatch(setStatistic({}))
                    } else {
                        reject(data)
                    }
                })
                .catch((error) => {
                    dispatch(setIsError(error))
                })
        });
    };
}