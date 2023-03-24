//require express to create endpoint to handle the request o port 3000
const express = require('express');
const app = express();
const port = 3000;

// const { getURIs, getURI
//         } = require("src/contracts.js");

app.get('/slack', async (req: any, res: any) => {
  res.status(200).send("v1.0.8")
});



//listen to port 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
