
const express = require("express");
const mainRoute = require("./mainRoute.js")

const PORT = process.env.PORT || 5000;
console.log(process.env.DATABASE_URL)
const app = express();
app.use(express.json())
app.use("/family", mainRoute)

app.listen(PORT, () => {
    console.log(`Working on port ${PORT}`)
  })

