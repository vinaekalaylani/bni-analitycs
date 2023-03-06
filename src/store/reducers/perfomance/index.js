import { SET_URL, SET_RELOAD_TIME } from "../../action-types";
import {
    SET_IS_ERROR,
    SET_IS_LOADING,
    SET_PERFOMANCE,
    SET_PERFOMANCE_CHART,
    SET_PERFOMANCE_DETAIL,
} from "../../action-types/perfomance";

const initialState = {
    url: null,
    reloadTime: null,
    isError: null,
    isLoading: false,
    perfomance: [],
    perfomanceChart: [],
    perfomanceDetail: []
}

const perfomance = (state = initialState, action) => {
    switch (action.type) {
        case SET_URL:
            return { ...state, url: action.payload }
        case SET_RELOAD_TIME:
            return { ...state, reloadTime: action.payload }
        case SET_IS_ERROR:
            return { ...state, isError: action.payload }
        case SET_IS_LOADING:
            return { ...state, isLoading: action.payload }
        case SET_PERFOMANCE:
            return { ...state, perfomance: action.payload }
        case SET_PERFOMANCE_CHART:
            return { ...state, perfomanceChart: action.payload }
        case SET_PERFOMANCE_DETAIL:
            return { ...state, perfomanceDetail: action.payload }
        default:
            return state
    }
}

export default perfomance