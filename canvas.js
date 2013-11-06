/** canvas **/
var PlayerX = function(canvas, size)
{
    this.$context = canvas;
    this.size     = size || 35;
    //draw player x symbol
}

PlayerX.prototype.draw = function(origin, size)
{
    this.$context.beginPath();
    this.$context.moveTo(origin.X-this.size, origin.Y-this.size);
    this.$context.lineTo(origin.X+this.size, origin.Y+this.size);
    
    this.$context.moveTo(origin.X+this.size, origin.Y-this.size);
    this.$context.lineTo(origin.X-this.size, origin.Y+this.size);
    this.$context.stroke();
};

var PlayerO = function(canvas, size)
{
    this.$context = canvas;
    this.size     = size || 35;
}

PlayerO.prototype.draw = function(origin, size)
{   
    this.$context.beginPath();
    this.$context.arc(origin.X, origin.Y, this.size, 0, 2*Math.PI); //x, y, radius, start angle in radians, end angle in radians
    this.$context.stroke();
};


var TicTacToeBoard = function(game, canvas, width, height)
{
    this.$canvas  = $(canvas);
    this.$context = this.$canvas.get(0).getContext('2d');
    this.width    = width  || 300;
    this.height   = height || 300;
    this.game     = game;
    
    this.playerX = new PlayerX(this.$context);
    this.playerO = new PlayerO(this.$context);
    
    /*this.$canvas.css({
        'width' : this.width,
        'height' : this.height
    });*/
    
    //draw game board
    this.drawGameBoard();
    
    //setup listeners on canvas
    this.createListeners(canvas, game); //needs canvas string, not object
};


TicTacToeBoard.prototype.drawGameBoard = function()
{
    this.$context.beginPath();
    this.$context.lineWidth = 1.5; //on edges, need +.5 for crisp line
    
    //border the board
    //this.$context.strokeRect(0, 0, this.width, this.height);
    
    //top horizontal
    this.$context.moveTo(0, (this.height/3));
    this.$context.lineTo(this.width, (this.height/3));
    
    //bottom horizontal
    this.$context.moveTo(0, (this.height/3)*2);
    this.$context.lineTo(this.width, (this.height/3)*2);
    
    //left vertical
    this.$context.moveTo((this.width/3), 0);
    this.$context.lineTo((this.width/3), this.height);
    
    //right vertical
    this.$context.moveTo((this.width/3)*2, 0);
    this.$context.lineTo((this.width/3)*2, this.height);
    this.$context.stroke();
};


TicTacToeBoard.prototype.createListeners = function(canvas, game)
{
    var self = this;
    $(document).on("click", canvas, function(e)
    {
        //determine which square was clicked
        var player = game.expectedPlayer(),
            click = {},
            play;
            
        click.x = Math.ceil((e.offsetX / (self.width / 3)) - 1);
        click.y = Math.ceil((e.offsetY / (self.height / 3)) - 1);
        
        if (click.y == 1) //middle row
        {
            click.x += 3;
        }
        
        if (click.y == 2) //bottom row
        {
            click.x += 6;
        }
        
        /**
         * play object
         *     won     - bool
         *     move    - index of the winning_games array that won
         *     message - string message (only present on non-valid & winning plays)
         */
        play = game.play(player, click.x);
        
        if (!play.message)
        {
            self.drawMove(player, click.x);
            
            if (play.won)
            {
                //alert(player + ' wins!');
                console.log('winning game index: ' + play.move);
                
                self.drawWinStrike(play.move);
            }
        }
        else
        {
            alert(play.message);
        }
    });
};


TicTacToeBoard.prototype.drawMove = function(player, square)
{
    var origin   = {};
        origin.X = 0;
        origin.Y = 0;
        
    if (square <= 2)
    {
        origin.X = Math.ceil(square * (this.width / 3) + 50);
        origin.Y = 50;
    }
    else if (square >= 3 && square <= 5)
    {
        origin.X = Math.ceil((square * (this.width / 3) + 50) - this.width);
        origin.Y = (this.height / 2);
    }
    else if (square >= 6)
    {
        origin.X = Math.ceil((square * (this.width / 3) + 50) - (this.width*2));
        origin.Y = 250;
    }
    
    if (player == "x"){
        this.playerX.draw(origin);
    } else{
        this.playerO.draw(origin);
    }
};


TicTacToeBoard.prototype.drawWinStrike = function(moveIndex)
{
    this.$context.beginPath();
    this.$context.lineWidth = 1.5; //on edges, need +.5 for crisp line
    
    this.$context.strokeStyle = '#ff0000';
    this.$context.shadowColor = '#000000';
    this.$context.shadowBlur = 5;
    
    /**
     * winning position indexes - for drawing winning strikethrough
     *     0 - top horizontal
     *     1 - middle horizontal
     *     2 - bottom horizontal
     *     
     *     3 - left vertical
     *     4 - middle vertical
     *     5 - right vertical
     *     
     *     6 - \ win (0,4,8)
     *     7 - / win (2,4,6)
     */
    
    switch (moveIndex)
    {
        case "0":
            this.$context.moveTo(0, (this.width/3)/2);
            this.$context.lineTo(this.width, (this.height/3)/2);
            break;
            
        case "1":
            this.$context.moveTo(0, (this.width/3)*1.5);
            this.$context.lineTo(this.width, (this.height/3)*1.5);
            break;
            
        case "2":
            this.$context.moveTo(0, (this.width/3)*2.5);
            this.$context.lineTo(this.width, (this.height/3)*2.5);
            break;
            
        case "3":
            this.$context.moveTo((this.width/6), 0);
            this.$context.lineTo((this.width/3)/2, this.height);
            break;
            
        case "4":
            this.$context.moveTo(this.width/2, 0);
            this.$context.lineTo(this.width/2, this.height);
            break;
            
        case "5":
            this.$context.moveTo((this.width/6)*5, 0);
            this.$context.lineTo((this.width/6)*5, this.height);
            break;
            
        case "6":
            this.$context.moveTo(0, 0);
            this.$context.lineTo(this.width, this.height);
            break;
            
        case "7":
            this.$context.moveTo(this.width, 0);
            this.$context.lineTo(0, this.height);
            break;
        
        default:
            return false;
    }
    
    //draw it!
    this.$context.stroke();
};