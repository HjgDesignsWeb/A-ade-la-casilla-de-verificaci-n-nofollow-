/**
 * Añade la opción de rel="nofollow" al modal nativo de enlaces de WordPress (wplink).
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        if (typeof wpLinkL10n === 'undefined') {
            return;
        }

        // Modificar la estructura de wplink al abrirse el modal
        $(document).on('wplink-open', function() {
            if ($('#wp-link-nofollow').length === 0) {
                var nofollowCheckbox = '<div class="link-nofollow" style="float: left; margin: 11px 0 0 0;">' +
                    '<label><span></span>' +
                    '<input type="checkbox" id="wp-link-nofollow" /> ' +
                    'Añadir rel="nofollow"' +
                    '</label>' +
                    '</div>';
                
                // Insertarlo dentro del contenedor de opciones del enlace
                $('#link-options').append(nofollowCheckbox);
            }

            // Sincronizar el estado del checkbox si el enlace ya tiene rel="nofollow"
            var currentRel = wpLink.getAttrs().rel || '';
            if (currentRel.indexOf('nofollow') !== -1) {
                $('#wp-link-nofollow').prop('checked', true);
            } else {
                $('#wp-link-nofollow').prop('checked', false);
            }
        });

        // Interceptar la obtención de atributos al insertar/actualizar el enlace
        if (typeof wpLink !== 'undefined' && typeof wpLink.getAttrs === 'function') {
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

})(jQuery);