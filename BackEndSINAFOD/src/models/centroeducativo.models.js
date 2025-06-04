import { pool } from "../db.js";

export const getCentroEducativoM = async () => {
  try {
    const { rows } = await pool.query(`
            SELECT 
                ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, na.nombre as nivelacademico, ced.zona, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            inner join nivelesacademicos na on ced.idnivelacademico=na.id
            order by ced.id desc
        `);

    return rows;
  } catch (error) {
    throw error;
  }
};

//get de centros educativos por id del registro del centro educativo
export const getIdCentroEducativoM = async (id) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, na.nombre as nivelacademico, ced.zona, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            inner join nivelesacademicos na on ced.idnivelacademico=na.id
            where ced.id=$1
            order by ced.id desc
        `,
      [id]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};


//get de centros educativos por id del departamento
export const getIdCentroEducativoIdDeptoM = async (iddepto, idmuni) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, na.nombre as nivelacademico, ced.zona, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            inner join nivelesacademicos na on ced.idnivelacademico=na.id
            where ced.iddepartamento=$1 and ced.idmunicipio=$2
            order by ced.nombreced asc
        `,
      [iddepto, idmuni]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};





//get de centros educativos por id del registro del centro educativo
export const getIdCentroEducativoSACEM = async (codigosace) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
                ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, na.nombre as nivelacademico, ced.zona, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            inner join nivelesacademicos na on ced.idnivelacademico=na.id
            where  ced.codigosace=$1
            order by ced.id desc
        `,
      [codigosace]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].id;
  } catch (error) {
    throw error;
  }
};

//get de centros educativos por identificacion del participante
export const getCentroEducativoParticipanteM = async (identificacion) => {
  try {
    const { rows } = await pool.query(
      `
           select 
                pc.id,
                pc.idparticipante,
                p.identificacion, p.codigosace, p.correo, p.nombre, p.fechanacimiento, p.edad, p.telefono, p.genero, 
                p.idnivelacademicos, n.nombre as nivelacademico,  p.idgradoacademicos, g.nombre as gradoacademico,
                p.añosdeservicio, p.codigodered, 
                p.deptoresidencia, de.nombre as departamento, p.municipioresidencia, me.nombre as municipio, p.aldearesidencia, ae.nombre as aldea,  p.caserio,
                p.idfuncion, cd.cargo as cargoparticipante, p.datoscorrectos,  p.autorizadatos, 
                pc.idcentroeducativo,
                ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, na.nombre as nivelacademico,
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced, ced.zona, 
                pc.cargo, cd.cargo as cargoecentroed, pc.jornada, pc.modalidad, 
                pc.prebasica, pc.basica, pc.media, 
                pc.primero, pc.segundo, pc.tercero, pc.cuarto, pc.quinto, pc.sexto, pc.septimo, pc.octavo, pc.noveno, 
                pc.decimo, pc.onceavo, pc.doceavo,
                -- columnas nuevas calculadas
                            CONCAT_WS(', ',
                                CASE WHEN pc.prebasica THEN 'Prebásica' END,
                                CASE WHEN pc.basica THEN 'Básica' END,
                                CASE WHEN pc.media THEN 'Media' END
                            ) AS nivelacademico_ced,

                            CONCAT_WS(', ',
                                CASE WHEN pc.primero THEN 'Primero' END,
                                CASE WHEN pc.segundo THEN 'Segundo' END,
                                CASE WHEN pc.tercero THEN 'Tercero' END,
                                CASE WHEN pc.cuarto THEN 'Cuarto' END,
                                CASE WHEN pc.quinto THEN 'Quinto' END,
                                CASE WHEN pc.sexto THEN 'Sexto' END,
                                CASE WHEN pc.septimo THEN 'Séptimo' END,
                                CASE WHEN pc.octavo THEN 'Octavo' END,
                                CASE WHEN pc.noveno THEN 'Noveno' END,
                                CASE WHEN pc.decimo THEN 'Decimo' END,
                                CASE WHEN pc.onceavo THEN 'Onceavo' END,
                                CASE WHEN pc.doceavo THEN 'Doceavo' END
                            ) AS gradoacademico_ced
            from participantescentroeducativo pc
            LEFT JOIN cargodesempeña c ON pc.cargo = c.id
            ----------------------------------------------------------------
            left join centroeducativo ced on pc.idcentroeducativo = ced.id 
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            inner join nivelesacademicos na on ced.idnivelacademico=na.id
            ---------------------------------------------------------------
            inner join participantes p on pc.id=pc.idparticipante
            LEFT JOIN nivelesacademicos n ON p.idnivelacademicos = n.id 
            LEFT JOIN gradosacademicos g ON p.idgradoacademicos = g.id 
            LEFT JOIN departamento de ON p.deptoresidencia = de.id 
            LEFT JOIN municipio me ON p.municipioresidencia = me.id 
            LEFT JOIN aldeas ae ON p.aldearesidencia = ae.id 
            LEFT JOIN cargodesempeña cd ON p.idfuncion = cd.id
            where p.identificacion=$1
        `,
      [identificacion]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

export const postCentroEducativoM = async (
  nombreced,
  codigosaceced,
  tipoadministracion,
  tipocentro,
  zona,
  iddepartamento,
  idmunicipio,
  idaldea, 
  idnivelacademico
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO centroeducativo ( 
                nombreced, codigosace, tipoadministracion, tipocentro, zona, iddepartamento, idmunicipio, idaldea, idnivelacademico) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) 
            RETURNING id
            `,
      [
        nombreced,
        codigosaceced,
        tipoadministracion,
        tipocentro,
        zona,
        iddepartamento,
        idmunicipio,
        idaldea, 
        idnivelacademico
      ]
    );
    return rows[0].id;
  } catch (error) {
    console.error(
      "ERROR AL INSERTAR EL CENTRO EDUCATIVO DEL PARTICIPANTE:",
      error.message
    );
    throw error;
  }
};

