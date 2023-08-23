let board, boardWidth = 500, boardHeight = 500, canvasContext, playerWidth = 12,
playerHeight = 70, playerVelocityY = 0, ballWidth = 15, ballHeight = 15,
player1Score = 0, player2Score = 0,
player1 = {
    /**Giving x and y co-ordinates for player one paddle who is on left side */
    x: 10,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : playerVelocityY
},
player2 = {
    /**Giving x and y co-ordinates for player two paddle who is on right side */
    x: boardWidth - playerWidth - 10,
    y: boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : playerVelocityY
},
ball = {
    /**Placing the ball at the center of the board */
    x : boardWidth / 2,
    y : boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    /**Moving ball twice as fast towards y axis comparing to x axis.
     * Means moving left and right we are just going to shift the ball
     * by 1 pixel but moving up and down we will shift the ball by 2 pixels.
     * we are also moving the ball towards postive direction in x axis which
     * is right side direction and moving the ball towards positive direction 
     * in y axis which is down side direction.*/
    velocityX : 1,
    velocityY : 2
};

window.onload = firstStep();

function firstStep() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    /**This is used for drawing on the board or canvas */
    canvasContext = board.getContext("2d");
    //canvasContext2 = board.getContext("2d");

    /**Drawing Player 1 */
    canvasContext.fillStyle = "darkred";
    canvasContext.fillRect(player1.x, player1.y, player1.width, player1.height);
    /**Calling the update function */
    requestAnimationFrame(update);

    /**Adding an event listener */
    document.addEventListener("keyup", movePlayer);
}

function update() {
    requestAnimationFrame(update);
    /**Clearing the Canvas after moving players up and down.
     * Here 0 and 0 represents top left corners whereas board.width
     * board.height are the width and height of rectangle.*/
    canvasContext.clearRect(0, 0, boardWidth, boardHeight);
    //canvasContext2.clearRect(0, 0, boardWidth, boardHeight);
    /**Drawing Player 1 */
    canvasContext.fillStyle = "darkred";
    //player1.y += player1.velocityY;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBound(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    canvasContext.fillRect(player1.x, player1.y, player1.width, player1.height);
    canvasContext.fillStyle = "indigo";
    //player2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBound(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    canvasContext.fillRect(player2.x, player2.y, player2.width, player2.height);

    /**Ball */
    canvasContext.fillStyle = "forestgreen";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    canvasContext.fillRect(ball.x, ball.y, ball.width, ball.height);

    /**If ball touches top border of the canvas that is why ball.y <= 0
     * or if ball touches the bottom border of the canvas that is why
     * ball.y + ball.height >= boardHeight.*/
    if (ball.y <= 0 || (ball.y + ball.height >= boardHeight)) {
        /**It will reverse the direction of the ball once it touches the 
         * border of the board. If ball is going at +2 velocity to downwards
         * once it touches the bottom border the calculation will be (2* -1)
         * and it will change the direction afterwards. If ball is going at 
         * -2 velocity to upwards once it touches the up border the calculation
         *  will be (-2 * -1) and it will change the direction afterwards.*/
        ball.velocityY *= -1;
    }

        /**Bounce the ball back */
        if (detectCollision(ball, player1)) {
            if (ball.x <= player1.x + player1.width) {
                /**Left side of ball touching right side of player 1 */
                ball.velocityX *= -1; /**Flip X direction */
            }
        } else if (detectCollision(ball, player2)) {
            if (ball.x + ball.width >= player2.x) {
                /**Right side of ball touching left side of player 2 */
                ball.velocityX *= -1; /**Flip X direction */
            }
        }
        
        /**If the ball get past player 1 who is on the left hand side*/
        if (ball.x < 0) {
            player2Score ++;
            resetGame(1);
        }
        /**If the ball get past player 2 who is on the right hand side*/
        else if (ball.x + ballWidth > boardWidth) {
            player1Score ++;
            resetGame(-1);
        }

        /**Drawing the Scores */
        canvasContext.fillStyle = "maroon";
        canvasContext.font = "45px sans-sherif";
        /**Setting an X postion by dividing boardwidth by 5 and 
         * setting Y postion to 45 */
        canvasContext.fillText(player1Score, boardWidth / 5, 45);
        canvasContext.fillStyle = "darkmagenta";
        canvasContext.font = "45px sans-sherif";
        /**Setting an X postion by multiplying boardwidth by 4/5 and 
        substracting 45 px pf font size from it and setting Y postion to 45 */
        canvasContext.fillText(player2Score, (boardWidth * 4/5 - 45), 45);

        /**Draw Dotted Line in the Middle */
        canvasContext.fillStyle = "orangered";
        for (let i = 0; i < board.height; i += 25) {
            /**i = starting y position, draw a square every 25 pixels down.
             * x position = (half of board width - 10) which means x position
             *  will always be at the middle of the board. The i = y position
             * which means i will be at y poisiton. Height is 20 pixel and 
             * width is 7 pixel.*/
            canvasContext.fillRect(board.width / 2 - 10, i, 7, 20);
        }

}

function outOfBound(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) {
    /**For player one to move the paddle up and down */
    if (e.code === "KeyW") {
        player1.velocityY = -3;
    } else if (e.code === "KeyS") {
        player1.velocityY = 3;
    }

      /**For player one to move the paddle up and down */
      if (e.code === "ArrowUp") {
        player2.velocityY = -3;
    } else if (e.code === "ArrowDown") {
        player2.velocityY = 3;
    }
}

function detectCollision(a, b) {
    /**This general formula is being used to detect the intersection or
     * collision between two rectangles.*/
    return a.x < b.x + b.width && /**a top left corner does not reach b top right corner. */
    a.x + a.width > b.x && /**a top right corner passes b top left corner */
    a.y < b.y + b.height && /**a top left corner does not reach b bottom left corner. */
    a.y + a.height > b.y; /**a bottom left corner passes b top left corner */
}

function resetGame(direction) {
    ball = {
        /**Placing the ball at the center of the board */
        x : boardWidth / 2,
        y : boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        /**Moving ball twice as fast towards y axis comparing to x axis.
         * Means moving left and right we are just going to shift the ball
         * by 1 pixel but moving up and down we will shift the ball by 2 pixels.
         * we are also moving the ball towards postive direction in x axis which
         * is right side direction and moving the ball towards positive direction 
         * in y axis which is down side direction.*/
        velocityX : direction,
        velocityY : 2
    };
    
}