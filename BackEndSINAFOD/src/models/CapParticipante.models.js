import { pool } from '../db.js'

export const getCapParticipanteM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 		
					--datos de la accion formativa
					cp.id, cp.idinvestigacioncap, i.accionformacion, 
					
					--datos del participante
					cp.codigosace, cp.nombre, cp.identificacion, cp.sexo, cp.funcion, cp.añosdeservicio,
					
					cp.deptoresidencia as iddeptoResidencia,  
					dr.nombre as nombreDeptoResidencia,
					cp.municipioresidencia as idMuniResidencia, mr.nombre as nombreMuniResidencia,
					cp.aldearesidencia as idAldeaResidencia, ar.nombre as nombreAldeaResidencia,
					
					cp.nivelacademicodocente as idNivelAcademicoDocente, ndo.nombre as nombreNivelDocente,
					cp.gradoacademicodocente as idGradoAcademicoDocente, gdo.nombre as nombreGradoDocente,
					
					--datos del centro educativo
                    cp.codigodered, cp.centroeducativo, cp.tipoadministracion,  cp.zona,
                    
                    --academico que atiende
                    cp.idnivelesacademicos as idNivelCed, n.nombre as nombreNivelCed, 
                    cp.idciclosacademicos as idCicloCed,  c.nombre as nombreCicloCed, 
                    cp.idgradosacademicos as idGradoCed, g.nombre as nombreGradoCed, 
                    
                    cp.departamentoced as idDeptoCed, dced.nombre as nombreDeptoCed, 
                    cp.municipioced as idMunicipioCed, mced.nombre nombreMunicipioCed,
                    cp.aldeaced as idAldeaCed, aced.nombre as nombreAldeaCed, 

                    --datos de auditoria
                    cp.creadopor, u.usuario as CreadoPor,
                    mp.modificadopor, mp.usuario as ModificadoPor, 
                    cp.fechacreacion, cp.fechamodificacion
                    
            
            FROM public.capparticipante as cp
            
            left join investigacioncap as i on cp.idinvestigacioncap = i.id 
            
            --docente
            left join departamento as dr on cp.deptoresidencia =dr.id
            left join municipio as mr on cp.municipioresidencia= mr.id 
            left join aldeas as ar on cp.aldearesidencia = ar.id
            left join nivelesacademicos ndo on cp.nivelacademicodocente =ndo.id 
            left join gradosacademicos gdo on cp.gradoacademicodocente =gdo.id
            
            --ced
            left join departamento as dced on cp.departamentoced =dced.id 
            left join municipio as mced on cp.municipioced = mced.id 
            left join aldeas as aced on cp.aldeaced = aced.id
            
           
            left join nivelesacademicos n on cp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on cp.idciclosacademicos =c.id 
            left join gradosacademicos g on cp.idgradosacademicos =g.id
            
            
 			left join usuario as u on cp.creadopor = u.id 
            left join usuario as mp on cp.modificadopor = mp.id 
            
        `)
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
            SELECT 		
					--datos de la accion formativa
					cp.id, cp.idinvestigacioncap, i.accionformacion, 
					
					--datos del participante
					cp.codigosace, cp.nombre, cp.identificacion, cp.sexo, cp.funcion, cp.añosdeservicio,
					
					cp.deptoresidencia as iddeptoResidencia,  
					dr.nombre as nombreDeptoResidencia,
					cp.municipioresidencia as idMuniResidencia, mr.nombre as nombreMuniResidencia,
					cp.aldearesidencia as idAldeaResidencia, ar.nombre as nombreAldeaResidencia,
					
					cp.nivelacademicodocente as idNivelAcademicoDocente, ndo.nombre as nombreNivelDocente,
					cp.gradoacademicodocente as idGradoAcademicoDocente, gdo.nombre as nombreGradoDocente,
					
					--datos del centro educativo
                    cp.codigodered, cp.centroeducativo, cp.tipoadministracion,  cp.zona,
                    
                    --academico que atiende
                    cp.idnivelesacademicos as idNivelCed, n.nombre as nombreNivelCed, 
                    cp.idciclosacademicos as idCicloCed,  c.nombre as nombreCicloCed, 
                    cp.idgradosacademicos as idGradoCed, g.nombre as nombreGradoCed, 
                    
                    cp.departamentoced as idDeptoCed, dced.nombre as nombreDeptoCed, 
                    cp.municipioced as idMunicipioCed, mced.nombre nombreMunicipioCed,
                    cp.aldeaced as idAldeaCed, aced.nombre as nombreAldeaCed, 

                    --datos de auditoria
                    cp.creadopor, u.usuario as CreadoPor,
                    mp.modificadopor, mp.usuario as ModificadoPor, 
                    cp.fechacreacion, cp.fechamodificacion
                    
            
            FROM public.capparticipante as cp
            
            left join investigacioncap as i on cp.idinvestigacioncap = i.id 
            
            --docente
            left join departamento as dr on cp.deptoresidencia =dr.id
            left join municipio as mr on cp.municipioresidencia= mr.id 
            left join aldeas as ar on cp.aldearesidencia = ar.id
            left join nivelesacademicos ndo on cp.nivelacademicodocente =ndo.id 
            left join gradosacademicos gdo on cp.gradoacademicodocente =gdo.id
            
            --ced
            left join departamento as dced on cp.departamentoced =dced.id 
            left join municipio as mced on cp.municipioced = mced.id 
            left join aldeas as aced on cp.aldeaced = aced.id
            
           
            left join nivelesacademicos n on cp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on cp.idciclosacademicos =c.id 
            left join gradosacademicos g on cp.idgradosacademicos =g.id
            
            
 			left join usuario as u on cp.creadopor = u.id 
            left join usuario as mp on cp.modificadopor = mp.id 
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
            SELECT 		
					--datos de la accion formativa
					cp.id, cp.idinvestigacioncap, i.accionformacion, 
					
					--datos del participante
					cp.codigosace, cp.nombre, cp.identificacion, cp.sexo, cp.funcion, cp.añosdeservicio,
					
					cp.deptoresidencia as iddeptoResidencia,  
					dr.nombre as nombreDeptoResidencia,
					cp.municipioresidencia as idMuniResidencia, mr.nombre as nombreMuniResidencia,
					cp.aldearesidencia as idAldeaResidencia, ar.nombre as nombreAldeaResidencia,
					
					cp.nivelacademicodocente as idNivelAcademicoDocente, ndo.nombre as nombreNivelDocente,
					cp.gradoacademicodocente as idGradoAcademicoDocente, gdo.nombre as nombreGradoDocente,
					
					--datos del centro educativo
                    cp.codigodered, cp.centroeducativo, cp.tipoadministracion,  cp.zona,
                    
                    --academico que atiende
                    cp.idnivelesacademicos as idNivelCed, n.nombre as nombreNivelCed, 
                    cp.idciclosacademicos as idCicloCed,  c.nombre as nombreCicloCed, 
                    cp.idgradosacademicos as idGradoCed, g.nombre as nombreGradoCed, 
                    
                    cp.departamentoced as idDeptoCed, dced.nombre as nombreDeptoCed, 
                    cp.municipioced as idMunicipioCed, mced.nombre nombreMunicipioCed,
                    cp.aldeaced as idAldeaCed, aced.nombre as nombreAldeaCed, 

                    --datos de auditoria
                    cp.creadopor, u.usuario as CreadoPor,
                    mp.modificadopor, mp.usuario as ModificadoPor, 
                    cp.fechacreacion, cp.fechamodificacion
                    
            
            FROM public.capparticipante as cp
            
            left join investigacioncap as i on cp.idinvestigacioncap = i.id 
            
            --docente
            left join departamento as dr on cp.deptoresidencia =dr.id
            left join municipio as mr on cp.municipioresidencia= mr.id 
            left join aldeas as ar on cp.aldearesidencia = ar.id
            left join nivelesacademicos ndo on cp.nivelacademicodocente =ndo.id 
            left join gradosacademicos gdo on cp.gradoacademicodocente =gdo.id
            
            --ced
            left join departamento as dced on cp.departamentoced =dced.id 
            left join municipio as mced on cp.municipioced = mced.id 
            left join aldeas as aced on cp.aldeaced = aced.id
            
           
            left join nivelesacademicos n on cp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on cp.idciclosacademicos =c.id 
            left join gradosacademicos g on cp.idgradosacademicos =g.id
            
            
 			left join usuario as u on cp.creadopor = u.id 
            left join usuario as mp on cp.modificadopor = mp.id 
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
    idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered,
    deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced
) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO capparticipante (
                idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipioced, creadopor, fechacreacion, fechamodificacion, 
                idnivelesacademicos, idgradosacademicos, idciclosacademicos, sexo, "añosdeservicio", 
                tipoadministracion, codigodered, 
                deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, null, 
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
            ) 
            RETURNING *;
        `, [
            idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
            departamentoced, municipioced, creadopor, idnivelesacademicos, idgradosacademicos,
            idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered, 
            deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced
        ]);

        return rows[0];
    } catch (error) {
        console.error("Error en postCapParticipanteM:", error.message);
        throw error;
    }
};



export const putCapParticipanteM = async (idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
    departamentoced, municipio, usuario, idnivelesacademicos, idgradosacademicos, idciclosacademicos,
    sexo, añosdeservicio, tipoadministracion, codigodered,
    deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced,
    id) => {
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
                codigodered=$17,
                deptoresidencia=$18,
                municipioresidencia=$19,
                aldearesidencia=$20,
                nivelacademicodocente=$21,
                gradoacademicodocente=$22,
                aldeaced=$23,
                WHERE id=$24
                RETURNING *`,
            [idinvestigacioncap, identificacion, codigosace, nombre, funcion, centroeducativo, zona,
                departamentoced, municipio, usuario, idnivelesacademicos,
                idgradosacademicos, idciclosacademicos, sexo, añosdeservicio, tipoadministracion, codigodered, 
                deptoresidencia, municipioresidencia, aldearesidencia, nivelacademicodocente, gradoacademicodocente, aldeaced,
                id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}
