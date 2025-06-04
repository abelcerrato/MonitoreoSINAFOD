import { pool } from "../db.js";

export const getParticipanteM = async () => {
  try {
    const { rows } = await pool.query(`
             SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, TO_CHAR(p.fechanacimiento, 'DD/MM/YYYY') AS fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo as cargopart,
                
                -------------------DATOS DE LA INVESTIGACION------------------
                pi.idinvestigacion, i.investigacion, i.tipoactividad, i.existeconvenio,
                i.institucionconvenio, i.presupuesto, i.duracion, i.funciondirigido, 
                i.prebasica, i.basica, i.media,
                    CONCAT_WS(', ',
                        CASE when i.prebasica THEN 'Prebásica' END,
                        CASE WHEN i.basica THEN 'Básica' END,
                        CASE WHEN i.media THEN 'Media' END
                    ) AS nivelacademico_invest,
                i.fechainicio, i.fechafinal, i.direccion, i.socializaron, i.observacion, 
                i.presentoprotocolo, i.presentoprotocolourl, i.estadoprotocolo, i.monitoreoyevaluacion, i.monitoreoyevaluacionurl, i.aplicacionevaluacion, i.aplicacionevaluacionurl, i.divulgacionresultados, i.divulgacionresultadosurl,
                -------------------DATOS DE LA FORMACION------------------
                pf.idformacion, f.formacion, f.tipoactividad, f.existeconvenio, f.institucionconvenio, f.responsablefirmas, f.ambitoformacion, f.tipoformacion, f.modalidad, f.plataforma, f.duracion, f.estado, f.funciondirigido,
                f.prebasica, f.basica, f.media, 
                    CONCAT_WS(', ',
                        CASE when f.prebasica THEN 'Prebásica' END,
                        CASE WHEN f.basica THEN 'Básica' END,
                        CASE WHEN f.media THEN 'Media' END
                    ) AS nivelacademico_form,
                f.primerciclo, f.segundociclo, f.tercerciclo, 
                    CONCAT_WS(', ',
                        CASE when f.primerciclo THEN 'Primer Ciclo' END,
                        CASE WHEN f.segundociclo THEN 'Segundo Ciclo' END,
                        CASE WHEN f.tercerciclo THEN 'Tercer Ciclo' END
                    ) AS cicloacademico_form,
                f.fechainicio, f.fechafinal, f.participantesprog, f.espaciofisico, f.direccion, f.zona, f.socializaron, f.observacion,
                f.criteriosfactibilidad, f.criteriosfactibilidadurl, f.requisitostecnicos, f.requisitostecnicosurl, f.criterioseticos, f.criterioseticosurl,
             
                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.id as idcentropart, pced.idcentroeducativo, ced.nombreced, ced.codigosace as codigosaceced, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo as idcargoced, c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id  
                left join participantesinvestigacion pi on p.id= pi.idparticipante 
                left join investigacion i on pi.idinvestigacion =i.id 
                left join cargodesempeña c on p.idfuncion = c.id
                left join participantesformacion pf on p.id = pf.idparticipante 
                left join formacion f on pf.idformacion = f.id 
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id  
        `);
    //console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getParticipanteDNIM = async (identificacion) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
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
           
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 
            WHERE p.identificacion=$1
            order by p.id desc
        `,
      [identificacion]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].id;
  } catch (error) {
    throw error;
  }
};

export const getParticipanteIdM = async (id) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                

                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.id as idcentropart, pced.idcentroeducativo, ced.nombreced, ced.codigosace as codigosaceced, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo , c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id
                inner join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                inner join gradosacademicos g on p.idgradoacademicos = g.id  
                inner join cargodesempeña c on p.idfuncion = c.id
                inner join participantescentroeducativo pced on p.id = pced.idparticipante 
                inner join centroeducativo ced on pced.idcentroeducativo = ced.id 
                inner join cargodesempeña c2 on pced.cargo = c2.id
                inner join departamento dced on ced.iddepartamento = dced.id 
                inner join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id 
            WHERE p.id=$1
            order by p.id desc
        `,
      [id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};



//datos del participante y la investigación
export const getParticipanteInvestigacionM = async () => {
  try {
    const { rows } = await pool.query(
      `
              SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                -------------------DATOS DE LA INVESTIGACION------------------
                pi.idinvestigacion, i.investigacion, i.tipoactividad, i.existeconvenio,
                i.institucionconvenio, i.presupuesto, i.duracion, i.funciondirigido, 
                i.prebasica, i.basica, i.media,
                    CONCAT_WS(', ',
                        CASE when i.prebasica THEN 'Prebásica' END,
                        CASE WHEN i.basica THEN 'Básica' END,
                        CASE WHEN i.media THEN 'Media' END
                    ) AS nivelacademico_invest,
                i.fechainicio, i.fechafinal, i.direccion, i.socializaron, i.observacion, 
                i.presentoprotocolo, i.presentoprotocolourl, i.estadoprotocolo, i.monitoreoyevaluacion, i.monitoreoyevaluacionurl, i.aplicacionevaluacion, i.aplicacionevaluacionurl, i.divulgacionresultados, i.divulgacionresultadosurl,
                
                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.idcentroeducativo, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo as idcargo, c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id 
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id 
                left join cargodesempeña c on p.idfuncion = c.id
                left join participantesinvestigacion pi on p.id= pi.idparticipante 
                left join investigacion i on pi.idinvestigacion =i.id 
                
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



//datos del participante y por id de la investigación
export const getParticipanteIdInvestM = async (id) => {
  try {
    const { rows } = await pool.query(
      `
              SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                -------------------DATOS DE LA INVESTIGACION------------------
                pi.idinvestigacion, i.investigacion, i.tipoactividad, i.existeconvenio,
                i.institucionconvenio, i.presupuesto, i.duracion, i.funciondirigido, 
                i.prebasica, i.basica, i.media,
                    CONCAT_WS(', ',
                        CASE when i.prebasica THEN 'Prebásica' END,
                        CASE WHEN i.basica THEN 'Básica' END,
                        CASE WHEN i.media THEN 'Media' END
                    ) AS nivelacademico_invest,
                i.fechainicio, i.fechafinal, i.direccion, i.socializaron, i.observacion, 
                i.presentoprotocolo, i.presentoprotocolourl, i.estadoprotocolo, i.monitoreoyevaluacion, i.monitoreoyevaluacionurl, i.aplicacionevaluacion, i.aplicacionevaluacionurl, i.divulgacionresultados, i.divulgacionresultadosurl,
                
                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.idcentroeducativo, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo as idcargo, c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id 
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id 
                left join cargodesempeña c on p.idfuncion = c.id
                left join participantesinvestigacion pi on p.id= pi.idparticipante 
                left join investigacion i on pi.idinvestigacion =i.id 
                
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id 

                WHERE pi.idinvestigacion = $1;


        `,
      [id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};



//datos del participante y la formación
export const getParticipanteFormacionM = async () => {
  try {
    const { rows } = await pool.query(
      `
             SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                
                -------------------DATOS DE LA FORMACION------------------
                pf.idformacion, f.formacion, f.tipoactividad, f.existeconvenio, f.institucionconvenio, f.responsablefirmas, f.ambitoformacion, f.tipoformacion, f.modalidad, f.plataforma, f.duracion, f.estado, f.funciondirigido,
                f.prebasica, f.basica, f.media, 
                    CONCAT_WS(', ',
                        CASE when f.prebasica THEN 'Prebásica' END,
                        CASE WHEN f.basica THEN 'Básica' END,
                        CASE WHEN f.media THEN 'Media' END
                    ) AS nivelacademico_form,
                f.primerciclo, f.segundociclo, f.tercerciclo, 
                    CONCAT_WS(', ',
                        CASE when f.primerciclo THEN 'Primer Ciclo' END,
                        CASE WHEN f.segundociclo THEN 'Segundo Ciclo' END,
                        CASE WHEN f.tercerciclo THEN 'Tercer Ciclo' END
                    ) AS cicloacademico_form,
                f.fechainicio, f.fechafinal, f.participantesprog, f.espaciofisico, f.direccion, f.zona, f.socializaron, f.observacion,
                f.criteriosfactibilidad, f.criteriosfactibilidadurl, f.requisitostecnicos, f.requisitostecnicosurl, f.criterioseticos, f.criterioseticosurl,
                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.idcentroeducativo, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo as idcargo, c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id  
                left join cargodesempeña c on p.idfuncion = c.id
                
                left join participantesformacion pf on p.id = pf.idparticipante 
                left join formacion f on pf.idformacion = f.id 
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id 

        `);
    return rows;
  } catch (error) {
    throw error;
  }
};



//datos del participante por id de la formación
export const getParticipanteIdFormacionM = async (id) => {
  try {
    const { rows } = await pool.query(
      `
             SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                
                -------------------DATOS DE LA FORMACION------------------
                pf.idformacion, f.formacion, f.tipoactividad, f.existeconvenio, f.institucionconvenio, f.responsablefirmas, f.ambitoformacion, f.tipoformacion, f.modalidad, f.plataforma, f.duracion, f.estado, f.funciondirigido,
                f.prebasica, f.basica, f.media, 
                    CONCAT_WS(', ',
                        CASE when f.prebasica THEN 'Prebásica' END,
                        CASE WHEN f.basica THEN 'Básica' END,
                        CASE WHEN f.media THEN 'Media' END
                    ) AS nivelacademico_form,
                f.primerciclo, f.segundociclo, f.tercerciclo, 
                    CONCAT_WS(', ',
                        CASE when f.primerciclo THEN 'Primer Ciclo' END,
                        CASE WHEN f.segundociclo THEN 'Segundo Ciclo' END,
                        CASE WHEN f.tercerciclo THEN 'Tercer Ciclo' END
                    ) AS cicloacademico_form,
                f.fechainicio, f.fechafinal, f.participantesprog, f.espaciofisico, f.direccion, f.zona, f.socializaron, f.observacion,
                f.criteriosfactibilidad, f.criteriosfactibilidadurl, f.requisitostecnicos, f.requisitostecnicosurl, f.criterioseticos, f.criterioseticosurl,
                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.idcentroeducativo, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo as idcargo, c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id  
                left join cargodesempeña c on p.idfuncion = c.id
                
                left join participantesformacion pf on p.id = pf.idparticipante 
                left join formacion f on pf.idformacion = f.id 
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id 
            where pf.idformacion =$1

        `,
      [id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const postParticipanteM = async (
  identificacion,
  codigosace,
  correo,
  nombre,
  fechanacimiento,
  edad,
  telefono,
  genero,
  idfuncion,
  idnivelacademicos,
  idgradoacademicos,
  añosdeservicio,
  codigodered,
  deptoresidencia,
  municipioresidencia,
  aldearesidencia,
  caserio,
  datoscorrectos,
  autorizadatos,
  creadopor
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO participantes (
                identificacion, codigosace, correo, nombre, fechanacimiento, edad, telefono, genero, idfuncion,
                idnivelacademicos, idgradoacademicos, añosdeservicio, codigodered, 
                deptoresidencia, municipioresidencia, aldearesidencia, caserio, datoscorrectos, autorizadatos, 
                creadopor, fechacreacion, fechamodificacion ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,  CURRENT_TIMESTAMP, null
            ) 
            RETURNING id
        `,
      [
        identificacion,
        codigosace,
        correo,
        nombre,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
      ]
    );

    return rows[0].id;
  } catch (error) {
    console.error("Error en postParticipanteM:", error.message);
    throw error;
  }
};

export const putParticipanteM = async (
  identificacion,
  codigosace,
  correo,
  nombre,
  fechanacimiento,
  edad,
  telefono,
  genero,
  idfuncion,
  idnivelacademicos,
  idgradoacademicos,
  añosdeservicio,
  codigodered,
  deptoresidencia,
  municipioresidencia,
  aldearesidencia,
  caserio,
  datoscorrectos,
  autorizadatos,
  modificadopor,
  id
) => {
  try {
    const { rows } = await pool.query(
      `
                UPDATE participantes
                SET 
                
                identificacion=$1, 
                codigosace=$2, 
                correo=$3, 
                nombre=$4, 
                fechanacimiento=$5, 
                edad=$6, 
                telefono=$7, 
                genero=$8, 
                idfuncion=$9,
                idnivelacademicos=$10, 
                idgradoacademicos=$11, 
                añosdeservicio=$12, 
                codigodered=$13,
                deptoresidencia=$14, 
                municipioresidencia=$15, 
                aldearesidencia=$16, 
                caserio=$17, 
                datoscorrectos=$18, 
                autorizadatos=$19, 
                modificadopor=$20
                WHERE id=$21
                RETURNING *`,
      [
        identificacion,
        codigosace,
        correo,
        nombre,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        modificadopor,
        id,
      ]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

//para buscar por identificacion en tabla de docentesdgdp

export const getParticipanteIdentificacionM = async (filtro) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                -------------------DATOS DEL PARTICIPANTE------------------------
                p.id, p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico, p.idcicloacademicos, ciclo.nombre as cicloacademico, p.idgradoacademicos, g.nombre as gradoacademico, 
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, dres.nombre as departamento, p.municipioresidencia, mres.nombre as municipio, p.aldearesidencia, ares.nombre as aldea, p.caserio, 
                p.datoscorrectos, p.autorizadatos, p.creadopor, p.fechacreacion, p.modificadopor, p.fechamodificacion, p.idfuncion, c.cargo,
                

                -------------------DATOS DEL CENTRO EDUCATIVO Y LA TABLA DE RELACION ENTRE CENTRO EDUCATIVO Y PARTICIPANTES------------------
                pced.idcentroeducativo, ced.nombreced, ced.codigosace as codigosaceced, ced.tipoadministracion, ced.tipocentro, ced.zona, pced.cargo , c2.cargo as cargoced, pced.jornada, pced.modalidad, 
                pced.prebasica, pced.basica, pced.media, pced.primero, pced.segundo, pced.tercero, pced.cuarto, pced.quinto, pced.sexto, pced.septimo, pced.octavo, pced.noveno, pced.decimo, pced.onceavo, pced.doceavo,
                    CONCAT_WS(', ',
                        CASE WHEN pced.prebasica THEN 'Prebásica' END,
                        CASE WHEN pced.basica THEN 'Básica' END,
                        CASE WHEN pced.media THEN 'Media' END
                    ) AS nivelacademico_ced,
                    CONCAT_WS(', ',
                        CASE WHEN pced.primero THEN 'Primero' END,
                        CASE WHEN pced.segundo THEN 'Segundo' END,
                        CASE WHEN pced.tercero THEN 'Tercero' END,
                        CASE WHEN pced.cuarto THEN 'Cuarto' END,
                        CASE WHEN pced.quinto THEN 'Quinto' END,
                        CASE WHEN pced.sexto THEN 'Sexto' END,
                        CASE WHEN pced.septimo THEN 'Séptimo' END,
                        CASE WHEN pced.octavo THEN 'Octavo' END,
                        CASE WHEN pced.noveno THEN 'Noveno' END,
                        CASE WHEN pced.decimo THEN 'Decimo' END,
                        CASE WHEN pced.onceavo THEN 'Onceavo' END,
                        CASE WHEN pced.doceavo THEN 'Doceavo' END
                    ) AS gradoacademico_ced,
                ced.iddepartamento, dced.nombre as departamentoced, ced.idmunicipio, mced.nombre as municipioced, ced.idaldea, aced.nombre as aldeaced
                FROM participantes as p
                left join departamento dres on p.deptoresidencia = dres.id 
                left join municipio mres on p.municipioresidencia = mres.id 
                left join aldeas ares on p.aldearesidencia = ares.id
                left join nivelesacademicos n on p.idnivelacademicos = n.id 
                left join ciclosacademicos ciclo on p.idcicloacademicos = ciclo.id 
                left join gradosacademicos g on p.idgradoacademicos = g.id  
                left join cargodesempeña c on p.idfuncion = c.id
                left join participantescentroeducativo pced on p.id = pced.idparticipante 
                left join centroeducativo ced on pced.idcentroeducativo = ced.id 
                left join cargodesempeña c2 on pced.cargo = c2.id
                left join departamento dced on ced.iddepartamento = dced.id 
                left join municipio mced on ced.idmunicipio = mced.id
                left join aldeas aced on ced.idaldea = aced.id 
            WHERE p.identificacion=$1
            order by p.id desc
        `,
      [filtro]
    );
    //console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

//para buscar por codigo SACE en tabla de docentesdgdp

export const getParticipanteCodSACEM = async (filtro) => {
  try {
    const { rows } = await pool.query(
      ` SELECT p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
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
            
            left join cargodesempeña c on p.idfuncion = c.id
            inner join ms_usuarios mu on p.creadopor = mu.id 
            left join ms_usuarios mu2 on p.modificadopor = mu2.id 
            WHERE p.codigosace=$1
            order by p.id desc
        `,
      [filtro]
    );
    //console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const postParticipanteInvestigacionM = async (
  idinvestigacion,
  idparticipante
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO participantesinvestigacion ( idinvestigacion, idparticipante ) 
            VALUES ( $1, $2 ) 
            RETURNING id
        `,
      [idinvestigacion, idparticipante]
    );

    return rows[0];
  } catch (error) {
    console.error("Error en postParticipanteInvestigacionM:", error.message);
    throw error;
  }
};

export const postParticipanteFormacionM = async (
  idformacion,
  idparticipante
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO participantesformacion ( idformacion, idparticipante ) 
            VALUES ( $1, $2 ) 
            RETURNING id
        `,
      [idformacion, idparticipante]
    );

    return rows[0];
  } catch (error) {
    console.error("Error en postParticipanteInvestigacionM:", error.message);
    throw error;
  }
};
