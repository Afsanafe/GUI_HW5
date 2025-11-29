// JavaScript source file that holds the logic for the game

$(document).ready(function() {
    // Make the cards movable
    $(".card").draggable({
        revert: "invalid", // automatically handles the animation of the item snapping back if the user drops it outside the target
        // helper: "none"    // Leaves the original item in place until the drop is confirmed 
    });

    // Both target and origin boxes can accept the cards
    $("#origin, #target").droppable({ // The comma acts like an 'and' operator
        accept: ".card",
        activeClass: "highlight",
        drop: function(event, ui) {
            var droppedItem = ui.draggable;
            $(this).append(droppedItem); // 
            droppedItem.css({top: 0, left: 0});
        }
    });
});