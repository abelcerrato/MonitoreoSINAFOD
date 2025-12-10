import { pool } from '../db.js' // Importa la conexión a la base de datos

//Trae todas las aldeas mediante el ID del registro
export const getAldeasIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            select a.id, a.nombre as aldea , m.nombre as municipio 
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
