let axios = require('axios');

class MapsApiRequest {
    
    static distanceMatrixRequest(to, from) {
      return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&units=metricl&key=${process.env.GOOGLE_MAPS_API_KEY}`,
            headers: { }
          };

          
          axios(config)
          .then(function (response) {

            // TODO Fix this thing to handle errors
            console.table(JSON.stringify(response.data));
            const resData = response.data;

            if (resData.status === "INVALID_REQUEST") {
              // return console.log(resData.status)
              throw new Error("Invalid Response");

            }
            if (resData.rows[0].elements[0].status !== "NO_RESULTS") {
              return console.log(resData.status)
              // throw new Error("Invalid Response");

            }
           
            resolve(response.data)
            
            
          })
          .catch(function (error) {
            console.log(error);
            reject(error)
          });
          
        })
}
}



module.exports = MapsApiRequest