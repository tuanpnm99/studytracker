var express = require("express")
var app = express()
var parser = require("body-parser")
var helper = require("./helper")
var methodOverride = require("method-override")
var passport = require('passport')
var LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
var $ = require("jquery")
mongoose.connect('mongodb://localhost/db1', { useNewUrlParser: true });

var Schema = mongoose.Schema;
//create class and score Schemas
const classSchema = new Schema({
    class_name: String,
    credit: Number,
    scoreID: String
})
const classesSchema = new Schema({
    user_name: String,
    classes: [classSchema]
})
const subScoreSchema = new Schema({
    name: String,
    score: [Number],
    weight: Number
})

const scoreSchema = new Schema({
    all_score: [subScoreSchema],
    total: Number,
    grade: String
})
const User = require('./models/user')
//Create classes and score models
var classesDB = mongoose.model("class", classesSchema)
var scoreDB = mongoose.model("score", scoreSchema)


app.use(parser.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(methodOverride("_method"))
app.set('view engine', 'ejs');
app.use(require("express-session")({
    secret: "This is Study Tracker",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//pass user info for all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})



// Index Route
app.get("/", isLoggedIn, function(req,res){
    res.render('pages/index');
})

// Register Route
app.get("/register", function(req, res){
    res.render("pages/register")
})
app.post("/register", function(req, res){
    if(req.body.password != req.body.confirmpassword) return res.redirect("/register")
    var username = new User({username: req.body.username})
    User.register(username, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("pages/register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect('/newuser')
        })
    })
    
})

//Login Route
app.get("/login", function(req, res){
    res.render("pages/login")
})
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){})

//Handle logout
app.get("/logout", function(req, res){
    req.logout()
    res.redirect("login")
})

//Edit class information Route
app.get("/editclass", isLoggedIn, function(req,res){
    var username = req.user.username
    console.log(req.body)
    classesDB.find({"user_name": username}, function(err, info){
        if(err) console.log(err)
        else{
            var info = info[0]
            console.log(info)
            res.render("pages/editclass", {info: info})
        }
    })
    
})
app.put("/editclass/:iduser", isLoggedIn, function(req,res){
    var classes = []
    var oldClasses = req.body.classes
    console.log(req.body)
    if(req.body.new){
        req.body.new.forEach(function(c){
            var newScore = new scoreDB({
                all_score: [],
                total: null,
                grade: ''
            })
            newScore.save(function(err, score){
                if(err) console.log(err)
                var obj = Object.assign(c, {scoreID: score._id})
                classes.push(obj)
                if(classes.length == req.body.new.length){
                    var newClasses = oldClasses.concat(classes)
                    var saveClasses = {
                            user_name: req.body.user_name,
                            classes: newClasses
                    }
                    classesDB.update({"_id": mongoose.Types.ObjectId(req.params.iduser)}, saveClasses, function(err, updatedData){
                        if(err) console.log(err)
                        console.log(updatedData)
                        res.redirect("/showclass")
                    })
                }
            })        
        })
    } else{
        console.log(oldClasses)
        var saveClasses = {
                            user_name: req.body.user_name,
                            classes: oldClasses}
        classesDB.update({"_id": mongoose.Types.ObjectId(req.params.iduser)}, saveClasses, function(err, updatedData){
                if(err) console.log(err)
                console.log(updatedData)
                res.redirect("/showclass")
        })
                    
    }
    
    
})

//Create information for newuser
app.get("/newuser", isLoggedIn, function(req,res){
    res.render("pages/newuser")
})
app.post("/newuser", isLoggedIn, function(req,res){
    var classes = []
    console.log(req.body)
    req.body.classes.forEach(function(c){
        var newScore = new scoreDB({
            all_score: [],
            total: null,
            grade: ''
        })
        console.log(c)
        newScore.save(function(err, score){
            if(err) console.log(err)
            var obj = Object.assign(c, {scoreID: score._id})
            classes.push(obj)
            console.log(obj)
            if(classes.length == req.body.classes.length){
                var saveClasses = new classesDB({
                        user_name: req.body.user_name,
                        classes: classes
                })
                saveClasses.save(function(err, classes){
                    if(err) console.log(err)
                    console.log(classes)
                    res.redirect("/showclass")
                })
            }
        })        
    })
})
//Show class information route
app.get("/showclass", isLoggedIn, function(req,res){
    var username = req.user.username
    classesDB.find({"user_name": username}, function(err, info){
        if(err) console.log(err)
        else{
            if(info.length == 0) return res.redirect("/newuser")
            var info = info[0]
            var classinfo = []
            info.classes.forEach(function(c){
                scoreDB.find({"_id": c.scoreID}, function(err, scoreinfo){
                        if(err) console.log(err)
                        var tmp = {class_name: c.class_name, credit: c.credit, scoreinfo: scoreinfo[0]}
                        classinfo.push(tmp)
                        if(classinfo.length == info.classes.length){
                            console.log(classinfo)
                            res.render("pages/showclass", {username: username, info: classinfo})
                        } 
                })
            })
        }
    })
})
// Edit score information route
app.get("/editscore/:idscore", isLoggedIn, function(req, res){
    var id = req.params.idscore
    scoreDB.find({"_id": id}, function(err, score){
        if(err) console.log(err)
        console.log(score)
        res.render("pages/editscore", {info: score[0], id: id})
    })
})
app.put("/editscore/:idscore", isLoggedIn, function(req, res){
    console.log(req.body)
    scoreDB.findOneAndUpdate({"_id": req.params.idscore}, req.body, function(err, updatedData){
        if(err) console.log(err)
        console.log(updatedData)
        res.redirect("/showclass")
    })
})

//Generate study plan route
app.get("/studyplan", isLoggedIn, function(req, res){
    var username = req.user.username
    classesDB.find({"user_name": username}, function(err, info){
        if(err) console.log(err)
        else{
            if(info.length == 0) return res.redirect("/newuser")
            var info = info[0]
            var classinfo = []
            info.classes.forEach(function(c){
                scoreDB.find({"_id": c.scoreID}, function(err, scoreinfo){
                        if(err) console.log(err)
                        var tmp = {class_name: c.class_name, credit: c.credit, grade: scoreinfo[0].grade}
                        console.log(tmp)
                        classinfo.push(tmp)
                        if(classinfo.length == info.classes.length){
                            var plan = helper.studyplan(classinfo)
                            console.log(plan[0])
                            res.render('pages/studyplan',{plan: plan})
                        } 
                })
            })
        }
    })
})
//middleware to check if a user log in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect("/login")
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER STARTED ...")
  
})
