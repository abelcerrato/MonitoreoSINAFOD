import { pool } from '../db.js' // Importa la conexión a la base de datos

// Trae todos los roles
export const getRolesM = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT 
            r.id, r.rol, r.estado, r.descripcion,  muc.nombre as creadopor, r.fechacreacion, mum.nombre as modificadopor, r.fechamodificacion
        from ms_roles as r
        left join ms_usuarios muc on r.creadopor = muc.id 
        left join ms_usuarios mum on r.modificadopor = mum.id
        order by r.id asc`)
        return rows;
    } catch (error) {
        throw error;
    }
}

// Trae un rol por su id
export const getRolIdM = async (id) => {
    console.log('Rol enviada:', id);
    try {
        const { rows } = await pool.query('SELECT rol, estado, descripcion FROM ms_roles WHERE id=$1', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener el Rol:', error);
        throw error;
    }
}

// Crea un nuevo rol
export const postRolesM = async (rol, estado, descripcion, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO ms_roles 
            (rol, estado, descripcion, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null, null) RETURNING *`, [rol, estado, descripcion, creadopor]);
        return rows;
    } catch (error) {
        console.error('Error al insertar el Rol:', error);
        throw error;
    }
}

// Actualiza un rol por su id
export const putRolesM = async (rol,  estado, descripcion, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE ms_roles 
            SET 
            rol=$1, estado=$2, descripcion=$3, modificadopor=$4, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$5 RETURNING *`, [rol,  estado, descripcion, modificadopor, id]);
        return rows;
    } catch (error) {
        console.error('Error al actualizar el Rol:', error);
        throw error;
    }
}