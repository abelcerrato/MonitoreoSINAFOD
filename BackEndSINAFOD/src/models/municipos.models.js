import { pool } from "../db.js"; // Importa la conexión a la base de datos


// Trae los municipios por el id del departamento
export const getMunicipiosIdM = async (id) => {
  try {
    const { rows } = await pool.query(
      `
            select d.nombre as departamento , m.id, m.nombre as municipio 
            from municipio m 
            inner join departamento d on m.iddepartamento = d.id 
            WHERE d.id=$1
            order by m.nombre asc`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error) {
    throw error;
  }
};


// Trae un municipio por su id de departamento
export const getMunicipioxIdDepto = async (municipioced) => {
  console.log("Municipio enviado:", municipioced);
  try {
    // Obtener el ID del municipio
    const { rows } = await pool.query(
      "SELECT id FROM municipio WHERE nombre = $1",
      [municipioced]
    );
    console.log("Resultado de la consulta de municipio:", rows); // Agregado para depuración
    return rows;
  } catch (error) {
    console.error("Error al obtener el minicipio:", error); // Log de error más claro
    throw error;
  }
};


// Trae todos los municipios
export const getMunicipiosM = async () => {
  try {
    const { rows } = await pool.query(`
            select m.id, m.nombre as municipio 
            from municipio m 
            order by m.nombre asc`);
    return rows;
  } catch (error) {
    throw error;
  }
};
