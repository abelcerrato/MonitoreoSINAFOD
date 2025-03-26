import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs"
import Dashboard from "../Dashboard/dashboard";
import PropTypes from "prop-types";
import { color } from "../Components/color";
import { FaRegFileExcel } from "react-icons/fa";
import LogoCONED from "../Components/img/logos_CONED.png"
import LogoDGDP from "../Components/img/Logo_DGDP.png"
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import {
    IconButton,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    Paper,
    Tooltip,
    Typography,
    Select,
    MenuItem,
    FormControl,
    TextField,
    Grid,
    InputLabel
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";


const toBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};



const ListadoActividad = () => {
    const [rows, setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [filteredRows, setFilteredRows] = useState([]);
    const [filterColumn, setFilterColumn] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [niveles, setNiveles] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");


    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    useEffect(() => {
        // Obtener los datos de los participantes después de guardar
        axios
            .get(`${process.env.REACT_APP_API_URL}/investC`)
            .then((response) => {
                setRows(response.data);
                setFilteredRows(response.data);
                console.log(response.data);

            })
            .catch((error) => {
                console.error("Error al obtener los datos:", error);
            });
    }, []);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`).then(response => setNiveles(response.data));
        axios.get(`${process.env.REACT_APP_API_URL}/ciclosAcademicos`).then(response => setCiclos(response.data));

    }, []);



    useEffect(() => {
        console.log(" FilterColumn:", filterColumn);
        console.log(" FilterValue:", filterValue);
        console.log("📋 Filas originales:", rows);

        if (!filterColumn || (!filterValue && !fechaInicio && !fechaFinal)) {
            setFilteredRows(rows);
        } else {
            const filtered = rows.filter(row => {
                if (filterColumn === "fecha") {
                    const fechaInicioRow = row.fechainicio ? new Date(row.fechainicio).toISOString().split("T")[0] : null;
                    const fechaFinalRow = row.fechafinal ? new Date(row.fechafinal).toISOString().split("T")[0] : null;

                    const fechaInicioInput = fechaInicio ? new Date(fechaInicio) : null;
                    const fechaFinalInput = fechaFinal ? new Date(fechaFinal) : null;

                    if (!fechaInicioInput || !fechaFinalInput || !fechaInicioRow || !fechaFinalRow) {
                        return false;
                    }

                    const fechaInicioRowDate = new Date(fechaInicioRow);
                    const fechaFinalRowDate = new Date(fechaFinalRow);

                    const isInRange = fechaInicioRowDate >= fechaInicioInput && fechaFinalRowDate <= fechaFinalInput;

                    return isInRange;
                } else {
                    console.log(" Filtrando por:", filterColumn, "con valor:", filterValue);
                    console.log(" Valor en la fila:", row[filterColumn]);

                    return row[filterColumn]?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
                }
            });

            console.log(" Filas filtradas:", filtered);
            setFilteredRows(filtered);
        }
    }, [filterColumn, filterValue, fechaInicio, fechaFinal, rows]);





    const exportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Capacitaciones");
            // Convertir imágenes a base64 (si es necesario)
            const image1Base64 = await toBase64(LogoCONED);
            const image2Base64 = await toBase64(LogoDGDP);


            // Agregar imágenes
            const image1 = workbook.addImage({
                base64: image1Base64,
                extension: "png",
            });
            const image2 = workbook.addImage({
                base64: image2Base64,
                extension: "png",
            });

            // Insertar las imágenes en el archivo Excel
            worksheet.addImage(image1, "A1:B7");
            worksheet.addImage(image2, "E1:F5");


            // Definir el título
            worksheet.mergeCells("A8:F8");
            const title = worksheet.getCell("A8");
            title.value = "Listado de Capacitaciones";
            title.font = { size: 16, bold: true };
            title.alignment = { horizontal: "center", vertical: "middle" };

            // Agregar fecha y hora
            const fechaHoraActual = dayjs().format("DD/MM/YYYY  hh:mm A");
            worksheet.mergeCells("A9:E9");
            const title2 = worksheet.getCell("A9");
            title2.value = ` Fecha y hora de generación: ${fechaHoraActual}`;
            title2.font = { size: 10, italic: true };
            title2.alignment = { horizontal: "left", vertical: "middle" };

            // Espacio en blanco entre regionales
            worksheet.addRow([]);
            // Definir encabezados de la tabla
            const headers = [
                "ID", "Nombre de la Acción o Formación", "Formación o Investigación", "Institución Responsable", "Responsable de Firmas", "Ambito de Formación",
                "Tipo de Formación", "Modalidad", "Duración", "	Espacio Físico", "Cargo al que va Dirigido", "Nicel Educativo",
                "Ciclo Académico", "Estado", "Fecha Inicio", "Fecha de Finalización", "Cantidad de Participantes Programados",
                "Dirección", "Zona", "Observación"

            ];

            const colorPrimarioAzul = color.primary.azul;
            // Agregar encabezados a la primera fila
            const headerRow = worksheet.addRow(headers);
            headerRow.font = { bold: true, color: { argb: "FFFFFF" } }; // Texto en blanco

            // Aplicar color de fondo al encabezado
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: colorPrimarioAzul.replace("#", "") }  // Azul oscuro
                };
                cell.alignment = { horizontal: "center", vertical: "middle" }; // Centrar texto
            });
            // Agregar los datos como filas en la tabla
            filteredRows.forEach(item => {
                worksheet.addRow([
                    item.id, item.accionformacion, item.formacioninvest, item.institucionresponsable, item.responsablefirmas, item.ambitoformacion,
                    item.tipoformacion, item.modalidad, item.duracion ? `${item.duracion?.hours ?? 0}h ${item.duracion?.minutes ?? 0}m` : "0h 0m", item.espaciofisico, item.funciondirigido,
                    item.nivelacademico ?? "-", item.cicloacademico ?? "-", item.estado, item.fechainicio ? new Date(item.fechainicio).toLocaleDateString("es-ES") : "-", item.fechafinal ? new Date(item.fechafinal).toLocaleDateString("es-ES") : "-",
                    item.participantesprog, item.direccion, item.zona, item.observacion,
                ]);
            });

            // Ajustar ancho de columnas
            worksheet.columns.forEach((column, index) => {
                column.width = index === 0 ? 5 : 15; // Si es la primera columna (index 0), ancho 5, el resto 20
                column.alignment = { wrapText: true, vertical: "middle" };
            });


            // Generar y descargar el archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Reporte_Capacitaciones.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error al exportar a Excel:", error);
        }
    };


    return (
        <Dashboard>
            <Paper sx={{ padding: 3, marginBottom: 3 }}>

                <Typography variant="h2" sx={{ color: color.primary.azul, mb: 5 }}>
                    Listado de Capacitaciones
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Columna</InputLabel>
                            <Select
                                label="Columna"
                                onChange={(e) => setFilterColumn(e.target.value)}
                            >
                                <MenuItem value="" >Seleccionar columna</MenuItem >
                                <MenuItem value="accionformacion">Nombre de la Acción o Formación</MenuItem >
                                <MenuItem value="formacioninvest">Formación o Investigación</MenuItem >
                                <MenuItem value="institucionresponsable">Institución Responsable</MenuItem >
                                <MenuItem value="responsablefirmas">Responsable de Firmas</MenuItem >
                                <MenuItem value="ambitoformacion">Ambito de Formación</MenuItem >
                                <MenuItem value="tipoformacion">Tipo de Formación</MenuItem >
                                <MenuItem value="modalidad">Modalidad</MenuItem >
                                <MenuItem value="duracion">Duración</MenuItem >
                                <MenuItem value="espaciofisico">Espacio Físico</MenuItem >
                                <MenuItem value="funciondirigido">Cargo a la que va dirigido</MenuItem >
                                <MenuItem value="nivelacademico">Nivel Educativo</MenuItem >
                                <MenuItem value="cicloacademico">Ciclo Académico</MenuItem >
                                <MenuItem value="estado">Estado</MenuItem >
                                <MenuItem value="fecha">Fecha</MenuItem >
                                <MenuItem value="participantesprog">Cantidad de Participantes Programados</MenuItem >
                                <MenuItem value="zona">Zona</MenuItem >

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {filterColumn === "formacioninvest" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="Formacion">Formación</MenuItem>
                                    <MenuItem value="Investigacion">Investigación</MenuItem>
                                </Select>
                            </FormControl>
                        ) : filterColumn === "tipoformacion" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="Taller">Taller</MenuItem>
                                    <MenuItem value="Seminario">Seminario</MenuItem>
                                    <MenuItem value="Curso">Curso</MenuItem>
                                    <MenuItem value="Diplomado">Diplomado</MenuItem>
                                </Select>
                            </FormControl>
                        ) : filterColumn === "modalidad" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Presencial">Presencial</MenuItem>
                                    <MenuItem value="Híbrido">Híbrido</MenuItem>
                                </Select>
                            </FormControl>
                        ) : filterColumn === "estado" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="Planificada">Planificada</MenuItem>
                                    <MenuItem value="En Curso">En Curso</MenuItem>
                                    <MenuItem value="Suspendida">Suspendida</MenuItem>
                                    <MenuItem value="Completada">Completada</MenuItem>
                                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                                </Select>
                            </FormControl>
                        ) : filterColumn === "nivelacademico" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="">Seleccionar un nivel</MenuItem >
                                    {niveles.map(niv => <MenuItem key={niv.id} value={niv.nombre}>{niv.nombre}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "cicloacademico" ? (
                            <FormControl fullWidth>
                                <Select
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <MenuItem value="">Seleccionar un ciclo</MenuItem >
                                    {ciclos.map(cil => <MenuItem key={cil.id} value={cil.nombre}>{cil.nombre}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "zona" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar zona</MenuItem >
                                    <MenuItem value="Rural">Rural</MenuItem >
                                    <MenuItem value="Urbana">Urbana</MenuItem >
                                </Select>
                            </FormControl>
                        ) : filterColumn === "fecha" ? (
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={5}>
                                    <FormControl fullWidth>
                                        <TextField
                                            type="date"
                                            label="Fecha inicio"
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <FormControl fullWidth>
                                        <TextField
                                            type="date"
                                            label="Fecha final"
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e) => setFechaFinal(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        ) : (
                            <TextField type="text" placeholder="Ingresar valor" onChange={(e) => setFilterValue(e.target.value)} />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4} container justifyContent="flex-end">
                        <Tooltip title="Exportar Excel">
                            <IconButton
                                onClick={() => exportExcel(rows)}
                                aria-label="exportar Excel"
                                sx={{ fontSize: 40, color: color.primary.azul }}
                            >
                                <FaRegFileExcel />
                            </IconButton>
                        </Tooltip>
                    </Grid>



                </Grid>

                <TableContainer component={Paper} sx={{ marginTop: 5 }}>

                    <Table sx={{ minWidth: 500 }}>
                        <TableHead sx={{ backgroundColor: color.primary.azul }}>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: "bold" }}>
                                    ID
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Nombre de la Acción o Formación
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Formación o Investigación
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Institución Responsable</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Responsable de Firmas</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Ambito de Formación</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Tipo de Formación</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Modalidad
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Duración</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Espacio Físico</TableCell>

                                <TableCell align="right" style={{ fontWeight: "bold" }}>Cargo al que va Dirigido</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Nicel Educativo</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Ciclo</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Estado
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Fecha Inicio
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>
                                    Fecha de Finalización
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Cantidad de Participantes Programados</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Dirección</TableCell>
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Zona</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (


                                <TableRow key={row.idinvestigacioncap}>
                                    <TableCell style={{ width: 160 }} align="center">
                                        {row.id}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.accionformacion}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.formacioninvest}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.institucionresponsable}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.responsablefirmas}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.ambitoformacion}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.tipoformacion}
                                    </TableCell>

                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.modalidad}
                                    </TableCell>
                                    <TableCell cstyle={{ width: 160 }} align="right">
                                        {
                                            row.duracion ? `${row.duracion?.hours ?? 0}h ${row.duracion?.minutes ?? 0}m` : "0h 0m"
                                        }
                                    </TableCell>

                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.espaciofisico}
                                    </TableCell>

                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.funciondirigido}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.nivelacademico}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.cicloacademico}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.estado}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {new Date(row.fechainicio).toISOString().split("T")[0].split("-").reverse().join("/")}

                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {new Date(row.fechafinal).toISOString().split("T")[0].split("-").reverse().join("/")}

                                    </TableCell>


                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.participantesprog}
                                    </TableCell>

                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.direccion}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.zona}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                    colSpan={18}
                                    count={filteredRows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                "aria-label": "Filas por página",
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>

        </Dashboard>
    )
}

export default ListadoActividad;