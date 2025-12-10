import { getMunicipiosIdM, getMunicipiosM } from "../models/municipos.models.js"; // Importar el modelo para los municipios

// Trae todos los municipios mediante el ID del registro
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

// Trae todos los municipios
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