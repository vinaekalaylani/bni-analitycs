import {
	SET_IS_ERROR,
	SET_IS_LOADING,
	SET_TRANSACTIONS,
} from "../../action-types/transaction";
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

export function setTransactions(payload) {
	return {
		type: SET_TRANSACTIONS,
		payload,
	};
}

// FUNCTION GET, POST, PUT
export function getTransactions(url, token, filter) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			axios({
				method: "GET",
				url: url + "/bri-fs-app/api/cems/web/report/transactionDetails?token=" + token + "&from=" + filter.date[0] + "&to=" + filter.date[1] + "&branch=" + filter.branch,
			})
				.then(({ data }) => {
					if (data.errorCode === "1000" || data.errorCode === "9406" || data.errorCode === "9000") {
						dispatch(setTransactions(data.children))
						resolve()
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
