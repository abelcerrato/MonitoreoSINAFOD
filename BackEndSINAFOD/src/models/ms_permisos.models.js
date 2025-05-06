import { pool } from '../db.js'

export const getPermisosM = async () => {
    try {
        /*  const { rows } = await pool.query(`
         select
             p.id, p.idrol, mr.rol, p.idobjeto, mo.objeto, 
             p.consultar, p.insertar, p.actualizar, 
             muc.nombre as creadopor, p.fechacreacion, mum.nombre as modificadopor, p.fechamodificacion 
         FROM ms_permisos p
             left join ms_roles mr on p.idrol =mr.id 
             left join ms_objetos mo on p.idobjeto = mo.id 
             left join ms_usuarios muc on p.creadopor = muc.id 
             left join ms_usuarios mum on p.modificadopor = mum.id `) */

        const { rows } = await pool.query(`
                SELECT 
                    mr.id AS idrol,
                    mr.descripcion,
                    mr.rol,
                    muc.nombre AS creadopor,
                    mr.estado,
                    json_agg(json_build_object(
                        'idobjeto', mo.id,
                        'objeto', mo.objeto,
                        'idmodulo', mm.id,
                        'modulo', mm.modulo,
                        'consultar', p.consultar,
                        'insertar', p.insertar,
                        'actualizar', p.actualizar
                    )) AS permisos
                FROM ms_permisos p
                LEFT JOIN ms_roles mr ON p.idrol = mr.id
                LEFT JOIN ms_objetos mo ON p.idobjeto = mo.id
                LEFT JOIN ms_modulos mm ON mo.idmodulo = mm.id
                LEFT JOIN ms_usuarios muc ON p.creadopor = muc.id
                GROUP BY mr.id, mr.rol, mr.estado, muc.nombre;
                `)
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

//Trae los permisos que se le han dado al rol
export const getPermisosIdRolM = async (id) => {
    console.log('Rol enviado:', id);
    try {
        const { rows } = await pool.query(`
        select
            p.id, p.idrol, mr.rol, p.idobjeto, mo.objeto,mo.idmodulo, mr.estado,mr.descripcion,
            p.consultar, p.insertar, p.actualizar, 
            muc.nombre as creadopor, p.fechacreacion, mum.nombre as modificadopor, p.fechamodificacion 
        FROM ms_permisos p
            left join ms_roles mr on p.idrol =mr.id 
            left join ms_objetos mo on p.idobjeto = mo.id 
            left join ms_usuarios muc on p.creadopor = muc.id 
            left join ms_usuarios mum on p.modificadopor = mum.id 
        where 
            p.idrol=$1 `, [id]);
        console.log('Resultado de la consulta de los permisos que tiene el Rol:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener los permisos que tiene el Rol:', error);
        throw error;
    }
}




export const postRolyPermisosM = async (rol, estado, descripcion, creadopor, permisos) => {
    // console.log(req.body);
    try {
        await pool.query('BEGIN');
        //insertar en roles
        const result = await pool.query(`
            INSERT INTO ms_roles 
            (rol, estado, descripcion, creadopor, fechacreacion, modificadopor, fechamodificacion) 
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null, null) RETURNING *`,
            [rol, estado, descripcion, creadopor]
        );

        const idrol = result.rows[0].id;
        console.log("idrol: ", idrol);

        // Traer los id de la tabla ms_objetos
        const objetosResult = await pool.query('SELECT id FROM ms_objetos');
        const objetos = objetosResult.rows;


        // Recorrer los objetos para insertar permisos en la tabla "ms_permisos"
        for (const objeto of objetos) {
            const idobjeto = objeto.id;
            const { consultar = 0, insertar = 0, actualizar = 0 } = permisos[idobjeto] || {};

            const permisosValues = [idrol, idobjeto, consultar, insertar, actualizar, creadopor];

            // Insertar datos en la tabla "ms_permisos"
            const permisosQuery = await pool.query(`
                INSERT INTO ms_permisos (idrol, idobjeto, consultar, insertar, actualizar, creadopor, fechacreacion, modificadopor, fechamodificacion)
                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, null, null) RETURNING id;`, permisosValues);

            //const idpermisos = permisosQuery.rows[0].id;
        }

        await pool.query('COMMIT');
        return { message: 'Rol y permisos creados correctamente', idrol };

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error al insertar el Rol y sus permisos:', error);
        throw error;
    }
}


export const putPerfilPermisosM = async (rol, estado, descripcion, modificadopor, permisos, idrol) => {
    try {
        await pool.query('BEGIN');
        //insertar en roles
        const result = await pool.query(`
            UPDATE ms_roles set
            rol=$1, estado=$2, descripcion=$3, modificadopor=$4, fechamodificacion=CURRENT_TIMESTAMP
            where id=$5 RETURNING *`,
            [rol, estado, descripcion, modificadopor, idrol]
        );

        // Traer los id de la tabla ms_objetos
        const objetosResult = await pool.query('SELECT id FROM ms_objetos');
        const objetos = objetosResult.rows;

        // QUERY QUE ACTUALIZA LOS DATOS EN LA TABLA "Permisos"
        const permisos_Query = `
            INSERT INTO ms_permisos
            (idobjeto, consultar, insertar, actualizar, modificadopor, fechamodificacion, idrol)
            VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
            ON CONFLICT (idobjeto, idrol)
            DO UPDATE SET  
                consultar = EXCLUDED.consultar,
                insertar = EXCLUDED.insertar,
                actualizar = EXCLUDED.actualizar,
                modificadopor = EXCLUDED.modificadopor,
                fechamodificacion = CURRENT_TIMESTAMP
            RETURNING *;`;

        for (const objeto of objetos) {
            const idobjeto = objeto.id;
            const permiso = permisos[idobjeto] || {};

            const { insertar = 0, actualizar = 0, consultar = 0 } = permiso;


            await pool.query(permisos_Query, [
                idobjeto,
                consultar,
                insertar,
                actualizar,
                modificadopor,
                idrol
            ]);

        }
        await pool.query('COMMIT');
        return { message: 'Rol y permisos actualizados correctamente', idrol, rolActualizado: result.rows[0] };
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error al actualizar el Rol y sus permisos:', error);
        throw error;
    }
}