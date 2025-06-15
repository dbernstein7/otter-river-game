<?php
/*
Plugin Name: Otter River Adventure Game
Description: A Three.js-based otter river adventure game for WordPress
Version: 1.0
Author: Your Name
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue necessary scripts and styles
function otter_river_game_enqueue_scripts() {
    // Enqueue Three.js
    wp_enqueue_script('three-js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', array(), 'r128', true);
    
    // Enqueue game script
    wp_enqueue_script('otter-river-game', plugins_url('otter-river-game.js', __FILE__), array('three-js'), '1.0', true);
    
    // Add custom styles
    wp_add_inline_style('wp-block-library', '
        #game-container {
            width: 100%;
            height: 100vh;
            position: relative;
            overflow: hidden;
        }
        #score {
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            font-size: 24px;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
    ');
}
add_action('wp_enqueue_scripts', 'otter_river_game_enqueue_scripts');

// Add shortcode for the game
function otter_river_game_shortcode() {
    return '<div id="game-container"><div id="score">Score: 0</div></div>';
}
add_shortcode('otter_river_game', 'otter_river_game_shortcode');

// Add admin menu
function otter_river_game_admin_menu() {
    add_menu_page(
        'Otter River Game Settings',
        'Otter River Game',
        'manage_options',
        'otter-river-game',
        'otter_river_game_settings_page',
        'dashicons-games',
        30
    );
}
add_action('admin_menu', 'otter_river_game_admin_menu');

// Settings page
function otter_river_game_settings_page() {
    ?>
    <div class="wrap">
        <h1>Otter River Game Settings</h1>
        <p>Use the shortcode <code>[otter_river_game]</code> to add the game to any page or post.</p>
        <h2>How to Use</h2>
        <ol>
            <li>Create a new page or post</li>
            <li>Add the shortcode <code>[otter_river_game]</code> where you want the game to appear</li>
            <li>Publish the page/post</li>
        </ol>
        <h2>Game Controls</h2>
        <ul>
            <li>Touch and drag left/right to move the otter</li>
            <li>Avoid obstacles to increase your score</li>
            <li>Game ends when you hit an obstacle</li>
        </ul>
    </div>
    <?php
} 