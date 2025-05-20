import { pool } from '../db.js'

export const getParticipanteM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                p.idinvestigacion, i.investigacion,
                p.idformacion, f.formacion,
                p.idfuncion, c.cargo,
                p.datoscorrectos, p.autorizadatos, 
                mu.usuario as creadopor, p.fechacreacion, 
                mu2.usuario as modificadopor, p.fechamodificacion 
            FROM participantes p
            inner join nivelesacademicos n on p.idnivelacademicos = n.id 
            inner join gradosacademicos g on p.idgradoacademicos = g.id 
            inner join departamento d on p.deptoresidencia = d.id 
            inner join municipio m on p.municipioresidencia = m.id 
            left join aldeas a on p.aldearesidencia = a.id 
            left join investigacion i on p.id= i.id 
            left join formacion f on p.idformacion = f.id 
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 

            
        `)
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


export const getParticipanteIdM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
            SELECT p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                p.idinvestigacion, i.investigacion,
                p.idformacion, f.formacion,
                p.idfuncion, c.cargo,
                p.datoscorrectos, p.autorizadatos, 
                mu.usuario as creadopor, p.fechacreacion, 
                mu2.usuario as modificadopor, p.fechamodificacion 
            FROM participantes p
            inner join nivelesacademicos n on p.idnivelacademicos = n.id 
            inner join gradosacademicos g on p.idgradoacademicos = g.id 
            inner join departamento d on p.deptoresidencia = d.id 
            inner join municipio m on p.municipioresidencia = m.id 
            left join aldeas a on p.aldearesidencia = a.id 
            left join investigacion i on p.id= i.id 
            left join formacion f on p.idformacion = f.id 
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 
            WHERE p.id=$1
        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};

/* 
export const getParticipanteIdInvestM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
                SELECT p.idinvestigacion, i.investigacion, p.id as idparticipante, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                    p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                    p.añosdeservicio, p.codigodered, 
                    p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                    
                    p.idfuncion, c.cargo,
                    p.datoscorrectos, p.autorizadatos, 
                    mu.usuario as creadopor, p.fechacreacion, 
                    mu2.usuario as modificadopor, p.fechamodificacion 
                FROM participantes p
                inner join nivelesacademicos n on p.idnivelacademicos = n.id 
                inner join gradosacademicos g on p.idgradoacademicos = g.id 
                inner join departamento d on p.deptoresidencia = d.id 
                inner join municipio m on p.municipioresidencia = m.id 
                left join aldeas a on p.aldearesidencia = a.id 
                left join investigacion i on p.idinvestigacion= i.id 
                left join formacion f on p.idformacion = f.id 
                left join cargodesempeña c on p.idfuncion = c.id
                inner join ms_usuarios mu on p.creadopor = mu.id 
                left join ms_usuarios mu2 on p.modificadopor = mu2.id
                where p.idinvestigacion =$1

        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    } 
};*/




export const getParticipanteIdFormInvestM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
            SELECT p.idinvestigacion, i.investigacion,  p.idformacion, f.formacion, p.id as idparticipante, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                    p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                    p.añosdeservicio, p.codigodered, 
                    p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                    p.idfuncion, c.cargo,
                    p.datoscorrectos, p.autorizadatos, 
                    mu.usuario as creadopor, p.fechacreacion, 
                    mu2.usuario as modificadopor, p.fechamodificacion, 
                    --datos del centro educativo
                    ced.id as idcentroeducativo, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.jornada, ced.zona, 
	                ced.prebasica, ced.basica, ced.media, 
	                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
	                ced.btp1, ced.btp2, ced.btp3, ced.bch1, ced.bch2, ced.bch3, 
	                ced.modalidad, 
	                ced.iddepartamento, dced.nombre as departamentoced,
	                ced.idmunicipio, mced.nombre  as municipioced,
	                ced.idaldea, aced.nombre as aldeaced
                FROM participantes p
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id 
                left join departamento d on p.deptoresidencia = d.id 
                left join municipio m on p.municipioresidencia = m.id 
                left join aldeas a on p.aldearesidencia = a.id 
                left join investigacion i on p.idinvestigacion= i.id 
                left join formacion f on p.idformacion = f.id 
                left join cargodesempeña c on p.idfuncion = c.id
                --centro educativo
                left join centroeducativo ced on ced.idparticipante = p.id 
                left join departamento dced on ced.iddepartamento = dced.id
	            left join municipio mced on ced.idmunicipio = mced.id 
	            left join aldeas aced on ced.idaldea = aced.id
                left join ms_usuarios mu on p.creadopor = mu.id 
                left join ms_usuarios mu2 on p.modificadopor = mu2.id
                where p.idinvestigacion =$1 or p.idformacion =$1
        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};



export const postParticipanteM = async (
    idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
    idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
    deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor
) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO participantes (
                idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
                idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered, 
                deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, 
                creadopor, fechacreacion, fechamodificacion ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,  CURRENT_TIMESTAMP, null
            ) 
            RETURNING *;
        `, [
            idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
            idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
            deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, creadopor
        ]);

        return rows[0].id;
    } catch (error) {
        console.error("Error en postParticipanteM:", error.message);
        throw error;
    }
};



