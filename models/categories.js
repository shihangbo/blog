/**
 * Created by watson on 2018/01/06
*/

//引入mongoose
var mongoose = require("mongoose");
//加载schema
var categoriesSchema = require("../schemas/categories");
//创建model
module.exports = mongoose.model("Category", categoriesSchema);