const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const dbname=process.env.DBNAME;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



export const dbconnection=(cname)=>{
  return client.db(dbname).collection(cname)
}