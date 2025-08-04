import {
  getIdCentroEducativoSACEM,
  postCentroEducativoM,
  postCentroEducativoParticipanteM,
  putCentroEducativoM,
  putCentroEducativoParticipanteM,
} from "../models/centroeducativo.models.js";
import {
  getDocenteCodSACEM,
  getDocenteIdentificacionM,
  postDocentesM,
} from "../models/docentesDGDP.models.js";
import {
  getParticipanteIdInvestM,
  getParticipanteIdM,
  getParticipanteM,
  getParticipanteCodSACEM,
  getParticipanteIdentificacionM,
  postParticipanteM,
  putParticipanteM,
  getParticipanteIdFormacionM,
  postParticipanteFormacionM,
  getParticipanteDNIM,
  postParticipanteInvestigacionM,
  getParticipanteFormacionM,
  getParticipanteInvestigacionM,
} from "../models/Participante.models.js";

export const getParticipanteC = async (req, res) => {
  try {
    const Participante = await getParticipanteM();
    res.json(Participante);
  } catch (error) {
    console.error(
      "Error al obtener registros de acitacion del participante:",
      error
    );
    res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};

//Trae los participantes por el id
export const getParticipanteIdC = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);

    const Participante = await getParticipanteIdM(id);

    if (!Participante) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Trae los participantes por el id de la investigacion
