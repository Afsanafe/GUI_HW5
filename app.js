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
    // 1. BOARD SLOTS: Handle dropping onto the game board
    $(".board-slot").droppable({
        accept: ".tile",
        tolerance: "intersect", 
        drop: function(event, ui) {
            
            // FIX #1: When checking if the slot is full, ignore the tile we are currently holding.
            // This allows you to pick up a tile and drop it back in the same spot without it bouncing back.
            if ($(this).find(".tile").not(ui.draggable).length > 0) {
                ui.draggable.draggable('option', 'revert', true);
                return;
            }

            // Detach the tile from the rack (or previous slot)
            var tile = ui.draggable.detach();
            
            // FIX #2: Remove margins and center the tile
            // We set 'top' and 'left' to 0 and 'margin' to 0 so it sits flush in the corner.
            // If you want it strictly 70px (smaller than the slot), we can center it.
            tile.css({
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '80px',    // Restore original smaller size
                height: '80px',   
                margin: 0   // Restore the margin so they have breathing room in the rack
            });
            
            $(this).append(tile);
            
            // Reset revert so it doesn't bounce back next time
            tile.draggable('option', 'revert', 'invalid');

            // Update score
            calculateScore();
        }
    });

// 2. RACK: Handle dragging tiles BACK to the rack
    $("#rack").droppable({
        accept: ".tile",
        drop: function(event, ui) {
            var tile = ui.draggable.detach();
            
            // FIX #3: Restore the tile to its original "Rack Mode" state
            tile.css({
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '70px',    // Restore original smaller size
                height: '70px',   
                margin: 0   // Restore the margin so they have breathing room in the rack
            });
            
            $(this).append(tile);

            // Update score
            calculateScore();
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
        stack: ".tile",               // Ensure the dragged tile is always on top
        // snap: ".board-slot, #rack",   // Snap to board slots or back to rack
        // snapMode: "inner",            // Only snap to the INSIDE of the box */
        snapTolerance: 50,            // Increase distance (px) to make the magnet stronger/smoother */
        start: function(event, ui) {
            // Optional: visual effects when dragging starts
            $(this).css("opacity", "0.8"); 
        },
        stop: function(event, ui) {
            $(this).css("opacity", "1");
        }
    });
}


function calculateScore() {
    var roundScore = 0;
    var wordMultiplier = 1; // Used for "Double Word Score"
    var word = "";

    // Loop through every slot on the board
    $(".board-slot").each(function() {
        var tile = $(this).find(".tile"); // Look for a tile inside
        
        // If there is a tile here...
        if (tile.length > 0) {
            var letter = tile.attr("data-letter"); // Get 'A'
            var score = parseInt(tile.attr("data-value")); // Get 1
            
            word += letter;

            // CHECK BONUSES 
            // We look at the slot's ID or class to see if it's special
            if ($(this).hasClass("bonus-letter")) {
                score *= 2; // Double Letter Score
            }
            if ($(this).hasClass("bonus-word")) {
                wordMultiplier *= 2; // Double Word Score (applied at end)
            }

            roundScore += score;
        }
    });

    // Apply Word Multipliers
    roundScore *= wordMultiplier;
    
    // Update the UI
    $("#score-value").text(roundScore);
    $("#message-area").text("Word Played: " + word + " (" + roundScore + " points)");
    
    // Optional: Add roundScore to totalScore global variable here
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

    // // Update the text inside slot-2
    // $("#slot-2").text("DOUBLE WORD");

    // // Update the text inside slot-5
    // $("slot-5").text("DOUBLE WORD")

    // 4. Deal a fresh hand
    dealTiles();
    $("#message-area").text("");
}