/**
 * Registra y encola el script de nofollow para el editor clásico / wplink en el admin.
 */
function registrar_script_wplink_nofollow( $hook ) {
    // Limitar la carga exclusivamente a pantallas de edición de posts/páginas
    if ( 'post.php' !== $hook && 'post-new.php' !== $hook ) {
        return;
    }

    // Ruta al archivo JS en tu tema hijo (ajustar si está en un plugin o ruta distinta)
    $js_url  = get_stylesheet_directory_uri() . '/js/wplink-nofollow.js';
    $js_path = get_stylesheet_directory() . '/js/wplink-nofollow.js';

    // Verificar que el archivo físico exista antes de encolarlo (mejora de robustez)
    if ( file_exists( $js_path ) ) {
        wp_enqueue_script(
            'wplink-nofollow',
            $js_url,
            array( 'jquery', 'wplink' ), // Dependencias críticas del núcleo
            '1.0.0',
            true // Cargar en el footer de forma limpia
        );
    }
}
add_action( 'admin_enqueue_scripts', 'registrar_script_wplink_nofollow' );