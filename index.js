require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { Users } = require("./database");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.post("/api/saveResult", async (req, res) => {
      try {
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
        if (user.pass === req.body.pass) {
          return res.json({ status: "success" });
        } else {
          return res.json({ status: "failed" });
        }
      });
    });

    app.get("/api/apti", (req, res) => {
      if (req.query.limit <= 250) {
        fs.readFile(
          path.join(__dirname, "json", `${req.query.topic}.json`),
          "utf8",
          (err, data) => {
            if (!err) {
              let test = JSON.parse(data);
              let list = test["mcqs"];
              const shuffled = list.slice(0, req.query.limit);

              res.json({ mcq: shuffled });
            }
          }
        );
      } else {
        res.status(400).end();
      }
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });

    app.route("/static/*").get((req, res) => {
      res.sendFile(path.join(__dirname, "build", decodeURI(req.url)));
    });

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  });
