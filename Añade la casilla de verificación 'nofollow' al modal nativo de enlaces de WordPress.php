/**
 * Añade la casilla de verificación 'nofollow' al modal nativo de enlaces de WordPress (wplink).
 */
function agregar_checkbox_nofollow_wplink() {
    // Solo en las páginas de edición de administración
    if ( ! is_admin() ) {
        return;
    }
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            if (typeof wpLinkL10n !== 'undefined') {
                // Modificar la estructura de wplink al abrirse
                $(document).on('wplink-open', function() {
                    if ($('#wp-link-nofollow').length === 0) {
                        var nofollowCheckbox = '<div class="link-nofollow">' +
                            '<label><span></span>' +
                            '<input type="checkbox" id="wp-link-nofollow" /> ' +
                            'Añadir rel="nofollow"' +
                            '</label>' +
                            '</div>';
                        $('#link-options').append(nofollowCheckbox);
                    }

                    // Cargar estado si ya existe rel="nofollow"
                    var currentRel = wpLink.getAttrs().rel || '';
                    if (currentRel.indexOf('nofollow') !== -1) {
                        $('#wp-link-nofollow').prop('checked', true);
                    } else {
                        $('#wp-link-nofollow').prop('checked', false);
                    }
                });

                // Inyectar o quitar nofollow al guardar/insertar el enlace
                var originalGetAttrs = wpLink.getAttrs;
                wpLink.getAttrs = function() {
                    var attrs = originalGetAttrs.call(this);
                    var isNofollow = $('#wp-link-nofollow').is(':checked');

                    var rels = attrs.rel ? attrs.rel.split(' ') : [];
                    var index = rels.indexOf('nofollow');

                    if (isNofollow) {
                        if (index === -1) {
                            rels.push('nofollow');
                        }
                    } else {
                        if (index !== -1) {
                            rels.splice(index, 1);
                        }
                    }

                    attrs.rel = rels.join(' ').trim();
                    return attrs;
                };
            }
        });
    </script>
    <?php
}
add_action( 'admin_footer-post.php', 'agregar_checkbox_nofollow_wplink' );
add_action( 'admin_footer-post-new.php', 'agregar_checkbox_nofollow_wplink' );