export const putCentroEducativoM = async (
  nombreced,
  codigosaceced,
  tipoadministracion,
  tipocentro,
  zona,
  iddepartamento,
  idmunicipio,
  idaldea,
  idnivelacademico,
  id
) => {
  try {
    const { rows } = await pool.query(
      `
                UPDATE centroeducativo 
                SET 
                    nombreced = $1, codigosace = $2, tipoadministracion = $3, tipocentro = $4, zona = $5, iddepartamento = $6, idmunicipio = $7, idaldea = $8, idnivelacademico=$9
                WHERE id = $10
                RETURNING *`,
      [
        nombreced,
        codigosaceced,
        tipoadministracion,
        tipocentro,
        zona,
        iddepartamento,
        idmunicipio,
        idaldea,
        idnivelacademico,
        id,
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CETRO EDUCATIVO Y PARTICIPANTE

export const postCentroEducativoParticipanteM = async (
  idcentroeducativo,
  idparticipante,
  cargo,
  jornada,
  modalidad,
  prebasica,
  basica,
  media,
  primero,
  segundo,
  tercero,
  cuarto,
  quinto,
  sexto,
  septimo,
  octavo,
  noveno,
  decimo,
  onceavo,
  doceavo
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO participantescentroeducativo
                (idcentroeducativo, idparticipante, cargo, jornada, modalidad, prebasica, basica, media, primero, segundo, tercero, cuarto, quinto, sexto, septimo, octavo, noveno, decimo, onceavo, doceavo)
            VALUES
                ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING id`,
      [
        idcentroeducativo,
        idparticipante,
        cargo,
        jornada,
        modalidad,
        prebasica,
        basica,
        media,
        primero,
        segundo,
        tercero,
        cuarto,
        quinto,
        sexto,
        septimo,
        octavo,
        noveno,
        decimo,
        onceavo,
        doceavo,
      ]
    );
    return rows[0].id;
  } catch (error) {
    console.error(
      "ERROR AL INSERTAR LA RELACION DEL CENTRO EDUCATIVO Y EL PARTICIPANTE:",
      error.message
    );
    throw error;
  }
};

export const putCentroEducativoParticipanteM = async (
  idcentroeducativo,
  idparticipante,
  cargo,
  jornada,
  modalidad,
  prebasica,
  basica,
  media,
  primero,
  segundo,
  tercero,
  cuarto,
  quinto,
  sexto,
  septimo,
  octavo,
  noveno,
  decimo,
  onceavo,
  doceavo,
  id
) => {
  try {
    const { rows } = await pool.query(
      `
                UPDATE participantescentroeducativo 
                SET 
                    idcentroeducativo=$1 , idparticipante=$2 , cargo=$3 , jornada=$4 , modalidad=$5 , 
                    prebasica=$6 , basica=$7 , media=$8 , 
                    primero=$9 , segundo=$10 , tercero=$11 , cuarto=$12 , quinto=$13 , sexto=$14 , septimo=$15 , octavo=$16 , noveno=$17 , 
                    decimo=$18 , onceavo=$19 , doceavo=$20
                WHERE id = $21
                RETURNING *`,
      [
        idcentroeducativo,
        idparticipante,
        cargo,
        jornada,
        modalidad,
        prebasica,
        basica,
        media,
        primero,
        segundo,
        tercero,
        cuarto,
        quinto,
        sexto,
        septimo,
        octavo,
        noveno,
        decimo,
        onceavo,
        doceavo,
        id,
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};
