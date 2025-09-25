import { pool } from '../db.js'

export const getModulosM = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT
            mm.id,mm.modulo, mm.descripcion, muc.nombre as creadopor, mm.fechacreacion, mum.nombre as modificadopor, mm.fechamodificacion 
        FROM ms_modulos mm
        left join ms_usuarios muc on mm.creadopor = muc.id 
        left join ms_usuarios mum on mm.modificadopor = mum.id
        order by mm.id asc`)
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getModuloIdM = async (id) => {
    console.log('Modulo enviado:', id);
    try {
        const { rows } = await pool.query(`
            SELECT 
                modulo, descripcion, creadopor, fechacreacion, modificadopor, fechamodificacion 
            FROM ms_modulos 
            WHERE id=$1`, [id]);
        console.log('Resultado de la consulta del modulo:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el modulo:', error);
        throw error;
    }
}



export const postModuloM = async (modulo, descripcion, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO ms_modulos 
            (modulo, descripcion, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, null, null) RETURNING *`, 
            [modulo, descripcion, creadopor]);
        return rows;
    } catch (error) {
        console.error('Error al insertar el modulo:', error);
        throw error;
    }
}

export const putModuloM = async (modulo, descripcion, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE ms_modulos 
            SET 
            modulo=$1, descripcion=$2, modificadopor=$3, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$4 RETURNING *`, [modulo, descripcion, modificadopor, id]);
        return rows;
    } catch (error) {
        console.error('Error al actualizar el Rol:', error);
        throw error;
    }
}