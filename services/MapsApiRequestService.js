let axios = require('axios');

class MapsApiRequest {
    /*
    GOOGLE_MAPS_API_KEY is needed in .env
    
    
    */
    static distanceMatrixRequest(to, from) {
      return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&units=metric&mode=driving&key=${process.env.GOOGLE_MAPS_API_KEY}`,
            headers: { }
          };

          
          axios(config)
          .then(function (response) {


            // TODO Fix this thing to handle errors
            console.table(JSON.stringify(response.data));
            const resData = response.data;

            /*  the respose data should look like this

            {
              "destination_addresses": [
                "Kandy, Sri Lanka"
              ],
              "origin_addresses": [
                "Colombo, Sri Lanka"
              ],
              "rows": [
                {
                  "elements": [
                    {
                      "distance": {
                        "text": "122 km",
                        "value": 122351
                      },
                      "duration": {
                        "text": "3 hours 11 mins",
                        "value": 11470
                      },
                      "status": "OK"
                    }
                  ]
                }
              ],
              "status": "OK"
            }

            */


            // if the input ( to, from ) is blank it api will send an invalid request status
            if (resData.status === "INVALID_REQUEST") {
              throw new Error("Invalid Request");  // TODO give a better msg

            }
            // if the api key is invalid the request will be denied
            if (resData.status === "REQUEST_DENIED") {
              throw new Error(resData.error_message);

            }

            // if the api key is invalid the request will be denied
            if (resData.status === "REQUEST_DENIED") {
              throw new Error(resData.error_message);

            }
            if (resData.rows[0].elements[0].status === "NO_RESULTS") {
              return console.log(" No results lu" )
              // throw new Error("Invalid Response");

            }

            if (resData.rows[0].elements[0].status === "ZERO_RESULTS") {
              // return console.log("cannot go by bus lol")
              throw new Error("Cannnot travel to destination by bus");

            }

           
            // if the entered locations cannot be found this will api will send status NOT_FOUND
            if (resData.rows[0].elements[0].status === "NOT_FOUND") {
              if (resData.destination_addresses[0] === "") {
                throw new Error(`Could not find location ${to}`)
              }
              if (resData.origin_addresses[0] === "") {
                throw new Error(`Could not find location ${from}`)
              }

              return resData;
              // throw new Error("Invalid Response");
            }
           
            // the route distance in metres
            let distanceInMetres = response.data.rows[0].elements[0].distance.value;
            
            let resultObj = {
              distanceInMetres: distanceInMetres,

            }
            console.log(resultObj)
            resolve(resultObj);
            
            
          })
          .catch(function (error) {
            console.log(error);
            reject(error)
          });
          
        })
}
}



module.exports = MapsApiRequest