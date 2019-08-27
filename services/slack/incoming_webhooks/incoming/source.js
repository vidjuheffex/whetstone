exports = async function(payload) {
    const mongodb = context.services.get("whetstone-stitch");
    const whetstonedb = mongodb.db("whetstone-db");
    const challengesCol = whetstonedb.collection("challenges");
    
    const command = payload && payload.query && payload.query.command
  
    if (command) {
      switch (command) {
          case "/challenge":
            const [{challenge: text}] = await challengesCol.aggregate([{ $sample: { size: 1 } }]).toArray();
            
  
            return { text };
        default:
        return {
            text: "Unrecognized"
          };
        }  
    }
    
    return payload;
};