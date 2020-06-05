class API {
    async obtenerDatos() {
        const total = 1000;
        //obtener datos desde la API
        const datos = await fetch(`https://api.datos.gob.mx/v1/precio.gasolina.publico?pageSize=${total}`);
        //transformar en JSON
        const datosJSON = await datos.json();

        return datosJSON;
    }
}