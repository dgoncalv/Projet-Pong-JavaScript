let fs = require('fs'),
    PlayerModel = require(process.cwd() + "/app/models/Player.js"),
    Server = require(process.cwd() + "/app/core/router.js"),
    errs = require("restify-errors");

/**
 * Init Player set.
 */
exports.initStorage = function () {
    let players = PlayerModel.loadPlayers();
    console.log("Players loaded: %j", players);
};


/**
 * Returns the specified nb best players (if parameters nb exists) or all players if nb is not provided.
 */
exports.getBestPlayers = function (req, res, next) {
    console.log("getBestPlayers nb = %j", req.params.nb);
    
    if(req.params.nb === undefined)
    {
        PlayerModel.getPlayers(function(err, players)
        {
           if(err)
               return next(err);
            else
            {
                res.json(200, players);
                return next();
            }
        });
    }
    else
    {
        PlayerModel.getTopPlayers(req.params.nb, function(err, players)
        {
            if(err)
                return next(err);
            else
            {
                res.json(200, players);
                return next();
            }
        });  
    }
};

exports.addNewPlayer = function(req, res, next)
{
    console.log("CreatePlayer : %j", req.body);
    if(req.body.nom === undefined || req.body.score === undefined)
        return next(new errs.UnprocessableEntityError("createPlayer: parameter is missing"));
    
    let player = new PlayerModel.Player(req.body.nom, req.body.score);
    PlayerModel.addPlayer(player, function(err, player)
    {
        if(err)
            return next(err);
        else
        {
            if(player !== null)
            {
                res.json(201, player);;
                return next();
            }
            else
                return next(new errs.UnprocessableEntityError("Error when create player " + req.body.nom));
        }
    });
};
