import passport from 'passport';
import local from 'passport-local'
import userModel from '../daos/mongodb/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;
export const intializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField:'email'}, async (req, username, password, done)=> {
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userModel.findOne({email:username});
                if(user) {
                    console.log('user already exists')
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: 'usuario'
                }
                let result = await userModel.create(newUser)
                return done(null, result);
            } catch (error) {
                return done('Error al obtener el usuario: '+error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById(id)
        done(null, user);
    })

    
}

export const loginPassport = () => {
    passport.use('login', new LocalStrategy({ usernameField:'email'}, async (username, password, done)=> {
        try {
            let user = await userModel.findOne({email:username});
            if(!user) {
                console.log("user doesn't exists")
                return done(null, false)
            }
            if(!isValidPassword(user, password)) return done(null, false);
            delete user.password;
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById(id)
        done(null, user);
    })
}

export const githubPassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID:process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
            try{
                console.log(profile);
                let user = await userModel.findOne({email: profile._json.email})
                if(!user) {
                    let newUser = {
                        first_name: profile.username,
                        last_name: '',
                        email: profile.profileUrl, 
                        age: 18, 
                        password: createHash('1234')
                    }
                    const result = await userModel.create(newUser);
                    done(null, result);
                }
                else{
                    done(null, user)
                }
            } catch(error) {
                return done(error)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById(id)
        done(null, user);
    })
}
