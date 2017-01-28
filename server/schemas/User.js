const mongoose = require('mongoose'),
    mongooseHidden = require('mongoose-hidden')({
        defaultHidden: {
            __v: true,
            created_at: true,
            updated_at: true,
            admin: true,
            password: true
        }
    }),
    autoIncrement = require('mongoose-increment'),
    bcrypt = require('bcrypt-nodejs');

const regExp = /^[A-zÀ-ÿ-\s]{2,100}$/;
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const usernameRegExp = /^[A-Za-z0-9]{3,20}$/;
const phoneRegExp = /^((\+|00)32\s?|0)4(60|[789]\d)(\s?\d{2}){3}$/;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: emailRegExp
    },
    firstname: {
        type: String,
        required: true,
        match: regExp
    },
    joined_on: {
        type: Date,
        required: true,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        match: regExp
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        match: phoneRegExp
    },
    invoice_amount: {
        type: Number,
        required: true,
        default: 0
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    _id: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

userSchema.pre('save', function(next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            } else {
                bcrypt.hash(user.password, salt, null, (err, hash) => {
                    if (err) {
                        return next(err);
                    } else {
                        user.password = hash;
                        return next(null);
                    }
                });
            }
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = (providedPassword, actualPassword, next) => {
    bcrypt.compare(providedPassword, actualPassword, (err, isMatch) => {
        if (err) {
            return next(err, null);
        } else {
            return next(null, isMatch);
        }
    });
};

userSchema.plugin(autoIncrement, {
    modelName: 'User',
    fieldName: '_id'
});
userSchema.plugin(mongooseHidden);

module.exports = userSchema;