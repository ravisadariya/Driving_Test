const UserModel = require("../../models/userModel");
const {getUserTypes} = require("../../models/enums/userType");

module.exports = async (req, res, next) => {
    if (!req.session.userdata) {
        return res.redirect("/login");
    }
    const user = await UserModel.findOne({_id: req.session.userdata._id});
    if (user.userType !== getUserTypes().ADMIN.id.toString()) {
        return res.redirect("/login");
    }
    next();
}