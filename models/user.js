const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
    },
    apellido: {
        type: String,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
    },
    lenguaje: {
        type: String,
    },
    nosotros: {
        type: String,
    }
}, {
    timestamps: true
})

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(5), null);
    next();
})

userSchema.methods.compararPasswords = function(password, cb) {
    bcrypt.compare(password, this.password, (err, sonIguales) => {
        if (err) {
            return cb(err);
        }
        return cb(null, sonIguales);
    })
}

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const Usuario = mongoose.model('usuarios', userSchema);

module.exports = Usuario;