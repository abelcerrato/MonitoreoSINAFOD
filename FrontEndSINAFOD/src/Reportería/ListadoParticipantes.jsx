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
import { DataGrid } from '@mui/x-data-grid';



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
                "Nivel Académico que Atiende", "Ciclo Educativo que Atiende", "Grado que Atiende", "Tipo Administración",
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

    const columns = [
        { field: "accionformacion", headerName: "Nombre de la Acción", width: 180 },
        { field: "codigosace", headerName: "Código SACE", width: 180 },
        { field: "nombre", headerName: "Nombre", width: 180 },
        { field: "identificacion", headerName: "Identidad", width: 180 },
        { field: "sexo", headerName: "Sexo", width: 180 },
        { field: "nombreniveldocente", headerName: "Nivel Académico del Participante", width: 230 },
        { field: "nombregradodocente", headerName: "Grado Académico del Participante", width: 230 },
        { field: "añosdeservicio", headerName: "Años de Servicio", width: 180 },
        { field: "codigodered", headerName: "Código de Red que Pertenece", width: 230 },
        { field: "funcion", headerName: "Función", width: 180 },
        { field: "nombredeptoresidencia", headerName: "Departamento en el que Reside", width: 230 },
        { field: "nombremuniresidencia", headerName: "Municipio en el que Reside", width: 230 },
        { field: "nombrealdearesidencia", headerName: "Aldea en la que Reside", width: 180 },
        { field: "centroeducativo", headerName: "Centro Educativo", width: 180 },
        { field: "nombrenivelced", headerName: "Nivel Académico que Atiende", width: 200 },
        { field: "nombrecicloced", headerName: "Ciclo Educativo que Atiende", width: 230 },
        { field: "nombregradoced", headerName: "Grado que Atiende", width: 230 },
        { field: "tipoadministracion", headerName: "Tipo Administración", width: 180 },
        { field: "zona", headerName: "Zona Centro Educativo", width: 180 },
        { field: "nombredeptoced", headerName: "Departamento Centro Educativo", width: 230 },
        { field: "nombremunicipioced", headerName: "Municipio Centro Educativo", width: 200 },
        { field: "nombrealdeaced", headerName: "Aldea Centro Educativo", width: 180 },
    ];


    return (
        <Dashboard>
            <Paper sx={{ padding: 3, marginBottom: 3 }}>

                <Typography variant="h3" sx={{ color: color.primary.azul, mb: 5 }}>
                    Listado de Participantes
                </Typography>

                <Grid container spacing={2} marginBottom={3}>
                    <Grid item xs={12} size={4}>
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
                                <MenuItem value="nombrecicloced">Ciclo Educativo que Atiende</MenuItem >
                                <MenuItem value="nombregradoced">Grado que Atiende</MenuItem >
                                <MenuItem value="tipoadministracion">Tipo Administración</MenuItem >
                                <MenuItem value="zona">Zona Centro Educativo</MenuItem >
                                <MenuItem value="nombredeptoced">Departamento Centro Educativo</MenuItem >
                                <MenuItem value="nombremunicipioced">Municipio Centro Educativo</MenuItem >
                                <MenuItem value="nombrealdeaced">Aldea Centro Educativo</MenuItem >
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} size={4}>
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
                    <Grid item xs={12} size={4} container justifyContent="flex-end">
                        <Tooltip title="Exportar Excel">
                            <IconButton
                                onClick={() => exportExcel(rows)}
                                aria-label="exportar Excel"
                                sx={{ fontSize: 30, color: color.primary.azul }}
                            >
                                <FaRegFileExcel />
                            </IconButton>
                        </Tooltip>
                    </Grid>



                </Grid>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    getRowId={(row) => row.idinvestigacioncap}
                    pageSizeOptions={[5, 10, 25]}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={({ page, pageSize }) => {
                        setPage(page);
                        setRowsPerPage(pageSize);
                    }}
                    autoHeight

                />


            </Paper>

        </Dashboard>
    )
}

export default ListadoParticipantes;