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


export const getParticipanteIdInvestM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
               SELECT 
                p.idinvestigacion, 
                i.investigacion, 
                p.id as idparticipante, 
                p.identificacion, 
                p.codigosace, 
                p.correo, 
                p.nombre, 
                p.fechanacimiento, 
                p.edad, 
                p.telefono, 
                p.genero, 
                p.idnivelacademicos, 
                n.nombre as nivelacademico,  
                p.idgradoacademicos, 
                g.nombre as gradoacademico,
                p.añosdeservicio, 
                p.codigodered, 
                p.deptoresidencia, 
                d.nombre as departamento, 
                p.municipioresidencia, 
                m.nombre as municipio, 
                p.aldearesidencia, 
                a.nombre as aldea,  
                p.caserio, 
                p.idfuncion, 
                c.cargo,
                p.datoscorrectos, 
                p.autorizadatos, 
                mu.usuario as creadopor, 
                p.fechacreacion, 
                mu2.usuario as modificadopor, 
                p.fechamodificacion, 

                -- datos del centro educativo
                ced.id as idcentroeducativo, 
                ced.nombreced, 
                ced.codigosace, 
                ced.tipoadministracion, 
                ced.tipocentro, 
                ced.jornada, 
                ced.zona, 

                -- columnas booleanas individuales
                ced.prebasica, ced.basica, ced.media, 
                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, 
                ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
                ced.btp1, ced.btp2, ced.btp3, 
                ced.bch1, ced.bch2, ced.bch3, 

                -- columnas nuevas calculadas
                CONCAT_WS(', ',
                    CASE WHEN ced.prebasica THEN 'Prebásica' END,
                    CASE WHEN ced.basica THEN 'Básica' END,
                    CASE WHEN ced.media THEN 'Media' END
                ) AS nivelacademico_ced,

                CONCAT_WS(', ',
                    CASE WHEN ced.primero THEN 'Primero' END,
                    CASE WHEN ced.segundo THEN 'Segundo' END,
                    CASE WHEN ced.tercero THEN 'Tercero' END,
                    CASE WHEN ced.cuarto THEN 'Cuarto' END,
                    CASE WHEN ced.quinto THEN 'Quinto' END,
                    CASE WHEN ced.sexto THEN 'Sexto' END,
                    CASE WHEN ced.séptimo THEN 'Séptimo' END,
                    CASE WHEN ced.octavo THEN 'Octavo' END,
                    CASE WHEN ced.noveno THEN 'Noveno' END,
                    CASE WHEN ced.btp1 THEN 'BTP 1' END,
                    CASE WHEN ced.btp2 THEN 'BTP 2' END,
                    CASE WHEN ced.btp3 THEN 'BTP 3' END,
                    CASE WHEN ced.bch1 THEN 'BCH 1' END,
                    CASE WHEN ced.bch2 THEN 'BCH 2' END,
                    CASE WHEN ced.bch3 THEN 'BCH 3' END
                ) AS gradoacademico_ced,

                -- ubicación del centro educativo
                ced.modalidad, 
                ced.iddepartamento, dced.nombre as departamentoced,
                ced.idmunicipio, mced.nombre as municipioced,
                ced.idaldea, aced.nombre as aldeaced

            FROM participantes p
            LEFT JOIN nivelesacademicos n ON p.idnivelacademicos = n.id 
            LEFT JOIN gradosacademicos g ON p.idgradoacademicos = g.id 
            LEFT JOIN departamento d ON p.deptoresidencia = d.id 
            LEFT JOIN municipio m ON p.municipioresidencia = m.id 
            LEFT JOIN aldeas a ON p.aldearesidencia = a.id 
            LEFT JOIN investigacion i ON p.idinvestigacion = i.id 
            LEFT JOIN formacion f ON p.idformacion = f.id 
            LEFT JOIN cargodesempeña c ON p.idfuncion = c.id

            -- centro educativo
            LEFT JOIN centroeducativo ced ON ced.idparticipante = p.id 
            LEFT JOIN departamento dced ON ced.iddepartamento = dced.id
            LEFT JOIN municipio mced ON ced.idmunicipio = mced.id 
            LEFT JOIN aldeas aced ON ced.idaldea = aced.id

            LEFT JOIN ms_usuarios mu ON p.creadopor = mu.id 
            LEFT JOIN ms_usuarios mu2 ON p.modificadopor = mu2.id

            WHERE p.idinvestigacion = $1;


        `, [id])
        //console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
};




export const getParticipanteIdFormacionM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
             SELECT 
                p.idformacion, 
                f.formacion,
                 p.id as idparticipante, 
                p.identificacion, 
                p.codigosace, 
                p.correo, 
                p.nombre, 
                p.fechanacimiento, 
                p.edad, 
                p.telefono, 
                p.genero, 
                p.idnivelacademicos, 
                n.nombre as nivelacademico,  
                p.idgradoacademicos, 
                g.nombre as gradoacademico,
                p.añosdeservicio, 
                p.codigodered, 
                p.deptoresidencia, 
                d.nombre as departamento, 
                p.municipioresidencia, 
                m.nombre as municipio, 
                p.aldearesidencia, 
                a.nombre as aldea,  
                p.caserio, 
                p.idfuncion, 
                c.cargo,
                p.datoscorrectos, 
                p.autorizadatos, 
                mu.usuario as creadopor, 
                p.fechacreacion, 
                mu2.usuario as modificadopor, 
                p.fechamodificacion, 

                -- datos del centro educativo
                ced.id as idcentroeducativo, 
                ced.nombreced, 
                ced.codigosace, 
                ced.tipoadministracion, 
                ced.tipocentro, 
                ced.jornada, 
                ced.zona, 

                -- columnas booleanas individuales
                ced.prebasica, ced.basica, ced.media, 
                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, 
                ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
                ced.btp1, ced.btp2, ced.btp3, 
                ced.bch1, ced.bch2, ced.bch3, 

                -- columnas nuevas calculadas
                CONCAT_WS(', ',
                    CASE WHEN ced.prebasica THEN 'Prebásica' END,
                    CASE WHEN ced.basica THEN 'Básica' END,
                    CASE WHEN ced.media THEN 'Media' END
                ) AS nivelacademico_ced,

                CONCAT_WS(', ',
                    CASE WHEN ced.primero THEN 'Primero' END,
                    CASE WHEN ced.segundo THEN 'Segundo' END,
                    CASE WHEN ced.tercero THEN 'Tercero' END,
                    CASE WHEN ced.cuarto THEN 'Cuarto' END,
                    CASE WHEN ced.quinto THEN 'Quinto' END,
                    CASE WHEN ced.sexto THEN 'Sexto' END,
                    CASE WHEN ced.séptimo THEN 'Séptimo' END,
                    CASE WHEN ced.octavo THEN 'Octavo' END,
                    CASE WHEN ced.noveno THEN 'Noveno' END,
                    CASE WHEN ced.btp1 THEN 'BTP 1' END,
                    CASE WHEN ced.btp2 THEN 'BTP 2' END,
                    CASE WHEN ced.btp3 THEN 'BTP 3' END,
                    CASE WHEN ced.bch1 THEN 'BCH 1' END,
                    CASE WHEN ced.bch2 THEN 'BCH 2' END,
                    CASE WHEN ced.bch3 THEN 'BCH 3' END
                ) AS gradoacademico_ced,

                -- ubicación del centro educativo
                ced.modalidad, 
                ced.iddepartamento, dced.nombre as departamentoced,
                ced.idmunicipio, mced.nombre as municipioced,
                ced.idaldea, aced.nombre as aldeaced

            FROM participantes p
            LEFT JOIN nivelesacademicos n ON p.idnivelacademicos = n.id 
            LEFT JOIN gradosacademicos g ON p.idgradoacademicos = g.id 
            LEFT JOIN departamento d ON p.deptoresidencia = d.id 
            LEFT JOIN municipio m ON p.municipioresidencia = m.id 
            LEFT JOIN aldeas a ON p.aldearesidencia = a.id 
            LEFT JOIN investigacion i ON p.idinvestigacion = i.id 
            LEFT JOIN formacion f ON p.idformacion = f.id 
            LEFT JOIN cargodesempeña c ON p.idfuncion = c.id

            -- centro educativo
            LEFT JOIN centroeducativo ced ON ced.idparticipante = p.id 
            LEFT JOIN departamento dced ON ced.iddepartamento = dced.id
            LEFT JOIN municipio mced ON ced.idmunicipio = mced.id 
            LEFT JOIN aldeas aced ON ced.idaldea = aced.id

            LEFT JOIN ms_usuarios mu ON p.creadopor = mu.id 
            LEFT JOIN ms_usuarios mu2 ON p.modificadopor = mu2.id
            where p.idformacion =$1

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
