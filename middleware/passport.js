const passport = require("passport")
const userModel = require("../models/user")

const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    try {
        let user = await userModel.findOne({ email: profile.emails[0].value })
        if (!user) {
            user = new userModel({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                password: " ",
                isVerified: profile.emails[0].verified
            })
            await user.save()
        }
        return cb(null, user)

    } catch (error) {
        return cb(error, null)

    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await userModel.findById(id)
        if(!user) {
            return done(new Error("User not found"), null)
        }
        return done(null, user)

    }catch(error) {
        return done(error, null)

    }
})