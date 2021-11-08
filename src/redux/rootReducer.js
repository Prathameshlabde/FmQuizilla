import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import component from "./reducer/component";
export default combineReducers({
    router,
    component
});
