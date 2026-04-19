import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcryptjs";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";

import User from "./models/User.js";
import ExpressError from "./utils/ExpressError.js";
import wrapAsync from "./utils/wrapAsync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.SPOON_KEY;

app.use(expressLayouts);
app.set("layout", "partials/layout");
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
  next();
}

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    req.session.userId = user._id;
    req.flash("success", "Account created! Welcome to Say2Cook");
    res.redirect("/");
  } catch (e) {
    req.flash("error", "Email already exists. Try logging in.");
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No account found with that email.");
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Wrong password. Try again.");
    return res.redirect("/login");
  }

  req.session.userId = user._id;
  req.flash("success", "Welcome back!");
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.get("/", (req, res) => {
  const cuisines = [
    "Indian",
    "Italian",
    "Chinese",
    "Thai",
    "Mexican",
    "Japanese",
    "Korean",
    "French",
    "Spanish",
    "Greek",
    "Turkish",
    "Vietnamese",
    "American",
    "British",
    "German",
  ];
  res.render("home", { cuisines });
});

app.get(
  "/cuisine/:name",
  requireLogin,
  wrapAsync(async (req, res) => {
    const cuisine = req.params.name;
    const query = req.query.query || "";
    const number = parseInt(req.query.number) || 12;
    const offset = parseInt(req.query.offset) || 0;

    const url = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&query=${query}&number=${number}&offset=${offset}&addRecipeInformation=true&sort=popularity&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    res.render("results", {
      cuisine,
      query,
      recipes: data.results || [],
      number,
      offset,
      totalResults: data.totalResults || 0,
    });
  }),
);

app.get(
  "/api/search",
  requireLogin,
  wrapAsync(async (req, res) => {
    const query = req.query.query || "";
    const cuisine = req.query.cuisine || "";

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&cuisine=${cuisine}&number=12&addRecipeInformation=true&sort=popularity&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    res.json({ results: data.results || [] });
  }),
);

app.get(
  "/recipe/:id",
  requireLogin,
  wrapAsync(async (req, res) => {
    const url = `https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=true&apiKey=${API_KEY}`;
    const r = await fetch(url);
    const recipe = await r.json();

    res.render("recipe", { recipe });
  }),
);

app.get(
  "/favourites",
  requireLogin,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render("favourites", { favourites: user.favourites });
  }),
);

app.post(
  "/favourite/:id",
  requireLogin,
  wrapAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: {
        favourites: {
          recipeId: req.params.id,
          title: req.body.title,
          image: req.body.image,
        },
      },
    });
    req.flash("success", "Recipe saved to favourites!");
    res.redirect(`/recipe/${req.params.id}`);
  }),
);

app.post(
  "/favourite/:id/remove",
  requireLogin,
  wrapAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.session.userId, {
      $pull: { favourites: { recipeId: req.params.id } },
    });
    req.flash("success", "Removed from favourites.");
    res.redirect("/favourites");
  }),
);

app.post(
  "/translate",
  requireLogin,
  wrapAsync(async (req, res) => {
    const { texts, to } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const response = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${to}`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_TRANSLATOR_REGION,
          "Content-type": "application/json",
        },
        body: JSON.stringify(texts.map((t) => ({ Text: t }))),
      },
    );

    const result = await response.json();
    const translated = result.map((item) => item.translations[0].text);
    res.json({ translated });
  }),
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).render("error", { status, message, err });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
