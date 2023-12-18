jQuery(document).ready(function($) {
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Umbral de scroll hacia arriba antes de ocultar el contenedor
  
    $(window).scroll(function() {
      const st = $(this).scrollTop();
  
      if (st > lastScrollTop) {
        $('#newsContainer').fadeIn();
      } else {
        // Verificar si la diferencia de scroll es mayor que el umbral
        if (lastScrollTop - st > scrollThreshold) {
          $('#newsContainer').fadeOut();
        }
      }
  
      lastScrollTop = st;
    });
  });