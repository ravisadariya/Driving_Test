const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {encrypt, decrypt} = require('../encryption');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    licenseNumber: String,
    age: Number,
    dob: String,
    car_details: {
        make: String,
        model: String,
        year: Number,
        plateNo: String
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },

    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    testType: {
        type: String
    },
    comments: {
        type: String
    },
    passFail: {
        type: Boolean
    }

});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err);
        }

        this.password = hash;
        next();
    });
});


UserSchema.pre('findByIdAndUpdate', function (next) {
    if (!this._update.licenseNumber) return next();

    const encryptedNo = encrypt(this._update.licenseNumber || '');

    this._update.licenseNumber = encryptedNo;

    return next();
});

UserSchema.post('findOne', function (docs, next) {
    if (!docs) {
        return next();
    }

    if (Array.isArray(docs)) {
        docs.forEach((doc) => {
            doc.licenseNumber = decrypt(doc.licenseNumber || '');
        });
    } else {
        docs.licenseNumber = decrypt(docs.licenseNumber || '');
    }
    next();
});


const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;