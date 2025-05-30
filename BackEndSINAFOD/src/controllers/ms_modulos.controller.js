
import { getModuloIdM, getModulosM, postModuloM, putModuloM } from "../models/ms_modulos.models.js";


export const getModulosC = async (req, res) => {
    try {
        const modulos = await getModulosM();
        res.json(modulos)
    } catch (error) {
        console.error('Error al obtener modulos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getModuloIdC = async (req, res) => {
    try {
        const { id } = req.params
        const modulo = await getModuloIdM(id);

        if (!modulo) {
            return res.status(404).json({ message: "Modulo no encontrado" });
        }

        // Retornar el ID del modulo
        res.json({ id: modulo[0].id });
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postModuloC = async (req, res) => {
    try {
        const { modulo, descripcion, creadopor } = req.body;
        console.log(req.body);


        if (!modulo) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newModulo = await postModuloM(modulo, descripcion, creadopor);
        res.json({ message: "Modulo agregado exitosamente: ", newModulo });

    } catch (error) {
        console.error('Error al insertar el Modulo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putModuloC = async (req, res) => {
    try {
        const { id } = req.params;
        const { modulo, descripcion, modificadopor} = req.body;

        if (!modulo) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedmodulo = await putModuloM(modulo, descripcion, modificadopor, id);
        res.json({ message: "modulo actualizado exitosamente: ", updatedmodulo });


    } catch (error) {
        console.error('Error al actualizar el modulo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

