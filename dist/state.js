var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
var getStateCodes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get("https://www.cowin.gov.in/api/v2/admin/location/states");
        //   console.log(response.data);
        const stateCodes = response.data.states;
        return stateCodes;
    }
    catch (err) {
        console.log("Error in getStateCodes");
        console.log(err);
    }
});
const getStateCode = (state, stateCodes) => {
    try {
        const obj = stateCodes.find((element) => element.state_name.toUpperCase() === state.toUpperCase());
        return !!obj ? obj.state_id : null;
    }
    catch (err) {
        console.log("Error in getStateCode");
        console.log(err);
    }
};
export { getStateCodes, getStateCode };
//# sourceMappingURL=state.js.map