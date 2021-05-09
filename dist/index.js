var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prompts from "prompts";
import { getStateCodes, getStateCode } from "./state.js";
import { getDistrictCodes, getDistrictCode } from "./district.js";
import { getVaccineStatus } from "./vaccine.js";
let stateCodes;
let districtCodes;
let response;
const question1 = {
    type: "text",
    name: "state",
    message: "Enter Your State",
    validate: (value) => {
        return !!getStateCode(value, stateCodes) ? true : "Wrong State Provided";
    },
};
const question2 = {
    type: "text",
    name: "district",
    message: "Enter Your District",
    validate: (value) => {
        return !!getDistrictCode(value, districtCodes)
            ? true
            : "Wrong District Provided";
    },
};
const question3 = {
    type: "text",
    name: "ageGroup",
    message: "Enter Your Age Group (18-45) or (45+)",
    validate: (value) => value === "18-45" || value === "45+" ? true : "Wrong Age Group",
};
const question4 = {
    type: "text",
    name: "howMuchData",
    message: "Do you want to see all the available centers of vaccine or just the top 10 with highest available capacity of vaccine ? (all or 10)",
    validate: (value) => value === "all" || value === "10" ? true : "Wrong Input",
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        stateCodes = yield getStateCodes();
        response = yield prompts(question1);
        const stateCode = getStateCode(response.state, stateCodes);
        districtCodes = yield getDistrictCodes(stateCode);
        response = yield prompts(question2);
        const districtCode = getDistrictCode(response.district, districtCodes);
        response = yield prompts(question3);
        const ageGroup = response.ageGroup;
        response = yield prompts(question4);
        const howMuchData = response.howMuchData;
        yield getVaccineStatus(districtCode, ageGroup, howMuchData);
        console.log("Results will be fetched again after 30 sec");
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            yield getVaccineStatus(districtCode, ageGroup, howMuchData);
            console.log("Results will be fetched again after 30 secs");
        }), 30000);
    }
    catch (err) {
        console.log("Error in Index.js");
        console.log(err);
    }
}))();
// const question4 = {
//   type: "text",
//   name: "exit",
//   message: "Do you want to close this program now? (Yes or No)",
//   validate: (value) =>
//     value === "Yes" || value === "No" ? true : "Wrong Input",
// };
// response = await prompts(question4); // this can be used to give an option to user to exit program on pressing yes
// if (response.exit == "Yes") {
//   console.log("Thanks For using The program");
//   console.log("Exititing!!!");
//   process.exit();
// }
// else{
//   console.log('Vaccine Sessions will be fethched every min')
// }
//# sourceMappingURL=index.js.map