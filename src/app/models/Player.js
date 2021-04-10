let fs = require('fs');

// global player array
let players = []

/**
 * Player cst
 */
exports.Player = function Player(nom, score) {
    this.nom = nom;
    this.score = score;

    this.toString = function() {
        return this.nom + " : " + this.score + " points.";
    }
};

/**
 * Init a Player object array
 *
 */
exports.loadPlayers = function () {
    if (fs.existsSync('data/players.json')) {
        players = JSON.parse(fs.readFileSync("data/players.json"));
        players.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0))
    }
    return players;
};


/**
 * Get all Players objects
 */
exports.getPlayers = function (callback) {
    callback(null, players);
};

/**
 * Get top Players objects
 */
exports.getTopPlayers = function(nb, callback)
{
    if(nb < players.length)
        callback(null, players.slice(0, nb));
    else
        callback(null, players);
}

exports.addPlayer = function(player, callback)
{
    players.push(player);
    fs.writeFile("data/players.json", JSON.stringify(players), err => console.log(err));
    callback(null, player);
}