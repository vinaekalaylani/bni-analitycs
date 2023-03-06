import { combineReducers } from "redux"

import transaction from "./transaction";
import perfomance from "./perfomance";
import statistic from "./statistic";
import summary from "./summary";

const reducers = combineReducers({
    transaction,
    perfomance,
    statistic,
    summary,
})

export default reducers