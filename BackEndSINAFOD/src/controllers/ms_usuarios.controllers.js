import { pool } from "../db.js";
import bcrypt from "bcrypt"; // Para cifrar contraseñas
import jwt from "jsonwebtoken";

import {
  getUserM,
  getUserIdM,
  postUserM,
  updateUserM,
  getUsuarioIdM,
  verificarUsuarioM,
  updateContraseñaM,
  resetContraseñaM,
} from "../models/ms_usuarios.models.js";

export const getUserC = async (req, res) => {
  try {
    const users = await getUserM();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUsuarioIdC = async (req, res) => {
  try {
    const { usuario } = req.params;
    const users = await getUsuarioIdM(usuario);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUserIdC = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUserIdM(id);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verificarUsuarioC = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    console.log(req.body);

    if (!usuario || !contraseña) {
      console.log("Faltan datos en la solicitud");
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const user = await verificarUsuarioM(usuario);

    if (!user) {
      console.log("Usuario o contraseña incorrectos");
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) {
      console.log("Usuario o contraseña incorrectos");
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.json({
      message: `Usuario autenticado. Su usuario es: ${user.nombre}`,
      user: user,
    });
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const postUserC = async (req, res) => {
  try {
    const { nombre, usuario, correo, idrol, estado, identidad, creadopor } =
      req.body;
    console.log(req.body);
    const users = await postUserM(
      nombre,
      usuario,
      correo,
      idrol,
      estado,
      identidad,
      creadopor
    );
    //res.json(users)
    res.json({ message: "Usuario Agregado Exitosamente", user: users });
  } catch (error) {
    console.error("Error al insertar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUserC = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, idrol, estado, modificadopor, usuario, identidad } =
      req.body;

    const users = await updateUserM(
      nombre,
      correo,
      idrol,
      estado,
      modificadopor,
      usuario,
      identidad,
      id
    );
    res.json({ message: "Usuario Actualizado Exitosamente", user: users });
  } catch (error) {
    console.error("Error al actualizar el usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//no está en uso, ya que la contraseña es la identidad del usuario
export const updateContraseñaC = async (req, res) => {
  try {
    console.log("Entro a la función de actualizar contraseña");

    const { usuario } = req.params;
    const { nuevaContraseña } = req.body;

    const users = await updateContraseñaM(nuevaContraseña, usuario);

    res.status(200).json({
      message: "Contraseña del Usuario Actualizada Exitosamente",
      user: users,
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña del usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//no está en uso, ya que la contraseña es la identidad del usuario
export const resetContraseñaUserC = async (req, res) => {
  try {
    const { usuario } = req.params;

    const users = await getUsuarioIdM(usuario);
    const identidad = users[0].identidad;
    console.log("Identidad del usuario:", identidad);

    const usuarioActualizado = await resetContraseñaM(identidad, usuario);

    res.json({
      message: "Contraseña reseteada con éxito. ",
      user: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al resetear la contraseña del usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const verificarToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT sesionactiva FROM ms_usuarios WHERE id = $1",
      [decoded.id]
    );

    const storedToken = result.rows[0]?.sesionactiva;

    if (storedToken !== token) {
      return res.status(403).json({
        valid: false,
        message: "Sesión inválida o cerrada en otro lugar",
      });
    }

    return res.json({ valid: true });
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Token inválido o expirado" });
  }
};

// Controlador para el login
export const loginC = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const user = await verificarUsuarioM(usuario);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    // Verificar si el usuario no tiene rol asignado
    if (user.estado === "Inactivo" || user.estado === "Bloqueado") {
      return res
        .status(401)
        .json({ message: "El usuario no tiene permisos para acceder" });
    }

    // Verificar si el usuario no tiene rol asignado
    if (user.idrol === null) {
      return res
        .status(401)
        .json({ message: "El usuario no tiene un rol asignado" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // const contraseñaNuevoUsuario = await bcrypt.compare("NuevoUsuario1*", user.contraseña);
    /*const contraseñaTemporal = await bcrypt.compare("Temporal1*", user.contraseña); // yano se usa ya que la contraseña es la identidad del usuario*/
    const requiereCambio = user.cambiocontraseña === true;

    if (requiereCambio) {
      return res.status(403).json({
        message: "Debe cambiar su contraseña",

        user: {
          id: user.id,
          usuario: user.usuario,
          idrol: user.idrol,
          estado: user.estado,
          changePasswordRequired: user.cambiocontraseña,
        },
      });
    }

    // Verificar si ya había una sesión activa
    const yaHabiaSesion = user.sesionactiva !== null;

    //  Generar nuevo token
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, idrol: user.idrol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    //  Guardar nuevo token en BD
    await pool.query("UPDATE ms_usuarios SET sesionactiva = $1 WHERE id = $2", [
      token,
      user.id,
    ]);
 console.log("Usuario autenticado:", user);
    // Responder incluyendo si ya había sesión activa
    return res.json({
      message: yaHabiaSesion
        ? "Inicio de sesión exitoso. Se cerró otra sesión activa."
        : "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        usuario: user.usuario,
        idrol: user.idrol,
        sesionactiva: token,
      },
      yaHabiaSesion,
    });

   
  } catch (error) {
    console.error("Error en login: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const logoutC = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID del usuario que quiere cerrar sesión: ", id);

    // Cerrar sesión del usuario (poner sesionactiva a false)
    await pool.query(
      "UPDATE ms_usuarios SET sesionactiva = null WHERE id = $1",
      [id]
    );

    return res.json({ message: "Sesión cerrada exitosamente." });
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
