import { pool } from "../db.js";

export const getNivelesAcademicosM = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM nivelesacademicos ORDER BY id asc"
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getNivelAcademicoM = async (NivelAcademico) => {
  try {
    const { rows } = await pool.query(
      "SELECT id FROM nivelesacademicos where nombre=$1 ",
      [NivelAcademico]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getCiclosAcademicosM = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ciclosacademicos ORDER BY id asc"
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getCicloAcademicoM = async (CicloAcademico) => {
  try {
    const { rows } = await pool.query(
      "SELECT id FROM ciclosacademicos where nombre=$1",
      [CicloAcademico]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};

//Trae el ciclo academico mediante el id del nivel academico
export const getCicloAcademicoIdNivelM = async (IdNivel) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.nombre as ciclo, n.nombre as nivel FROM ciclosacademicos as c
                                            inner join nivelesacademicos n on c.idnivelesacademicos =n.id 
                                            where idnivelesacademicos=$1`,
      [IdNivel]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getGradosAcademicosM = async () => {
  try {
    const { rows } = await pool.query(`
            SELECT ga.id, ga.nombre as GradoAcademico, ga.ciclo_educativo_id, ga.nivel_educativo_id 
                FROM gradosacademicos as ga
                left join ciclosacademicos c on ga.ciclo_educativo_id = c.id 
                left join nivelesacademicos n on ga.nivel_educativo_id = c.id
                order by ga.id asc`);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getGradoAcademicoM = async (GradoAcademico) => {
  try {
    const { rows } = await pool.query(
      `SELECT id FROM gradosacademicos where nombre=$1`,
      [GradoAcademico]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

//Trae el grado academico mediante el id del ciclo academico
export const getGradoAcademicoIdCicloM = async (Ciclo) => {
  try {
    const { rows } = await pool.query(
      `
            SELECT ga.nombre as Grado,  c.nombre as Ciclo,  n.nombre as Nivel
                FROM gradosacademicos as ga
            inner join ciclosacademicos c on ga.ciclo_educativo_id = c.id 
            inner join nivelesacademicos n on ga.nivel_educativo_id =n.id 
            where ga.ciclo_educativo_id = $1
            order by ga.ciclo_educativo_id asc`,
      [Ciclo]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

//Trae el grado academico mediante el id del nivel academico

export const getGradoAcademicoIdNivelM = async (IdNivel) => {
  try {
    const { rows } = await pool.query(
      `SELECT ga.id, ga.nombre as Grado, c.nombre as Ciclo, n.nombre as Nivel
             FROM gradosacademicos as ga
             LEFT JOIN ciclosacademicos c ON ga.ciclo_educativo_id = c.id 
             INNER JOIN nivelesacademicos n ON ga.nivel_educativo_id = n.id 
             WHERE ga.nivel_educativo_id = $1
             order by ga.nivel_educativo_id asc`,
      [IdNivel]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};
