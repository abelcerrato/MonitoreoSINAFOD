import { getCentroEducativoIdPartM, getCentroEducativoM, getIdCentroEducativoM, postCentroEducativoM, putCentroEducativoM } from "../models/centroeducativo.models.js";


export const getCentroEducativoC = async (req, res) => {
    try {
        const CentroEducativo = await getCentroEducativoM();
        res.json(CentroEducativo)
    } catch (error) {
        console.error('Error al obtener registros del CentroEducativo:', error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
}


//Trae los centros educativos por el id
export const getIdCentroEducativoC = async (req, res) => {
    try {
        const { id } = req.params
        const CentroEducativo = await getIdCentroEducativoM(id);

        if (!CentroEducativo) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(CentroEducativo)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



//Trae los centros educativos por el id del participante
export const getCentroEducativoIdPartC = async (req, res) => {
    try {
        const { id } = req.params
        const CentroEducativo = await getCentroEducativoIdPartM(identificacion);

        if (!CentroEducativo) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(CentroEducativo)

    } catch (error) {
        console.error('Error al obtener el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const postCentroEducativoC = async (req, res) => {
    try {


        const { nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
            primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
            modalidad, iddepartamento, idmunicipio, idaldea, idparticipante } = req.body
        console.log(req.body);


        const CentroEducativo = await postCentroEducativoM(
            nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
            primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
            modalidad, iddepartamento, idmunicipio, idaldea, idparticipante)

        res.json({ message: "Centro Educativo  agregado exitosamente", user: CentroEducativo });
    } catch (error) {
        console.error('Error al insertar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




export const putCentroEducativoC = async (req, res) => {
    const { id } = req.params;
    const { nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
        primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
        modalidad, iddepartamento, idmunicipio, idaldea, idparticipante } = req.body

    try {



        const CentroEducativo = await putCentroEducativoM(
            nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
            primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
            modalidad, iddepartamento, idmunicipio, idaldea, idparticipante, id)
        //res.json(Participante)
        res.json({ message: "Centro Educativo actualizado exitosamente ", user: CentroEducativo });
    } catch (error) {
        console.error('Error al actualizarel Centro Educativo : ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



