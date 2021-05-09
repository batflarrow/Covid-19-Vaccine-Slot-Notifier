// // const prompts = require('prompts');

// // (async () => {
// //   const response = await prompts({
// //     type: 'text',
// //     name: 'name',
// //     message: 'What is your name',
// //     validate: value => value === 'Amit' ? true : 'ma asdfa'
// //   });

// //   console.log(response); // => { value: 24 }
// // })();

// import axios from 'axios'

// const getVaccineStatus = async (districtId, ageGroup) => {
//     let min_age_limit;
//     if (ageGroup === "18-45") {
//         min_age_limit = 18;
//     } else if (ageGroup === "45+") {
//         min_age_limit = 45;
//     }
//     console.log(min_age_limit);
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, "0");
//     var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
//     var yyyy = today.getFullYear();
//     const date = dd + "-" + mm + "-" + yyyy;
//     const response = await axios.get(
//         `https://www.cowin.gov.in/api/v2/appointment/sessions/public/calendarByDistrict`,
//         {
//             params: {
//                 district_id: districtId,
//                 date,
//             },
//         }
//     );

//     const centers = response.data.centers;
//     //  console.log(centers);

//     const availableCenter = centers.find((center) => {
//         if (center.sessions.length > 0) {
//             // console.log('******',center.sessions)
//             const availableSession = center.sessions.find((session) => {
//                 return (session.min_age_limit === min_age_limit && session.available_capacity > 0);
//             });
//             if (!!availableSession) return true;
//             else return false;
//         } else return false;
//     });
//     // console.log(availableCenter)
//     return availableCenter;
// };

// getVaccineStatus(143, '45+');
// // module.exports = getVaccineApi;
import beeper  from 'beeper';

(async() => {
	await beeper();
	// beep one time

	await beeper(3);
	// beep three times

	await beeper('****-*-*');
	// beep, beep, beep, beep, pause, beep, pause, beep
})();
// import beep from 'beepbeep'
 
// beep()
// // Beep!
// beep(2)
// // Beep! Beep!
 
// beep(3, 1000)