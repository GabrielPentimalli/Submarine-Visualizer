# Submarine Visualizer

Interactive submarine visualization representing multivariate data. Each submarine's physical properties (depth, size, components) reflect data variables. Click to select and exchange values between submarines with smooth animations.


## Overview

This project visualizes a multivariate dataset using submarine silhouettes. Each submarine represents one data point with 5 variables:

- **Depth**: Vertical position of the submarine
- **Length**: Horizontal size of the submarine
- **Tower Height**: Size of the tower/sail above the main body
- **Body Height**: Vertical thickness of the submarine body
- **Periscope Radius**: Size of the periscope component

## Features

- **Interactive Selection**: Click on any submarine to select it (turns white)
- **Value Exchange**: Click on a second submarine to exchange variable values between them
- **Smooth Animations**: All transformations occur with fluid animations
- **D3.js Scales**: Flexible mapping of data ranges to visual properties
- **Tooltips**: Hover over submarines to see the numerical data values
- **Data Export**: Export the current dataset as JSON

## How to Use

1. Open `index.html` in a modern web browser
2. Observe the 10 submarines representing different data points
3. Click on a submarine to select it (it will turn white)
4. Click on another submarine to exchange their data values (except x-position)
5. Watch the animated transformation as the submarines adapt to their new data values
6. Click "Export Data JSON" to download the current dataset

## Implementation Details

- Built with vanilla JavaScript and D3.js (no frameworks)
- Each submarine maintains its horizontal position (x-value) throughout interactions
- All other properties can be exchanged between submarines
- D3.js scales ensure proper mapping of any data range to appropriate visual dimensions


## Development

To modify the visualization:

1. Adjust the `generateMultivariateData()` function to change initial dataset values
2. Modify the submarine drawing function `drawSubmarine()` to alter appearance
3. Update scale domains and ranges to change how data maps to visual properties


## Author

[Gabriel Pentimalli ](https://github.com/GabrielPentimalli) - gab.pentimalli@stud.uniroma3.it
