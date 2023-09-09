import passport from 'passport';
import local from 'passport-local'
import userModel from '../daos/mongodb/models/user.model.js';
import GitHubStrategy from 'passport-github2';
import SessionService, {USER_ADMIN} from '../services/session.service.js'
const sessionService = new  SessionService()
import { CONFIG } from '../config.js'


const LocalStrategy = local.Strategy;
export const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField: 'email'}, async (req, username, password, done) => {
            const {first_name, last_name, age} = req.body;
            try {
               const user = await sessionService.register({
                first_name, last_name, email: username, age, password, role: 'user'
               })
                return done(null, user || false);
            } catch (error) {
                return done('Error al obtener el usuario: ' +error);
            }
        }
    ))
        
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username,password,done) => {
        try {
            const user = await sessionService.login(username, password)
            return done(null, user || false);  
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID:CONFIG.CLIENT_ID,
        clientSecret: CONFIG.CLIENT_SECRET,
        callbackURL: CONFIG.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = userService.loginWithGithub(profile)
            done(null, user || false);
        }catch (error) {
            return done(error);
        }
    }))
    
    passport.serializeUser(async (user, done) => {
        done(null, user._id);
      })
      
    passport.deserializeUser(async (id, done) => {
        if(id === 'admin') {
          return done(null, USER_ADMIN);
        }
        let user = await userModel.findById(id);
        done(null, user);
      })
      
}
