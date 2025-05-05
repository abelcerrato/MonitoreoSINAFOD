import { getObjetoIdM, getObjetosM, postObjetosM, putObjetosM } from "../models/ms_objetos.models.js";


export const getObjetosC = async (req, res) => {
    try {
        const objetos = await getObjetosM();
        res.json(objetos)
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getObjetoIdC = async (req, res) => {
    try {
        const { id } = req.params
        const objeto = await getObjetoIdM(id);

        if (!objeto) {
            return res.status(404).json({ message: "Objeto no encontrado" });
        }

        // Retornar el ID del objeto 
        res.json({ id: objeto[0].id });
    } catch (error) {
        console.error('Error al obtener el objeto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const postObjetosC = async (req, res) => {
    try {
        const { objeto, idmodulo, descripcion, creadopor } = req.body;
        console.log(req.body);


        if (!objeto) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newObjeto = await postObjetosM(objeto, idmodulo, descripcion, creadopor);
        res.json({ message: "Objeto agregado exitosamente: ", newObjeto });

    } catch (error) {
        console.error('Error al insertar el Objeto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const putObjetosC = async (req, res) => {
    try {
        const { id } = req.params;
        const { objeto, idmodulo, descripcion, modificadopor} = req.body;

        if (!objeto) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newObjeto = await putObjetosM(objeto, idmodulo, descripcion, modificadopor, id);
        res.json({ message: "Objeto actualizado exitosamente: ", newObjeto });

    } catch (error) {
        console.error('Error al actualizar el Objeto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}