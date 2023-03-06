import {
	SET_IS_ERROR,
	SET_IS_LOADING,
	SET_PERFOMANCE,
	SET_PERFOMANCE_CHART,
	SET_PERFOMANCE_DETAIL,
} from "../../action-types/perfomance";
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

export function setPerfomance(payload) {
	return {
		type: SET_PERFOMANCE,
		payload,
	};
}

export function setPerfomanceChart(payload) {
	return {
		type: SET_PERFOMANCE_CHART,
		payload,
	};
}

export function setPerfomanceDetail(payload) {
	return {
		type: SET_PERFOMANCE_DETAIL,
		payload,
	};
}

// FUNCTION GET, POST, PUT
export function getPerfomance(url, token, filter) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			axios({
				method: "GET",
				url: url + "/bri-fs-app/api/cems/web/report/staffPerfomance?token=" + token + "&from=" + filter.date[0] + "&to=" + filter.date[1] + "&branch=" + filter.branch,
			})
				.then(({ data }) => {
					if (data.errorCode === "1000" || data.errorCode === "9406" || data.errorCode === "9000") {
						let staffs = []
						for (let i = 0; i < data.staffs.length; i++) {
							if (data.staffs[i].completeQueue > 0) {
								staffs.push({ 
									...data.staffs[i], 
									staffType: data.staffs[i]["staffType"].replaceAll("Finance", "Finansial"),
									key: i + 1,
								})
							}
						}
						dispatch(setPerfomance(staffs))
						dispatch(setPerfomanceDetail(staffs))
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

export function getPerfomanceSummary(url, token, filter) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			axios({
				method: "GET",
				url: url + "/bri-fs-app/api/cems/web/report/userTransactionSummary?token=" + token + "&from=" + filter.from + "&to=" + filter.to + "&branch=" + filter.branch + "&user=" + filter.user,
			})
				.then(({ data }) => {
					if (data.errorCode === "1000" || data.errorCode === "9406") {
						resolve(data)
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

export function getPerfomanceChart(url, token, filter) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			axios({
				method: "GET",
				url: url + "/bri-fs-app/api/cems/web/report/chart/staffPerfomance?token=" + token + "&from=" + filter.date[0] + "&to=" + filter.date[1] + "&branch=" + filter.branch,
			})
				.then(({ data }) => {
					if (data.errorCode === "1000" || data.errorCode === "9406" || data.errorCode === "9000") {
						let staffs = []
						for (let i = 0; i < data.staffs.length; i++) {
							staffs.push({ 
								...data.staffs[i], 
								staffType: data.staffs[i]["staffType"].replaceAll("Finance", "Finansial"),
								key: i + 1,
							})
						}
						dispatch(setPerfomanceChart(staffs))
						// dispatch(setPerfomanceDetail(staffs))
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
