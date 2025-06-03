import { pool } from "../db.js";

export const getDocentesM = async () => {
  try {
    const { rows } = await pool.query(`
            SELECT dgdp.id, dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento, d.nombre as departamento,
                dgdp.idmunicipio, m.nombre as municipio,
                dgdp.idaldea, a.nombre as aldea,
                dgdp.genero, dgdp.institucion, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos, n.nombre as nivelEducativo, 
                dgdp.idciclosacademicos, c.nombre as cicloAcademico,
                dgdp.zona 
            FROM docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            `);
    console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getDocentesIdM = async (identificacion) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento, d.nombre as departamento,
                dgdp.idmunicipio, m.nombre as municipio,
                dgdp.idaldea, a.nombre as aldea,
                dgdp.genero, dgdp.institucion, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos, n.nombre as nivelEducativo, 
                dgdp.idciclosacademicos, c.nombre as cicloAcademico,
                dgdp.zona 
            FROM docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            WHERE dgdp.identificacion=$1`,
      [identificacion]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

export const postDocentesM = async (
  codigosace,
  nombre,
  identificacion,
  correo,
  departamentoced,
  municipioced,
  aldeaced,
  genero,
  centroeducativo,
  institucioncodsace,
  idnivelesacademicos,
  idciclosacademicos,
  zona
) => {
  try {
    const { rows } = await pool.query(
      `
            INSERT INTO docentesdgdp (codigosace, nombre, identificacion, correo, iddepartamento, idmunicipio, idaldea, 
                                        genero, institucion, institucioncodsace, idnivelesacademicos, idciclosacademicos, zona) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        codigosace,
        nombre,
        identificacion,
        correo,
        departamentoced,
        municipioced,
        aldeaced,
        genero,
        centroeducativo,
        institucioncodsace,
        idnivelesacademicos,
        idciclosacademicos,
        zona,
      ]
    );
    // Log for debugging
    //console.log(rows);
    return rows[0].id;
  } catch (error) {
    throw error;
  }
};

export const putDocentesM = async (
  codigosace,
  nombre,
  correo,
  departamentoced,
  municipioced,
  aldeaced,
  genero,
  centroeducativo,
  institucioncodsace,
  idnivelesacademicos,
  idciclosacademicos,
  zona,
  identificacion
) => {
  try {
    const { rows } = await pool.query(
      `
            UPDATE docentesdgdp SET codigosace=$1, nombre=$2, correo=$3, iddepartamento=$4, idmunicipio=$5, idaldea=$6, 
                                    genero=$7, institucion=$8, institucioncodsace=$9, idnivelesacademicos=$10, idciclosacademicos=$11, zona=$12
            WHERE identificacion=$13 RETURNING *`,
      [
        codigosace,
        nombre,
        correo,
        departamentoced,
        municipioced,
        aldeaced,
        genero,
        centroeducativo,
        institucioncodsace,
        idnivelesacademicos,
        idciclosacademicos,
        zona,
        identificacion,
      ]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

//para buscar por identificacion en tabla de docentesdgdp
export const getDocenteIdentificacionM = async (filtro) => {
  console.log(filtro);

  try {
    const { rows } = await pool.query(
      `
            select dgdp.id, dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento, d.nombre as nombredeptoced,
                dgdp.idmunicipio, m.nombre as nombremunicipioced,
                dgdp.idaldea, a.nombre as nombrealdeaced,
                dgdp.genero, dgdp.institucion as nombreced, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos , n.nombre as nombrenivelced, 
                dgdp.idciclosacademicos, c.nombre as nombrecicloced,
                dgdp.zona 
            from docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            where dgdp.identificacion=$1
            `,
      [filtro]
    );
    console.log(rows);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

//para buscar por codigo SACE en tabla de docentesdgdp
export const getDocenteCodSACEM = async (filtro) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT dgdp.id, dgdp.codigosace, dgdp.nombre, dgdp.identificacion, dgdp.correo, 
                dgdp.iddepartamento as departamentoced, d.nombre as nombredeptoced,
                dgdp.idmunicipio as municipioced, m.nombre as nombremunicipioced,
                dgdp.idaldea as aldeaced, a.nombre as nombrealdeaced,
                dgdp.genero, dgdp.institucion as centroeducativo, dgdp.institucioncodsace, 
                dgdp.idnivelesacademicos , n.nombre as nombrenivelced, 
                dgdp.idciclosacademicos, c.nombre as nombrecicloced,
                dgdp.zona 
            from docentesdgdp as dgdp
            left join departamento as d on dgdp.iddepartamento =d.id
            left join municipio as m on dgdp.idmunicipio= m.id 
            left join aldeas as a on dgdp.idaldea = a.id
            left join nivelesacademicos n on dgdp.idnivelesacademicos =n.id 
            left join ciclosacademicos c on dgdp.idciclosacademicos =c.id
            where dgdp.codigosace=$1
            ORDER BY dgdp.id DESC`,
      [filtro]
    );
    //console.log(rows);
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw error;
  }
};
