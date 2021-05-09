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
const getDistrictCodes = (districtId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get(`https://www.cowin.gov.in/api/v2/admin/location/districts/${districtId}`);
        const districtCodes = response.data.districts;
        return districtCodes;
    }
    catch (err) {
        console.log("Error in getDistrictCodes");
        console.log(err);
    }
});
const getDistrictCode = (district, districtCodes) => {
    try {
        const obj = districtCodes.find((element) => element.district_name.toUpperCase() === district.toUpperCase());
        return !!obj ? obj.district_id : null;
    }
    catch (err) {
        console.log("Error in getDistrictCode");
        console.log(err);
    }
};
export { getDistrictCodes, getDistrictCode };
//# sourceMappingURL=district.js.map