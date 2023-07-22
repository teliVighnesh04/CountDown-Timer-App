document.addEventListener("DOMContentLoaded", function() {
    var startButton = document.getElementById("startButton");
    var resetButton = document.getElementById("resetButton");
    var minutesInput = document.getElementById("minutesInput");
    var countdownDisplay = document.getElementById("countdown");
    var countdownInterval;

    startButton.addEventListener("click", function() {
        var minutes = parseInt(minutesInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            startTimer(minutes);
        }
    });

    resetButton.addEventListener("click", function() {
        clearInterval(countdownInterval);
        countdownDisplay.textContent = "00:00";
    });

    function startTimer(minutes) {
        var seconds = minutes * 60;
        clearInterval(countdownInterval);

        countdownInterval = setInterval(function() {
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.textContent = "Time's up!";
            } else {
                var minutesRemaining = Math.floor(seconds / 60);
                var secondsRemaining = seconds % 60;

                var formattedMinutes = minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining;
                var formattedSeconds = secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining;

                countdownDisplay.textContent = formattedMinutes + ":" + formattedSeconds;
            }
            seconds--;
        }, 1000);
    }
});

