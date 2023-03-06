import { SET_URL, SET_RELOAD_TIME } from "../../action-types";
import {
    SET_IS_ERROR,
    SET_IS_LOADING,
    SET_SUMMARY,
} from "../../action-types/summary";

const initialState = {
    url: null,
    reloadTime: null,
    isError: null,
    isLoading: false,
    summary: [],
}

const summary = (state = initialState, action) => {
    switch (action.type) {
        case SET_URL:
            return { ...state, url: action.payload }
        case SET_RELOAD_TIME:
            return { ...state, reloadTime: action.payload }
        case SET_IS_ERROR:
            return { ...state, isError: action.payload }
        case SET_IS_LOADING:
            return { ...state, isLoading: action.payload }
        case SET_SUMMARY:
            return { ...state, summary: action.payload }
        default:
            return state
    }
}

export default summary