export const getParticipanteIdInvestC = async (req, res) => {
  try {
    const { id } = req.params;
    const Participante = await getParticipanteIdInvestM(id);

    if (!Participante) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Trae los participantes por formacion
export const getParticipanteFormacionC = async (req, res) => {
  try {
    const Participante = await getParticipanteFormacionM();
    res.json(Participante);
  } catch (error) {
    console.error(
      "Error al obtener registros de los participantes y su formación:",
      error
    );
    res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};

//Trae los participantes por el id de la Formacion
export const getParticipanteIdFormacionC = async (req, res) => {
  try {
    const { id } = req.params;
    const Participante = await getParticipanteIdFormacionM(id);

    if (!Participante) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Trae los participantes por formacion
export const getParticipanteInvestigacionC = async (req, res) => {
  try {
    const Participante = await getParticipanteInvestigacionM();
    res.json(Participante);
  } catch (error) {
    console.error(
      "Error al obtener registros de los participantes y su investigación:",
      error
    );
    res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};

// Trae los participantes por el id de la Formacion o de la Investigacion
export const getParticipanteIdFormInvestC = async (req, res) => {
  try {
    const { tipo, id } = req.params;

    let Participante;

    if (tipo === "investigacion") {
      Participante = await getParticipanteIdInvestM(id);
    } else if (tipo === "formacion") {
      Participante = await getParticipanteIdFormacionM(id);
    } else {
      return res.status(400).json({
        error: "Tipo inválido. Debe ser 'investigacion' o 'formacion'.",
      });
    }

    if (!Participante || Participante.length === 0) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const postParticipanteC = async (req, res) => {
  const {
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
    deptoresidencia,
    municipioresidencia,
    aldearesidencia,
    caserio,
    datoscorrectos,
    autorizadatos,
    creadopor,
  } = req.body;
  console.log(req.body);

  try {
    const Participante = await postParticipanteM(
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
      deptoresidencia,
      municipioresidencia,
      aldearesidencia,
      caserio,
      datoscorrectos,
      autorizadatos,
      creadopor
    );

    res.json({
      message: "Participante agregado exitosamente",
      user: Participante,
    });
  } catch (error) {
    console.error("Error al insertar", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const putParticipanteC = async (req, res) => {
  const { id } = req.params;
  const {
    //datos del participamnte
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
    //datos del centro educativo
    idcentroeducativo,
    nombreced,
    codigosaceced,
    tipoadministracion,
    tipocentro,
    zona,
    iddepartamento,
    idmunicipio,
    idaldea,
    //datos de la relacion del centro educativo con el participante
    idcentropart,
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
  } = req.body;
  console.log("Datos que llega", req.body);

  let idciclosacademicos = null; // Por defecto lo dejamos en null

  // Lógica para asignar el valor a idciclosacademicos según idgradoacademicos
  if (idgradoacademicos >= 1 && idgradoacademicos <= 3) {
    idciclosacademicos = 1;
  } else if (idgradoacademicos >= 4 && idgradoacademicos <= 6) {
    idciclosacademicos = 2;
  } else if (idgradoacademicos >= 7 && idgradoacademicos <= 9) {
    idciclosacademicos = 3;
  }

  try {
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
      id
    );

    const CentroEducativo = await putCentroEducativoM(
      nombreced,
      codigosaceced,
      tipoadministracion,
      tipocentro,
      zona,
      iddepartamento,
      idmunicipio,
      idaldea,
      idcentroeducativo
    );

    const CentroEducativoPart = await putCentroEducativoParticipanteM(
      idcentroeducativo,
      id,
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
      idcentropart
    );

    res.json({
      message:
        "Datos del participante y el centro educativo actualizados correctamente",
      participante: Participante,
      centroEd: CentroEducativo,
      relacionCentroPart: CentroEducativoPart,
    });
  } catch (error) {
    console.error("Error al actualizar la acitacion del participante: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//para buscar por identificacion en tabla de docentesdgdp
export const getParticipanteIdentificacionC = async (req, res) => {
  try {
    const { filtro } = req.params;
    const Participante = await getParticipanteIdentificacionM(filtro);

    if (!Participante) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//para buscar por codigo SACE en tabla de docentesdgdp
export const getParticipanteCodSACEC = async (req, res) => {
  try {
    const { filtro } = req.params;
    const Participante = await getParticipanteCodSACEM(filtro);

    if (!Participante) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(Participante);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//filtrar por codigo SACE o por Identificacion
export const postParticipantesIFCedC = async (req, res) => {
  const {
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

    nombreced,
    codigosaceced,
    tipoadministracion,
    tipocentro,
    zona,
    iddepartamento,
    idmunicipio,
    idaldea,
    idnivelacademicocentro,

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

    idinvestigacion,
    idformacion,
  } = req.body;

  let idciclosacademicos = null;
  if (idgradoacademicos >= 1 && idgradoacademicos <= 3) {
    idciclosacademicos = 1;
  } else if (idgradoacademicos >= 4 && idgradoacademicos <= 6) {
    idciclosacademicos = 2;
  } else if (idgradoacademicos >= 7 && idgradoacademicos <= 9) {
    idciclosacademicos = 3;
  }

  try {
    const resultado1 = await getDocenteIdentificacionM(identificacion); // iddocente
    const resultado3 = await getParticipanteDNIM(identificacion); // idparticipante
    const resultado4 = await getIdCentroEducativoSACEM(codigosaceced); // idcentroeducativo

    const iddocente = resultado1;
    const idparticipante = resultado3;
    const idcentroeducativo = resultado4;

    console.log("iddocente: ", iddocente);
    console.log("idparticipante: ", idparticipante);
    console.log("idcentroeducativo: ", idcentroeducativo);

    let response = {
      docentes: null,
      participantes: null,
      formacion: null,
      investigacion: null,
      ced: null,
      ced2: null,
    };

    // CASO 1: No existe docente, ni participante, ni centro educativo
    if (!iddocente && !idparticipante && !idcentroeducativo) {
      // Insertar docente
      const docente = await postDocentesM(
        codigosace,
        nombre,
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
      response.docentes = docente;

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
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor
      );
      response.participantes = participante;

      const idPart = participante;
      console.log("idPart: ", idPart);

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
      response.ced = centro;

      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idPart, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }
    // CASO 2: Existe docente, pero no participante ni centro educativo
    else if (iddocente && !idparticipante && !idcentroeducativo) {
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
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor
      );
      response.participantes = participante;

      const idPart = participante;

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
      response.ced = centro;

      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idPart, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }

    // CASO 3: No existe docente, pero sí existe participante y centro educativo
    else if (!iddocente && idparticipante && idcentroeducativo) {
      const docente = await postDocentesM(
        codigosace,
        nombre,
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
      response.docentes = docente;

      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idparticipante, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }
    // CASO 4: Existe docente y participante, pero NO existe centro educativo
    else if (iddocente && idparticipante && !idcentroeducativo) {
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
      response.ced = centro;

      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idparticipante, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }


    // CASO 5: Existe docente y centro educativo, pero NO existe participante
    else if (iddocente && !idparticipante && idcentroeducativo) {
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
        deptoresidencia,
        municipioresidencia,
        aldearesidencia,
        caserio,
        datoscorrectos,
        autorizadatos,
        creadopor
      );
      response.participantes = participante;

      const idPart = participante;

      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idPart, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }
    // CASO 6: Ya existen todos, solo agregar relaciones nuevas si es necesario
    else {
      // Insertar relación con centro educativo
      const relacionCed = await postCentroEducativoParticipanteM(
        centro,
        idPart,
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
      );
      response.ced2 = relacionCed;
      
      const idparticipantecentro = relacionCed;
      console.log("idparticipantecentro: ", idparticipantecentro);

      // Insertar formaciones
      if (Array.isArray(idformacion)) {
        response.formacion = [];
        for (const form of idformacion) {
          const r = await postParticipanteFormacionM(form, idparticipante, idparticipantecentro);
          response.formacion.push(r);
        }
      }
    }

    return res.status(201).json({
      message: "Proceso completado exitosamente.",
      ...response,
    });
  } catch (error) {
    console.error("Error al registrar participante:", error);
    return res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
