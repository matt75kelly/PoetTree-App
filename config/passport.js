// load up the user model
var db = require('../models');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require("passport-local");

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.Users.findOne({
            where: {
                id: id
            }
        }).then(result=>{
            done(result);
        }).catch(err=>{
            throw new Error(`Could not deserialize User with ID: ${id}: ${err}`)
        });
    });
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
            console.log(req.body);
            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
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
                  return done(null, user);
                } else{
                  return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
              }).catch(err=>{
                throw new Error(`Error Creating New User: ${err}`);
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
        function(req, username, password, done) { // callback with email and password from our form
            db.Users.findOne({
                where:{
                    email: username,
                }
            }).catch(err=>{
                throw new Error(`No User found with that email: ${err}`);
            }).then(result=>{
                if(!bcrypt.compareSync(password, result.password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password.'));
                }
                return done(null, result);
            })
        })
    );
};

// passport.use(new LocalStrategy(config.passport.authenticate()));
// passport.serializeUser(db.Users.serializeUser());
// passport.deserializeUser(db.Users.deserializeUser())
