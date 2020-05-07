const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        expire_at: {
            type: Number,
            required: true
        }
    }],
},
    {
        timestamps: true // This is separet from other field
    }
);

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ["_id", "email", "username", "firstName", "lastName", "tokens"]);
};


userSchema.methods.generateAuthToken = async function() {
    let user = this;
    let access = "auth";
    let token = await jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    let expire_at = moment.utc(new Date()).valueOf();

    user.tokens.push({ access, token, expire_at });
    await user.save()
    return user;
};

userSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

userSchema.statics.findByToken = async function(token) {
    let User = this;
    let decoded;

    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
};

userSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

userSchema.pre("save", function(next) {
    let user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;