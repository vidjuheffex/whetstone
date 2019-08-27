function calcTime(offset) {
  // create Date object for current location
  d = new Date();
  
  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  
  // create new Date object for different city
  // using supplied offset
  nd = new Date(utc + (3600000*offset));
  
  // return time as a string
  return nd.getHours();
}

exports = async function() {
  const mongodb = context.services.get("whetstone-stitch");
  const whetstonedb = mongodb.db("whetstone-db");
  const teamsCol = whetstonedb.collection("teams");
  const challengesCol = whetstonedb.collection("challenges");
  
  const teams = await teamsCol.find().toArray();
  
  const [{challenge: text}] = await challengesCol.aggregate([{ $sample: { size: 1 } }]).toArray();
  
  teams.forEach((team) => {

    if (calcTime(team.gmtOffset) === 9) {
      context.http.post({
        url: team.incomingWebhook.url,
        body: {text},
        encodeBodyAsJSON: true,
      });
    }
  });
}
