import { getDepartamentosM } from "../models/departamentos.models.js"; // Importar el modelo para los departamentos

//---------------------------------------------------------
//                  DEPARTAMENTIOS
//---------------------------------------------------------

//Trae todos los departamentos
export const getDepartamentosC = async (req, res) => {
    try {
        const departamentos = await getDepartamentosM();
        res.json(departamentos)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}