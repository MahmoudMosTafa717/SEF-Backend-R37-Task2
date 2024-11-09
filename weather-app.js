const request = require("request");
const yargs = require("yargs");

yargs.command({
  command: "get",
  describe: "Get weather information",
  builder: {
    country: {
      describe: "Name of country",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${argv.country}.json?access_token=pk.eyJ1IjoiaXNsYW0yODQiLCJhIjoiY2wwamEzNmFhMGFtNTNkb3pqaXk4bXNnYSJ9.qYlrWIqo41gXgNNc4h8yIw`;

    request({ url: geocodeUrl, json: true }, (error, response) => {
      if (error) {
        return console.log(
          "Network Error: Unable to connect to location service"
        );
      }

      if (response.body.message) {
        return console.log("Error: Invalid geocoding API token");
      }

      if (response.body.features.length === 0) {
        return console.log("Error: Country not found. Please check the name");
      }

      const latitude = response.body.features[0].center[1];
      const longitude = response.body.features[0].center[0];
      const location = response.body.features[0].place_name;

      const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=7f97e74ef23b418c97a155211230503&q=${latitude},${longitude}`;

      request({ url: weatherUrl, json: true }, (error, response) => {
        if (error) {
          return console.log(
            "Network Error: Unable to connect to weather service"
          );
        }

        if (response.body.error) {
          return console.log("Error: Invalid weather API token");
        }

        console.log("\nLocation Details:");
        console.log("-----------------");
        console.log("Place:", location);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("\nWeather Details:");
        console.log("----------------");
        console.log("Temperature:", response.body.current.temp_c + "°C");
        console.log("Condition:", response.body.current.condition.text);
      });
    });
  },
});

yargs.parse();
