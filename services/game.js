const Game = require("../models/Game");

async function getAllGames() {
  return Game.find().populate("owner").lean();
}

async function getGameById(id) {
  return Game.findById(id).populate("owner").lean();
}

async function createGame(gameData) {
  const game = new Game(gameData);

  await game.save();

  return game;
}

async function editGame(id, gameData) {
  const game = await Game.findById(id);

  game.name = gameData.name;
  game.imageUrl = gameData.imageUrl;
  game.price = gameData.price;
  game.description = gameData.description;
  game.genre = gameData.genre;
  game.platform = gameData.platform;

  return game.save();
}

async function deleteGame(id){
    return Game.findByIdAndDelete(id);
}

async function buyGame(gameId, userId){
  const game = await Game.findById(gameId);
  
  game.boughtBy.push(userId);
 
  return game.save();
}

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  editGame,
  deleteGame,
  buyGame
};
