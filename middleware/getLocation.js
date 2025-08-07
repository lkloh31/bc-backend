// export async function getLocation(req) {
//   const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   const response = await fetch(`https://ipapi.co/${ip}/json/`);
//   const data = await response.json();
//   return `${data.city}, ${data.region}, ${data.country_name}`;
// }
