import { pool } from '../db.js'

export const getCentroEducativoM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ced.idparticipante, p.identificacion, p.nombre, ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.jornada, ced.zona, 
                ced.prebasica, ced.basica, ced.media, 
                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
                ced.btp1, ced.btp2, ced.btp3, ced.bch1, ced.bch2, ced.bch3, 
                ced.modalidad, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            left join participantes p on ced.idparticipante = p.id 
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            order by ced.id desc
        `)

        return rows;
    } catch (error) {
        throw error;
    }
};

//get de centros educativos por id del registro del centro educativo
export const getIdCentroEducativoM = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ced.idparticipante, p.identificacion, p.nombre, ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.jornada, ced.zona, 
                ced.prebasica, ced.basica, ced.media, 
                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
                ced.btp1, ced.btp2, ced.btp3, ced.bch1, ced.bch2, ced.bch3, 
                ced.modalidad, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            left join participantes p on ced.idparticipante = p.id 
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            where ced.id=$1
            order by ced.id desc
        `, [id])

        return rows;
    } catch (error) {
        throw error;
    }
};


//get de centros educativos por identificacion del participante
export const getCentroEducativoIdPartM = async (identificacion) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                ced.idparticipante, p.identificacion, p.nombre, ced.id, ced.nombreced, ced.codigosace, ced.tipoadministracion, ced.tipocentro, ced.jornada, ced.zona, 
                ced.prebasica, ced.basica, ced.media, 
                ced.primero, ced.segundo, ced.tercero, ced.cuarto, ced.quinto, ced.sexto, ced.séptimo, ced.octavo, ced.noveno, 
                ced.btp1, ced.btp2, ced.btp3, ced.bch1, ced.bch2, ced.bch3, 
                ced.modalidad, 
                ced.iddepartamento, d.nombre as departamentoced,
                ced.idmunicipio, m.nombre  as municipioced,
                ced.idaldea, a.nombre as aldeaced
            FROM centroeducativo as ced
            left join participantes p on ced.idparticipante = p.id 
            inner join departamento d on ced.iddepartamento = d.id
            inner join municipio m on ced.idmunicipio = m.id 
            left join aldeas a on ced.idaldea = a.id 
            wherep.identificacion=$1
            order by ced.id desc
        `, [identificacion])

        return rows;
    } catch (error) {
        throw error;
    }
};




export const postCentroEducativoM = async (
    nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
    primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
    modalidad, iddepartamento, idmunicipio, idaldea, idparticipante
) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO centroeducativo ( 
                nombreced, codigosace, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media, 
                primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3, 
                modalidad, iddepartamento, idmunicipio, idaldea, idparticipante) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
            ) 
            RETURNING *;
        `, [
            nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
            primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
            modalidad, iddepartamento, idmunicipio, idaldea, idparticipante
        ]);

        return rows[0];
    } catch (error) {
        console.error("ERROR AL INSERTAR EL CENTRO EDUCATIVO DEL PARTICIPANTE:", error.message);
        throw error;
    }
};





export const putCentroEducativoM = async (
    nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
    primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
    modalidad, iddepartamento, idmunicipio, idaldea, idparticipante, id) => {
    try {
        const { rows } = await pool.query(`
                UPDATE centroeducativo 
                SET 
                    nombreced = $1, codigosace = $2, tipoadministracion = $3, tipocentro = $4, jornada = $5, zona = $6, prebasica = $7, basica = $8, media = $9,
                    primero = $10, segundo = $11, tercero = $12, cuarto = $13, quinto = $14, sexto = $15, séptimo = $16, octavo = $17, noveno = $18,
                    btp1 = $19, btp2 = $20, btp3 = $21, bch1 = $22, bch2 = $23, bch3 = $24,
                    modalidad = $25, iddepartamento = $26, idmunicipio = $27, idaldea = $28, idparticipante = $29 
                WHERE id = $30
                RETURNING *`,
            [
                nombreced, codigosaceCed, tipoadministracion, tipocentro, jornada, zona, prebasica, basica, media,
                primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, btp1, btp2, btp3, bch1, bch2, bch3,
                modalidad, iddepartamento, idmunicipio, idaldea, idparticipante, id
            ])

        return rows[0]
    } catch (error) {
        throw error;
    }

}








