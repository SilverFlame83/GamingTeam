const router = require("express").Router();
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");
const user = require("../services/user");

router.get("/catalog", async (req, res) => {
  const games = await req.storage.getAllGames();

  res.render("catalog", { games });
});
router.get("/create", async (req, res) => {
  res.render("create");
});

router.post("/create", isUser(), async (req, res) => {
  try {
    const gameData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      genre: req.body.genre,
      platform: req.body.platform,
      owner: req.user,
    };

    await req.storage.createGame(gameData);

    res.redirect("/game/catalog");
  } catch (err) {
    console.log(err.message);

    const ctx = {
      errors: parseError(err),
      gameData: {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
      },
    };

    res.render("create", ctx);
  }
});

router.get("/details/:id", async (req, res) => {
  const game = await req.storage.getGameById(req.params.id);

  game.isOwner = req.user && req.user._id == game.owner._id;
  game.isNotOwner = req.user && req.user._id != game.owner._id;
  game.bought = req.user && game.boughtBy.find((u) => u == req.user._id);

  res.render("details", { game });
});

router.get("/delete/:id", isUser(), async (req, res) => {
  try {
    const game = await req.storage.getGameById(req.params.id);

    //   if (game.owner != req.user._id) {
    //     throw new Error("Not the owner can not delete!");
    //   }

    await req.storage.deleteGame(req.params.id);
    res.redirect("/game/catalog");
  } catch (err) {
    console.log(err.message);
    res.redirect("/game/details/" + req.params.id);
  }
});

router.get("/edit/:id", isUser(), async (req, res) => {
  try {
    const game = await req.storage.getGameById(req.params.id);

    // if (pet.owner != req.user._id) {
    //   throw new Error("Not the owner can not edit!");
    // }

    res.render("edit", { game });
  } catch (err) {
    console.log(err.message);
    res.redirect("/game/details/" + req.params.id);
  }
});

router.post("/edit/:id", isUser(), async (req, res) => {
  try {
    await req.storage.editGame(req.params.id, req.body);
    res.redirect("/game/details/" + req.params.id);
  } catch (err) {
    const ctx = {
      errors: parseError(err),
      game: {
        _id: req.params.id,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
      },
    };
    res.render("edit", ctx);
  }
});

router.get("/buy/:id", isUser(), async (req, res) => {
  try {
    await req.storage.buyGame(req.params.id, req.user._id);

    res.redirect("/game/details/" + req.params.id);
  } catch (err) {
    console.log("Éroor", err.message);
    res.redirect("/game/details/" + req.params.id);
  }
});

router.get("/search", async (req, res) => {
  const games = await req.storage.getAllGames();

  res.render("search", { games });
});

router.post("/search", async (req, res) => {
  try {
    const filter = await req.storage.getAllGames();

    const search = req.body.search;
    const platform = req.body.platform;

    const games = filter.filter(
      (game) =>
        game.name.toLowerCase() == search.toLowerCase() &&
        game.platform.toLowerCase() == platform.toLowerCase()
    );

    //console.log(games)
    res.render("search", {games});
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
