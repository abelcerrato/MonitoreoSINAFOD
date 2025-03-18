import { pool } from '../db.js'


export const getAldeasIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            select a.nombre as aldea , m.nombre as municipio 
            from aldeas a 
            inner join municipio m on a.idmunicipio = m.id 
            WHERE m.id=$1`, [id])

        if (rows.length === 0) {
            return null
        }
        return rows
    } catch (error) {

        throw error;
    }
}
