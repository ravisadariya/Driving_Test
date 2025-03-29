class userController {
    static index = (req, res) => {
        res.render("dashboard");
    }

    static saveData = (req, res) => {
        res.send("Save Data");
    }
}


module.exports = userController