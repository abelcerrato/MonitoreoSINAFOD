import { pool } from '../db.js'

export const getUserM = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuario')
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getUsuarioIdM = async (user) => {
    console.log('Usuario enviado:', user);
    try {
        const { rows } = await pool.query('SELECT id FROM usuario WHERE usuario=$1', [user]);
        console.log('Resultado de la consulta de usuario:', rows); // Agregado para depuración
        return rows;
    } catch (error) {
        console.error('Error al obtener el usuario:', error); // Log de error más claro
        throw error;
    }
}


export const getUserIdM = async (id) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuario WHERE id=$1', [id])

        if (rows.length === 0) {
            return null
        }
        return rows[0]
    } catch (error) {

        throw error;
    }
}

export const verificarUsuarioM = async (usuario, contraseña) => {
    try {
        const { rows, rowCount } = await pool.query('SELECT * FROM usuario WHERE usuario = $1 AND contraseña = $2', 
            [usuario, contraseña]);

        if (rowCount === 0) {
            return null;  // Esto se utiliza para que en el controlador se indique que no fue encontrado.
        }

        return rows[0];  // Devuelve el primer usuario encontrado.
    } catch (error) {
        throw error; // Si ocurre algún error en la consulta, se lanza el error.
    }
};


export const postUserM = async (nombre, edad, usuario, contraseña) => {
    try {
        const { rows } = await pool.query('INSERT INTO usuario (nombre, edad, usuario, contraseña, fechacreacion, fechamodificacion ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null) RETURNING *',
            [nombre, edad, usuario, contraseña])

        //console.log(result);
        return rows[0]
    } catch (error) {
        throw error;
    }
}


export const updateUserM = async (nombre, edad, usuario, contraseña, id) => {
    try {
        const { rows } = await pool.query('UPDATE usuario SET nombre=$1, edad=$2, usuario=$3, contraseña=$4, fechamodificacion=CURRENT_TIMESTAMP  WHERE id=$5 RETURNING *',
            [nombre, edad, usuario, contraseña, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}

export const deleteUserM = async (id) => {
    try {
        const { rows, rowCount } = await pool.query('DELETE FROM usuario WHERE id=$1 RETURNING *', [id])
        console.log(rows);

        if (rowCount === 0) {
            return null; // Retorna null si el usuario no existe
        }

        return rows[0];
    } catch (error) {
        throw error;
    }
}

