# Otter River Adventure Game

A mobile-friendly Three.js game where you control an otter navigating through a river while avoiding obstacles.

## Play the Game

You can play the game here: [Play Otter River Adventure](https://samsa-dev.github.io/otter-river-game/)

## How to Play

1. Open the game on your mobile device
2. Tap to start
3. Touch and drag left/right to move the otter
4. Avoid the red obstacles
5. Try to get the highest score!

## Development

To run the game locally:
1. Clone this repository
2. Open `index.html` in your browser

## Technologies Used

- Three.js for 3D graphics
- HTML5
- CSS3
- JavaScript

## Features

- Mobile-optimized touch controls
- 3D graphics using Three.js
- Score tracking
- Responsive design
- Easy WordPress integration via shortcode

## Requirements

- WordPress 5.0 or higher
- Modern web browser with WebGL support
- Mobile device with touch screen

## Installation

1. Download the plugin files
2. Create a new folder called `otter-river-game` in your WordPress plugins directory (`wp-content/plugins/`)
3. Upload the following files to the `otter-river-game` folder:
   - `otter-river-game.php`
   - `otter-river-game.js`
4. Activate the plugin through the WordPress admin panel

## Usage

1. Create a new page or post in WordPress
2. Add the shortcode `[otter_river_game]` where you want the game to appear
3. Publish the page/post

## Game Controls

- Touch and drag left/right to move the otter
- Avoid obstacles to increase your score
- Game ends when you hit an obstacle
- Tap to restart after game over

## Customization

The game can be customized by modifying the following files:

- `otter-river-game.js`: Main game logic and Three.js implementation
- `otter-river-game.php`: WordPress integration and styling

## Adding Custom 3D Models

To add custom 3D models:

1. Create or obtain a GLTF/GLB format 3D model
2. Place the model file in the plugin directory
3. Update the `loadOtter()` function in `otter-river-game.js` to load your custom model

## Support

For support, please create an issue in the GitHub repository or contact the plugin author.

## License

This plugin is licensed under the GPL v2 or later.

## Credits

- Three.js - https://threejs.org/
- WordPress - https://wordpress.org/ 