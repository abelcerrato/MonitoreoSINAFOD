import { pool } from '../db.js'

export const getDepartamentosM= async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM departamento')
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getDepartamentoId= async (departamentoced) => {
    console.log('Municipio enviado:', departamentoced);
    try {
        // Obtener el ID del departamento
        const { rows } = await pool.query('SELECT id FROM departamento WHERE nombre = $1', [departamentoced]);
        console.log('Resultado de la consulta de departamento:', rows); // Agregado para depuración
        return rows;
    } catch (error) {
        console.error('Error al obtener el departamento:', error); // Log de error más claro
        throw error;
    }
}



