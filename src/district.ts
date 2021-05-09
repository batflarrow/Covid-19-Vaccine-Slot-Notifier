import axios from "axios";

const getDistrictCodes = async (districtId: number) => {
  try {
    const response = await axios.get(
      `https://www.cowin.gov.in/api/v2/admin/location/districts/${districtId}`
    );

    const districtCodes = response.data.districts;
    return districtCodes;
  } catch (err) {
    console.log("Error in getDistrictCodes");
    console.log(err);
  }
};
const getDistrictCode = (district: string, districtCodes) => {
  try {
    const obj = districtCodes.find(
      (element) =>
        element.district_name.toUpperCase() === district.toUpperCase()
    );
    return !!obj ? obj.district_id : null;
  } catch (err) {
    console.log("Error in getDistrictCode");
    console.log(err);
  }
};

export { getDistrictCodes, getDistrictCode };
