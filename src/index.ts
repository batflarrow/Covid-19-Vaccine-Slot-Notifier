import prompts from "prompts";
import { getStateCodes, getStateCode } from "./state.js";
import { getDistrictCodes, getDistrictCode } from "./district.js";
import { getVaccineStatus, getVaccineStatusByPincode } from "./vaccine.js";
import pincodeDirectory from "india-pincode-lookup";
let stateCodes;
let districtCodes;
let response;
const question0 = {
  type: "text",
  name: "districtOrPin",
  initial: "district",
  message:
    "You want to search vaccine slots via pincode or via district (Enter Pincode or District)",
  validate: (value) => {
    return value.toUpperCase() === "PINCODE" ||
      value.toUpperCase() === "DISTRICT"
      ? true
      : "Wrong Value Entered";
  },
};
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
  initial: "18-45",
  message: "Enter Your Age Group (18-45) or (45+)",
  validate: (value) =>
    value === "18-45" || value === "45+" ? true : "Wrong Age Group",
};
const question4 = {
  type: "text",
  name: "howMuchData",
  initial: "all",
  message:
    "Do you want to see all the available centers of vaccine or just the top 10 with highest available capacity of vaccine ? (all or 10)",
  validate: (value) =>
    value === "all" || value === "10" ? true : "Wrong Input",
};

const question5 = {
  type: "text",
  name: "pincode",
  message: "Enter  Pincode",
  validate: (value) => {
    return pincodeDirectory.lookup(value).length > 0
      ? true
      : "Wrong Pincode Entered";
  },
};
const question6 = {
  type: "text",
  name: "fees",
  initial: "both",
  message:
    "Do you want to see available centers which are free or paid or both? (default both)",
  validate: (value) => {
    return value === "free" || value === "paid" || value === "both"
      ? true
      : "Wrong Input";
  },
};
const question7 = {
  type: "text",
  name: "dose",
  initial: "both",
  message:
    "Do you want to see available centers for availability of dose1 or dose2 or both? (default both)",
  validate: (value) => {
    return value === "dose1" || value === "dose2" || value === "both"
      ? true
      : "Wrong Input";
  },
};
const question8 = {
  type: "number",
  name: "interval",
  initial: 5,
  min: 1,
  message:
    "After what interval of time (in seconds) do you want to fetch results(for a long running of application keep this 5 so as to not reach maximum api hits)",
};
(async () => {
  try {
    response = await prompts(question0);
    const districtOrPin = response.districtOrPin;
    response = await prompts(question3);
    const ageGroup = response.ageGroup;
    response = await prompts(question6);
    const fees = response.fees;
    response = await prompts(question7);
    const dose = response.dose;
    response = await prompts(question8);
    const interval = response.interval;

    if (districtOrPin.toUpperCase() === "DISTRICT") {
      response = await prompts(question4);
      const howMuchData = response.howMuchData;
      stateCodes = await getStateCodes();
      response = await prompts(question1);
      const stateCode = getStateCode(response.state, stateCodes);
      districtCodes = await getDistrictCodes(stateCode);

      response = await prompts(question2);
      const districtCode = getDistrictCode(response.district, districtCodes);

      await getVaccineStatus(districtCode, ageGroup, howMuchData, dose, fees);
      console.log(`Results will be fetched again after ${interval} secs`);
      setInterval(async () => {
        await getVaccineStatus(districtCode, ageGroup, howMuchData, dose, fees);
        console.log(`Results will be fetched again after ${interval} secs`);
      }, interval * 1000);
    } else if (districtOrPin.toUpperCase() === "PINCODE") {
      response = await prompts(question5);
      const pincode = response.pincode;
      await getVaccineStatusByPincode(pincode, ageGroup, dose, fees);
      console.log(`Results will be fetched again after ${interval} secs`);
      setInterval(async () => {
        await getVaccineStatusByPincode(pincode, ageGroup, dose, fees);
        console.log(`Results will be fetched again after ${interval} secs`);
      }, interval * 1000);
    }
  } catch (err) {
    console.log("Error in Index.js");
    console.log(err);
  }
})();

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
