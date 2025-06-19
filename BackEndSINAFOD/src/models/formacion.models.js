import { pool } from "../db.js";

export const getFormacionM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                f.id, f.formacion, f.tipoactividad, f.existeconvenio, f.institucionconvenio, f.institucionresponsable, f.responsablefirmas, f.ambitoformacion, f.tipoformacion, 
                f.modalidad, f.plataforma, f.duracion, f.estado, f.funciondirigido, f.prebasica, 
                f.basica, f.media, f.primerciclo, f.segundociclo, f.tercerciclo, f.fechainicio, f.fechafinal, f.participantesprog, f.espaciofisico, f.direccion, f.zona, 
                f.socializaron, f.observacion, 
                f.criteriosfactibilidad, f.criteriosfactibilidadurl, 
                f.requisitostecnicos, f.requisitostecnicosurl, 
                f.criterioseticos, f.criterioseticosurl,

                  CONCAT_WS(', ',
                        CASE WHEN f.prebasica THEN 'Prebásica' END,
                        CASE WHEN f.basica THEN 'Básica' END,
                        CASE WHEN f.media THEN 'Media' END
                    ) AS nivelacademico,
                 
                       CONCAT_WS(', ',
                        CASE WHEN f.primerciclo THEN 'Primer Ciclo' END,
                        CASE WHEN f.segundociclo THEN 'Segundo Ciclo' END,
                        CASE WHEN f.tercerciclo THEN 'Tercer Ciclo' END
                    ) AS cicloacademico,
            CASE 
                WHEN f.criterioseticos = TRUE AND f.requisitostecnicos = TRUE AND f.criteriosfactibilidad = TRUE THEN 'Lineamientos Completos'
                WHEN (f.criterioseticos = TRUE AND f.requisitostecnicos = TRUE)
                OR (f.criterioseticos = TRUE AND f.criteriosfactibilidad = TRUE)
                OR (f.requisitostecnicos = TRUE AND f.criteriosfactibilidad = TRUE)
                OR (f.criterioseticos = TRUE)
                OR (f.requisitostecnicos = TRUE)
                OR (f.criteriosfactibilidad = TRUE) THEN 'Lineamientos Incompletos'
                ELSE 'No Lleno Lineamientos'
            end as estado_lineamientos,
            CASE 
                WHEN f.existeconvenio IS FALSE THEN 'No'
                WHEN f.existeconvenio THEN 'Sí'
                ELSE ''
            END AS existeconvenio,
            CASE 
                WHEN f.socializaron IS FALSE THEN 'No'
                WHEN f.socializaron THEN 'Sí'
                ELSE ''
            END AS socializaron

            FROM formacion as f
            ORDER BY f.id DESC;
            `);
        return rows;
    } catch (error) {
        throw error;
    }
};

export const getIdFormacionM = async (id) => {
    try {
        const { rows } = await pool.query(
            `
            SELECT  
                f.id, f.formacion, f.tipoactividad, f.existeconvenio, f.institucionconvenio, f.institucionresponsable, f.responsablefirmas, f.ambitoformacion, f.tipoformacion, 
                f.modalidad, f.plataforma, f.duracion, f.estado, f.funciondirigido, f.prebasica, 
                f.basica, f.media, f.primerciclo, f.segundociclo, f.tercerciclo, f.fechainicio, f.fechafinal, f.participantesprog, f.espaciofisico, f.direccion, f.zona, 
                f.socializaron, f.observacion, 
                f.criteriosfactibilidad, f.criteriosfactibilidadurl, 
                f.requisitostecnicos, f.requisitostecnicosurl, 
                f.criterioseticos, f.criterioseticosurl
            FROM formacion as f
            WHERE f.id=$1`,
            [id]
        );

        return rows;
    } catch (error) {
        console.error("Error al obtener el registro:", error);
        throw error;
    }
};

export const postFormacionM = async (
    formacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    institucionresponsable,
    responsablefirmas,
    ambitoformacion,
    tipoformacion,
    modalidad,
    plataforma,
    duracion,
    estado,
    funciondirigido,
    prebasica,
    basica,
    media,
    primerciclo,
    segundociclo,
    tercerciclo,
    fechainicio,
    fechafinal,
    participantesprog,
    espaciofisico,
    direccion,
    zona,
    socializaron,
    observacion,
    creadopor
) => {
    try {
        const { rows } = await pool.query(
            `
            INSERT INTO formacion (formacion, tipoactividad, existeconvenio, institucionconvenio, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, 
                                    modalidad, plataforma, duracion, estado, funciondirigido, prebasica, basica, media, primerciclo, segundociclo, tercerciclo, fechainicio, fechafinal, 
                                    participantesprog, espaciofisico, direccion, zona, socializaron, observacion, creadopor, fechacreacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, CURRENT_TIMESTAMP) 
            RETURNING id`,
            [
                formacion,
                tipoactividad,
                existeconvenio,
                institucionconvenio,
                institucionresponsable,
                responsablefirmas,
                ambitoformacion,
                tipoformacion,
                modalidad,
                plataforma,
                duracion,
                estado,
                funciondirigido,
                prebasica,
                basica,
                media,
                primerciclo,
                segundociclo,
                tercerciclo,
                fechainicio,
                fechafinal,
                participantesprog,
                espaciofisico,
                direccion,
                zona,
                socializaron,
                observacion,
                creadopor,
            ]
        );

        console.log("Id Formacion: " + rows[0].id);
        return { id: rows[0].id };
    } catch (error) {
        throw error;
    }
};

export const putFormacionM = async (
    formacion,
    tipoactividad,
    existeconvenio,
    institucionconvenio,
    institucionresponsable,
    responsablefirmas,
    ambitoformacion,
    tipoformacion,
    modalidad,
    plataforma,
    duracion,
    estado,
    funciondirigido,
    prebasica,
    basica,
    media,
    primerciclo,
    segundociclo,
    tercerciclo,
    fechainicio,
    fechafinal,
    participantesprog,
    espaciofisico,
    direccion,
    zona,
    socializaron,
    observacion,
    modificadopor,
    id
) => {
    try {
        const { rows } = await pool.query(
            `
            UPDATE formacion 
            SET 
                formacion=$1,
                tipoactividad=$2, 
                existeconvenio=$3, 
                institucionconvenio=$4, 
                institucionresponsable=$5, 
                responsablefirmas=$6, 
                ambitoformacion=$7, 
                tipoformacion=$8, 
                modalidad=$9, 
                plataforma=$10, 
                duracion=$11, 
                estado=$12, 
                funciondirigido=$13, 
                prebasica=$14, 
                basica=$15, 
                media=$16, 
                primerciclo=$17, 
                segundociclo=$18, 
                tercerciclo=$19, 
                fechainicio=$20, 
                fechafinal=$21, 
                participantesprog=$22, 
                espaciofisico=$23, 
                direccion=$24, 
                zona=$25, 
                socializaron=$26, 
                observacion=$27,
                modificadopor=$28
            WHERE id=$29
            RETURNING *`,
            [
                formacion,
                tipoactividad,
                existeconvenio,
                institucionconvenio,
                institucionresponsable,
                responsablefirmas,
                ambitoformacion,
                tipoformacion,
                modalidad,
                plataforma,
                duracion,
                estado,
                funciondirigido,
                prebasica,
                basica,
                media,
                primerciclo,
                segundociclo,
                tercerciclo,
                fechainicio,
                fechafinal,
                participantesprog,
                espaciofisico,
                direccion,
                zona,
                socializaron,
                observacion,
                modificadopor,
                id,
            ]
        );

        return rows[0];
    } catch (error) {
        throw error;
    }
};

////////////////////////////////////////////////////

export const postLineamientosFormacionM = async (
    formacion,
    criteriosfactibilidad,
    criteriosfactibilidadurl,
    requisitostecnicos,
    requisitostecnicosurl,
    criterioseticos,
    criterioseticosurl,
    creadopor
) => {
    try {
        const { rows } = await pool.query(
            `
            INSERT INTO formacion ( formacion, criteriosfactibilidad, criteriosfactibilidadurl, requisitostecnicos, requisitostecnicosurl, criterioseticos, criterioseticosurl, creadopor, fechacreacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) 
            RETURNING id`,
            [
                formacion,
                criteriosfactibilidad,
                criteriosfactibilidadurl,
                requisitostecnicos,
                requisitostecnicosurl,
                criterioseticos,
                criterioseticosurl,
                creadopor,
            ]
        );

        console.log("Id Lineamientos de formacion: " + rows[0].id);
        return { id: rows[0].id };
    } catch (error) {
        throw error;
    }
};

export const putLineamientosFormacionM = async (
    formacion,
    criteriosfactibilidad,
    criteriosfactibilidadurl,
    requisitostecnicos,
    requisitostecnicosurl,
    criterioseticos,
    criterioseticosurl,
    modificadopor,
    id
) => {
    try {
        const { rows } = await pool.query(
            `

            UPDATE formacion 
            SET 
            formacion=$1,
                criteriosfactibilidad=$2,
                criteriosfactibilidadurl=$3,
                requisitostecnicos=$4,
                requisitostecnicosurl=$5,
                criterioseticos=$6,
                criterioseticosurl=$7,
                modificadopor=$8
            WHERE id=$9
            RETURNING *`,
            [
                formacion,
                criteriosfactibilidad,
                criteriosfactibilidadurl,
                requisitostecnicos,
                requisitostecnicosurl,
                criterioseticos,
                criterioseticosurl,
                modificadopor,
                id,
            ]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
};
