import { pool } from '../db.js'

export const getCapParticipanteM = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM capparticipante')
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getCapParticipanteIdM = async (id) => {
    try {
        const { rows } = await pool.query
        (`
            SELECT cp.id, cp.idinvestigacioncap, i.accionformacion, cp.identificacion, cp.codigosace, cp.nombre, cp.funcion, 
                    cp.centroeducativo, d.nombre as nombredep,d.id as departamentoced , m.nombre as municipioced , u.usuario, cp.fechacreacion, 
                    cp.fechamodificacion, cp.zona, cp.idnivelesacademicos, n.nombre as nivel, cp.idciclosacademicos, c.nombre as ciclo, cp.idgradosacademicos, g.nombre as grado, 
                    cp.sexo, cp.añosdeservicio, cp.tipoadministracion, cp.codigodered
            FROM public.capparticipante as cp
            left join investigacioncap as i on cp.idinvestigacioncap = i.id 
            left join departamento as d on cp.departamentoced =d.id 
            left join municipio as m on cp.municipioced = m.id 
            left join usuario as u on cp.creadopor = u.id 
            left join nivelesacademicos n on cp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on cp.idciclosacademicos =c.id 
            left join gradosacademicos g on cp.idgradosacademicos =g.id 
            WHERE cp.id=$1
        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getCapParticipanteIdInvestM = async (id) => {
    try {
        const { rows } = await pool.query
        (`
            SELECT cp.id, cp.idinvestigacioncap, i.accionformacion, cp.identificacion, cp.codigosace, cp.nombre, cp.funcion, 
                    cp.centroeducativo, d.nombre as nombredepto , m.nombre as nombremuni , u.usuario, cp.fechacreacion, 
                    cp.fechamodificacion, cp.zona, cp.idnivelesacademicos, n.nombre as nivel, cp.idciclosacademicos, c.nombre as ciclo, cp.idgradosacademicos, g.nombre as grado, 
                    cp.sexo, cp.añosdeservicio, cp.tipoadministracion, cp.codigodered
            FROM public.capparticipante as cp
            left join investigacioncap as i on cp.idinvestigacioncap = i.id 
            left join departamento as d on cp.departamentoced =d.id 
            left join municipio as m on cp.municipioced = m.id 
            left join usuario as u on cp.creadopor = u.id 
            left join nivelesacademicos n on cp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on cp.idciclosacademicos =c.id 
            left join gradosacademicos g on cp.idgradosacademicos =g.id 
            WHERE cp.idinvestigacioncap=$1
        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const postCapParticipanteM = async (
    idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
    departamentoced, municipioced, creadopor, idnivelesacademicos, idgradosacademicos, 
    idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered
) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO capparticipante (
                idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipioced, creadopor, fechacreacion, fechamodificacion, 
                idnivelesacademicos, idgradosacademicos, idciclosacademicos, sexo, "añosdeservicio", 
                tipoadministracion, codigodered
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, null, 
                $11, $12, $13, $14, $15, $16, $17
            ) 
            RETURNING *;
        `, [
            idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona, 
            departamentoced, municipioced, creadopor, idnivelesacademicos, idgradosacademicos, 
            idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered
        ]);

        return rows[0];
    } catch (error) {
        console.error("Error en postCapParticipanteM:", error.message);
        throw error;
    }
};



export const putCapParticipanteM = async (idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
    departamentoced, municipio, usuario, idnivelesacademicos, idgradosacademicos, idciclosacademicos, 
    sexo, añosdeservicio, tipoadministracion, codigodered, id) => {
    try {
        const { rows } = await pool.query(`
                UPDATE capparticipante 
                SET 
                idinvestigacioncap=$1, 
                identificacion=$2, 
                codigosace=$3, 
                nombre=$4, 
                funcion=$5, 
                centroeducativo=$6, 
                zona=$7,
                departamentoced=$8, 
                municipioced=$9, 
                modificadopor=$10, 
                fechamodificacion=CURRENT_TIMESTAMP,
                idnivelesacademicos=$11, 
                idgradosacademicos=$12,
                idciclosacademicos=$13,
                sexo=$14, 
                añosdeservicio=$15, 
                tipoadministracion=$16, 
                codigodered=$17
                WHERE id=$18
                RETURNING *`,
            [idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipio, usuario, idnivelesacademicos, 
                idgradosacademicos, idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered, id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}
