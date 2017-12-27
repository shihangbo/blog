/**
 * Created by watson on 2017/12/27
*/

//引入mongoose
var mongoose = require("mongoose");
//加载schema
var userSchema = require("../schemas/users");
//创建model
module.exports = mongoose.model("User", userSchema);