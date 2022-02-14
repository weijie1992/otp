# otp
Nodejs OTP Server
To run -> npx nodemon app.js
Sending a post request to generate OTP
 - URL = http://localhost:3004/generateOTP
 - Payload = {
    "phoneNumber":"12345678"
}

Sending a post request to verify OTP
- URL = http://localhost:3004/verifyOTP
- Pass JWT token from response of generateOTP
- Payload = {
    "phoneNumber":"12345678",
    "otp":"response of generateOTP"
}