export const putParticipanteM = async (
    idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
    idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
    deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, modificadopor, id) => {
    try {
        const { rows } = await pool.query(`
                UPDATE participantes
                SET 
                idinvestigacion=$1, 
                idformacion=$2, 
                identificacion=$3, 
                codigosace=$4, 
                correo=$5, 
                nombre=$6, 
                fechanacimiento=$7, 
                edad=$8, 
                telefono=$9, 
                genero=$10, 
                idfuncion=$11,
                idnivelacademicos=$12, 
                idgradoacademicos=$13, 
                añosdeservicio=$14, 
                codigodered=$15,
                deptoresidencia=$16, 
                municipioresidencia=$17, 
                aldearesidencia=$18, 
                caserio=$19, 
                datoscorrectos=$20, 
                autorizadatos=$21, 
                modificadopor=$22,
                WHERE id=$23
                RETURNING *`,
            [idinvestigacion, idformacion, identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
                idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered,
                deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, modificadopor, id
            ])

        return rows[0]
    } catch (error) {
        throw error;
    }

}



//para buscar por identificacion en tabla de docentesdgdp

export const getParticipanteIdentificacionM = async (filtro) => {
    try {
        const { rows } = await pool.query
            (`
            SELECT p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                p.idinvestigacion, i.investigacion,
                p.idformacion, f.formacion,
                p.idfuncion, c.cargo,
                p.datoscorrectos, p.autorizadatos, 
                mu.usuario as creadopor, p.fechacreacion, 
                mu2.usuario as modificadopor, p.fechamodificacion 
            FROM participantes p
            inner join nivelesacademicos n on p.idnivelacademicos = n.id 
            inner join gradosacademicos g on p.idgradoacademicos = g.id 
            inner join departamento d on p.deptoresidencia = d.id 
            inner join municipio m on p.municipioresidencia = m.id 
            left join aldeas a on p.aldearesidencia = a.id 
            left join investigacion i on p.id= i.id 
            left join formacion f on p.idformacion = f.id 
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 
            WHERE p.identificacion=$1
            order by p.id desc
        `, [filtro])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};


//para buscar por codigo SACE en tabla de docentesdgdp

export const getParticipanteCodSACEM = async (filtro) => {
    try {
        const { rows } = await pool.query
            (` SELECT p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, d.nombre as departamento, p.municipioresidencia, m.nombre as municipio, p.aldearesidencia, a.nombre as aldea,  p.caserio, 
                p.idinvestigacion, i.investigacion,
                p.idformacion, f.formacion,
                p.idfuncion, c.cargo,
                p.datoscorrectos, p.autorizadatos, 
                mu.usuario as creadopor, p.fechacreacion, 
                mu2.usuario as modificadopor, p.fechamodificacion 
            FROM participantes p
            inner join nivelesacademicos n on p.idnivelacademicos = n.id 
            inner join gradosacademicos g on p.idgradoacademicos = g.id 
            inner join departamento d on p.deptoresidencia = d.id 
            inner join municipio m on p.municipioresidencia = m.id 
            left join aldeas a on p.aldearesidencia = a.id 
            left join investigacion i on p.id= i.id 
            left join formacion f on p.idformacion = f.id 
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 
            WHERE p.codigosace=$1
            order by p.id desc
        `, [filtro])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};
