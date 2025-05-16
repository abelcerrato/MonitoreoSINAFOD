import { pool } from '../db.js'

export const getCargoDesempeñaM = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT id, cargo FROM cargodesempeña
        `)
        return rows;
    } catch (error) {
        throw error;
    }
};




export const getCargoDesempeñaIdM = async (id) => {
    try {
        const { rows } = await pool.query
            (`
            SELECT id, cargo FROM cargodesempeña
            WHERE id=$1
        `, [id])
        return rows;
    } catch (error) {
        throw error;
    }
};



export const postCargoDesempeñaM = async ( cargo ) => {
    try {
        const { rows } = await pool.query(`
            INSERT INTO cargodesempeña (cargo) 
            VALUES($1) 
            RETURNING *;
        `, [cargo]);

        return rows[0].id;
    } catch (error) {
        console.error("Error en postParticipanteM:", error.message);
        throw error;
    }
};



export const putCargoDesempeñaM = async (cargo, id) => {
    try {
        const { rows } = await pool.query(`
                UPDATE cargodesempeña
                SET 
                cargo=$1, 
                WHERE id=$2
                RETURNING *`,
            [cargo,id])

        return rows[0]
    } catch (error) {
        throw error;
    }

}

