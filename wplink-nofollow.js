/**
 * Añade la opción de rel="nofollow" al modal nativo de enlaces de WordPress (wplink).
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        if (typeof wpLinkL10n === 'undefined') {
            return;
        }

        // Función para verificar y actualizar el estado del checkbox
        function actualizarEstadoCheckbox() {
            var $checkbox = $('#wp-link-nofollow');
            if ($checkbox.length === 0) {
                return;
            }

            var attrs = {};
            if (typeof wpLink !== 'undefined' && typeof wpLink.getAttrs === 'function') {
                attrs = wpLink.getAttrs() || {};
            }

            var currentRel = attrs.rel || '';

            // Si wpLink.getAttrs no trae el rel aún, lo leemos directamente del elemento seleccionado en TinyMCE / Editor
            if (!currentRel && typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                var selectedNode = tinymce.activeEditor.selection.getNode();
                if (selectedNode && selectedNode.nodeName === 'A') {
                    currentRel = $(selectedNode).attr('rel') || '';
                }
            }

            // Marcar o desmarcar el checkbox según corresponda
            var tieneNofollow = currentRel.split(' ').indexOf('nofollow') !== -1;
            $checkbox.prop('checked', tieneNofollow);
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
                
                $('#link-options').append(nofollowCheckbox);
            }

            // Sincronizar inmediatamente y tras un pequeño delay para asegurar la lectura del nodo
            actualizarEstadoCheckbox();
            setTimeout(actualizarEstadoCheckbox, 50);
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
