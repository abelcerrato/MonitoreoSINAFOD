import { pool } from '../db.js'
import { getUserM, getUserIdM, postUserM, updateUserM, deleteUserM, verificarUsuarioM, getUsuarioIdM} from "../models/user.models.js";
 

export const getUserC = async (req, res) => {
    try {
        const users = await getUserM();
        res.json(users)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}

export const getUsuarioIdC = async (req, res) => {
    try {
        const {usuario } = req.params
        const users = await getUsuarioIdM(usuario);

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

       // Retornar el ID del usuario (suponiendo que el resultado tiene un campo 'id')
       res.json({ id: users[0].id });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const getUserIdC = async (req, res) => {
    try {
        const { id } = req.params
        const users = await getUserIdM(id);

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(users)
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const verificarUsuarioC = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        if (!usuario || !contraseña) {
            console.log("Faltan datos en la solicitud" );
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const user = await verificarUsuarioM(usuario, contraseña);

        if (!user) {
            console.log("Usuario o contraseña incorrectos");
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

         // Si el usuario es autenticado correctamente
         console.log("Usuario autenticado. Su usuario es:", user.nombre); // Imprime el nombre del usuario en la consola

         
        // Si el usuario es autenticado correctamente
        return res.json({
            message: `Usuario autenticado. Su usuario es: ${user.nombre}`, // Aquí agregamos el nombre del usuario
            user: user
        });

    } catch (error) {
        console.error("Error al verificar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};




export const posUserC = async (req, res) => {
    try {
        const { nombre, edad, usuario, contraseña } = req.body
        console.log(req.body);

        const users = await postUserM(nombre, edad, usuario, contraseña)
        //res.json(users)
        res.json({ message: "User added successfully", user: users });
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const updateUserC = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, edad, usuario, contraseña } = req.body

        const users = await updateUserM(nombre, edad, usuario, contraseña, id)
        //res.json(users)
        res.json({ message: "User updated successfully", user: users });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }


}


export const deleteUserC = async (req, res) => {
    try {
        const { id } = req.params
        const users = await deleteUserM(id)
        console.log(users);

        
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", user: users });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}