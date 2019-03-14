var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String,
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "comments"
		}
	]
});

module.exports = mongoose.model("campgrounds", campSchema);