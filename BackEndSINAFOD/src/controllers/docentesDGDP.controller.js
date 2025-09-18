import { getCicloAcademicoM } from "../models/Academico.models.js";
import {
  getParticipanteCodSACEM,
  getParticipanteDNIM,
  getParticipanteIdentificacionM,
  postParticipanteFormacionM,
  postParticipanteInvestigacionM,
  postParticipanteM,
  putParticipanteM,
} from "../models/Participante.models.js";
import {
  getIdCentroEducativoSACEM,
  postCentroEducativoM,
  postCentroEducativoParticipanteM,
} from "../models/centroeducativo.models.js";
import {
  getDocenteCodSACEM,
  getDocenteIdentificacionM,
  getDocentesIdM,
  getDocentesM,
  postDocentesM,
  putDocentesM,
} from "../models/docentesDGDP.models.js";
import { getUsuarioIdM } from "../models/ms_usuarios.models.js";

export const getDocentesC = async (req, res) => {
  try {
    const docentes = await getDocentesM();
    res.json(docentes);
  } catch (error) {
    console.log("Error al obtener docentes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getDocentesIdC = async (req, res) => {
  const { identificacion } = req.params;
  try {
    const docentes = await getDocentesIdM(identificacion);
    if (docentes === null) {
      res.status(404).json({ error: "Docente no encontrado" });
      return;
    }
    res.json(docentes);
  } catch (error) {
    console.log("Error al obtener docente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const postDocentesC = async (req, res) => {
  const {
    codigosace,
    nombre,
    apellido,
    identificacion,
    correo,
    iddepartamento,
    idmunicipio,
    idaldea,
    sexo,
    institucion,
    institucioncodsace,
    idnivelesacademicos,
    idciclosacademicos,
    zona,
  } = req.body;
  try {
    const docentes = await postDocentesM(
      codigosace,
      nombre,
      apellido,
      identificacion,
      correo,
      iddepartamento,
      idmunicipio,
      idaldea,
      sexo,
      institucion,
      institucioncodsace,
      idnivelesacademicos,
      idciclosacademicos,
      zona
    );
    res.json({ message: "Docente agregado ", docentes: docentes });
  } catch (error) {
    console.error("Error al insertar docente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const putDocentesC = async (req, res) => {
  try {
    //const { id } = req.params;
    const {
      codigosace,
      nombre,
      apellido,
      identificacion,
      correo,
      iddepartamento,
      idmunicipio,
      idaldea,
      sexo,
      institucion,
      institucioncodsace,
      idnivelesacademicos,
      idciclosacademicos,
      zona,
    } = req.body;
    console.log(req.body);

    const docentes = await putDocentesM(
      codigosace,
      nombre,
      apellido,
      identificacion,
      correo,
      iddepartamento,
      idmunicipio,
      idaldea,
      sexo,
      institucion,
      institucioncodsace,
      idnivelesacademicos,
      idciclosacademicos,
      zona
    );
    res.json({ message: "Docente actualizado", docentes: docentes });
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//para buscar por identificacion en tabla de docentesdgdp
export const getDocenteIdentificacionC = async (req, res) => {
  const { filtro } = req.params;
  try {
    const docentes = await getDocenteIdentificacionM(filtro);
    if (docentes === null) {
      res
        .status(404)
        .json({ error: "Docente no encontrado por identificacion" });
      return;
    }
    res.json(docentes);
  } catch (error) {
    console.log("Error al obtener docente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//para buscar por codigo SACE en tabla de docentesdgdp
export const getDocenteCodSACEC = async (req, res) => {
  const { filtro } = req.params;
  try {
    const docentes = await getDocenteIdentificacionM(filtro);
    if (docentes === null) {
      res
        .status(404)
        .json({ error: "Docente no encontrado por identificacion" });
      return;
    }
    res.json(docentes);
  } catch (error) {
    console.log("Error al obtener docente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//filtrar por codigo SACE o por Identificacion

/* 
export const getFiltroDocenteC = async (req, res) => {
    const { filtro } = req.params;
    try {
        let resultado;

        // Buscar por identificación de docente
        resultado = await getDocenteIdentificacionM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por código SACE de docente
        resultado = await getDocenteCodSACEM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por identificación de participante
        resultado = await getParticipanteIdentificacionM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Buscar por código SACE de participante
        resultado = await getParticipanteCodSACEM(filtro);
        if (resultado) {
            return res.json(resultado);
        }

        // Si no encontró en ninguno
        res.status(404).json({ error: 'No se encontraron resultados para el filtro proporcionado' });
    } catch (error) {
        console.error('Error al obtener docente o participante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
 */

//filtrar por codigo SACE o por Identificacion
export const getFiltroDocenteC = async (req, res) => {
  const { filtro } = req.params;
  try {
    // const docentes = await getDocenteIdentificacionM(filtro);
    const resultados = await Promise.all([
      //getParticipanteCodSACEM(filtro),
      getParticipanteIdentificacionM(filtro),
      getDocenteIdentificacionM(filtro),
      // getDocenteCodSACEM(filtro)
    ]);

    // Buscar el primer resultado que no esté vacío o null
    const resultadoValido = resultados.find(
      (item) =>
        item &&
        (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0)
    );

    if (resultadoValido) {
      return res.json(resultadoValido);
    }

    // console.log("respuesta back", getDocenteIdentificacionM);

    return res.status(202).json({
      mensaje: "No se encontraron registros para el filtro proporcionado.",
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//filtrar por codigo SACE o por Identificacion
export const getFiltroDocentesC = async (req, res) => {
  const { tipo, id } = req.params;

  let idinvestigacion = null;
  let idformacion = null;

  if (tipo === "investigacion") {
    idinvestigacion = id;
  } else if (tipo === "formacion") {
    idformacion = id;
  } else {
    return res.status(400).json({
      error: "Tipo inválido. Debe ser 'investigacion' o 'formacion'.",
    });
  }

  const {
    //datos del participante o sea el docente
    identificacion,
    codigosace,
    correo,
    nombre,
    apellido,
    fechanacimiento,
    edad,
    telefono,
    genero,
    idfuncion,
    idnivelacademicos,
    idgradoacademicos,
    añosdeservicio,
    codigodered,
    lugardetrabajo,
    deptoresidencia,
    municipioresidencia,
    aldearesidencia,
    caserio,
    datoscorrectos,
    autorizadatos,
    creadopor,
    idetnia,

    //datos del cventro educativo
    nombreced,
    codigosaceced,
    tipoadministracion,
    tipocentro,
    zona,
    iddepartamento,
    idmunicipio,
    idaldea,
    idnivelacademicocentro,

    //datos de la relacion de centro educativo con participante
    cargo,
    jornada,
    modalidad,
    idnivelatiende,
    idcicloatiende,

    tienecentro,
  } = req.body;

  console.log("respuesta del servidor: ", req.body);

  let idciclosacademicos = null; // Por defecto lo dejamos en null

  // Lógica para asignar el valor a idciclosacademicos según idgradoacademicos
  if (idgradoacademicos >= 1 && idgradoacademicos <= 3) {
    idciclosacademicos = 1;
  } else if (idgradoacademicos >= 4 && idgradoacademicos <= 6) {
    idciclosacademicos = 2;
  } else if (idgradoacademicos >= 7 && idgradoacademicos <= 9) {
    idciclosacademicos = 3;
  }

  let idparticipantecentropostman = 86; // valor de la relacion del participante que no lleva centro educativo quemado
  let modificadopor = null; // valor por defecto

  try {
    // Buscar por identificación de docente y por codigo sace
    const resultado1 = await getDocenteIdentificacionM(identificacion);
    const resultado3 = await getParticipanteDNIM(identificacion); // idparticipante
    const resultado4 = await getIdCentroEducativoSACEM(codigosaceced); // idcentroeducativo

    const iddocente = resultado1;
    const idparticipante = resultado3;
    const idcentroeducativo = resultado4;

    console.log("iddocente: ", iddocente);
    console.log("idparticipante: ", idparticipante);
    console.log("idcentroeducativo: ", idcentroeducativo);

    // Variables para la respuesta
    let docentes = null;
    let idPart = null;
    let idcentro = null;
    let ced2 = null;
    let form = null;
    let inv = null;
    let participantes = null;

    // CASO 0: Solo insertar participante si viene el flag, y se deja quemado el id del centroeducativo en 58 que es sin centro educativo
    if (tienecentro === false && !iddocente && !idparticipante) {
      console.log(
        "CASO 0: Solo insertar participante y la relacion con centro, si no existe en docente ni en participante"
      );

      // Insertar docente
      const docente = await postDocentesM(
        codigosace,
        nombre,
        apellido,
        identificacion,
        correo,
        iddepartamento,
        idmunicipio,
        idaldea,
        genero,
        nombreced,
        codigosaceced,
        idnivelacademicos,
        idciclosacademicos,
        zona
      );
      docentes = docente;
      console.log("iddocente: ", docentes);

      // Insertar participante
      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Insertar formaciones
      form = await postParticipanteFormacionM(
        idformacion,
        idPart,
        idparticipantecentropostman
      );
    }

    // CASO 0.1: Solo insertar participante si viene el flag, y se deja quemado el id del centroeducativo en 58 que es sin centro educativo{
    else if (tienecentro === false && !idparticipante) {
      console.log(
        "CASO 0.1: Solo inserta el participante y la relacion si no existe participante"
      );

      // Insertar participante
      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Insertar formaciones
      form = await postParticipanteFormacionM(
        idformacion,
        idPart,
        idparticipantecentropostman
      );
    }

    // CASO 0.2: Solo insertar participante si viene el flag
    else if (tienecentro === false) {
      console.log(
        "CASO 0.2: Solo insertar la relacion del participante con la formacion y el centroparticipante"
      );

      // Actualizar participante
      const Participante = await putParticipanteM(
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
        apellido,
        lugardetrabajo,
        idetnia,
        idparticipante
      );
      participantes = Participante;
      console.log("idparticipante actualizado: ", participantes);

      // Insertar formaciones
      form = await postParticipanteFormacionM(
        idformacion,
        idparticipante,
        idparticipantecentropostman
      );
    }

    // CASO 1: No existe docente, ni participante, ni centro educativo
    else if (!iddocente && !idparticipante && !idcentroeducativo) {
      console.log(
        "CASO 1: No existe docente, ni participante, ni centro educativo"
      );

      // Insertar docente
      const docente = await postDocentesM(
        codigosace,
        nombre,
        apellido,
        identificacion,
        correo,
        iddepartamento,
        idmunicipio,
        idaldea,
        genero,
        nombreced,
        codigosaceced,
        idnivelacademicos,
        idciclosacademicos,
        zona
      );
      docentes = docente;
      console.log("iddocente: ", docentes);

      // Insertar participante
      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idPart) {
        // Insertar centro educativo
        const centro = await postCentroEducativoM(
          nombreced,
          codigosaceced,
          tipoadministracion,
          tipocentro,
          zona,
          iddepartamento,
          idmunicipio,
          idaldea,
          idnivelacademicocentro
        );
        idcentro = centro;
        console.log("idCentro: ", idcentro);

        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentro,
          idPart,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idPart,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idPart) {
        inv = await postParticipanteInvestigacionM(idinvestigacion, idPart);
      }
    }
    // CASO 2: Existe docente, pero no participante ni centro educativo
    else if (!idparticipante && !idcentroeducativo && iddocente) {
      console.log(
        "CASO 2: Existe docente, pero no participante ni centro educativo"
      );
      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idPart) {
        const centro = await postCentroEducativoM(
          nombreced,
          codigosaceced,
          tipoadministracion,
          tipocentro,
          zona,
          iddepartamento,
          idmunicipio,
          idaldea,
          idnivelacademicocentro
        );
        idcentro = centro;
        console.log("idCentro: ", idcentro);

        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentro,
          idPart,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idPart,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idPart) {
        inv = await postParticipanteInvestigacionM(idinvestigacion, idPart);
      }
    }
    // CASO 3: No existe docente, pero sí existe participante y centro educativo
    else if (!iddocente && idparticipante && idcentroeducativo) {
      console.log(
        "CASO 3: No existe docente, pero sí existe participante y centro educativo"
      );

      // Actualizar participante
      const Participante = await putParticipanteM(
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
        apellido,
        lugardetrabajo,
        idetnia,
        idparticipante
      );
      participantes = Participante;
      console.log("idparticipante actualizado: ", participantes);

      const docente = await postDocentesM(
        codigosace,
        nombre,
        apellido,
        identificacion,
        correo,
        iddepartamento,
        idmunicipio,
        idaldea,
        genero,
        nombreced,
        codigosaceced,
        idnivelacademicos,
        idciclosacademicos,
        zona
      );
      docentes = docente;
      console.log("iddocente: ", docentes);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idparticipante) {
        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentroeducativo,
          idparticipante,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idparticipante,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idparticipante) {
        inv = await postParticipanteInvestigacionM(
          idinvestigacion,
          idparticipante
        );
      }
    }

    // CASO 4: Existe docente y participante, pero NO existe centro educativo
    else if (!idcentroeducativo && iddocente && idparticipante) {
      console.log(
        "CASO 4: Existe docente y participante, pero NO existe centro educativo"
      );

      // Actualizar participante
      const Participante = await putParticipanteM(
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
        apellido,
        lugardetrabajo,
        idetnia,
        idparticipante
      );
      participantes = Participante;
      console.log("idparticipante actualizado: ", participantes);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idparticipante) {
        // Insertar centro educativo
        const centro = await postCentroEducativoM(
          nombreced,
          codigosaceced,
          tipoadministracion,
          tipocentro,
          zona,
          iddepartamento,
          idmunicipio,
          idaldea,
          idnivelacademicocentro
        );
        idcentro = centro;
        console.log("idCentro: ", idcentro);

        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentro,
          idparticipante,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idparticipante,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idparticipante) {
        inv = await postParticipanteInvestigacionM(
          idinvestigacion,
          idparticipante
        );
      }
    }
    // CASO 5: Existe docente y centro educativo, pero NO existe participante
    else if (!idparticipante && iddocente && idcentroeducativo) {
      console.log(
        "CASO 5: Existe docente y centro educativo, pero NO existe participante"
      );
      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idPart) {
        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentroeducativo,
          idPart,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idPart,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idPart) {
        inv = await postParticipanteInvestigacionM(idinvestigacion, idPart);
      }
    }
    // CASO 6: Existe en centro educativo, pero NO existe participante ni en docente
    else if (!iddocente && !idparticipante && idcentroeducativo) {
      console.log(
        "CASO 6: Existe en centro educativo, pero NO existe participante ni en docente"
      );
      const docente = await postDocentesM(
        codigosace,
        nombre,
        apellido,
        identificacion,
        correo,
        iddepartamento,
        idmunicipio,
        idaldea,
        genero,
        nombreced,
        codigosaceced,
        idnivelacademicos,
        idciclosacademicos,
        zona
      );
      docentes = docente;
      console.log("iddocente: ", docentes);

      const participante = await postParticipanteM(
        identificacion,
        codigosace,
        correo,
        nombre,
        apellido,
        fechanacimiento,
        edad,
        telefono,
        genero,
        idfuncion,
        idnivelacademicos,
        idgradoacademicos,
        añosdeservicio,
        codigodered,
        lugardetrabajo,
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor,
        idetnia
      );

      idPart = participante;
      console.log("idPart: ", idPart);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idPart) {
        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentroeducativo,
          idPart,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idPart,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idPart) {
        inv = await postParticipanteInvestigacionM(idinvestigacion, idPart);
      }
    }
    // CASO 7: Ya existen todos, solo agregar relaciones nuevas si es necesario
    else {
      console.log(
        "CASO 7: Ya existen todos, solo agregar relaciones nuevas si es necesario"
      );

      // Actualizar participante
      const Participante = await putParticipanteM(
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
        apellido,
        lugardetrabajo,
        idetnia,
        idparticipante
      );
      participantes = Participante;
      console.log("idparticipante actualizado: ", participantes);

      // Inserciones condicionales según el tipo
      if (tipo === "formacion" && idformacion && idparticipante) {
        // Insertar relación con centro educativo
        const relacionCed = await postCentroEducativoParticipanteM(
          idcentroeducativo,
          idparticipante,
          cargo,
          jornada,
          modalidad,
          idnivelatiende,
          idcicloatiende
        );
        ced2 = relacionCed;

        const idparticipantecentro = relacionCed;
        console.log("idparticipantecentro: ", idparticipantecentro);

        form = await postParticipanteFormacionM(
          idformacion,
          idparticipante,
          idparticipantecentro
        );
      }

      if (tipo === "investigacion" && idinvestigacion && idparticipante) {
        inv = await postParticipanteInvestigacionM(
          idinvestigacion,
          idparticipante
        );
      }
    }

    // Al final del try, ya todas las variables necesarias estarán definidas correctamente
    return res.status(201).json({
      message: "Proceso completado exitosamente.",
      docentes,
      iddocente,
      idPart,
      idparticipante,
      idcentro,
      idcentroeducativo,
      ced2,
      form,
      inv,
      participantes,
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
