import { getAldeasIdM } from "../models/aldeas.models.js";

export const getAldeasIdC = async (req, res) => {
    try {
        const { id } = req.params;
        const aldeas = await getAldeasIdM(id);

        if (!aldeas) {
            return res.status(404).json({ message: "aldeas no encontradas" });
        }

        res.json(aldeas);
    } catch (error) {
        console.error('Error al obtener las aldeas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}