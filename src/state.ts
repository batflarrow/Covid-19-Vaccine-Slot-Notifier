import axios from "axios";

var getStateCodes = async () => {
  try {
    const response = await axios.get(
      "https://www.cowin.gov.in/api/v2/admin/location/states"
    );
    //   console.log(response.data);
    const stateCodes = response.data.states;
    return stateCodes;
  } catch (err) {
    console.log("Error in getStateCodes");
    console.log(err);
  }
};
const getStateCode = (state: string, stateCodes) => {
  try {
    const obj = stateCodes.find(
      (element) => element.state_name.toUpperCase() === state.toUpperCase()
    );
    return !!obj ? obj.state_id : null;
  } catch (err) {
    console.log("Error in getStateCode");
    console.log(err);
  }
};

export { getStateCodes, getStateCode };
