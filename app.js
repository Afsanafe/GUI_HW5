// JavaScript source file that holds the logic for the game

$(document).ready(function() {
    // Make the cards movable
    $(".card").draggable({
        revert: "invalid",
        helper: "clone"
    });

    // Make the target box accept drops
    $("#target").droppable({
        accept: ".card",
        activeClass: "highlight",
        drop: function(event, ui) {
            var droppedItem = ui.draggable;
            $(this).append(droppedItem);
            droppedItem.css({top: 0, left: 0});
        }
    });
});