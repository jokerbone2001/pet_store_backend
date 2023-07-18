const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 
const Users = require('./models/User');
 
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'abc'
};
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const user = Users.findOne({email_address:jwt_payload.email_address})
      .then(user => {
        return done (null,user || false);
      });

    })
  );
};