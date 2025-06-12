import { getMunicipiosIdM, getMunicipiosM } from "../models/municipos.models.js";

export const getMunicipiosIdC = async (req, res) => {
    try {
        const { id } = req.params;
        const municipios = await getMunicipiosIdM(id);

        if (!municipios) {
            return res.status(404).json({ message: "Municipios no encontrados" });
        }

        res.json(municipios);
    } catch (error) {
        console.error('Error al obtener los municipios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export const getMunicipiosC = async (req, res) => {
    try {
        
        const municipios = await getMunicipiosM();

        if (!municipios) {
            return res.status(404).json({ message: "Municipios no encontrados" });
        }

        res.json(municipios);
    } catch (error) {
        console.error('Error al obtener los municipios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}