import { getPermisosIdRolM, getPermisosM, postRolyPermisosM, putPerfilPermisosM } from "../models/ms_permisos.models.js";
import { getRolIdM } from "../models/ms_roles.models.js";

export const getPermisosC = async (req, res) => {
    try {
        const permisos = await getPermisosM();
        res.json(permisos)
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//permisos que tiene el rol
export const getPermisosIdRolC = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el nombre del rol (aunque no tenga permisos)
        const rol = await getRolIdM(id);
        if (!rol) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }
         if (rol.estado===false) {
            return res.status(404).json({ message: "Rol Inactivo" });
        }

        const permisos = await getPermisosIdRolM(id);

        if (permisos.length === 0) {
            console.log(`El rol '${rol.rol}' no tiene permisos asignados`);
            return res.status(401).json({ message: `El usuario no tiene permisos asignados` });
        }


        res.json(permisos);
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export const postRolyPermisosC = async (req, res) => {
    const { rol, estado, descripcion, creadopor, permisos } = req.body;
    console.log(req.body);
    
    try {
        if (!rol || !creadopor || !permisos) {
            return res.status(400).json({ error: 'Faltan datos requeridos: rol, creadopor o permisos.' });
        }

        const resultado = await postRolyPermisosM(rol, estado, descripcion, creadopor, permisos);
        res.status(201).json(resultado);

    } catch (error) {
        console.error('Error en el controlador al crear rol y permisos:', error);
        res.status(500).json({ error: 'Error al crear el rol y asignar permisos' });
    }
};



export const putPerfilPermisosC = async (req, res) => {
    try {
        const { rol, estado, descripcion,  modificadopor, permisos, idrol } = req.body;
        console.log(req.body);

        if (!idrol || !rol || estado === undefined || !modificadopor || !permisos) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const resultado = await putPerfilPermisosM( rol, estado, descripcion, modificadopor, permisos, idrol);

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en el controlador putPerfilPermisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


