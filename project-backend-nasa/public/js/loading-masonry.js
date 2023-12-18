document.addEventListener("DOMContentLoaded", function () {
    // Ocultar el contenedor de noticias al principio
    document.getElementById('newsContainer').style.display = 'none';

    // Mostrar el mensaje de carga al principio
    document.getElementById('loading').style.display = 'block';

    // Lógica para cargar las noticias (aquí es donde cargas las noticias actualmente)

    // Supongamos que la carga de noticias toma algún tiempo, por ejemplo, setTimeout
    setTimeout(function () {
        // Una vez que las noticias se han cargado (simulado por setTimeout)
        // Ocultar el mensaje de carga
        document.getElementById('loading').style.display = 'none';

        // Mostrar el contenedor de noticias
        document.getElementById('newsContainer').style.display = 'block';

        // Inicializar Masonry o cualquier otro código necesario una vez que se muestran las noticias
        var grid = document.querySelector('.row');
        var masonry = new Masonry(grid, {
            itemSelector: '.col-md-4',
            columnWidth: '.col-md-4',
            gutter: 0,
            horizontalOrder: true
        });
    }, 2000); // Tiempo simulado de carga (en milisegundos)
});
