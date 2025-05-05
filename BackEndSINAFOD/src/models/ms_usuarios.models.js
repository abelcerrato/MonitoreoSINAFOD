import { pool } from '../db.js'
import bcrypt from 'bcrypt'; // Para cifrar contraseñas

export const getUserM = async () => {
    try {
        const { rows } = await pool.query(` 
        SELECT 
            u.id,
            u.nombre,
            u.correo,
            u.idrol,
            u.usuario,
            '********' AS contraseña, -- Se muestra oculta
            u.estado,
            r.rol
        FROM ms_usuarios u  
        left  JOIN ms_roles r   ON u.idrol = r.id
        ORDER BY u.id ASC;
        `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getUsuarioIdM = async (usuario) => {
    console.log('Usuario enviado:', usuario);
    try {
        const { rows } = await pool.query(`
            SELECT id, nombre, correo, idrol, contraseña, estado, fechacreacion, creadopor, fechamodificacion, modificadopor 
            FROM ms_usuarios 
            WHERE usuario=$1`, 
            [usuario]);
        console.log('Resultado de la consulta de usuario:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener el usuario:', error); 
        throw error;
    }
}


export const getUserIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT nombre,  correo, idrol, contraseña, 
            estado, fechacreacion, creadopor, fechamodificacion, modificadopor, usuario
            FROM ms_usuarios WHERE id=$1`, [id])

        if (rows.length === 0) {
            return null
        }
        return rows[0]
    } catch (error) {

        throw error;
    }


}

export const verificarUsuarioM = async (usuario) => {
    try {

        const { rows, rowCount } = await pool.query('SELECT id, usuario, idrol, nombre, contraseña, correo, sesionactiva, cambiocontraseña FROM ms_usuarios WHERE usuario = $1', 
            [usuario]);


        if (rowCount === 0) {
            return null;  // Esto se utiliza para que en el controlador se indique que no fue encontrado.
        }

        return rows[0];  // Devuelve el primer usuario encontrado.
    } catch (error) {
        throw error; // Si ocurre algún error en la consulta, se lanza el error.
    }
};


export const postUserM = async (nombre, usuario, cecap, correo, idrol, estado, creadopor) => {
    try {
        // Definir la nueva contraseña temporal
        const ContraseñaUsuarioNuevo = "NuevoUsuario1*";


        const contraseñaCifrada  = await bcrypt.hash(ContraseñaUsuarioNuevo, 10);
        const { rows } = await pool.query(`INSERT INTO ms_usuarios
                                                (nombre, usuario, cecap, correo, idrol, contraseña,
                                                estado, creadopor, fechacreacion, fechamodificacion, cambiocontraseña) 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, null, true) RETURNING *`,
            [nombre, usuario, cecap,  correo, idrol, contraseñaCifrada,  estado, creadopor])

        console.log(rows);
        return rows[0]
    } catch (error) {
        throw error;
    }
}


export const updateUserM = async ( nombre,  correo, idrol,  estado, modificadopor, usuario, id) => {
    try {

        //const contraseñaCifrada  = await bcrypt.hash(contraseña, 10);

        const { rows } = await pool.query(`UPDATE ms_usuarios SET 
                                                nombre=$1, correo=$2, idrol=$3, 
                                                estado=$4, modificadopor=$5, usuario=$6,
                                                fechamodificacion=CURRENT_TIMESTAMP, fechacreacion=null
                                            WHERE id=$7 RETURNING *`,
            [nombre,  correo, idrol,  estado, modificadopor, usuario, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}


export const updateContraseñaM = async (nuevaContraseña, usuario ) => {
    try {
        // Encriptar la nueva contraseña
        const contraseñaCifrada = await bcrypt.hash(nuevaContraseña, 10);

        // Actualizar solo la contraseña
        const { rows } = await pool.query(
            `UPDATE ms_usuarios 
                SET contraseña = $1, cambiocontraseña=false
                WHERE usuario = $2
                RETURNING usuario, nombre, correo`,
            [contraseñaCifrada, usuario]
        );

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        return { mensaje: "Contraseña actualizada correctamente", usuario: rows[0] };
    } catch (error) {
        throw error;
    }
};



export const resetContraseñaM = async (usuario) => {
    try {
        // Definir la nueva contraseña temporal
        const nuevaContraseña = "Temporal1*";

        // Encriptar la contraseña temporal
        const contraseñaCifrada = await bcrypt.hash(nuevaContraseña, 10);

        // Actualiza la contraseña en la base de datos
        const { rows } = await pool.query(
            `UPDATE ms_usuarios 
                SET contraseña = $1, cambiocontraseña=true
                WHERE usuario = $2
                RETURNING id, usuario, correo`,
            [contraseñaCifrada, usuario]
        );

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        return { mensaje: "Contraseña reseteada correctamente", usuario: rows[0] };
    } catch (error) {
        throw error;
    }
};
