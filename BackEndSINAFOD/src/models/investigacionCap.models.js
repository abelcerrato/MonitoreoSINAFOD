import { pool } from '../db.js'


/**
tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl
 */

export const getInvestigacionCapM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ic.id, ic.accionformacion, ic.tipoactividad, ic.institucionresponsable, ic.responsablefirmas, ic.ambitoformacion, 
                ic.tipoformacion, ic.modalidad, ic.formacioninvest, ic.zona, ic.duracion, ic.espaciofisico, 
                ic.funciondirigido, ic.fechainicio, ic.fechafinal, ic.participantesprog, 
                ic.participantesrecib, ic.direccion, ic.observacion, ic.estado, u.nombre, 
                n.id AS IdNivel, n.nombre AS NivelAcademico, 
                c.id AS IdCiclo, c.nombre AS CicloAcademico,
                ic.existeconvenio, ic.institucionconvenio, ic.presentoprotocolo, ic.presentoprotocolourl,
                ic.estadoprotocolo, ic.monitoreoyevaluacion, ic.monitoreoyevaluacionurl, ic.aplicacionevaluacion,
                ic.aplicacionevaluacionurl
            FROM investigacioncap AS ic
            LEFT JOIN usuario u ON ic.creadopor = u.id
            LEFT JOIN nivelesacademicos n ON ic.idnivelesacademicos = n.id 
            LEFT JOIN ciclosacademicos c ON ic.idciclosacademicos = c.id
            ORDER BY ic.id DESC;
            `)
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getInvestigacionCapIdInvM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT inc.id, inc.accionformacion, inc.institucionresponsable, inc.responsablefirmas, inc.ambitoformacion, inc.tipoformacion, inc.modalidad, inc.formacioninvest, 
                    inc.zona, inc.duracion, inc.espaciofisico, inc.funciondirigido, inc.fechainicio, inc.fechafinal, inc.participantesprog, 
                    inc.participantesrecib, inc.direccion, inc.observacion, inc.estado, n.id as idnivelesacademicos,  c.nombre as cicloacademico, n.nombre as nivelacademico,
                    inc.tipoactividad,
                    inc.existeconvenio,
                    inc.institucionconvenio,
                    inc.presentoprotocolo,
                    inc.presentoprotocolourl,
                    inc.estadoprotocolo,
                    inc.monitoreoyevaluacion,
                    inc.monitoreoyevaluacionurl,
                    inc.aplicacionevaluacion,
                    inc.aplicacionevaluacionurl
            FROM investigacioncap as inc
            left join nivelesacademicos n on inc.idnivelesacademicos = n.id 
            left join ciclosacademicos c on inc.idciclosacademicos =c.id 
            WHERE inc.id=$1`, [id])

        return rows;
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        throw error;
    }
};



/////////////////////////////
export const postInvestigacionCapM = async (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad,
    formacioninvest, zona, duracion, espaciofisico, funciondirigido, fechainicio, fechafinal,
    participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos,
    tipoactividad, existeconvenio, institucionconvenio) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacioncap (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico, 
                                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, creadopor, fechacreacion, fechamodificacion, idnivelesacademicos, idciclosacademicos,
                                tipoactividad, existeconvenio, institucionconvenio) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,  CURRENT_TIMESTAMP, null, $20, $21, $22, $23, $24) 
            RETURNING id`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario,
                idnivelesacademicos, idciclosacademicos,
                tipoactividad, existeconvenio, institucionconvenio])


        console.log("Id investigacionCap: " + rows[0].id);
        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}




export const putInvestigacionCapM = async (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion,
    espaciofisico, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion,
    estado, usuario, idnivelesacademicos, idciclosacademicos,
    tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
    id) => {
    try {
        const { rows } = await pool.query(`
            UPDATE investigacioncap 
            SET 
                accionformacion=$1, 
                institucionresponsable=$2, 
                responsablefirmas=$3, 
                ambitoformacion=$4, 
                tipoformacion=$5, 
                modalidad=$6, 
                formacioninvest=$7, 
                zona=$8, 
                duracion=$9, 
                espaciofisico=$10, 
                funciondirigido=$11, 
                fechainicio=$12, 
                fechafinal=$13, 
                participantesprog=$14, 
                participantesrecib=$15, 
                direccion=$16, 
                observacion=$17, 
                estado=$18, 
                modificadopor=$19,
                idnivelesacademicos=$20,
                idciclosacademicos=$21, 
                fechamodificacion=CURRENT_TIMESTAMP,
                tipoactividad=$22,
                existeconvenio=$23,
                institucionconvenio=$24,
                presentoprotocolo=$25,
                presentoprotocolourl=$26,
                estadoprotocolo=$27,
                monitoreoyevaluacion=$28,
                monitoreoyevaluacionurl=$29,
                aplicacionevaluacion=$30,
                aplicacionevaluacionurl=$31
            WHERE id=$32
            RETURNING *`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos,
                tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
                id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}




////////////////////////////////////////////////////

export const postLineamientosM = async ( presentoprotocolo, presentoprotocolourl, estadoprotocolo,
    monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, accionformacion, usuario) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacioncap ( presentoprotocolo, presentoprotocolourl, estadoprotocolo,
                                            monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, accionformacion, creadopor, fechacreacion, fechamodificacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, null) 
            RETURNING id`,
            [ presentoprotocolo, presentoprotocolourl, estadoprotocolo,
                monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, accionformacion, usuario])

        console.log("Id investigacionCap de los lineamientos: " + rows[0].id);

        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}



export const putLineamientosM = async ( presentoprotocolo, presentoprotocolourl, estadoprotocolo,
    monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, idInvestCap) => {
    try {
        const { rows } = await pool.query(`
            UPDATE investigacioncap 
            SET 
                presentoprotocolo=$1,
                presentoprotocolourl=$2,
                estadoprotocolo=$3,
                monitoreoyevaluacion=$4,
                monitoreoyevaluacionurl=$5,
                aplicacionevaluacion=$6,
                aplicacionevaluacionurl=$7
            WHERE id=$8
            RETURNING *`,
            [presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, 
                monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, idInvestCap])

        console.log("Id investigacionCap de los lineamientos: " + rows[0].id);
        return rows[0];
    } catch (error) {
        throw error;
    }
}