import { getDepartamentosM } from "../models/departamentos.models.js";


export const getDepartamentosC = async (req, res) => {
    try {
        const departamentos = await getDepartamentosM();
        res.json(departamentos)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}