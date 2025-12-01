# Single-Line Scrabble Game

## Overview

A browser-based implementation of a single-line Scrabble game built with vanilla JavaScript and jQuery UI. Players drag Scrabble tiles onto a linear board, form valid English words, and earn points based on tile values and bonus squares. The game validates words against a dictionary containing 400,000+ English words and implements classic Scrabble scoring mechanics including bonus squares.

---

## Game Features

### Core Gameplay

- **Drag-and-Drop Tiles**: Click and drag tiles from the rack onto the board using jQuery UI draggable/droppable functionality
- **Single-Line Board**: 7 consecutive board slots form a linear game board for creating words
- **7-Tile Rack**: Players manage a hand of 7 tiles that automatically refills when tiles are played
- **Continuous Words**: Enforces that all tiles in a word must be placed consecutively with no gaps
- **Minimum 2-Letter Words**: Prevents single-letter submissions

### Bonus Squares

- **Double Word Score (Slots 2 & 5)**: Multiplies the entire word score by 2
- **Double Letter Score (Future Expansion)**: Multiplies individual tile value by 2
- Visual styling distinguishes bonus squares from standard squares

### Scoring System

- **Tile Point Values**: Each letter has a point value (A=1, B=3, C=3, Z=10, etc.)
- **Bonus Multipliers**: Applied during word validation
  - Double Letter: Multiplies the tile's value by 2
  - Double Word: Multiplies the entire word's total value by 2
- **Cumulative Score**: Total score persists across multiple word submissions until game reset

### Dictionary Validation

- **400,000+ Word Dictionary**: Loaded from `words.txt` file during game initialization
- **Case-Insensitive Matching**: Tiles are matched against uppercase dictionary entries
- **Real-Time Feedback**: Immediate validation results when submitting words
- **Error Messages**: Specific feedback for invalid words, gaps in words, or insufficient tile count

### Blank Tiles

- **Special Blank Tile ('_')**: Can represent any letter
- **Interactive Assignment**: Clicking "Submit Word" with a blank tile triggers a prompt asking the player which letter it represents
- **Input Validation**: Ensures only valid A-Z letters are accepted
- **Persistent Assignment**: Once assigned, the blank tile displays and scores as the selected letter
- **Revert on Cancel**: Users can cancel the assignment, returning the tile to the rack

### Game Controls

- **Deal New Tiles**: Refills the rack up to 7 tiles (respects tile bag depletion)
- **Submit Word**: Validates the current word on the board against the dictionary and scoring rules
- **Restart Game**: Clears board/rack, resets score to 0, and restores tile distribution

---

## Implementation Details

### Architecture

**File Structure:**
- `index.html` - Semantic HTML markup with game board, rack, and controls
- `app.js` - Core game logic and jQuery event handlers
- `styles.css` - Visual styling for board, tiles, and UI elements
- `graphics_data/Scrabble_Pieces_AssociativeArray_Jesse.js` - Scrabble tile data (letter distributions, point values)
- `graphics_data/Scrabble_Tiles/` - Image files for each tile (A-Z, Blank)
- `words.txt` - 400,000+ word dictionary for validation

### Key Functions

#### `$(document).ready(function() { ... })`
Initialization on page load:
- Loads the `words.txt` dictionary into a global array
- Initializes the board (makes slots droppable)
- Deals the initial 7 tiles to the rack
- Attaches click listeners to "Deal", "Submit", and "Reset" buttons

#### `initializeBoard()`
Sets up jQuery UI droppable zones:
- **Board Slot Drop Handler**: Accepts tiles dragged from rack/other slots
  - Prevents multiple tiles per slot
  - Handles blank tile letter assignment via prompt
  - Removes margins and positions tile correctly
  - Resets revert behavior for smooth interaction
- **Rack Drop Handler**: Accepts tiles dragged back from board
  - Restores original tile dimensions (70px × 70px)
  - Restores margins for proper spacing

#### `dealTiles()`
Manages tile distribution:
- Counts tiles on both rack and board
- Calculates tiles needed to reach 7 total
- Prevents dealing if hand is already full
- Calls `getRandomTile()` for each tile to deal
- Appends new tiles to rack with proper attributes (`data-letter`, `data-value`)
- Calls `makeTilesDraggable()` to enable interaction on new tiles
- Updates remaining tile count

#### `getRandomTile()`
Random tile selection from the "bag":
- Builds array of letters with `number-remaining > 0`
- Returns `null` if bag is empty
- Selects random letter and decrements its count in `ScrabbleTiles` object
- Returns the selected letter

#### `makeTilesDraggable()`
Configures jQuery UI draggable behavior:
- `revert: "invalid"` - Snaps tile back if dropped outside valid zones
- `stack: ".tile"` - Ensures dragged tile stays on top
- Visual feedback: reduces opacity during drag, restores on drop

#### `validateWord()`
Core game logic for word validation:
- Loops through all 7 board slots in order
- Concatenates tiles into a word string
- Detects gaps in tile placement and rejects if found
- Calculates score:
  - Applies double-letter bonus per tile
  - Accumulates tile values
  - Applies double-word bonus to total
- Validates minimum 2-letter requirement
- Searches dictionary array for word match
- **On Success**: 
  - Adds round score to global `totalScore`
  - Clears board tiles
  - Displays success message in green
- **On Failure**: Displays error message in red

#### `resetGame()`
Game state reset:
- Clears rack and board of all tiles
- Resets `totalScore` to 0
- Restores each letter's `number-remaining` to `original-distribution`
- Deals fresh hand of 7 tiles

#### `updateRemainingTiles()`
Displays remaining tile count:
- Loops through `ScrabbleTiles` and sums all `number-remaining` counts
- Updates the UI display
- Shows "Empty" in red when bag is depleted

#### `generateID()`
Creates unique identifiers for tile elements:
- Returns random number (0-100000) for use in tile IDs

---

## Technical Stack

- **HTML5**: Semantic markup for game structure
- **CSS3**: Flexbox layout, gradient effects, responsive positioning
- **JavaScript (Vanilla)**: Game state management and logic
- **jQuery**: DOM manipulation and event handling
- **jQuery UI**: Draggable/droppable interactions for tile movement

---

## Game Rules

1. **Tile Placement**: Drag tiles from the rack onto board slots
2. **Word Formation**: All tiles must form a continuous word (no gaps)
3. **Minimum Length**: Words must be at least 2 letters long
4. **Dictionary Check**: Word must exist in the loaded 400,000+ word dictionary
5. **Scoring**:
   - Each tile has a point value
   - Double Letter squares multiply that tile by 2
   - Double Word squares multiply the entire word by 2
6. **Tile Refill**: After submitting a valid word, new tiles are automatically dealt to reach 7
7. **Blank Tiles**: Can represent any letter A-Z when played

---

## How to Play

1. Open `index.html` in a web browser
2. **Deal New Tiles** - Refills your rack if tiles have been played
3. Drag tiles onto the board to form a word
4. Click **Submit Word** to validate and score
5. Successfully scored words clear the board; invalid words show error messages
6. Continue playing until the tile bag is empty
7. Click **Restart Game** to reset everything and play again

---

## Bonus Feature

- ✅ **400,000+ Word Dictionary Integration**: Real-time validation using loaded word list

---

## Author

**Afsa Nafe**
- Affiliation: UMass Lowell, Computer Science Department
- Email: afsa_nafe@student.uml.edu
- Last Updated: December 1st, 2025

---

## License

Copyright (c) 2025 by Afsa Nafe. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.