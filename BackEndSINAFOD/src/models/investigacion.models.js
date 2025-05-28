import { pool } from '../db.js'


/**
tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl
 */

export const getInvestigacionM = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT  
            i.id, i.investigacion, i.tipoactividad, i.existeconvenio, i.institucionconvenio, i.presupuesto, i.duracion, 
            i.funciondirigido, i.prebasica, i.basica, i.media, i.fechainicio, i.fechafinal, i.direccion, i.socializaron,
            i.observacion, i.presentoprotocolo, i.presentoprotocolourl, i.estadoprotocolo, i.monitoreoyevaluacion, 
            i.monitoreoyevaluacionurl, i.aplicacionevaluacion, i.aplicacionevaluacionurl, i.divulgacionresultados, 
            i.divulgacionresultadosurl, 
        CASE 
                WHEN i.presentoprotocolo = TRUE AND i.monitoreoyevaluacion = TRUE AND i.aplicacionevaluacion = TRUE AND I.divulgacionresultados=true  THEN 'Lineamientos Completos'
                WHEN (i.presentoprotocolo = TRUE AND i.monitoreoyevaluacion = TRUE)
                    OR (i.presentoprotocolo = TRUE AND i.aplicacionevaluacion = TRUE)
                    OR (i.presentoprotocolo = TRUE AND i.divulgacionresultados = TRUE)
                    OR (i.monitoreoyevaluacion = TRUE AND i.aplicacionevaluacion = TRUE)
                    OR (i.presentoprotocolo = TRUE)
                    OR (i.monitoreoyevaluacion = TRUE)
                    OR (i.aplicacionevaluacion = TRUE) 
                    or (i.divulgacionresultados=true)
                THEN 'Lineamientos Incompletos'
                ELSE 'No Lleno Lineamientos'
        END AS estado_lineamientos
		FROM investigacion AS i
		ORDER BY i.id DESC;
        `)
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getIdInvestigacionM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT i.investigacion, i.tipoactividad, i.existeconvenio, i.institucionconvenio, i.presupuesto, i.duracion, 
                    i.funciondirigido, i.prebasica, i.basica, i.media, i.fechainicio, i.fechafinal, i.direccion, i.socializaron,
                    i.observacion, i.presentoprotocolo, i.presentoprotocolourl, i.estadoprotocolo, i.monitoreoyevaluacion, 
                    i.monitoreoyevaluacionurl, i.aplicacionevaluacion, i.aplicacionevaluacionurl, i.divulgacionresultados, 
                    i.divulgacionresultadosurl, i.creadopor, i.fechacreacion, i.modificadopor, i.fechamodificacion 
            FROM investigacion as i
            WHERE i.id=$1`, [id])

        return rows;
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        throw error;
    }
};



/////////////////////////////
export const postInvestigacionM = async (investigacion, tipoactividad, existeconvenio, institucionconvenio,
    presupuesto, duracion, funciondirigido, prebasica, basica, media,
    fechainicio, fechafinal, direccion, socializaron, observacion, creadopor, tipomoneda) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacion (investigacion, tipoactividad, existeconvenio, institucionconvenio,
                                        presupuesto, duracion, funciondirigido, prebasica, basica, media, 
                                        fechainicio, fechafinal, direccion, socializaron, observacion, creadopor,fechacreacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,  CURRENT_TIMESTAMP, $17) 
            RETURNING id`,
            [investigacion, tipoactividad, existeconvenio, institucionconvenio,
                presupuesto, duracion, funciondirigido, prebasica, basica, media,
                fechainicio, fechafinal, direccion, socializaron, observacion, creadopor, tipomoneda
            ])
        console.log("Id investigacion: " + rows[0].id);
        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}




export const putInvestigacionM = async (investigacion, tipoactividad, existeconvenio, institucionconvenio,
    presupuesto, duracion, funciondirigido, prebasica, basica, media,
    fechainicio, fechafinal, direccion, socializaron, observacion, modificadopor, tipomoneda, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE investigacion
            SET 
                investigacion=$1, 
                tipoactividad=$2, 
                existeconvenio=$3, 
                institucionconvenio=$4,
                presupuesto=$5, 
                duracion=$6, 
                funciondirigido=$7, 
                prebasica=$8, 
                basica=$9, 
                media=$10,
                fechainicio=$11, 
                fechafinal=$12, 
                direccion=$13, 
                socializaron=$14, 
                observacion=$15, 
                modificadopor=$16,
                tipomoneda=$17
            WHERE id=$18
            RETURNING *`,
            [investigacion, tipoactividad, existeconvenio, institucionconvenio,
                presupuesto, duracion, funciondirigido, prebasica, basica, media,
                fechainicio, fechafinal, direccion, socializaron, observacion, modificadopor, tipomoneda, id
            ])

        return rows[0]
    } catch (error) {
        throw error;
    }

}




////////////////////////////////////////////////////

export const postLineamientosInvesatigacionM = async (investigacion, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, 
                                    aplicacionevaluacion, aplicacionevaluacionurl, divulgacionresultados, divulgacionresultadosurl, creadopor) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacion ( investigacion, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, 
                                    aplicacionevaluacion, aplicacionevaluacionurl, divulgacionresultados, divulgacionresultadosurl, creadopor, fechacreacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) 
            RETURNING id`,
            [investigacion, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, 
            aplicacionevaluacion, aplicacionevaluacionurl, divulgacionresultados, divulgacionresultadosurl, creadopor])

        console.log("Id lineamientos de la investigacion: " + rows[0].id);

        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}



export const putLineamientosInvesatigacionM = async (investigacion, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, 
                                    aplicacionevaluacion, aplicacionevaluacionurl, divulgacionresultados, divulgacionresultadosurl, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE investigacion
            SET 
                investigacion=$1,
                presentoprotocolo=$2,
                presentoprotocolourl=$3,
                estadoprotocolo=$4,
                monitoreoyevaluacion=$5,
                monitoreoyevaluacionurl=$6,
                aplicacionevaluacion=$7,
                aplicacionevaluacionurl=$8,
                divulgacionresultados=$9,
                divulgacionresultadosurl=$10,
                modificadopor=$11
            WHERE id=$12
            RETURNING *`,
            [investigacion, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, 
            aplicacionevaluacion, aplicacionevaluacionurl, divulgacionresultados, divulgacionresultadosurl, modificadopor, id ])
        return rows[0];
    } catch (error) {
        throw error;
    }
}