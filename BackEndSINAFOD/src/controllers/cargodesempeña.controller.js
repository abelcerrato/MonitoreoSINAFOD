import { getCargoDesempeñaIdM, getCargoDesempeñaM, postCargoDesempeñaM, putCargoDesempeñaM } from "../models/cargodesempeña.models.js"; // Importar los modelos para los cargos que desempeña

//Trae todos los cargos que desempeña
export const getCargoDesempeñaC = async (req, res) => {
    try {
        const cargodes = await getCargoDesempeñaM();
        res.json(cargodes)
    } catch (error) {
        console.error('Error al obtener registros:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }

}


//Trae los cargos por el id
export const getCargoDesempeñaIdC = async (req, res) => {
    try {
        const { id } = req.params
        const cargodes = await getCargoDesempeñaIdM(id);

        if (!cargodes) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(cargodes)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


//Inserta un nuevo cargo que desempeña
export const postCargoDesempeñaC = async (req, res) => {
    const { cargo } = req.body
    console.log(req.body);
    try {
        const cargodes = await postCargoDesempeñaM(cargo)
        res.json({ message: "Cargo agregado exitosamente", user: cargodes });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//Actualiza un cargo que desempeña
export const putCargoDesempeñaC = async (req, res) => {
    const { id } = req.params;
    const { cargo } = req.body

    try {
        const cargodes = await putCargoDesempeñaM(cargo, id)
        res.json({ message: "acitacion del participanteactualizada ", user: cargodes });
    } catch (error) {
        console.error('Error al actualizar la acitacion del participante: ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




