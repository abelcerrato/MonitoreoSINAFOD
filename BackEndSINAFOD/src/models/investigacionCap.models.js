import { pool } from '../db.js'

export const getInvestigacionCapM = async () => {
    try {
        const { rows } = await pool.query(`
           SELECT 
    ic.id, ic.accionformacion, ic.institucionresponsable, ic.responsablefirmas, ic.ambitoformacion, 
    ic.tipoformacion, ic.modalidad, ic.formacioninvest, ic.zona, ic.duracion, ic.espaciofisico, 
    ic.niveleducactivoobj, ic.funciondirigido, ic.fechainicio, ic.fechafinal, ic.participantesprog, 
    ic.participantesrecib, ic.direccion, ic.observacion, ic.estado, u.nombre, 
    n.id AS IdNivel, n.nombre AS NivelAcademico, 
    c.id AS IdCiclo, c.nombre AS CicloAcademico
FROM investigacioncap AS ic
LEFT JOIN usuario u ON ic.creadopor = u.id
LEFT JOIN nivelesacademicos n ON ic.idnivelesacademicos = n.id 
LEFT JOIN ciclosacademicos c ON ic.idciclosacademicos = c.id
ORDER BY ic.id DESC;
 `)
        // console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getInvestigacionCapIdInvM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT inc.id, inc.accionformacion, inc.institucionresponsable, inc.responsablefirmas, inc.ambitoformacion, inc.tipoformacion, inc.modalidad, inc.formacioninvest, 
                    inc.zona, inc.duracion, inc.espaciofisico, inc.niveleducactivoobj, inc.funciondirigido, inc.fechainicio, inc.fechafinal, inc.participantesprog, 
                    inc.participantesrecib, inc.direccion, inc.observacion, inc.estado, n.id as idnivelesacademicos,  c.nombre as cicloacademico, n.nombre as nivelacademico
            FROM investigacioncap as inc
            left join nivelesacademicos n on inc.idnivelesacademicos = n.id 
            left join ciclosacademicos c on inc.idciclosacademicos =c.id 
            WHERE inc.id=$1`, [id])
        // console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        throw error;
    }
};

//`

/////////////////////////////
export const postInvestigacionCapM = async (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad,
    formacioninvest, zona, duracion, espaciofisico, niveleducactivoobj, funciondirigido, fechainicio, fechafinal,
    participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO investigacioncap (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico, 
                                niveleducactivoobj, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, creadopor, fechacreacion, fechamodificacion, idnivelesacademicos, idciclosacademicos ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, null, $21, $22 ) 
            RETURNING id`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico,
                niveleducactivoobj, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario,
                idnivelesacademicos, idciclosacademicos])

        // Log for debugging
        console.log("Id investigacionCap: " + rows[0].id);

        // Return the ID of the newly inserted record
        return { id: rows[0].id };

    } catch (error) {
        throw error;
    }
}


export const putInvestigacionCapM = async (accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion,
    espaciofisico, niveleducactivoobj, funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion,
    estado, usuario, idnivelesacademicos, idciclosacademicos, id) => {
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
                niveleducactivoobj=$11, 
                funciondirigido=$12, 
                fechainicio=$13, 
                fechafinal=$14, 
                participantesprog=$15, 
                participantesrecib=$16, 
                direccion=$17, 
                observacion=$18, 
                estado=$19, 
                modificadopor=$20,
                idnivelesacademicos=$21,
                idciclosacademicos=$22, 
                fechamodificacion=CURRENT_TIMESTAMP 
            WHERE id=$23 
            RETURNING *`,
            [accionformacion, institucionresponsable, responsablefirmas, ambitoformacion, tipoformacion, modalidad, formacioninvest, zona, duracion, espaciofisico, niveleducactivoobj,
                funciondirigido, fechainicio, fechafinal, participantesprog, participantesrecib, direccion, observacion, estado, usuario, idnivelesacademicos, idciclosacademicos, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}
