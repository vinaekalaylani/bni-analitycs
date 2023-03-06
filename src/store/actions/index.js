import {
	SET_IS_ERROR,
	SET_IS_LOADING,
	SET_URL,
	SET_RELOAD_TIME,
} from "../action-types";
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

export function setUrl(payload) {
	return {
		type: SET_URL,
		payload,
	};
}

export function setReloadTime(payload) {
	return {
		type: SET_RELOAD_TIME,
		payload,
	};
}

// FUNCTION GET, POST, PUT
export function login(url, data) {
	return (dispatch, getState) => {
		dispatch(setIsLoading(true))
		return new Promise((resolve, reject) => {
			axios({
				method: "GET",
				url: url + "/bri-fs-app/api/cems/web/login?username=" + data.username + "&password=" + data.password,
			})
				.then(({ data }) => {
					if (data.errorCode === "1000") {
						resolve(data)
					} else {
						reject(data)
					}
				})
				.catch((error) => {
					dispatch(setIsError(error))
				})
				.finally(() => {
					dispatch(setIsLoading(false));
				})
		});
	};
}