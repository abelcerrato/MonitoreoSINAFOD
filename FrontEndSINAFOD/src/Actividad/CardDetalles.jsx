import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const CardDetalles = ({ open, handleClose, id }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const obtenerDetalles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/investC/${id}`);


        const data = response.data[0]; // Extraemos solo el primer objeto
        console.log(data);

        setData(data); // Guardamos solo el primer objeto
      } catch (error) {
        console.error("Error al obtener los detalles", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalles();
  }, [open, id]);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.1)" }, // Hace el fondo más transparente
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Hace el modal semi-transparente
          boxShadow: "none",
          backdropFilter: "blur(5px)", // Aplica desenfoque al fondo
        },
      }}
    >
      <DialogTitle>Detalles de la Acción</DialogTitle>
      <IconButton
        color="error"
        onClick={handleClose}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Card>
          <CardContent>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <Table>
                <TableBody>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell >{data.id}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>  Nombre de la Acción o Formación</TableCell>
                    <TableCell >{data.accionformacion}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Formación o Investigación
                    </TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.formacioninvest}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Institución Responsable</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.institucionresponsable}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Responsable de Firmas</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.responsablefirmas}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Ambito de Formación</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.ambitoformacion}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}> Tipo de Formación</TableCell>
                    <TableCell >{data.tipoformacion}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Modalidad
                    </TableCell>
                    <TableCell >{data.modalidad}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Duración</TableCell>
                    <TableCell cstyle={{ width: 160 }} >
                      {
                        data.duracion ? `${data.duracion?.hours ?? 0}h ${data.duracion?.minutes ?? 0}m` : "0h 0m"
                      }

                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Espacio Físico</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.espaciofisico}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Cargo a la que va dirigido</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.funciondirigido}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Nivel Educativo</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.nivelacademico}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Ciclo Educativo</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.cicloacademico}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Estado</TableCell>
                    <TableCell >{data.estado}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Fecha Inicio
                    </TableCell>
                    <TableCell > {new Date(data.fechainicio).toLocaleDateString("es-ES")}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Fecha Final
                    </TableCell>
                    <TableCell > {new Date(data.fechafinal).toLocaleDateString("es-ES")}</TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Cantidad de Participantes Programados</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.participantesprog}
                    </TableCell>
                  </TableRow>
                  {/*     <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Participantes que Asistieron</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.participantesrecib}
                    </TableCell>
                  </TableRow> */}
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Dirección</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.direccion}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Zona</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.zona}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" } }}>
                    <TableCell style={{ fontWeight: "bold" }}>Observación</TableCell>
                    <TableCell style={{ width: 160 }} >
                      {data.observacion}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetalles;
