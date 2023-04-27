const { registerModel } = require('../Models/user.model')
const express = require("express");
const app = express()
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const userRouter = express.Router();
app.use(express.json())

const CI = 'ac276adc9b26f1c5ba51';
const CS = '47e740aa8222f8533ce999610c902267766d4515'

userRouter.post('/register', async (req, res) => {
    let payload = req.body;
    let email = payload.email;
    let check = await registerModel.find({ email });
    if (check.length > 0) {
        res.send({ "msg": "email Already Exist" });
    } else {
        try {
            console.log(payload)
            bcrypt.hash(payload.password, 2, async (err, hash) => {
                try {
                    if (hash) {
                        payload.password = hash;
                        const data = await new registerModel(payload);
                        await data.save()
                        res.send({ "msg": "NEW REGISTRATION DONE" });
                    } else {
                        res.send({ "msg": "ERROR IN HASHING" })
                    }
                } catch (err) {
                    console.log("ERROR IN REGISTER", err)
                    res.send("ERROR IN REGISTER")
                }
            });

        } catch (err) {
            console.log("ERROR", err)
        }
    }
});


userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = await registerModel.find({ email });

        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, function (err, result) {
                // console.log(result)
                if (result) {
                    var token = jwt.sign({ ID: data[0]._id }, "mock7");
                    res.send({
                        "msg": "LOGGIN SUCCESSFUL",
                        "token": token, "username": data[0].Name, "email": email
                    });
                } else {
                    res.send({ "msg": "Invalid password" })
                }
            });
        } else {
            res.send({ "msg": "email not Found" })
        }

    } catch (err) {
        console.log("ERROR", err)
    }
});

userRouter.get('/register/github', async (req, res) => {

    const { code } = req.query;

    //get acessToken
    const accessToken = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            client_id: CI,
            client_secret: CS,
            code: code,
        })
    }).then((res) => res.json())

    console.log(accessToken)
    const userDetails = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken.access_token}`
        }
    }).then((res) => res.json())
    console.log(userDetails)
    let payload = {
        'name': userDetails.name,
        'bio': userDetails.bio,
        "email": userDetails.email,
        "image": userDetails.avatar_url
    };
    const data = await new registerModel(payload);
    await data.save()
    res.send({ "msg": "registered susseccful" })


});

userRouter.post('/getProfile', async (req, res) => {
    let { email } = req.body
    console.log(email)
    const data = await registerModel.find({ email });
    console.log(data)
    res.send({
        'details': data[0],
        "msg": "fetched"
    });


})
userRouter.post('/editProfile', async (req, res) => {
    let payload = req.body
    console.log("payload", payload)
    await registerModel.updateOne({ email: payload.email }, payload);
    res.send({
        "msg": "updated"
    });

})
module.exports = { userRouter }