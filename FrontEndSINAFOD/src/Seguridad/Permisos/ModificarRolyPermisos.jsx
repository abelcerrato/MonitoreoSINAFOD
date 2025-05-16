import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "../../Components/UserContext";
import { color } from '../../Components/color';
import Dashboard from '../../Dashboard/dashboard';
import {
    Paper, Box, Typography,
    Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Checkbox,
    FormControl, InputLabel, Select, MenuItem,
    Button, Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EditRole = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [modulos, setModulos] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [formData, setFormData] = useState({
        rol: '',
        descripcion: '',
        estado: true,
        permisos: []
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Obtener datos del rol y permisos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roleRes, modulosRes, objetosRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/permisos/${id}`),
                    axios.get(`${process.env.REACT_APP_API_URL}/modulos`),
                    axios.get(`${process.env.REACT_APP_API_URL}/objetos`)
                ]);

                setModulos(modulosRes.data);
                setObjetos(objetosRes.data);

                // Transformar la respuesta de la API
                const permissionsArray = roleRes.data;

                if (permissionsArray.length > 0) {
                    // Extraer los datos comunes del rol (del primer elemento)
                    const firstPermission = permissionsArray[0];

                    const roleData = {
                        rol: firstPermission.rol,
                        descripcion: firstPermission.descripcion || '',
                        estado: firstPermission.estado || 'false',
                        idrol: firstPermission.idrol,
                        permisos: permissionsArray.map(p => ({
                            idobjeto: p.idobjeto,
                            objeto: p.objeto,
                            idmodulo: p.idmodulo,
                            modulo: modulosRes.data.find(m => m.id === p.idmodulo)?.modulo || '',
                            consultar: p.consultar,
                            insertar: p.insertar,
                            actualizar: p.actualizar
                        }))
                    };

                    setFormData(roleData);
                    console.log("Datos transformados:", roleData);
                }
            } catch (error) {
                console.error("Error al obtener datos", error);
            }
        };

        if (id) fetchData();
    }, [id]);

    // Funciones de manejo similares a las del componente original

    const handleSave = async () => {
        try {
            // Formatear permisos para el backend
            const permisosFormateados = formData.permisos.reduce((acc, permiso) => {
                acc[permiso.idobjeto] = {
                    consultar: permiso.consultar,
                    insertar: permiso.insertar,
                    actualizar: permiso.actualizar
                };
                return acc;
            }, {});

            const dataToSend = {
                rol: formData.rol,
                descripcion: formData.descripcion,
                estado: formData.estado,
                permisos: permisosFormateados,
                modificadopor: user.id,
                idrol: id
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/permisos`, dataToSend);

            Swal.fire({
                title: '¡Éxito!',
                text: 'Rol actualizado correctamente',
                icon: 'success',
                confirmButtonColor: color.primary.azul
            }).then(() => {
                navigate('/Seguridad/Roles-y-Permisos');
            });
        } catch (error) {
            console.error("Error al actualizar rol", error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Ocurrió un error al actualizar el perfil',
                icon: 'error',
                confirmButtonColor: color.primary.azul
            });
        }
    };

    // Manejar cambios en los permisos
    const handlePermissionChange = (idobjeto, tipo) => {
        setFormData(prev => {
            const updatedPermisos = prev.permisos.map(permiso => {
                if (permiso.idobjeto === idobjeto) {
                    const newValue = !permiso[tipo];

                    // Si estamos activando insertar o actualizar, activar también consultar
                    const shouldActivateConsultar =
                        (tipo === 'insertar' || tipo === 'actualizar') &&
                        newValue &&
                        !permiso.consultar;

                    return {
                        ...permiso,
                        [tipo]: newValue,
                        consultar: shouldActivateConsultar ? true : permiso.consultar
                    };
                }
                return permiso;
            });

            return { ...prev, permisos: updatedPermisos };
        });
    };


    // Agrupar objetos por módulo
    const objetosPorModulo = modulos.reduce((acc, modulo) => {
        const objetosModulo = objetos.filter(obj => obj.idmodulo === modulo.id);
        if (objetosModulo.length > 0) {
            acc.push({
                idmodulo: modulo.id,
                modulo: modulo.modulo,
                objetos: objetosModulo
            });
        }
        return acc;
    }, []);




    // Verifica si todos los permisos están activos
    const allPermissionsActive = () => {
        return formData.permisos.length > 0 &&
            formData.permisos.every(p => p.consultar && p.insertar && p.actualizar);
    };

    // Verifica si todos los permisos de un tipo están activos
    const allPermissionsOfTypeActive = (type) => {
        return formData.permisos.length > 0 &&
            formData.permisos.every(p => p[type]);
    };

    // Verifica si todos los permisos de un módulo están activos
    const moduleAllPermissionsActive = (moduleId) => {
        const moduleObjects = objetos.filter(o => o.idmodulo === moduleId);
        return moduleObjects.length > 0 &&
            moduleObjects.every(obj => {
                const permiso = formData.permisos.find(p => p.idobjeto === obj.id);
                return permiso?.consultar && permiso?.insertar && permiso?.actualizar;
            });
    };

    // Verifica si todos los permisos de un tipo en un módulo están activos
    const modulePermissionTypeActive = (moduleId, type) => {
        const moduleObjects = objetos.filter(o => o.idmodulo === moduleId);
        return moduleObjects.length > 0 &&
            moduleObjects.every(obj => {
                const permiso = formData.permisos.find(p => p.idobjeto === obj.id);
                return permiso?.[type];
            });
    };

    // Funciones toggle actualizadas
    const handleToggleAllPermissions = () => {
        const shouldActivate = !allPermissionsActive();
        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => ({
                ...permiso,
                consultar: shouldActivate,
                insertar: shouldActivate,
                actualizar: shouldActivate
            }))
        }));
    };

    const handleTogglePermissionType = (tipo) => {
        const shouldActivate = !allPermissionsOfTypeActive(tipo);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => ({
                ...permiso,
                [tipo]: shouldActivate,
                // Si estamos activando insertar o actualizar, activar también consultar
                consultar: ((tipo === 'insertar' || tipo === 'actualizar') && shouldActivate)
                    ? true
                    : permiso.consultar
            }))
        }));
    };

    const handleToggleModulePermissions = (moduleId) => {
        const shouldActivate = !moduleAllPermissionsActive(moduleId);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => {
                const obj = objetos.find(o => o.id === permiso.idobjeto);
                if (obj && obj.idmodulo === moduleId) {
                    return {
                        ...permiso,
                        consultar: shouldActivate,
                        insertar: shouldActivate,
                        actualizar: shouldActivate
                    };
                }
                return permiso;
            })
        }));
    };

    const handleToggleModulePermissionType = (moduleId, tipo) => {
        const shouldActivate = !modulePermissionTypeActive(moduleId, tipo);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => {
                const obj = objetos.find(o => o.id === permiso.idobjeto);
                if (obj && obj.idmodulo === moduleId) {
                    return {
                        ...permiso,
                        [tipo]: shouldActivate,
                        // Si estamos activando insertar o actualizar, activar también consultar
                        consultar: ((tipo === 'insertar' || tipo === 'actualizar') && shouldActivate)
                            ? true
                            : permiso.consultar
                    };
                }
                return permiso;
            })
        }));
    };

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.primary.azul, mb: 3 }}>
                    Editar Rol: {formData.rol}
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            label="Estado"
                        >
                            <MenuItem value={true}>Activo</MenuItem>
                            <MenuItem value={false}>Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Asignación de Permisos
                </Typography>

                {/* Controles masivos de permisos */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="text"
                        onClick={() => handleToggleAllPermissions()}
                        startIcon={allPermissionsActive() ? <CancelIcon /> : <CheckCircleIcon />}
                        sx={{
                            color: allPermissionsActive() ? color.primary.rojo : color.primary.azul,

                        }}

                    >
                        {allPermissionsActive() ? 'Desactivar Todos' : 'Activar Todos'}
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => handleTogglePermissionType('consultar')}
                        startIcon={allPermissionsOfTypeActive('consultar') ? <CancelIcon /> : <CheckCircleIcon />}

                        sx={{
                            color: allPermissionsOfTypeActive('consultar') ? color.primary.rojo : color.primary.azul,

                        }}
                    >
                        {allPermissionsOfTypeActive('consultar') ? 'Desactivar Consultar' : 'Activar Consultar'}
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => handleTogglePermissionType('insertar')}
                        startIcon={allPermissionsOfTypeActive('insertar') ? <CancelIcon /> : <CheckCircleIcon />}
                        sx={{
                            color: allPermissionsOfTypeActive('insertar') ? color.primary.rojo : color.primary.azul,

                        }}
                    >
                        {allPermissionsOfTypeActive('insertar') ? 'Desactivar Insertar' : 'Activar Insertar'}
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => handleTogglePermissionType('actualizar')}
                        startIcon={allPermissionsOfTypeActive('actualizar') ? <CancelIcon /> : <CheckCircleIcon />}
                        sx={{
                            color: allPermissionsOfTypeActive('actualizar') ? color.primary.rojo : color.primary.azul,

                        }}
                    >
                        {allPermissionsOfTypeActive('actualizar') ? 'Desactivar Actualizar' : 'Activar Actualizar'}
                    </Button>
                </Box>

                {objetosPorModulo.map((grupo) => (
                    <Accordion key={grupo.idmodulo}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>{grupo.modulo}</Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleModulePermissions(grupo.idmodulo);
                                    }}
                                    title={moduleAllPermissionsActive(grupo.idmodulo) ? 'Desactivar todos' : 'Activar todos'}
                                    sx={{
                                        color: moduleAllPermissionsActive(grupo.idmodulo) ? color.primary.rojo : color.primary.azul,
                                        borderColor: moduleAllPermissionsActive(grupo.idmodulo) ? color.primary.rojo : color.primary.azul,
                                    }}

                                >
                                    {moduleAllPermissionsActive(grupo.idmodulo) ? <CancelIcon /> : <CheckCircleIcon />}
                                </IconButton>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Objeto</TableCell>
                                            {['consultar', 'insertar', 'actualizar'].map((tipo) => (
                                                <TableCell key={tipo} align="center" sx={{ fontWeight: 'bold' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ textTransform: 'capitalize' }}>{tipo}</span>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleModulePermissionType(grupo.idmodulo, tipo)}
                                                            title={modulePermissionTypeActive(grupo.idmodulo, tipo) ?
                                                                `Desactivar todos ${tipo}` : `Activar todos ${tipo}`}
                                                            sx={{
                                                                color: modulePermissionTypeActive(grupo.idmodulo, tipo) ? color.primary.rojo : color.primary.azul,
                                                                borderColor: modulePermissionTypeActive(grupo.idmodulo, tipo) ? color.primary.rojo : color.primary.azul,
                                                            }}
                                                        >
                                                            {modulePermissionTypeActive(grupo.idmodulo, tipo) ?
                                                                <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {grupo.objetos.map((obj) => {
                                            const permiso = formData.permisos.find(p => p.idobjeto === obj.id) || {};
                                            return (
                                                <TableRow key={obj.id}>
                                                    <TableCell>{obj.objeto}</TableCell>
                                                    <TableCell align="center">
                                                        <Checkbox
                                                            checked={permiso.consultar || false}
                                                            onChange={() => handlePermissionChange(obj.id, 'consultar')}
                                                            sx={{
                                                                color: color.gris,
                                                                '&.Mui-checked': {
                                                                    color: color.primary.azul,
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Checkbox
                                                            checked={permiso.insertar || false}
                                                            onChange={() => {
                                                                handlePermissionChange(obj.id, 'insertar');
                                                                // Mostrar notificación si se activó consultar automáticamente
                                                                if (!permiso.consultar && !permiso.insertar) {
                                                                    setTimeout(() => {
                                                                        const updatedPermiso = formData.permisos.find(p => p.idobjeto === obj.id);
                                                                        if (updatedPermiso?.consultar) {
                                                                            Swal.fire({
                                                                                title: 'Permiso de consulta activado',
                                                                                text: 'Para poder insertar, se requiere permiso de consulta',
                                                                                icon: 'info',
                                                                                confirmButtonColor: color.primary.azul,
                                                                                timer: 2000
                                                                            });
                                                                        }
                                                                    }, 100);
                                                                }
                                                            }}
                                                            sx={{
                                                                color: color.gris,
                                                                '&.Mui-checked': {
                                                                    color: color.primary.azul,
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Checkbox
                                                            checked={permiso.actualizar || false}
                                                            onChange={() => {
                                                                handlePermissionChange(obj.id, 'actualizar');
                                                                // Mostrar notificación si se activó consultar automáticamente
                                                                if (!permiso.consultar && !permiso.actualizar) {
                                                                    setTimeout(() => {
                                                                        const updatedPermiso = formData.permisos.find(p => p.idobjeto === obj.id);
                                                                        if (updatedPermiso?.consultar) {
                                                                            Swal.fire({
                                                                                title: 'Permiso de consulta activado',
                                                                                text: 'Para poder actualizar, se requiere permiso de consulta',
                                                                                icon: 'info',
                                                                                confirmButtonColor: color.primary.azul,
                                                                                timer: 2000
                                                                            });
                                                                        }
                                                                    }, 100);
                                                                }
                                                            }}
                                                            sx={{
                                                                color: color.gris,
                                                                '&.Mui-checked': {
                                                                    color: color.primary.azul,
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        onClick={() => navigate('/Seguridad/Roles-y-Permisos')}
                        sx={{ color: color.primary.rojo, mr: 2 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: color.primary.azul }}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </Dashboard>
    );
};

export default EditRole;