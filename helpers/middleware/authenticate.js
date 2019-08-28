const jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_SECRET || 'Please be sure to add a Secret in your env';

function GenerateToken(slack_token, user_id){
  
}