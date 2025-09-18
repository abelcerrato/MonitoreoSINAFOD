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
    /*          WHERE (ced.iddepartamento = $1 OR $1 IS NULL)
              AND (ced.idmunicipio = $2 OR $2 IS NULL) */
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
                pc.idnivelatiende, n2.nombre as nivelatiende, pc.idcicloatiende, ciclo2.nombre as cicloatiende,
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
            left join nivelesacademicos n2 on pc.idnivelatiende = n2.id
            left join ciclosacademicos ciclo2 on pc.idcicloatiende = ciclo2.id
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
  idnivelatiende,
  idcicloatiende
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO participantescentroeducativo
                (idcentroeducativo, idparticipante, cargo, jornada, modalidad, idnivelatiende, idcicloatiende)
            VALUES
                ( $1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
      [
        idcentroeducativo,
        idparticipante,
        cargo,
        jornada,
        modalidad,
        idnivelatiende,
        idcicloatiende
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
  idnivelatiende,
  idcicloatiende,
  id
) => {
  try {
    const { rows } = await pool.query(
      `
                UPDATE participantescentroeducativo 
                SET 
                    idcentroeducativo=$1 , idparticipante=$2 , cargo=$3 , jornada=$4 , modalidad=$5 , 
                    idnivelatiende=$6 , idcicloatiende=$7 
                WHERE id = $8
                RETURNING *`,
      [
        idcentroeducativo,
        idparticipante,
        cargo,
        jornada,
        modalidad,
        idnivelatiende,
        idcicloatiende,
        id,
      ]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};
