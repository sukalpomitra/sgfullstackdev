'use strict'

let jwt = require('jsonwebtoken');

module.exports = {
    Login : Login,
    TestProtected : TestProtected
}

function Login(req, res) {
    // console.log(req.swagger.params.my_cred.value.username)
    let id = req.swagger.params.my_cred.value.username
    res.header('Content-Type','application/json')
    res.statusCode = 200
    jwt.sign({ id: id }, 'secret', { algorithm: 'HS256' }, function(err, token) {
        //console.log(token);
        if (err) {
            res.status(401).end()
        }
        else {
            res.status(200).end(JSON.stringify({ token: token }))            
        }
    });
    // res.end(JSON.stringify({ token: "1" }))
}


function TestProtected(req, res) {
    console.log(req.decoded)
    res.header('Content-Type','application/json')
    res.status(200).end(req.decoded)
}