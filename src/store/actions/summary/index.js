import {
    SET_IS_ERROR,
    SET_IS_LOADING,
    SET_SUMMARY,
} from "../../action-types/summary";
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

export function setSummary(payload) {
    return {
        type: SET_SUMMARY,
        payload,
    };
}

// FUNCTION GET, POST, PUT
export function getSummary(url, token, filter) {
    return (dispatch, getState) => {
        dispatch(setIsLoading(true))
        return new Promise((resolve, reject) => {
            axios({
                method: "GET",
                url: url + "/bri-fs-app/api/cems/web/report/summaryData?token=" + token + "&from=" + filter.date[0] + "&to=" + filter.date[1] + "&branch=" + filter.branch,
            })
                .then(({ data }) => {
                    if (data.errorCode === "1000" || data.errorCode === "9406" || data.errorCode === "9000") {
                        dispatch(setSummary(data.data))
                        resolve()
                    } else {
                        reject(data)
                    }
                })
                .catch((error) => {
                    dispatch(setIsError(error))
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setIsLoading(false));
                    }, 200)
                })
        });
    };
}
