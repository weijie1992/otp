const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

const hashMap = new Map();

app.post("/generateOTP", async (req, res) => {
  const { phoneNumber } = req.body;
  if (phoneNumber) {
    //generated OTP
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += Math.floor(Math.random() * 10).toString();
    }
    //save to hashmap
    hashMap.set(phoneNumber, OTP);
    console.log(hashMap);

    const token = await jwt.sign({ phoneNumber, OTP }, "generateOTPSecret", {
      expiresIn: "60s",
    });
    res.json({ token, OTP });
  } else {
    res.status(400).json({ message: "Phone number not sent" });
  }
});

app.post("/verifyOTP", async (req, res) => {
  const { authorization } = req.headers;
  const { otp, phoneNumber } = req.body;
  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, "generateOTPSecret", (err, success) => {
        if (err) {
          res.status(500).json({ err });
        }
        //compare check passed in otp and phonenumber with hashmap
        if (hashMap.has(phoneNumber) && hashMap.get(phoneNumber) === otp) {
          //removed record from hashmap
          hashMap.delete(phoneNumber);
          console.log(hashMap);
          res.json({ message: "Success" });
        } else {
          res.status(400).json({ message: "OTP does not match" });
        }
      });
    } catch (err) {
      console.error(err);
      //log trace file, db
      return res.status(500).json({ err });
    }
  } else {
    return res.status(400).json({ message: "err" });
  }
});

app.listen(3004, () => {
  console.log("Express is running");
});

//assume otp only last 60seconds - jwt expires in :60s -
//route = verify the otp - verification of OTP is thru expiry of JWT instead of the actual OTP pin
//any phone number can be generate otp, not required to do any prior
