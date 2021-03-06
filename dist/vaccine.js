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
import chalk from "chalk";
import beeper from "beeper";
let sortOnAvailableCapacity = (availableCenters) => {
    //this function sorts the available centers on the basis of the avalable capacity in each session in descending order
    try {
        availableCenters.forEach((availableCenter) => {
            availableCenter.sessions.sort((sessionA, sessionB) => sessionB.available_capacity - sessionA.available_capacity);
        });
        availableCenters.sort((centerA, centerB) => centerB.sessions[0].available_capacity -
            centerA.sessions[0].available_capacity);
    }
    catch (err) {
        console.log("Error in sortOnAvailableCapacity in vaccine.js");
        console.log(err);
    }
};
let getVaccineStatus = (districtCode, ageGroup, howMuchData, dose, fees) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let min_age_limit;
        if (ageGroup === "18-45") {
            min_age_limit = 18;
        }
        else if (ageGroup === "45+") {
            min_age_limit = 45;
        }
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        const date = dd + "-" + mm + "-" + yyyy;
        console.log(date);
        const response = yield axios.get("https://www.cowin.gov.in/api/v2/appointment/sessions/public/calendarByDistrict", {
            params: {
                district_id: districtCode,
                date,
            },
        });
        const centers = response.data.centers;
        let availableCenters = [];
        switch (fees) {
            case "free":
                availableCenters = centers.filter((center) => {
                    if (center.sessions.length > 0 && center.fee_type === "Free") {
                        const availableSession = center.sessions.find((session) => {
                            switch (dose) {
                                case "dose1":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose1 > 0);
                                case "dose2":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose2 > 0);
                                default:
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        (session.available_capacity_dose2 > 0 ||
                                            session.available_capacity_dose1 > 0));
                            }
                        });
                        if (!!availableSession)
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                });
                break;
            case "paid":
                availableCenters = centers.filter((center) => {
                    if (center.sessions.length > 0 && center.fee_type === "Paid") {
                        const availableSession = center.sessions.find((session) => {
                            switch (dose) {
                                case "dose1":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose1 > 0);
                                case "dose2":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        (session.available_capacity_dose2 > 0 ||
                                            session.available_capacity_dose1 > 0));
                                default:
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        (session.available_capacity_dose2 > 0 ||
                                            session.available_capacity_dose1 > 0));
                            }
                        });
                        if (!!availableSession)
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                });
                break;
            default:
                availableCenters = centers.filter((center) => {
                    if (center.sessions.length > 0) {
                        const availableSession = center.sessions.find((session) => {
                            switch (dose) {
                                case "dose1":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose1 > 0);
                                case "dose2":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose2 > 0);
                                default:
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose2 > 0 &&
                                        session.available_capacity_dose1 > 0);
                            }
                        });
                        if (!!availableSession)
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                });
                break;
        }
        // console.log(availableCenters);
        if (availableCenters.length > 0) {
            sortOnAvailableCapacity(availableCenters);
            yield beeper("*-*-*");
            console.log(chalk.bgGreenBright.blue("Congratulation Slots are available for vaccine In the folowing Centers"));
            const numberOfAvailableCenters = availableCenters.length;
            // console.log(numberOfAvailableCenters);
            availableCenters.every((availableCenter, index) => {
                console.log(chalk.cyanBright.bold("Center Name :", availableCenter.name));
                console.log(chalk.cyanBright.bold("Address :", availableCenter.address));
                console.log(chalk.cyanBright.bold("State :", availableCenter.state_name));
                console.log(chalk.cyanBright.bold("District :", availableCenter.district_name));
                console.log(chalk.cyanBright.bold("Block Name: ", availableCenter.block_name));
                console.log(chalk.cyanBright.bold("Pincode: ", availableCenter.pincode));
                console.log(chalk.cyanBright.bold("Time Period for which center is working: " +
                    availableCenter.from +
                    " To " +
                    availableCenter.to));
                console.log(chalk.cyanBright.bold("Fees :" + availableCenter.fee_type));
                availableCenter.sessions.forEach((session) => {
                    if (session.available_capacity > 0) {
                        console.log(chalk.yellowBright("Sessions Available in this center are"));
                        console.log(chalk.yellowBright("Date: " + session.date));
                        console.log(chalk.yellowBright("available_capacity_dose1: " + session.available_capacity_dose1));
                        console.log(chalk.yellowBright("available_capacity_dose2: " + session.available_capacity_dose2));
                        console.log(chalk.yellowBright("Vaccine used at this center: " + session.vaccine));
                        console.log(chalk.yellowBright("Age Group: " + ageGroup));
                        console.log(chalk.yellowBright("Slots: " + session.slots));
                    }
                });
                if (howMuchData === "all")
                    return true;
                else {
                    if (numberOfAvailableCenters > 10 && index === 9) {
                        console.log(chalk.inverse(`There are more available centers with various sessions in 7 days starting from ${date} for vaccine for the requested age group, only top 10 with the largest available capacity are shown here`));
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            });
        }
        else {
            console.log(chalk.bgRed("No Slots Available :( Slots will be shown here when they will be available"));
        }
    }
    catch (err) {
        console.log("Error In getVaccineStatus in vaccine.js");
        console.log(err);
    }
});
let getVaccineStatusByPincode = (pincode, ageGroup, dose, fees) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let min_age_limit;
        if (ageGroup === "18-45") {
            min_age_limit = 18;
        }
        else if (ageGroup === "45+") {
            min_age_limit = 45;
        }
        for (let i = 0; i < 3; i++) {
            var dates = new Date();
            dates.setDate(new Date().getDate() + i);
            var dd = String(dates.getDate()).padStart(2, "0");
            var mm = String(dates.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = dates.getFullYear();
            const date = dd + "-" + mm + "-" + yyyy;
            const response = yield axios.get("https://www.cowin.gov.in/api/v2/appointment/sessions/public/findByPin", {
                params: {
                    pincode: pincode,
                    date: date,
                },
            });
            // console.log(response);
            const sessions = response.data.sessions;
            // console.log(sessions)
            if (sessions.length > 0) {
                // console.log("*******", sessions);
                // const availableSessions = sessions.filter((session) => {
                //   return (
                //     session.min_age_limit === min_age_limit &&
                //     session.available_capacity > 0
                //   );
                // });
                let availableSessions = [];
                switch (fees) {
                    case "free":
                        availableSessions = sessions.filter((session) => {
                            if (session.fee_type === "Free") {
                                switch (dose) {
                                    case "dose1":
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            session.available_capacity_dose1 > 0);
                                    case "dose2":
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            session.available_capacity_dose2 > 0);
                                    default:
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            (session.available_capacity_dose2 > 0 ||
                                                session.available_capacity_dose1 > 0));
                                }
                            }
                            else {
                                return false;
                            }
                        });
                        break;
                    case "paid":
                        availableSessions = sessions.filter((session) => {
                            if (session.fee_type === "Paid") {
                                switch (dose) {
                                    case "dose1":
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            session.available_capacity_dose1 > 0);
                                    case "dose2":
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            session.available_capacity_dose2 > 0);
                                    default:
                                        return (session.min_age_limit === min_age_limit &&
                                            session.available_capacity > 0 &&
                                            (session.available_capacity_dose2 > 0 ||
                                                session.available_capacity_dose1 > 0));
                                }
                            }
                            else {
                                return false;
                            }
                        });
                        break;
                    default:
                        availableSessions = sessions.filter((session) => {
                            switch (dose) {
                                case "dose1":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose1 > 0);
                                case "dose2":
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        session.available_capacity_dose2 > 0);
                                default:
                                    return (session.min_age_limit === min_age_limit &&
                                        session.available_capacity > 0 &&
                                        (session.available_capacity_dose2 > 0 ||
                                            session.available_capacity_dose1 > 0));
                            }
                        });
                        break;
                }
                const numberOfAvailableSessions = availableSessions.length;
                if (numberOfAvailableSessions == 0) {
                    console.log(chalk.bgRed(`For Date ${date} No Slots Available :( Slots will be shown here when they will be available`));
                }
                else {
                    yield beeper("*-*-*");
                    console.log(chalk.bgGreenBright.blue(`For Date=${date} Congratulation Slots are available for vaccine In the folowing Centers`));
                    // console.log(numberOfAvailableCenters);
                    availableSessions.forEach((availableSession, index) => {
                        console.log(chalk.cyanBright.bold("Center Name :", availableSession.name));
                        console.log(chalk.cyanBright.bold("Address :", availableSession.address));
                        console.log(chalk.cyanBright.bold("State :", availableSession.state_name));
                        console.log(chalk.cyanBright.bold("District :", availableSession.district_name));
                        console.log(chalk.cyanBright.bold("Block Name: ", availableSession.block_name));
                        console.log(chalk.cyanBright.bold("Pincode: ", availableSession.pincode));
                        console.log(chalk.cyanBright.bold("Time Period for which center is working: " +
                            availableSession.from +
                            " To " +
                            availableSession.to));
                        console.log(chalk.cyanBright.bold("Fees :" + availableSession.fee_type));
                        console.log(chalk.yellowBright("Date: " + availableSession.date));
                        console.log(chalk.yellowBright("available_capacity_dose1: " +
                            availableSession.available_capacity_dose1));
                        console.log(chalk.yellowBright("available_capacity_dose2: " +
                            availableSession.available_capacity_dose2));
                        console.log(chalk.yellowBright("Vaccine used at this center: " + availableSession.vaccine));
                        console.log(chalk.yellowBright("Age Group: " + ageGroup));
                        console.log(chalk.yellowBright("Slots: " + availableSession.slots));
                    });
                }
            }
            else {
                console.log(chalk.bgRed(` For Date=${date} No Slots Available :( Slots will be shown here when they will be available`));
            }
        }
    }
    catch (err) {
        console.log("Error In getVaccineStatus in vaccine.js");
        console.log(err);
    }
});
export { getVaccineStatus, getVaccineStatusByPincode };
//# sourceMappingURL=vaccine.js.map