class UI {
    constructor() {
        //instanciar la Api
        this.gasApi = new API();
        //crear los pines con layergroup de Leaflet
        this.markers = new L.LayerGroup();
         // Iniciar el mapa
         this.mapa = this.inicializarMapa();

    };

    inicializarMapa() {
         // Inicializar y obtener la propiedad del mapa
         const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
         const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
         L.tileLayer(
             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; ' + enlaceMapa + ' Contributors',
             maxZoom: 18,
             }).addTo(map);
         return map;

    };

    mostrarEstablecimientos() {
        this.gasApi.obtenerDatos()
            .then(datos => {
                const resultado = datos.results;
                //ejecutar función que muestra pines de ubicación
                this.mostrarPines(resultado);
            })
    };

    mostrarPines(datos) {
        //limpia los pines
        this.markers.clearLayers();
        
        //recorrer los establecimientos
        datos.map(dato => {
            //destructuración
            const {latitude, longitude, calle, regular, premium} = dato;
            //ademas de crear los pin, se tiene que agregar a cada uno un pop-up con la información sobre los precios y su ubicación.
            const popup = L.popup().setContent(`
                        <p>Calle : ${calle}</p>
                        <p>Premium : MX$${premium}</p>
                        <p>Regular : MX$${regular}</p>`);
            //crear los pines
            const marker = new L.marker([parseFloat(latitude), parseFloat(longitude)]).bindPopup(popup);
            //crear capa para agregar el grupo de markers que se vaya a mostrar
            this.markers.addLayer(marker);
        });
        //una vez agregados todos los pines a la capa de grupo de pines, se tiene que agregar esta capa sobre el mapa en cuestión
        this.markers.addTo(this.mapa);
    };

    obtenerSugerencias(sugerencia) {
        this.gasApi.obtenerDatos()
            .then(datos => {
                const resultado = datos.results;
                //enviar el json y la búsqueda para el filtrado
                this.filtrarSugerencias(resultado, sugerencia);
            })
    };

    filtrarSugerencias(resultado, busqueda) {
        //filtrar con .filter
        const filtro = resultado.filter( filtro => filtro.calle.indexOf(busqueda) !== -1);
        console.log(filtro);        
        //mostrar los pines filtrados
        this.mostrarPines(filtro)
    };
}