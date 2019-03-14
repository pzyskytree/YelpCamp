var mongoose = require("mongoose"),
	Campgrounds = require("./campground.js"),
	Comments = require("./comment.js");
data = [
	{
		name: "Granite Hill", 
 		image: "http://www.photosforclass.com/download/2489726263",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},{
		name: "Granite Hill", 
 		image: "http://www.photosforclass.com/download/2489726263",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},{
		name: "Granite Hill", 
 		image: "http://www.photosforclass.com/download/2489726263",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
]
function seedDb(){
	//Remove
	Campgrounds.remove({}, function(err, campground){
		if (err){
			console.log(err);
		}else{
			console.log("Remove All");
			data.forEach(function(seed){
				Campgrounds.create(seed, function(err, campground){
					if(err){
						console.log(err);
					}else{
						console.log("Add One Campground");
						Comments.create({
							content: "This is place is very good except for the internet",
							author: "Alan Pan"
						}, function(err, comment){
							if (err){
								console.log(err);
							}else{
								console.log("Add a comment");
								campground.comments.push(comment);
								campground.save();
							}
						});
					}
				});
			});
		}
	});
}
module.exports = seedDb;