"use strict";
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Usuario = require("../models/user");
const bcrypt = require("bcryptjs");

function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      "mongodb+srv://jareddelao:bWlRWhgRKu9Z2nCv@ecommerce1.mcoiu.mongodb.net/e-commerce?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      function (err) {
        if (err) {
          // return console.dir(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
}

module.exports.handlerPost = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    const body = JSON.parse(event.body);

    const user = new Usuario({
      nombre: body.nombre,
      apellido: body.apellido,
      empresa: body.empresa,
      lenguaje: body.lenguaje,
      nosotros: body.nosotros,
      email: body.email,
      password: body.password,
    });

    const userDB = await Usuario.findOne({ email: body.email });
    if (userDB) {
      return {
        ok: false,
        mensaje: "El email ya esta registrado",
      };
      // return callback(null, {
      //   statusCode: 400,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     success: false,
      //     mensaje: 'El email ya esta registrado',
      //   }),
      // });
    }

    await user.save();

    return {
      ok: true,
      mensaje: "Usuario creado correctamente",
    };

  } catch (e) {
    callback(null, {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Error al acceder a la BD: " + err,
      }),
    });
  }
};


module.exports.handlerLogin = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    const body = JSON.parse(event.body);
    const email = body.email;
    const password = body.password;

    const usuarioDB = await Usuario.findOne({ email: body.email });

    if (!usuarioDB) {
      return {
        ok: false,
        message: `El email: ${email} no esta registrado`,
      };
    }

    const match = await bcrypt.compare(password, usuarioDB.password);

    if (match) {
      return {
        ok: true,
        message: `Login exitoso`,
      };
    }
    return {
      ok: false,
      message: `Contraseña inválida`,
    };
  } catch (e) {
    callback(null, {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Error al acceder a la BD: " + err,
      }),
    });
  }
};
