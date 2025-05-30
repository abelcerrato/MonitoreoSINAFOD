import { pool } from '../db.js'

// Obtener todos los objetos
export const getObjetosM = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT 
            mso.id, mso.objeto, mso.descripcion, mso.idmodulo, mm.modulo, 
            muc.nombre as creadopor, mso.fechacreacion, mum.nombre as modificadopor, 
            mso.fechamodificacion 
        FROM ms_objetos mso
        left join ms_modulos mm  on mso.idmodulo = mm.id 
        left join ms_usuarios muc on mso.creadopor = muc.id 
        left join ms_usuarios mum on mso.modificadopor = mum.id 
        order by mso.id asc`)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


// Obtener un objeto por ID
export const getObjetoIdM = async (id) => {
    console.log('Objeto enviado:', id);
    try {
        const { rows } = await pool.query(`SELECT 
            mso.objeto, mso.descripcion, mso.idmodulo, mm.modulo, 
            muc.nombre as creadopor, mso.fechacreacion, mum.nombre as modificadopor, 
            mso.fechamodificacion 
        FROM ms_objetos mso
        inner join ms_modulos mm  on mso.idmodulo = mm.id 
        inner join ms_usuarios muc on mso.creadopor = muc.id 
        inner join ms_usuarios mum on mso.modificadopor = mum.id 
        WHERE mso.id=$1`, [id]);
        console.log('Resultado de la consulta del Objeto:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Objeto:', error);
        throw error;
    }
}



//mostrar objetos por el id del modulo
export const getObjetoIdModuloM = async (id) => {
    console.log('Objeto enviado:', id);
    try {
        const { rows } = await pool.query(`SELECT 
            mso.objeto, mso.descripcion, mso.idmodulo, mm.modulo, 
            muc.nombre as creadopor, mso.fechacreacion, mum.nombre as modificadopor, 
            mso.fechamodificacion 
        FROM ms_objetos mso
        inner join ms_modulos mm  on mso.idmodulo = mm.id 
        inner join ms_usuarios muc on mso.creadopor = muc.id 
        inner join ms_usuarios mum on mso.modificadopor = mum.id 
        WHERE mm.id=$1`, [id]);
        console.log('Resultado de la consulta del Objeto:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el Objeto:', error);
        throw error;
    }
}


// Insertar un nuevo objeto
export const postObjetosM = async (objeto, idmodulo, descripcion, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO ms_objetos 
            (objeto, idmodulo, descripcion, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null, null) RETURNING *`, [objeto, idmodulo, descripcion, creadopor]);
        return rows;
    } catch (error) {
        console.error('Error al insertar el Objeto:', error);
        throw error;
    }
}

// Actualizar un objeto existente
export const putObjetosM = async (objeto, idmodulo, descripcion, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE ms_objetos 
            SET 
            objeto=$1, idmodulo=$2, descripcion=$3, modificadopor=$4, fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$5 RETURNING *`, [objeto, idmodulo, descripcion, modificadopor, id]);
        return rows;
    } catch (error) {
        console.error('Error al actualizar el Objeto:', error);
        throw error;
    }
}
