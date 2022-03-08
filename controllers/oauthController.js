
let User = require('../models/User')
const axios =require('axios') ;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');

const oauthCallback="http://localhost:3001";
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const oauth = require('../lib/oauth-promise')(oauthCallback);


const _oauth = new (require('oauth').OAuth)(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    CONSUMER_KEY, // consumer key
    CONSUMER_SECRET, // consumer secret
    '1.0',
    "https://localhost:3001",
    'HMAC-SHA1'
);



const COOKIE_NAME = 'oauth_token';

let tokens = {}

exports.requestToken = async (req, res) =>  {  
  
    async function getOAuthRequestToken(){ 
        return new Promise((resolve, reject) => {
          _oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
            if(error) {
              reject(error);  
            } else {
              resolve({oauth_token, oauth_token_secret, results});  
            }
          });
        });
      }

    const test= await getOAuthRequestToken();

    // const {oauth_token, oauth_token_secret} = await getOAuthRequestToken();
  
    // res.cookie(COOKIE_NAME, oauth_token , {
    //   maxAge: 15 * 60 * 1000, // 15 minutes
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
    
    // tokens[oauth_token] = { oauth_token_secret };
    // res.json({ oauth_token });
    
  };

exports.accessToken = async (req, res) =>  {
    // try {
    //     const {oauth_token: req_oauth_token, oauth_verifier} = req.body;
    //     const oauth_token = req.cookies[COOKIE_NAME];
    //     const oauth_token_secret = tokens[oauth_token].oauth_token_secret;
        
    //     if (oauth_token !== req_oauth_token) {
    //       res.status(403).json({message: "Request tokens do not match"});
    //       return;
    //     }
        
    //     const {oauth_access_token, oauth_access_token_secret} = await oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier);
    //     tokens[oauth_token] = { ...tokens[oauth_token], oauth_access_token, oauth_access_token_secret };
    //     res.json({success: true});
        
    //   } catch(error) {
    //     res.status(403).json({message: "Missing access token"});
    //   } 
}
exports.profileAccess = async (req, res) =>  {
    // try {
    //     const oauth_token = req.cookies[COOKIE_NAME];
    //     const { oauth_access_token, oauth_access_token_secret } = tokens[oauth_token]; 
    //     const response = await oauth.getProtectedResource("https://api.twitter.com/1.1/account/verify_credentials.json", "GET", oauth_access_token, oauth_access_token_secret);
    //     res.json(JSON.parse(response.data));
    //   } catch(error) {
    //     res.status(403).json({message: "Missing, invalid, or expired tokens"});
    //   } 
}

exports.logout = async (req, res) =>  {
    // try {
    //     const oauth_token = req.cookies[COOKIE_NAME];
    //     delete tokens[oauth_token];
    //     res.cookie(COOKIE_NAME, {}, {maxAge: -1});
    //     res.json({success: true});
    //   } catch(error) {
    //     res.status(403).json({message: "Missing, invalid, or expired tokens"});
    //   } 
}
