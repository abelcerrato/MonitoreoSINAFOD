import XLSX from 'xlsx';
import { getFiltroDocentesC } from './docentesDGDP.controller.js'; // Importa tu controlador existente
import { postFormacionM } from "../models/formacion.models.js";


//no está en uso
export const cargaMasivaFormacion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Procesar cada fila
    for (const row of data) {
      try {
        // Mapear los datos del Excel a la estructura que espera tu controlador
        const body = {
          // Datos del participante (docente)
          identificacion: row.identificacion,
          codigosace: row.codigosace,
          correo: row.correo,
          nombre: row.nombre,
          apellido: row.apellido,
          fechanacimiento: row.fechanacimiento,
          edad: row.edad,
          telefono: row.telefono,
          genero: row.genero,
          idfuncion: row.idfuncion,
          idnivelacademicos: row.idnivelacademicos,
          idgradoacademicos: row.idgradoacademicos,
          añosdeservicio: row.añosdeservicio,
          codigodered: row.codigodered,
          deptoresidencia: row.deptoresidencia,
          municipioresidencia: row.municipioresidencia,
          aldearesidencia: row.aldearesidencia,
          caserio: row.caserio,
          datoscorrectos: row.datoscorrectos,
          autorizadatos: row.autorizadatos,
          creadopor: req.user?.id || 1, // Usa el usuario actual o un valor por defecto
          idetnia: row.idetnia,

          // Datos del centro educativo
          nombreced: row.nombreced,
          codigosaceced: row.codigosaceced,
          tipoadministracion: row.tipoadministracion,
          tipocentro: row.tipocentro,
          zona: row.zona,
          iddepartamento: row.iddepartamento,
          idmunicipio: row.idmunicipio,
          idaldea: row.idaldea,
          idnivelacademicocentro: row.idnivelacademicocentro,

          // Datos de la relación
          cargo: row.cargo,
          jornada: row.jornada,
          modalidad: row.modalidad,
          idnivelatiende: row.idnivelatiende,
          idcicloatiende: row.idcicloatiende
        };

        console.log(`Procesando fila: ${JSON.stringify(body)}`);
        
        // Crear un objeto request simulado para cada fila
        const mockReq = {
          params: {
            tipo: "formacion",
            id: 12 // ID fijo para la formación, aqui se modifica el id
          },
          body: body
        };

        // Crear un objeto response simulado para capturar la respuesta
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              console.log(`Procesado: ${row.identificacion} - Código: ${code}`);
              return { code, data };
            }
          })
        };

        // Llamar a tu controlador existente con los datos de esta fila
        await getFiltroDocentesC(mockReq, mockRes);
        
      } catch (error) {
        console.error(`Error al procesar fila con identificación ${row.identificacion}:`, error.message);
        // Puedes continuar con las siguientes filas aunque falle una
      }
    }

    return res.status(200).json({ 
      message: "Carga masiva completada", 
      total: data.length,
      // Puedes agregar más estadísticas si lo deseas
    });

  } catch (error) {
    console.error("Error en carga masiva:", error);
    return res.status(500).json({ error: "Error al procesar el archivo" });
  }
};


