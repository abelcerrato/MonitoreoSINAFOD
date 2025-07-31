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
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../../Dashboard/dashboard";
import { useUser } from "../../Components/UserContext";

import Swal from "sweetalert2";

const Investigacion = () => {
  const { user } = useUser();
  const location = useLocation();
  const [investCapId, setInvestCapId] = useState(null);
  const { uploadedFilesCount, totalRequiredFiles } = location.state || {};

  const [isFromLineamientos, setIsFromLineamientos] = useState(false);
  const [formData, setFormData] = useState({
    investigacion: location.state?.investigacion || "",
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

  const validarDuracion = ({ año, mes, dia }) => {
    const numAño = Number(año) || 0;
    const numMes = Number(mes) || 0;
    const numDia = Number(dia) || 0;

    const atLeastOne = numAño > 0 || numMes > 0 || numDia > 0;
    const errorAño = isNaN(numAño) || numAño < 0;
    const errorMes = isNaN(numMes) || numMes < 0 || numMes > 12;
    const errorDia = isNaN(numDia) || numDia < 0 || numDia > 31;

    const errores = {
      año: !atLeastOne || errorAño,
      mes: !atLeastOne || errorMes,
      dia: !atLeastOne || errorDia,
    };

    const tieneErrores = errores.año || errores.mes || errores.dia;

    const duracion = !tieneErrores
      ? `${numAño} years ${numMes} months ${numDia} days`
      : "";

    return { errores, duracion, atLeastOne };
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

    const { errores: erroresDuracion, atLeastOne } = validarDuracion(formData);
    errors = { ...errors, ...erroresDuracion };
    setFieldErrors(errors);

    if (Object.values(errors).some((val) => val)) {
      Swal.fire({
        title: "Error en los campos",
        text: !atLeastOne
          ? "Debe ingresar al menos un valor en año, mes o día"
          : "Revise los campos marcados en rojo",
        icon: "warning",
        timer: 6000,
        confirmButtonColor: color.primary.azul,
      });
      return;
    }

    const año = Number(formData.año) || 0;
    const mes = Number(formData.mes) || 0;
    const dia = Number(formData.dia) || 0;

    const cleanedFormData = {
      ...formData,
      año,
      mes,
      dia,
      ...Object.fromEntries(
        Object.entries(formData)
          .filter(([key]) => !["año", "mes", "dia"].includes(key))
          .map(([key, value]) => [
            key,
            value === "" && key !== "investigacion" ? null : value,
          ])
      ),
    };

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

    try {
      let idToUse = investCapId;
      let response;

      if (!idToUse) {
        const confirmResult = await Swal.fire({
          title: "Lineamientos Incompletos",
          text: `Solo has subido 0 de 3 lineamientos requeridos. ¿Deseas continuar con el registro?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: color.primary.azul,
          cancelButtonColor: color.primary.rojo,
          confirmButtonText: "Sí, Registrar",
          cancelButtonText: "No, cancelar",
          reverseButtons: true,
        });

        if (!confirmResult.isConfirmed) return;
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/investigacion`,
          cleanedFormData,
          { headers: { "Content-Type": "application/json" } }
        );
        idToUse = response.data.id;
      } else {
        const confirmResult = await Swal.fire({
          title: "Lineamientos Incompletos",
          text: `Solo has subido ${uploadedFilesCount} de ${totalRequiredFiles} lineamientos requeridos. ¿Deseas continuar con el registro?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: color.primary.azul,
          cancelButtonColor: color.primary.rojo,
          confirmButtonText: "Sí, Registrar",
          cancelButtonText: "No, cancelar",
          reverseButtons: true,
        });

        if (!confirmResult.isConfirmed) return;
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/investigacion/${idToUse}`,
          cleanedFormData,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      await Swal.fire({
        title: "¡Guardado!",
        text: "La investigación ha sido registrada",
        icon: "success",
        timer: 6000,
        confirmButtonColor: color.primary.azul,
      });

      navigate("/Participantes", {
        state: {
          investCap: idToUse,
          formacioninvest: "investigacion",
        },
      });
    } catch (error) {
      console.error("Error al guardar los datos", error);
      Swal.fire("¡Error!", "Error al guardar datos", "error");
    }
  };

  // Efecto para capturar el ID si viene del flujo "Guardar"
  useEffect(() => {
    if (location.state?.investCap) {
      setInvestCapId(location.state.investCap);
      setIsFromLineamientos(true);
      // Si viene con título desde lineamientos, actualiza el formData
      if (location.state.investigacion) {
        setFormData((prev) => ({
          ...prev,
          investigacion: location.state.investigacion,
        }));
      }
    }
  }, [location.state]);

  return (
    <>
      <Dashboard>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: color.primary.azul }}
              >
                Registro de Datos sobre la Investigación
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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

          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">
                Título de la Investigación
              </Typography>
              <TextField
                fullWidth
                name="investigacion"
                value={formData.investigacion}
                onChange={handleChange}
                error={fieldErrors.investigacion}
                helperText={
                  fieldErrors.investigacion ? "Este campo es obligatorio" : ""
                }
                disabled={isFromLineamientos} // Deshabilita si viene de lineamientos
                InputProps={{
                  readOnly: isFromLineamientos, // Hace que sea solo lectura
                }}
              />
              {isFromLineamientos && (
                <Typography variant="caption" color="info">
                  Este campo fue definido en los lineamientos
                </Typography>
              )}
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
                type="number"
                error={fieldErrors.presupuesto}
                helperText={
                  fieldErrors.presupuesto ? "Este campo es obligatorio" : ""
                }
                inputProps={{ min: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
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
                error={fieldErrors.funciondirigido}
                helperText={
                  fieldErrors.funciondirigido ? "Este campo es obligatorio" : ""
                }
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1">Fecha de Inicio</Typography>
              <TextField
                fullWidth
                type="date"
                name="fechainicio"
                value={formData.fechainicio || ""}
                onChange={handleChange}
                error={Boolean(fieldErrors.fechainicio)}
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
                onChange={handleChange}
                error={Boolean(fieldErrors.fechafinal)}
                helperText={
                  fieldErrors.fechafinal ? "Este campo es obligatorio" : ""
                }
                inputProps={{
                  min: formData.fechainicio || "",
                }}
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
