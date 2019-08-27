exports = async function register(payload) {
  const mongodb = context.services.get("whetstone-stitch");
  const whetstonedb = mongodb.db("whetstone-db");
  const teamsCol = whetstonedb.collection("teams");
  
  const code = payload && payload.query && payload.query.code;
  
  const response = await context.http.get({
    "scheme":"https",
    "host": "slack.com",
    "path": "/api/oauth.access",
    "username": "718150263313.726675082726",
    "password": "0a2984cbf4c1be2eeff296271f150559",
    "query": {
      "code": [code],
    }
  });
  
  const { team_name, team_id, incoming_webhook } = EJSON.parse(response.body.text());
  
  try {
    await teamsCol.updateOne({
      "teamId": team_id,
    },{"$set":{
      "teamName": team_name,
      "incomingWebhook": incoming_webhook,
      "createdAt": new Date(),
      "gmtOffset": -5
    }
      },{"upsert": true});
  } catch (err) {
    console.log(err);
  }
}


