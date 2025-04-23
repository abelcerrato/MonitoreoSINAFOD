import { pool } from '../db.js'


/**
tipoactividad, existeconvenio, institucionconvenio, presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl
 */

export const getInvestigacionCapM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT  
    ic.id, ic.formacioninvest, ic.accionformacion, ic.tipoactividad, ic.existeconvenio, 
    ic.institucionconvenio, ic.institucionresponsable, ic.responsablefirmas, ic.ambitoformacion,  
    ic.tipoformacion, ic.modalidad, ic.plataforma, ic.zona, ic.duracion, ic.espaciofisico, 
    ic.funciondirigido, ic.fechainicio, ic.fechafinal, ic.participantesprog, 
    ic.participantesrecib, ic.direccion, ic.observacion, ic.estado, u.nombre, 
    n.id AS IdNivel, n.nombre AS NivelAcademico, 
    c.id AS IdCiclo, c.nombre AS CicloAcademico,
    ic.socializaron, ic.costo, 
    ic.presentoprotocolo, ic.presentoprotocolourl, ic.estadoprotocolo, 
    ic.monitoreoyevaluacion, ic.monitoreoyevaluacionurl, 
    ic.aplicacionevaluacion, ic.aplicacionevaluacionurl, 
    ic.criteriosfactibilidad, ic.criteriosfactibilidadurl,
    ic.requisitostecnicos, ic.requisitostecnicosurl,
    ic.criterioseticos, ic.criterioseticosurl,

    CASE
        -- Para formación en investigación
        WHEN ic.formacioninvest = 'Investigacion' THEN
            CASE 
                WHEN ic.presentoprotocolo = TRUE AND ic.monitoreoyevaluacion = TRUE AND ic.aplicacionevaluacion = TRUE THEN 'Lineamientos Completos'
                WHEN (ic.presentoprotocolo = TRUE AND ic.monitoreoyevaluacion = TRUE)
                   OR (ic.presentoprotocolo = TRUE AND ic.aplicacionevaluacion = TRUE)
                   OR (ic.monitoreoyevaluacion = TRUE AND ic.aplicacionevaluacion = TRUE)
                   OR (ic.presentoprotocolo = TRUE)
                   OR (ic.monitoreoyevaluacion = TRUE)
                   OR (ic.aplicacionevaluacion = TRUE) THEN 'Lineamientos Incompletos'
                ELSE 'No Tiene Lineamientos'
            END

        -- Para formación
        WHEN ic.formacioninvest = 'Formacion' THEN
            CASE 
                WHEN ic.criterioseticos = TRUE AND ic.requisitostecnicos = TRUE AND ic.criteriosfactibilidad = TRUE THEN 'Lineamientos Completos'
                WHEN (ic.criterioseticos = TRUE AND ic.requisitostecnicos = TRUE)
                   OR (ic.criterioseticos = TRUE AND ic.criteriosfactibilidad = TRUE)
                   OR (ic.requisitostecnicos = TRUE AND ic.criteriosfactibilidad = TRUE)
                   OR (ic.criterioseticos = TRUE)
                   OR (ic.requisitostecnicos = TRUE)
                   OR (ic.criteriosfactibilidad = TRUE) THEN 'Lineamientos Incompletos'
                ELSE 'No Tiene Lineamientos'
            END

        ELSE 'no aplica'
    END AS estado_lineamientos

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
            SELECT  ic.id, ic.formacioninvest, ic.accionformacion, ic.tipoactividad, ic.existeconvenio, ic.institucionconvenio, ic.institucionresponsable, ic.responsablefirmas, ic.ambitoformacion,  
                    ic.tipoformacion, ic.modalidad, ic.plataforma,  ic.zona, ic.duracion, ic.espaciofisico, 
                    ic.funciondirigido, ic.fechainicio, ic.fechafinal, ic.participantesprog, 
                    ic.participantesrecib, ic.direccion, ic.observacion, ic.estado, 
                    n.id AS IdNivel, n.nombre AS NivelAcademico, 
                    c.id AS IdCiclo, c.nombre AS CicloAcademico,
                    ic.socializaron, ic.costo, 
                    ic.presentoprotocolo, ic.presentoprotocolourl, ic.estadoprotocolo, 
                    ic.monitoreoyevaluacion, ic.monitoreoyevaluacionurl, 
                    ic.aplicacionevaluacion, ic.aplicacionevaluacionurl, 
                    ic.criteriosfactibilidad, ic.criteriosfactibilidadurl,
                    ic.requisitostecnicos, ic.requisitostecnicosurl,
                    ic.criterioseticos, ic.criterioseticosurl 
            FROM investigacioncap as ic
            left join nivelesacademicos n on ic.idnivelesacademicos = n.id 
            left join ciclosacademicos c on ic.idciclosacademicos =c.id 
            WHERE ic.id=$1`, [id])

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
    tipoactividad, existeconvenio, institucionconvenio,
    plataforma, socializaron, costo) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacioncap (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico, 
                                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, creadopor, fechacreacion, fechamodificacion, idnivelesacademicos, idciclosacademicos,
                                tipoactividad, existeconvenio, institucionconvenio, plataforma, socializaron, costo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,  CURRENT_TIMESTAMP, null, $20, $21, $22, $23, $24, $25, $26, $27) 
            RETURNING id`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario,
                idnivelesacademicos, idciclosacademicos,
                tipoactividad, existeconvenio, institucionconvenio,
                plataforma, socializaron, costo
            ])


        console.log("Id investigacionCap: " + rows[0].id);
        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}




export const putInvestigacionCapM = async (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion,
    espaciofisico, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion,
    estado, usuario, idnivelesacademicos, idciclosacademicos,
    tipoactividad, existeconvenio, institucionconvenio,
    plataforma, socializaron, costo,
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
                plataforma=$25,
                socializaron=$26, 
                costo=$27
            WHERE id=$28
            RETURNING *`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos,
                tipoactividad, existeconvenio, institucionconvenio,
                plataforma, socializaron, costo,
                id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}




////////////////////////////////////////////////////

export const postLineamientosM = async (presentoprotocolo, presentoprotocolourl, estadoprotocolo,
    monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, accionformacion, usuario, formacioninvest,
    criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl

) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacioncap ( presentoprotocolo, presentoprotocolourl, estadoprotocolo,
                                            monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, 
                                            accionformacion, creadopor, fechacreacion, fechamodificacion, formacioninvest,
                                            criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, null, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING id`,
            [presentoprotocolo, presentoprotocolourl, estadoprotocolo,
                monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl, accionformacion, usuario, formacioninvest,
                criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl])

        console.log("Id investigacionCap de los lineamientos: " + rows[0].id);

        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}



export const putLineamientosM = async (presentoprotocolo, presentoprotocolourl, estadoprotocolo,
    monitoreoyevaluacion, monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
    criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl,
    usuario,
    idInvestCap) => {
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
                aplicacionevaluacionurl=$7,
                criteriosfactibilidad=$8,
                criteriosfactibilidadurl=$9,
                requisitostecnicos=$10,
                requisitostecnicosurl=$11,
                criterioseticos=$12,
                criterioseticosurl=$13,
                modificadopor=$14
            WHERE id=$15
            RETURNING *`,
            [presentoprotocolo, presentoprotocolourl, estadoprotocolo, monitoreoyevaluacion,
                monitoreoyevaluacionurl, aplicacionevaluacion, aplicacionevaluacionurl,
                criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl,
                usuario,
                idInvestCap])

        console.log("Id investigacionCap de los lineamientos: " + rows[0].id);
        return rows[0];
    } catch (error) {
        throw error;
    }
}