//Carga masiva de formacion con los participantes pertenecientes a cada formacion
export const cargaMasivaFormacionParticipantes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    if (data.length === 0) {
      return res.status(400).json({ error: "El archivo está vacío" });
    }

    const creadopor = req.user?.id || 1;

    // --- 1 Detectar formaciones únicas ---
    // Usamos un Map para evitar duplicados por nombre
    const formacionesMap = new Map();

    for (const row of data) {
      const claveFormacion = row.formacion?.trim();
      if (!claveFormacion) continue; // saltar filas vacías

      if (!formacionesMap.has(claveFormacion)) {
        formacionesMap.set(claveFormacion, {
          formacion: row.formacion,
          tipoactividad: row.tipoactividad,
          existeconvenio: row.existeconvenio,
          institucionconvenio: row.institucionconvenio,
          institucionresponsable: row.institucionresponsable,
          responsablefirmas: row.responsablefirmas,
          ambitoformacion: row.ambitoformacion,
          tipoformacion: row.tipoformacion,
          modalidad: row.modalidad,
          plataforma: row.plataforma,
          duracion: row.duracion,
          estado: row.estado,
          funciondirigido: row.funciondirigido,
          prebasica: row.prebasica,
          basica: row.basica,
          media: row.media,
          primerciclo: row.primerciclo,
          segundociclo: row.segundociclo,
          tercerciclo: row.tercerciclo,
          fechainicio: row.fechainicio,
          fechafinal: row.fechafinal,
          participantesprog: row.participantesprog,
          espaciofisico: row.espaciofisico,
          direccion: row.direccion,
          zona: row.zona,
          socializaron: row.socializaron,
          observacion: row.observacion,
          creadopor: req.user?.id || 1, // Usa el usuario actual o un valor por defecto
        });
      }
    }

    console.log(`Se detectaron ${formacionesMap.size} formaciones únicas en el archivo.`);

    // --- 2 Insertar todas las formaciones y guardar sus IDs ---
    const idFormaciones = {};

    for (const [clave, formacionData] of formacionesMap.entries()) {
      try {
        const nuevaFormacion = await postFormacionM(...Object.values(formacionData));
        idFormaciones[clave] = nuevaFormacion.id;
        console.log(`Formación '${clave}' creada con ID ${nuevaFormacion.id}`);
      } catch (err) {
        console.error(`Error al insertar formación '${clave}':`, err.message);
      }
    }

    // --- 3 Insertar los participantes y vincularlos a la formación correspondiente ---
    let exitosos = 0;
    let fallidos = 0;

    for (const row of data) {
      try {
        const idFormacion = idFormaciones[row.formacion?.trim()];
        if (!idFormacion) {
          console.warn(`No se encontró formación para el participante ${row.identificacion}`);
          fallidos++;
          continue;
        }

        const body = {
           // Datos del participante (docente)
          identificacion: row.identificacion,
          codigosace: row.codigosace,
          correo: row.correo,
          nombre: row.nombre,
          apellido: row.apellido,
          fechanacimiento: row.fechanacimiento,
          edad: row.edad,
          telefono: row.telefono,
          genero: row.genero,
          idfuncion: row.idfuncion,
          idnivelacademicos: row.idnivelacademicos,
          idgradoacademicos: row.idgradoacademicos,
          añosdeservicio: row.añosdeservicio,
          codigodered: row.codigodered,
          deptoresidencia: row.deptoresidencia,
          municipioresidencia: row.municipioresidencia,
          aldearesidencia: row.aldearesidencia,
          caserio: row.caserio,
          datoscorrectos: row.datoscorrectos,
          autorizadatos: row.autorizadatos,
          creadopor: req.user?.id || 1, // Usa el usuario actual o un valor por defecto
          idetnia: row.idetnia,

          // Datos del centro educativo
          nombreced: row.nombreced,
          codigosaceced: row.codigosaceced,
          tipoadministracion: row.tipoadministracion,
          tipocentro: row.tipocentro,
          zona: row.zona,
          iddepartamento: row.iddepartamento,
          idmunicipio: row.idmunicipio,
          idaldea: row.idaldea,
          idnivelacademicocentro: row.idnivelacademicocentro,

          // Datos de la relación
          cargo: row.cargo,
          jornada: row.jornada,
          modalidad: row.modalidad,
          idnivelatiende: row.idnivelatiende,
          idcicloatiende: row.idcicloatiende
        };

        const mockReq = {
          params: { tipo: "formacion", id: idFormacion },
          body,
          user: req.user,
        };

        const mockRes = {
          status: (code) => ({
            json: (data) => {
              console.log(`Participante ${row.identificacion} - formación ${idFormacion}`);
              return { code, data };
            },
          }),
        };

        await getFiltroDocentesC(mockReq, mockRes);
        exitosos++;
      } catch (error) {
        console.error(`Error con participante ${row.identificacion}:`, error.message);
        fallidos++;
      }
    }

    return res.status(200).json({
      message: "Carga masiva se completó exitosamente",
      totalFormaciones: formacionesMap.size,
      totalParticipantes: data.length,
      exitosos,
      fallidos,
    });

  } catch (error) {
    console.error("Error en carga masiva:", error);
    return res.status(500).json({ error: "Error al procesar el archivo" });
  }
};
