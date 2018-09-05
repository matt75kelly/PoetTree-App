// load up the user model
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require("passport-local");

// expose this function to our app using module.exports
module.exports = function(db, passport) {
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // we are checking to see if the user trying to login already exists
            db.Users.findOrCreate({
                where: {
                  email: req.body.email
                },
                defaults: {
                  username: username,
                  password: bcrypt.hashSync(password, null, null),
                }
              }).spread((user, created)=>{
                if(created){
                  console.log("User Successfully created");
                  return done(null, user.dataValues, {signupMessage: `User Successfully Created.`});
                } 
                else{
                  return done(null, false, {signupMessage: 'That username is already taken.'});
                }
              }).catch(err=>{
                return done(err, false, {signupMessage: 'Error occurred. User Not Created'});
              });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with username and password from our form
            console.log(req.body.user);
            db.Users.findOne({
                where:{
                    email: username
                }
            }).catch(err=>{
                return done(err, false, {loginMessage: `Could Not Find User by that name.`});
            }).then(result=>{
                if(!bcrypt.compareSync(password, result.password)){
                    console.log(`Login Failed: Bad Password`);
                    return done(null, false, {loginMessage: 'Oops! Wrong Password.'});
                }
                console.log(`User Login Successful. Welcome ${req.user.username}`);
                return done(null, result);
            })
        })
    );
    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, done) {
        console.log("User serialized");
        return done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log(id);
        db.Users.findOne({
            where: {
                id: id
            }
        }).then(result=>{
            console.log(result);
            console.log(`User Deserialized Successfully`);
            return done(null, result);
        }).catch(err=>{
            console.log(err);
           return done(err, false, {loginMessage: `Could not deserialize User with ID: ${id}: ${err}`})
        });
    });
};
