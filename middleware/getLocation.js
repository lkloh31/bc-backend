const fetch = require("node-fetch");

export async function getLocation(ip) {
  const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
  const data = await response.json();
  return data;
}
