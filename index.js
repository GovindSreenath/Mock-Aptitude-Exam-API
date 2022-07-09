require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { Users } = require("./database");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

function readJsonFile(name, limit) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "json", `${name}.json`),
      "utf8",
      (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(data)["mcqs"].slice(0, limit));
      }
    );
  });
}

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.post("/api/saveResult", async (req, res) => {
      try {
        let user = await Users.findOne({
          userName: req.query.id,
        });
        if (user.result) {
          throw new Error("Result already saved for", user.userName);
        }
        await Users.updateOne(
          { userName: req.query.id },
          { result: req.query.result }
        );
        return res.json({ msg: "success" });
      } catch (err) {
        console.error(err);
        return res.json({ msg: "failed" });
      }
    });

    app.post("/api/credentials", (req, res) => {
      Users.findOne({ userName: req.body.id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).send("Some error");
        }
        if (!user) {
          return res.status(400).send("User Not found");
        }
        if (user.result) {
          let err = "User" + user.userName + "already attempted";
          console.error(err);
          return res.status(400).send(err);
        }
        if (user.pass === req.body.pass) {
          return res.json({ status: "success" });
        } else {
          return res.json({ status: "failed" });
        }
      });
    });

    app.get("/api/apti", async(req, res) => {
      let finalResult = [];

      let result = await readJsonFile("physics", 50);
      finalResult = finalResult.concat(result);
      
      result = await readJsonFile("chemistry", 50);
      finalResult = finalResult.concat(result);
      
      result = await readJsonFile("biology", 100);
      finalResult = finalResult.concat(result);

      return res.json({mcq: finalResult});
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });

    app.route("/static/*").get((req, res) => {
      res.sendFile(path.join(__dirname, "build", decodeURI(req.url)));
    });

    app.route("/*").get((req, res) => {
      res.sendFile(path.join(__dirname, "build", decodeURI(req.url)));
    });

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  });
