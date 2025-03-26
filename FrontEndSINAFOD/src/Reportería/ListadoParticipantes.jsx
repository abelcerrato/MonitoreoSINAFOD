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
    Grid
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



const ListadoParticipantes = () => {
    const [rows, setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [filteredRows, setFilteredRows] = useState([]);
    const [filterColumn, setFilterColumn] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [grados, setGrados] = useState([]);


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
            .get(`${process.env.REACT_APP_API_URL}/CapacitacionP`)
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
        axios.get(`${process.env.REACT_APP_API_URL}/departamentos`).then(response => setDepartamentos(response.data));
        axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`).then(response => setNiveles(response.data));
        axios.get(`${process.env.REACT_APP_API_URL}/ciclosAcademicos`).then(response => setCiclos(response.data));
        axios.get(`${process.env.REACT_APP_API_URL}/gradosAcademicos`).then(response => setGrados(response.data));
    }, []);

    useEffect(() => {
        if (filterColumn === "municipioced" && filterValue) {
            axios.get(`${process.env.REACT_APP_API_URL}/municipios/${filterValue}`)
                .then(response => setMunicipios(response.data));
        }
    }, [filterColumn, filterValue]);

    useEffect(() => {
        if (!filterColumn || !filterValue) {
            setFilteredRows(rows);
        } else {
            setFilteredRows(rows.filter(row => row[filterColumn]?.toString() === filterValue.toString()));
        }
    }, [filterColumn, filterValue, rows]);



    const exportExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Participantes");
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
            title.value = "Listado de los Participantes";
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
                "ID", "Nombre de la Acción o Formación", "Código SACE", "Nombre", "Identificación", "Sexo",
                "Nivel Académico del Participante", "Grado Académico del Participante",
                "Años de Servicio", "Código de Red", "Función", "Departamento en el que Reside", "Municipio en el que Reside", "Aldea en la que Reside", "Centro Educativo",
                "Nivel Académico que Atiende", "Ciclo Académico que Atiende", "Grado Académico que Atiende", "Tipo Administración",
                "Zona Centro Educativo", "Departamento Centro Educativo", "Municipio Centro Educativo", "Aldea Centro Educativo",

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
                    item.id, item.accionformacion, item.codigosace, item.nombre, item.identificacion, item.sexo,
                    item.nombreniveldocente ?? "-", item.nombregradodocente ?? "-",
                    item.añosdeservicio, item.codigodered, item.funcion, item.nombredeptoresidencia, item.nombremuniresidencia,
                    item.nombrealdearesidencia, item.centroeducativo, item.nombrenivelced ?? "-",
                    item.nombrecicloced ?? "-", item.nombregradoced ?? "-", item.tipoadministracion,
                    item.zona, item.nombredeptoced, item.nombremunicipioced, item.nombrealdeaced,
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
            a.download = "Reporte_Participantes.xlsx";
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
                    Listado de Participantes
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <Select onChange={(e) => setFilterColumn(e.target.value)}>
                                <MenuItem value="">Seleccionar columna</MenuItem >
                                <MenuItem value="accionformacion">Nombre de la Acción o Formación</MenuItem >
                                <MenuItem value="codigosace">Código SACE</MenuItem >
                                <MenuItem value="nombre">Nombre</MenuItem >
                                <MenuItem value="identificacion">Identidad</MenuItem >
                                <MenuItem value="sexo">Sexo</MenuItem >
                                <MenuItem value="nombreniveldocente">Nivel Académico del Participante</MenuItem >
                                <MenuItem value="nombregradodocente">Grado Académico del Participante</MenuItem >
                                <MenuItem value="añosdeservicio">Años de Servicio</MenuItem >
                                <MenuItem value="codigodered">Código de Red que Pertenece</MenuItem >
                                <MenuItem value="funcion">Función</MenuItem >
                                <MenuItem value="nombredeptoresidencia">Departamento en el que Reside</MenuItem >
                                <MenuItem value="nombremuniresidencia">Municipio en el que Reside</MenuItem >
                                <MenuItem value="nombrealdearesidencia">Aldea en el que Reside</MenuItem >
                                <MenuItem value="centroeducativo">Centro Educativo</MenuItem >
                                <MenuItem value="nombrenivelced">Nivel Educativo que Atiende</MenuItem >
                                <MenuItem value="nombrecicloced">Ciclo Académico que Atiende</MenuItem >
                                <MenuItem value="nombregradoced">Grado Académico que Atiende</MenuItem >
                                <MenuItem value="tipoadministracion">Tipo Administración</MenuItem >
                                <MenuItem value="zona">Zona Centro Educativo</MenuItem >
                                <MenuItem value="nombredeptoced">Departamento Centro Educativo</MenuItem >
                                <MenuItem value="nombremunicipioced">Municipio Centro Educativo</MenuItem >
                                <MenuItem value="nombrealdeaced">Aldea Centro Educativo</MenuItem >
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {filterColumn === "sexo" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar sexo</MenuItem >
                                    <MenuItem value="Hombre">Hombre</MenuItem >
                                    <MenuItem value="Mujer">Mujer</MenuItem >
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
                        ) : ["nombredeptoresidencia", "nombredeptoced"].includes(filterColumn) ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar departamento</MenuItem>
                                    {departamentos.map(dep => (
                                        <MenuItem key={dep.id} value={dep.nombre}>{dep.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : ["nombremuniresidencia", "nombremunicipioced"].includes(filterColumn) ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar municipio</MenuItem >
                                    {municipios.map(mun => <MenuItem key={mun.id} value={mun.id}>{mun.nombre}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "idnivelesacademicos" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar nivel</MenuItem >
                                    {niveles.map(niv => <MenuItem key={niv.id} value={niv.id}>{niv.nombre}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "idciclosacademicos" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar ciclo</MenuItem >
                                    {ciclos.map(cic => <MenuItem key={cic.id} value={cic.id}>{cic.nombre}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "idgradosacademicos" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar grado</MenuItem >
                                    {grados.map(gra => <MenuItem key={gra.id} value={gra.id}>{gra.gradoacademico}</MenuItem >)}
                                </Select>
                            </FormControl>
                        ) : filterColumn === "tipoadministracion" ? (
                            <FormControl fullWidth>
                                <Select onChange={(e) => setFilterValue(e.target.value)}>
                                    <MenuItem value="">Seleccionar Tipo de Administración</MenuItem >
                                    <MenuItem value="Gubernamental">Gubernamental</MenuItem >
                                    <MenuItem value="No Gubernamental">No Gubernamental</MenuItem >
                                </Select>
                            </FormControl>
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
                                <TableCell align="center">Nombre de la Acción o Formación</TableCell>
                                <TableCell align="right">Código SACE</TableCell>
                                <TableCell align="right">Nombre</TableCell>
                                <TableCell align="right">Identidad</TableCell>
                                <TableCell align="right">Sexo</TableCell>
                                <TableCell align="right">Nivel Académico del Participante</TableCell>
                                <TableCell align="right">Grado Académico del Participante</TableCell>
                                <TableCell align="right">Años de Servicio</TableCell>
                                <TableCell align="right">Código de Red que Pertenece</TableCell>
                                <TableCell align="right">Función</TableCell>
                                <TableCell align="right">Departamento en el que Reside</TableCell>
                                <TableCell align="right">Municipio en el que Reside</TableCell>
                                <TableCell align="right">Aldea en la que Reside</TableCell>
                                <TableCell align="right">Centro Educativo</TableCell>
                                <TableCell align="right">Nivel Académico que Atiende</TableCell>
                                <TableCell align="right">Ciclo Académico que Atiende</TableCell>
                                <TableCell align="right">Grado Académico que Atiende</TableCell>
                                <TableCell align="right">Tipo Administración</TableCell>
                                <TableCell align="right">Zona Centro Educativo</TableCell>
                                <TableCell align="right">Departamento  Centro Educativo</TableCell>
                                <TableCell align="right">Municipio  Centro Educativo</TableCell>
                                <TableCell align="right">Aldea  Centro Educativo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (


                                <TableRow key={row.idinvestigacioncap}>
                                    <TableCell align="center">{row.accionformacion}</TableCell>
                                    <TableCell align="right">{row.codigosace}</TableCell>
                                    <TableCell align="right">{row.nombre}</TableCell>
                                    <TableCell align="right">{row.identificacion}</TableCell>
                                    <TableCell align="right">{row.sexo}</TableCell>
                                    <TableCell align="right">{row.nombreniveldocente}</TableCell>
                                    <TableCell align="right">{row.nombregradodocente}</TableCell>
                                    <TableCell align="right">{row.añosdeservicio}</TableCell>
                                    <TableCell align="right">{row.codigodered}</TableCell>
                                    <TableCell align="right">{row.funcion}</TableCell>
                                    <TableCell align="right">{row.nombredeptoresidencia}</TableCell>
                                    <TableCell align="right">{row.nombremuniresidencia}</TableCell>
                                    <TableCell align="right">{row.nombrealdearesidencia}</TableCell>
                                    <TableCell align="right">{row.centroeducativo}</TableCell>
                                    <TableCell align="right">{row.nombrenivelced}</TableCell>
                                    <TableCell align="right">{row.nombrecicloced}</TableCell>
                                    <TableCell align="right">{row.nombregradoced}</TableCell>
                                    <TableCell align="right">{row.tipoadministracion}</TableCell>
                                    <TableCell align="right">{row.zona}</TableCell>
                                    <TableCell align="right">{row.nombredeptoced}</TableCell>
                                    <TableCell align="right">{row.nombremunicipioced}</TableCell>
                                    <TableCell align="right">{row.nombrealdeaced}</TableCell>
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
                                    colSpan={23}
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

export default ListadoParticipantes;