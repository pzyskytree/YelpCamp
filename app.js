var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campgrounds = require("./models/campground.js"),
	Comments = require("./models/comment.js")
	seedDb = require("./models/seed.js")
	User = require("./models/users.js")
	passport = require("passport"),
	localStrategy = require("passport-local");

mongoose.connect("mongodb://localhost/yelp_camp_v6");
seedDb();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(require("express-session")({
	secret:"Hello world",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//ROUTES
//================
app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campgrounds.find({},function(err, campgrounds){
		if (err){
			console.log(err);
		}else{
			res.render("campground/index", {campgrounds : campgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res){
	var newName = req.body.name;
	var newImage = req.body.image;
	var newDesc = req.body.description;
	var newCamp = {name:newName, image:newImage, description: newDesc};
	Campgrounds.create(newCamp,function(err, campground){
		if (err){
			console.log(err);
		}else{
			res.redirect("/campgrounds"); 
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("campground/new");
});

app.get("/campgrounds/:id", function(req,res){
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err, campground){
		if (err){
			console.log(err);
		}else{
			console.log(campground);
			res.render("campground/show", {campground:campground});
		}
	});
});
//========================
// COMMENT
//========================
app.get("/campgrounds/:id/comments/new", isLogin, function(req, res){
	Campgrounds.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
		}else{
			res.render("comment/new", {campground, campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLogin, function(req, res){
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err, campground){
		if (err){
			console.log(err);
		}else {
			Comments.create(req.body.comment, function(err, comment){
				if (err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
		
	});
	
});
//===============
//Register
//===============
app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register", function(req, res){
	var newUser = {username:req.body.username};
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});
//===============
//Login
//===============
app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), function(req, res){});

//===============
//Logout
//===============
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});


function isLogin(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else{
		res.redirect("/login");
	}
}

app.listen(3000, process.env.IP, function(){
	console.log("The yelp camp server is started");
});