import { pool } from '../db.js'


export const getMunicipiosIdM = async (id) => {
    try {
        const { rows } = await pool.query(`
            select d.nombre as departamento , m.id, m.nombre as municipio 
            from municipio m 
            inner join departamento d on m.iddepartamento = d.id 
            WHERE d.id=$1`, [id])

        if (rows.length === 0) {
            return null
        }
        return rows
    } catch (error) {

        throw error;
    }
}




export const getMunicipioxIdDepto = async (municipioced) => {
    console.log('Municipio enviado:', municipioced);
    try {
        // Obtener el ID del municipio
        const { rows} = await pool.query('SELECT id FROM municipio WHERE nombre = $1', [municipioced]);
        console.log('Resultado de la consulta de municipio:', rows); // Agregado para depuración
        return rows;
    } catch (error) {
        console.error('Error al obtener el minicipio:', error); // Log de error más claro
        throw error;
    }
}

