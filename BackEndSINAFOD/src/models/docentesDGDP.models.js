import { pool } from '../db.js'


export const getDocentesM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT dgdp.id, dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento, d.nombre as departamento,
                dgdp.idmunicipio, m.nombre as municipio,
                dgdp.idaldea, a.nombre as aldea,
                dgdp.sexo, dgdp.institucion, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos, n.nombre as nivelEducativo, 
                dgdp.idciclosacademicos, c.nombre as cicloAcademico,
                dgdp.zona 
            FROM docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getDocentesIdM = async (identificacion) => {
    try {
        const { rows } = await pool.query(`
            SELECT dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento, d.nombre as departamento,
                dgdp.idmunicipio, m.nombre as municipio,
                dgdp.idaldea, a.nombre as aldea,
                dgdp.sexo, dgdp.institucion, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos, n.nombre as nivelEducativo, 
                dgdp.idciclosacademicos, c.nombre as cicloAcademico,
                dgdp.zona 
            FROM docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            WHERE dgdp.identificacion=$1`, [identificacion])
        if (rows.length === 0) {
            return null
        }
        return rows
    } catch (error) {
        throw error;
    }
}



export const postDocentesM = async (codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                    sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO docentesdgdp (codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                        sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, 
            [codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona])
         // Log for debugging
        console.log("Id docentesdgdp: " + rows[0].id);
        return rows
    } catch (error) {
        throw error;
    }
}


export const putDocentesM = async (codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                    sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE docentesdgdp SET codigosace=$1, nombre=$2, identificacion=$3, correo=$4, iddepartamento=$5, idmunicipio=$6, idaldea=$7, 
                                    sexo=$8, institucion=$9, institucioncodsace=$10, idnivelesacademicos=$11, idciclosacademicos=$12, zona=$13
            WHERE id=$14 RETURNING *`, 
            [codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                sexo, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona, id])
        return rows
    } catch (error) {
        throw error;
    }
}