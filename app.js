// JavaScript source file that holds the logic for the game

/* app.js */

var totalScore = 0;

// This array acts as the "bag" of tiles. 
// We rely on the 'ScrabbleTiles' global object from the other JS file.

$(document).ready(function() {
    // 1. Initialize the board (make slots droppable) - we will add this in the next step
    initializeBoard();
    // 2. Deal the first hand of 7 tiles
    dealTiles();

    // 3. Setup Button Event Listeners
    $("#deal-btn").click(function() {
        dealTiles(); // Logic to refill hand
    });
    
    $("#reset-btn").click(function() {
        resetGame();
    });
});

// Drop Logic, handles when a user drops a tile on a board slot.
/* script.js - Add this new function */

function initializeBoard() {
    // 1. Make the board slots droppable targets
    $(".board-slot").droppable({
        accept: ".tile", // Only accept elements with class 'tile'
        tolerance: "intersect", // Drag must overlap slightly to count
        drop: function(event, ui) {
            
            // 'this' refers to the board slot we just dropped on
            var droppedID = $(this).attr("id");
            
            // check if the slot is already filled
            if ($(this).find(".tile").length > 0) {
                // If full, revert the tile back to where it came from
                ui.draggable.draggable('option', 'revert', true);
                return;
            }

            // SNAP TO GRID LOGIC
            // 1. Detach the tile from the rack (or previous slot)
            var tile = ui.draggable.detach();
            
            // 2. Clear "top" and "left" styles set by jQuery UI during drag
            //    This effectively "snaps" it into the new parent container
            tile.css({top: 0, left: 0, position: 'relative'});
            
            // 3. Append the tile to this board slot
            $(this).append(tile);
            
            // 4. Reset revert so it doesn't bounce back next time
            tile.draggable('option', 'revert', 'invalid');
        }
    });

    /* Add this to initializeBoard or a new initializeRack function */
    // 2. Make the Rack a droppable target too
    $("#rack").droppable({
        accept: ".tile",
        drop: function(event, ui) {
            // Logic is similar: detach and append back to the rack
            var tile = ui.draggable.detach();
            tile.css({top: 0, left: 0, position: 'relative'});
            $(this).append(tile);
        }
    });
}
 

// Uses the needed amount of tiles.
function dealTiles() {
    var rack = $("#rack");
    var currentTiles = rack.children().length;
    var tilesNeeded = 7 - currentTiles; // Refill up to 7 

    // Safety check: Don't do anything if rack is full
    if (tilesNeeded <= 0) return;

    for (var i = 0; i < tilesNeeded; i++) {
        var randomLetter = getRandomTile();
        
        // If the bag is empty, stop dealing
        if (randomLetter === null) {
            $("#message-area").text("No more tiles left in the bag!");
            break; 
        }

        // Generate the Image HTML
        // Note: We use the letter to build the filename, e.g., "Scrabble_Tile_A.jpg"
        // We handle the Blank tile mapping explicitly if needed
        var tileImageName = (randomLetter === "_") ? "graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg" : "graphics_data/Scrabble_Tiles/Scrabble_Tile_" + randomLetter + ".jpg";
        
        // Create the image element
        var tileHTML = $('<img class="tile">')
            .attr("src", tileImageName)          // Set image source
            .attr("id", "tile-" + generateID())  // Unique ID for logic
            .attr("data-letter", randomLetter)   // Store the letter value in the DOM
            .attr("data-value", ScrabbleTiles[randomLetter].value); // Store points

        // Append to Rack
        rack.append(tileHTML);
    }

    // IMPORTANT: Apply Draggable logic to the NEW tiles
    makeTilesDraggable();
}



// Helper to pick a random available letter from the ScrabbleTiles object
function getRandomTile() {
    var availableLetters = [];

    // 1. Build a list of all letters that have a count > 0
    for (var key in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(key)) {
            if (ScrabbleTiles[key]["number-remaining"] > 0) {
                availableLetters.push(key);
            }
        }
    }

    // 2. If no letters remain, return null
    if (availableLetters.length === 0) return null;

    // 3. Pick a random index
    var randomIndex = Math.floor(Math.random() * availableLetters.length);
    var selectedLetter = availableLetters[randomIndex];

    // 4. Decrement the counter in the global data structure 
    ScrabbleTiles[selectedLetter]["number-remaining"]--;

    return selectedLetter;
}

// Helper to generate a unique ID for each tile DOM element
function generateID() {
    return Math.floor(Math.random() * 100000);
}


function makeTilesDraggable() {
    $(".tile").draggable({
        revert: "invalid",            // Snap back to rack if dropped strictly "nowhere" valid
        cursor: "move",               // Change cursor to indicate dragging
        snap: ".board-slot, #rack",   // Snap to board slots or back to rack
        stack: ".tile",               // Ensure the dragged tile is always on top
        start: function(event, ui) {
            // Optional: visual effects when dragging starts
            $(this).css("opacity", "0.8"); 
        },
        stop: function(event, ui) {
            $(this).css("opacity", "1");
        }
    });
}


function resetGame() {
    // 1. Clear the rack and board
    $("#rack").empty();
    $(".board-slot").empty(); // Remove tiles from board slots

    // 2. Reset Score
    totalScore = 0;
    $("#score-value").text(totalScore);

    // 3. Reset the Data Structure (Counts)
    // We must loop through and restore "number-remaining" to "original-distribution"
    for (var key in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(key)) {
            ScrabbleTiles[key]["number-remaining"] = ScrabbleTiles[key]["original-distribution"];
        }
    }

    // 4. Deal a fresh hand
    dealTiles();
    $("#message-area").text("");
}