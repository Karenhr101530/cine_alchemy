/* Importar mysql2 */
/* Prestamelo */
import mysql from "mysql2";

/* Pasar datos de configuracion a la conexion */
/* Pool = Conexion a la base de datos */
const conexion = mysql.createPool({
    /* Donde esta mi base de datos */
    /* 127.0.0.1 == localhost */
    host: 'localhost',
    /* Usuario de incio en la base de datos */
    user: 'root',
    /* Contraseña */
    password: '',
    /* Nombre de la base de datos */
    database: 'cine_alchemy'
});

/* Te lo presto */
export default conexion.promise();
