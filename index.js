const express = require("express");

// const path = require("path");
const bcrypt = require('bcrypt');

const admin = require("./middleware/role-based/admin");
const examiner = require("./middleware/role-based/examiner");


const sessions = require("express-session");

const app = express();
app.use(express.static("public"));
// const ejs = require("ejs");


app.set("view engine", "ejs");

const mongoose = require("mongoose");

const connectDb = require("./connection");





const Appointment = require("./models/Appointment");
const UserModel = require("./models/userModel");
const userController = require("./controller/userController");
const {getUserTypes, getUserType} = require("./models/enums/userType");
const {TestType} = require("./models/enums/testType");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(4000, async () => {
    console.log("Application is running port 4000");
    await connectDb();
})


app.use(sessions({
    resave: true,
    secret: "my secret",
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.userdata = req.session.userdata;
    res.locals.userPermissions = []
    if(req.session.userdata) {
        res.locals.userPermissions = getUserType(req.session.userdata.userType).permissions
    }
    res.locals.usertypes = getUserTypes();
    next();
});


app.post("/g2", async (req, res) => {
    try {
        const errors = {};
        const {
            firstName,
            lastName,
            licenseNumber,
            age,
            dob,
            make,
            model,
            year,
            plateNo
        } = req.body;



        if (!firstName) {
            errors['firstName'] = "Please Insert Firstname!"
        }
        if (!lastName) {
            errors['lastName'] = "Please Insert lastName!"
        }
        if (!licenseNumber) {
            errors['licenseNumber'] = "Please Insert licenseNumber!"
        }
        if (!age) {
            errors['age'] = "Please Insert age!"
        }
        if (!dob) {
            errors['dob'] = "Please Insert dob!"
        }
        if (!make) {
            errors['make'] = "Please Insert make!"
        }
        if (!model) {
            errors['model'] = "Please Insert model!"
        }
        if (!year) {
            errors['year'] = "Please Insert year!"
        }
        if (!plateNo) {
            errors['plateNo'] = "Please Insert plateNo!"
        }

        const insertObj = {
            firstName,
            lastName,
            licenseNumber,
            age,
            dob,
            car_details: {
                make,
                model,
                year,
                plateNo
            },
            testType: TestType.G2
        }

        if (Object.keys(errors).length <= 0) {
            const op = await UserModel.findByIdAndUpdate(req.session.userdata._id, insertObj);
            const appointmentData = await Appointment.findOne({
                date: req.body.date,
                time: req.body.time,
            });
    
            appointmentData.isTimeSlotAvailable = false;
    
            await appointmentData.save();
    
            op.appointment = appointmentData._id;
    
            await op.save();

        }
        console.log(errors);
        res.render("g2", { errors });
    } catch (error) {
        console.log(error)
        res.render("g2", { error: "Someting Went Wrong" });
    }
});


app.post("/g", async (req, res) => {

    try {
        const errors = {};
        const {
            userId,
            make,
            model,
            year,
            plateNo
        } = req.body;

        if (!make) {
            errors['make'] = "Please Insert make!"
        }
        if (!model) {
            errors['model'] = "Please Insert model!"
        }
        if (!year) {
            errors['year'] = "Please Insert year!"
        }
        if (!plateNo) {
            errors['plateNo'] = "Please Insert plateNo!"
        }
        if (!plateNo) {
            errors['plateNo'] = "Please Insert plateNo!"
        }

        const updateObj = {
            car_details: {
                make,
                model,
                year,
                plateNo
            },
            testType: TestType.G

        }

        if (Object.keys(errors).length <= 0) {

            const user = await UserModel.findByIdAndUpdate(userId, updateObj, { new: true });
            const appointmentData = await Appointment.findOne({
                date: req.body.date,
                time: req.body.time,
            });

            appointmentData.isTimeSlotAvailable = false;

            await appointmentData.save();

            op.appointment = appointmentData._id;

            await op.save();

            res.render("g", { errors, user: user, success: "User Updated Successfully!" });

        } else {
            res.render("g", { errors, success: null });
        }
    } catch (error) {
        console.log(error)
        res.render("g", { error: "Someting Went Wrong" });
    }
});


app.get("/", (req, res) => {
    res.render("dashboard")
});

app.get("/g2", async (req, res) => {
    res.render("g2")
})

app.get("/g", async (req, res) => {
    const user = await UserModel.findOne({ _id: req.session.userdata._id })
    res.render("g", { user })
});


app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    const userTypes = getUserTypes()
    res.render("signup", { userTypes })
});



app.post("/login", (req, res) => {
    const { username, password } = req.body;


    UserModel.findOne({ username: username })
        .then(userdata => {
            console.log(userdata);  
            if (userdata) {
                bcrypt.compare(password, userdata.password)
                    .then(domatch => {
                        if (domatch) {
                            req.session.userdata = userdata;
                            res.redirect("/");
                        } else {
                            res.send("Incorrect password");
                        }
                    })
                    .catch(error => {
                        console.error("Error comparing passwords", error);
                        res.status(500).send("Internal Server Error");
                    });
            } else {
                res.send("User not found");
            }
        })
        .catch(error => {
            console.error("Error finding user", error);
            res.status(500).send("Internal Server Error");
        });
});




app.post("/signup", (req, res) => {
    UserModel.create({
        username: req.body.username,
        password: req.body.password,
        userType: req.body.userType,
    })
        .then(data => {
            res.render("login");
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
});



app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

app.get('/examiner', examiner, async (req, res) => {
    return res.render('examiner');
});


app.get('/appointment', admin, async (req, res) => {
    return res.render('appointment');
});



app.post('/appointment', admin, async (req, res) => {
    const { date, time } = req.body;

    const slot = await Appointment.findOne({ date, time });

    if (slot) {
        return res.render('appointment', {
            error: "The selected slot is already taken, please select a different one!",
        });
    }

    await Appointment.create({
        date,
        time,
        isTimeSlotAvailable: true,
    });

    return res.redirect('/appointment');
});

function getTimeSlots(date, booked){
    if(booked){
        return Appointment.find({
            date: date,
            isTimeSlotAvailable: false
        });
    } else {
        return Appointment.find({
            date: date
        });
    }
}

app.get('/getTimeSlots', async (req, res) => {
    const booked = req.query.booked;
    const slots = await getTimeSlots(req.query.date, booked);
    console.log("slotsslotsslots", slots)
    return res.json(slots);
});

app.get('/getDriversFromTime', async (req, res) => {
    const drivers = await UserModel.find({
        appointment: req.query.appointment,
    });

    return res.json(drivers);
});

app.post("/take-test", async (req, res) => {
    try {
        const errors = {};
        const {
            userid,
            comments,
            passFail,
            testType
        } = req.body;

        const insertObj = {
            comments,
            passFail,
            testType
        }
        console.log(insertObj, userid)
        const op = await UserModel.findByIdAndUpdate({_id: userid}, insertObj);
        await op.save();
        res.render("examiner");
    } catch (error) {
        console.log(error)
        res.render("examiner", { error: "Someting Went Wrong" });
    }
});
