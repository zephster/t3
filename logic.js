/** game logic **/
var TicTacToe = function(canvas)
{
    this.current_game;
    this.winning_games;
    this.expected_player;
    this.game_over;
    this.$game_board; //the game board object itself (canvas)
    
    this.newGame(canvas);
};

TicTacToe.prototype.help = function()
{
    console.log('available commands:');
    console.log('\t.help() - this text');
    console.log('\t.newGame() - starts a new game');
    console.log('\t.play(player, square) - make a move. squares numbered 0-8 starting from the top left. displays game board afterwards');
    console.log('\t.viewGameBoard() - view current game board without making a move');
};

TicTacToe.prototype.newGame = function(canvas)
{
    //set up a new game
    this.current_game    = [[0,0,0],[0,0,0],[0,0,0]];
    this.winning_games   = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    this.expected_player = 'x';
    this.game_over       = false;
    
    console.log('new game started. game.help() for commands');
    
    //set up game board ui
    if (canvas != undefined)
    {
        this.$game_board = new TicTacToeBoard(this, canvas);
    }
};


TicTacToe.prototype.expectedPlayer = function()
{
    return this.expected_player;
};


TicTacToe.prototype.viewGameBoard = function()
{
    var grid = '\n';
    for (var row in this.current_game)
    {
        grid += this.current_game[row][0] + ' | ' + this.current_game[row][1] + ' | ' + this.current_game[row][2];
        
        if (row <= 1){
            grid += '\n';
            grid += '----------';
        
        }
        
        grid += '\n';
    }
    
    return grid;
};


TicTacToe.prototype.play = function(player, square)
{
    var square = parseInt(square),
        status = {},
        move;
    
    status.won = false;
    
    //check stuff
    if (this.game_over){
        status.won = true;
        status.message = "this game is done! use .newGame() to start a new game";
        return status;
    }
    
    if (!player){
        status.message = "missing player";
        return status;
    }
    
    if (isNaN(square)){
        status.message = "missing or invalid square";
        return status;
    }
    
    if (player != this.expected_player){
        status.message = "it is not your turn";
        return status;
    }
    
    //actually make the move
    if (!this._isValidMove(player, square)){
        status.message = "square already taken";
        return status;
    }
    
    //did it win?
    move = this._isWinningMove(player);
    if (move === false) //!win evals when win is in top row (index 0) lol
    {
        this.expected_player = (player == 'x') ? 'o' : 'x';
    }
    else
    {
        status.won     = true;
        status.move    = move;
    }
    
    return status;
};


TicTacToe.prototype._isValidMove = function(player, square)
{
    // is this a valid move?
    if (square >= 0 && square <= 8)
    {
        if (square <= 2)
        {
            if (this.current_game[0][square] !== 0){
                return false;
            }
            this.current_game[0][square] = player;
        }
        else if (square >= 3 && square <= 5)
        {
            if (this.current_game[1][square-3] !== 0){
                return false;
            }
            this.current_game[1][square-3] = player;
        }
        else if (square >= 6)
        {
            if (this.current_game[2][square-6] !== 0){
                return false;
            }
            this.current_game[2][square-6] = player;
        }
    }
    else
    {
        return false;
    }
    
    return true;
};

TicTacToe.prototype._isWinningMove = function(player)
{
    var squareCount  = 0,
        moves        = [],
        winning_move = false;
    
    //list currently plotted moves for player
    for (var row in this.current_game)
    {
        for (var square in this.current_game[row])
        {
            if (this.current_game[row][square] == player)
            {
                moves.push(squareCount);
            }
            
            squareCount++;
        }
    }
    
    //loop through winning game positions, see if we've got a complete set
    for (var winning_moves in this.winning_games)
    {
        var win_combo     = this.winning_games[winning_moves],
            current_combo = $.grep(win_combo, function(square_pos)
            {
                return $.inArray(square_pos, moves) < 0; // return bool instead of pos
            });
        
        if (current_combo.length == 0)
        {
            //winning_move   = true;
            winning_move   = winning_moves; //index of the win combo in this.winning_games
            this.game_over = true;
        }
    }
    
    return winning_move;
};