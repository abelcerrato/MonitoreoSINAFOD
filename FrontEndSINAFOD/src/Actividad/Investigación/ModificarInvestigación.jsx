import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tab,
  Tabs,
  FormHelperText,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { color } from "../../Components/color";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Swal from "sweetalert2";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

const Investigacion = () => {
  const { user } = useUser();

  const { id } = useParams();

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    investigacion: "",
    tipoactividad: "",
    existeconvenio: null,
    institucionconvenio: "",
    presupuesto: "",
    tipomoneda: "Lempira",
    duracion: "",
    funciondirigido: "",
    prebasica: false,
    basica: false,
    media: false,
    primerciclo: false,
    segundociclo: false,
    tercerciclo: false,
    btp1: false,
    btp2: false,
    btp3: false,
    bch1: false,
    bch2: false,
    bch3: false,
    fechainicio: "",
    fechafinal: "",
    direccion: "",
    socializaron: "",
    observacion: "",
    creadopor: user.id,
    modificadopor: user.id,
  });

  const [fieldErrors, setFieldErrors] = useState({
    fechainicio: false,
    fechafinal: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/investigacion/${id}`
        );
        const data = response.data[0];
        const dia = data.duracion?.days || 0;
        const mes = data.duracion?.months || 0;
        const año = data.duracion?.years || 0;

        setFormData({
          ...data,
          dia: data.duracion?.days || 0,
          mes: data.duracion?.months || 0,
          año: data.duracion?.years || 0,
          duracion: `${año} years ${mes} months ${dia} days`,
          fechainicio: data.fechainicio ? data.fechainicio.split("T")[0] : "",
          fechafinal: data.fechafinal ? data.fechafinal.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    obtenerDetalles();
  }, [id]);

  const validarDuracion = ({ año, mes, dia }) => {
    const numAño = Number(año) || 0;
    const numMes = Number(mes) || 0;
    const numDia = Number(dia) || 0;

    const atLeastOne = numAño > 0 || numMes > 0 || numDia > 0;
    const errorAño = isNaN(numAño) || numAño < 0;
    const errorMes = isNaN(numMes) || numMes < 0 || numMes > 12;
    const errorDia = isNaN(numDia) || numDia < 0;

    const errores = {
      año: !atLeastOne || errorAño,
      mes: !atLeastOne || errorMes,
      dia: !atLeastOne || errorDia,
    };

    const tieneErrores = errores.año || errores.mes || errores.dia;
    const duracion = !tieneErrores
      ? `${numAño} years ${numMes} months ${numDia} days`
      : "";

    return { errores, duracion };
  };
  const translateDuracion = (duracion) => {
    if (!duracion) return "";
    return duracion
      .replace(/years?/g, "años")
      .replace(/months?/g, "meses")
      .replace(/days?/g, "días");
  };
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const sanitizedValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => {
      let newData = { ...prevData, [name]: sanitizedValue };

      if (type !== "checkbox") {
        const isEmpty = String(sanitizedValue || "").trim() === "";
        setFieldErrors((prev) => ({ ...prev, [name]: isEmpty }));
      }

      // Limpiar ciclos si se desactiva "basica"
      if (name === "basica" && !sanitizedValue) {
        newData.primerciclo = false;
        newData.segundociclo = false;
        newData.tercerciclo = false;
      }

      // Limpiar convenios si se cambia a Interna
      if (name === "tipoactividad" && sanitizedValue === "Interna") {
        newData.institucionconvenio = "";
        newData.existeconvenio = "";
        setFieldErrors((prev) => ({
          ...prev,
          institucionconvenio: false,
          existeconvenio: false,
        }));
      }

      // Validación de fechas
      if (name === "fechainicio" || name === "fechafinal") {
        const isValidDate =
          sanitizedValue && !isNaN(new Date(sanitizedValue).getTime());
        if (isValidDate) {
          newData[name] = new Date(sanitizedValue).toISOString().split("T")[0];
        } else {
          newData[name] = "";
        }

        const { fechainicio, fechafinal } = newData;
        const fechaError =
          fechainicio &&
          fechafinal &&
          new Date(fechainicio) > new Date(fechafinal);

        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          fechainicio: !fechainicio || fechaError,
          fechafinal: !fechafinal || fechaError,
        }));

        if (fechaError) {
          setError(
            "La fecha de inicio no puede ser posterior a la fecha de finalización."
          );
        } else {
          setError("");
        }
      }

      // Validación de duración
      if (["año", "mes", "dia"].includes(name)) {
        if (!/^[0-9]*$/.test(value)) return prevData;
        newData[name] = value === "" ? "" : Number(value);

        const { errores, duracion } = validarDuracion(newData);
        setFieldErrors((prev) => ({ ...prev, ...errores }));
        if (duracion) {
          newData.duracion = duracion;
        }
      }

      return newData;
    });
  };
  const handleSave = async () => {
    const requiredFields = [
      "investigacion",
      "tipoactividad",
      "socializaron",
      "presupuesto",
      "tipomoneda",
      "funciondirigido",
      "fechafinal",
      "fechainicio",
    ];

    let errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) errors[field] = true;
    });

    // Validación duración
    const { errores: duracionErrores } = validarDuracion(formData);
    errors = { ...errors, ...duracionErrores };

    // Validación fecha
    if (formData.fechainicio && formData.fechafinal) {
      const inicio = new Date(formData.fechainicio);
      const fin = new Date(formData.fechafinal);
      if (inicio > fin) {
        errors.fechainicio = true;
        errors.fechafinal = true;
        setFieldErrors(errors);
        Swal.fire({
          title: "¡Advertencia!",
          text: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
          icon: "warning",
          timer: 6000,
        });
        return;
      }
    }

    if (Object.values(errors).some((e) => e)) {
      setFieldErrors(errors);
      Swal.fire({
        title: "Campos obligatorios",
        text: "Llenar los campos en rojo",
        icon: "warning",
        timer: 6000,
      });
      return;
    }

    // Validación fecha
    const { fechainicio, fechafinal } = formData;
    const fechaInicioValida =
      fechainicio && !isNaN(new Date(fechainicio).getTime());
    const fechaFinalValida =
      fechafinal && !isNaN(new Date(fechafinal).getTime());

    if (fechaInicioValida && fechaFinalValida) {
      const inicio = new Date(fechainicio);
      const fin = new Date(fechafinal);

      if (inicio > fin) {
        errors.fechainicio =
          "La fecha de inicio no puede ser posterior a la final.";
        errors.fechafinal =
          "La fecha de finalización debe ser posterior a la de inicio.";
      }
    }

    // Validación de booleanos mínimos
    const trueCount = [
      formData.presentoprotocolo,
      formData.monitoreoyevaluacion,
      formData.aplicacionevaluacion,
      formData.divulgacionresultadosurl,
    ].filter(Boolean).length;

    if (trueCount < 4) {
      const result = await Swal.fire({
        title: "Confirmación",
        text: `¿Está seguro de actualizar esta investigación con solo ${trueCount} de los 3 lineamientos requeridos?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: color.primary.azul,
        cancelButtonColor: color.primary.rojo,
        confirmButtonText: "Sí, Actualizar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    }

    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" && key !== "investigacion" ? null : value,
      ])
    );

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/investigacion/${id}`,
        cleanedFormData,
        { headers: { "Content-Type": "application/json" } }
      );

      await Swal.fire(
        "Actualización!",
        "La investigación ha sido actualizada",
        "success"
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire("¡Error!", "Error al guardar datos", "error");
    }
  };

  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: color.primary.azul }}
          >
            Actualizar Datos sobre la Investigación
          </Typography>

          <Grid
            container
            spacing={1}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
          >
            <Grid>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.azul }}
                startIcon={<Groups2OutlinedIcon />}
                onClick={() =>
                  navigate("/Participantes", {
                    state: { formacioninvest: "investigacion", investCap: id },
                  })
                }
              >
                INVESTIGADORES
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                sx={{ backgroundColor: color.primary.azul }}
                startIcon={<ChecklistIcon />}
                onClick={() =>
                  navigate(`/Actualizar_Lineamientos_De_Investigación/${id}`)
                }
              >
                Lineamientos
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                sx={{
                  borderColor: color.primary.rojo,
                  color: color.primary.rojo,
                }}
                onClick={() => navigate("/Listado_De_Investigaciones")}
              >
                Cerrar
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={5} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Título del Proyecto</Typography>
              <TextField
                fullWidth
                name="investigacion"
                value={formData.investigacion}
                onChange={handleChange}
                error={fieldErrors.investigacion}
                helperText={
                  fieldErrors.investigacion ? "Este campo es obligatorio" : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                ¿La Investigación Es Interna o Externa?
              </Typography>
              <FormControl fullWidth error={fieldErrors.tipoactividad}>
                <Select
                  name="tipoactividad"
                  value={formData.tipoactividad}
                  onChange={handleChange}
                >
                  <MenuItem value="Interna">Interna</MenuItem>
                  <MenuItem value="Externa">Externa</MenuItem>
                </Select>
                {fieldErrors.tipoactividad && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {formData.tipoactividad === "Externa" && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Nombre de la Institución Asociada
                  </Typography>
                  <TextField
                    fullWidth
                    name="institucionconvenio"
                    value={formData.institucionconvenio}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    Tiene Convenio la Institución Asociada
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="existeconvenio"
                      value={formData.existeconvenio}
                      onChange={handleChange}
                    >
                      <MenuItem value="true">Sí</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Presupuesto</Typography>
              <TextField
                fullWidth
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                error={fieldErrors.presupuesto}
                helperText={
                  fieldErrors.presupuesto ? "Este campo es obligatorio" : ""
                }
                type="number"
                inputProps={{ min: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      error={fieldErrors.tipomoneda}
                    >
                      <TextField
                        select
                        name="tipomoneda"
                        value={formData.tipomoneda}
                        onChange={handleChange}
                        variant="standard"
                        SelectProps={{ disableUnderline: true }}
                      >
                        <MenuItem value="Lempira">HNL</MenuItem>
                        <MenuItem value="Dolar">USD</MenuItem>
                        <MenuItem value="Euro">EUR</MenuItem>
                      </TextField>
                      {fieldErrors.tipomoneda && (
                        <FormHelperText>
                          Este campo es obligatorio
                        </FormHelperText>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Duración</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    variant="outlined"
                    label="Años"
                    fullWidth
                    type="text"
                    name="año"
                    value={formData.año || ""}
                    onChange={handleChange}
                    error={fieldErrors.año} // Aquí indicamos que el campo tiene error
                    helperText={
                      fieldErrors.año
                        ? "Por favor ingresa un número válido para el año."
                        : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    variant="outlined"
                    label="Meses"
                    fullWidth
                    type="text"
                    name="mes"
                    value={formData.mes || ""}
                    onChange={handleChange}
                    error={fieldErrors.mes} // Aquí indicamos que el campo tiene error
                    helperText={
                      fieldErrors.mes ? "El mes debe estar entre 0 y 12." : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    variant="outlined"
                    label="Días"
                    fullWidth
                    type="text"
                    name="dia"
                    value={formData.dia || ""}
                    onChange={handleChange}
                    error={fieldErrors.dia} // Aquí indicamos que el campo tiene error
                    helperText={
                      fieldErrors.dia
                        ? "Por favor ingresa un número válido para el día."
                        : ""
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    variant="outlined"
                    label="(Año-Mes-Día)"
                    fullWidth
                    name="duracion"
                    value={translateDuracion(formData.duracion) || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Población Objetivo</Typography>
              <TextField
                fullWidth
                name="funciondirigido"
                value={formData.funciondirigido}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Nivel Educativo</Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.prebasica}
                        onChange={handleChange}
                        name="prebasica"
                      />
                    }
                    label="Prebásica"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.basica}
                        onChange={handleChange}
                        name="basica"
                      />
                    }
                    label="Básica"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.media}
                        onChange={handleChange}
                        name="media"
                      />
                    }
                    label="Media"
                  />
                </Grid>
              </Grid>
            </Grid>

            {formData.basica === true && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Ciclo Educativo</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.primerciclo}
                          onChange={handleChange}
                          name="primerciclo"
                        />
                      }
                      label="Primer Ciclo"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.segundociclo}
                          onChange={handleChange}
                          name="segundociclo"
                        />
                      }
                      label="Segundo Ciclo"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.tercerciclo}
                          onChange={handleChange}
                          name="tercerciclo"
                        />
                      }
                      label="Tercer Ciclo"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {formData.media === true && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Grados Académicos ()
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp1}
                          onChange={handleChange}
                          name="btp1"
                        />
                      }
                      label="BTP 1"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp2}
                          onChange={handleChange}
                          name="btp2"
                        />
                      }
                      label="BTP 2"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.btp3}
                          onChange={handleChange}
                          name="btp3"
                        />
                      }
                      label="BTP 3"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch1}
                          onChange={handleChange}
                          name="bch1"
                        />
                      }
                      label="BCH 1"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch2}
                          onChange={handleChange}
                          name="bch2"
                        />
                      }
                      label="BCH 2"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.bch3}
                          onChange={handleChange}
                          name="bch3"
                        />
                      }
                      label="BCH 3"
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Fecha de Inicio</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechainicio"
                value={formData.fechainicio || ""}
                onChange={handleChange}
                error={fieldErrors.fechainicio}
                helperText={
                  fieldErrors.fechainicio ? "Este campo es obligatorio" : ""
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Fecha de Finalización</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechafinal"
                value={formData.fechafinal || ""}
                error={fieldErrors.fechafinal} // Aquí se activa el error
                helperText={
                  fieldErrors.fechafinal ? "Este campo es obligatorio" : ""
                }
                inputProps={{
                  min: formData.fechainicio || "",
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Ubicación</Typography>
              <TextField
                fullWidth
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                /* error={fieldErrors.direccion}
                            helperText={fieldErrors.direccion ? "Este campo es obligatorio" : ""} */
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                ¿Se realizó convocatoria?
              </Typography>
              <FormControl fullWidth error={fieldErrors.socializaron}>
                <Select
                  name="socializaron"
                  value={formData.socializaron}
                  onChange={handleChange}
                >
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
                {fieldErrors.socializaron && (
                  <FormHelperText>Este campo es obligatorio</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Observación</Typography>
              <TextField
                fullWidth
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box
            sx={{ marginTop: 5, display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: color.primary.azul, ml: 5 }}
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Guardar
            </Button>
          </Box>
        </Paper>
      </Dashboard>
    </>
  );
};

export default Investigacion;
