# 🍳 Say2Cook — Voice-Guided Recipe App

<div align="center">


**Cook anything, hands-free.**  
Search any recipe, pick a cuisine, and let Say2Cook read every step aloud while you cook.

[Click here for the Live Demo](https://say2cook-voice-speech-cooking-app-1.onrender.com)

</div>

---

## About the Project

Say2Cook is a full-stack web application that makes cooking easier and more accessible through **voice-guided step-by-step cooking**. Instead of constantly touching your phone with messy hands, you simply say "next" and the app reads the next step aloud.

It pulls real recipe data from the **Spoonacular API**, supports **multi-language translation** via **Azure Translator**, and uses the browser's **Web Speech API** for voice output and voice command input — all in one seamless experience.

Built as a personal project to learn full-stack development with Node.js, Express, MongoDB, and third-party API integration.

---

##  Features

###  Authentication
- User signup and login with **bcrypt** password hashing
- Session-based authentication using **express-session** + **connect-mongo**
- Flash messages for login errors, signup success, and all user actions
- Protected routes — cuisine, recipe, and favourites pages require login

###  Recipe Discovery
- Browse **15 world cuisines** on the home page (Indian, Italian, Chinese, Japanese, Mexican, and more)
- **Live search** — type in the search bar and results update instantly without page reload
- **Cuisine-specific search** — filter recipes within a cuisine in real time
- **Pagination** — navigate through large result sets with Prev / Next
- Recipe cards show image, title, and ready time at a glance

###  Voice Cooking Mode
- **Text-to-speech** reads each step aloud using the Web Speech API
- **Voice commands** — say "next", "repeat", "stop", "pause", "resume" — no hands needed
- **Auto timer** — if a step mentions a time (e.g. "cook for 10 minutes"), a countdown timer starts automatically
- Speech supported in **English and Hindi only** — other languages show a warning instead of broken audio
- Steps are **highlighted** in yellow as they are read

###  Recipe Translation
- Translate ingredients and steps into **19 languages** including Hindi, Tamil, French, Japanese, Arabic, and more
- Powered by **Azure Cognitive Translator API**
- Translation updates the page text in real-time without a page reload
- Voice mode falls back gracefully when text is in an unsupported speech language
  
###  Favourites
- Save any recipe to your personal favourites list
- Remove recipes you no longer want
- Favourites are stored per user in MongoDB

###  Nutrition Facts
- Each recipe page shows a nutrition table: Calories, Carbohydrates, Fat, Protein, Sugar, Fiber
- Calories highlighted in orange for quick reference

###  UI & Design
- Custom warm culinary design — saffron/orange palette with **Fraunces** (display) and **DM Sans** (body) fonts
- Fully responsive — works on mobile, tablet, and desktop
- Bootstrap 5 for grid and utilities, minimal custom CSS on top
- Proper error page with HTTP status code and dev stack trace in development mode

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **Templating** | EJS + express-ejs-layouts |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | bcryptjs + express-session + connect-mongo |
| **Flash Messages** | connect-flash |
| **Frontend** | Bootstrap 5.3 + Font Awesome 7 |
| **Fonts** | Google Fonts (Fraunces + DM Sans) |
| **Recipe API** | Spoonacular API |
| **Translation API** | Azure Cognitive Translator |
| **Voice** | Web Speech API (browser built-in) |
| **HTTP Client** | node-fetch |

---

##  File Structure

```
Say2Cook/
│
├── models/
│   └── User.js                  # Mongoose user schema (email, password, favourites)
│
├── public/                      # Static files served to browser
│   ├── home.js                  # Live search on home page
│   ├── result.js                # Live search on cuisine results page
│   ├── speech.js                # Voice cooking mode (TTS + voice commands + timer)
│   ├── translate.js             # Recipe translation logic
│   └── style.css                # Custom CSS (Bootstrap overrides + design system)
│
├── utils/
│   ├── ExpressError.js          # Custom error class with status + message
│   └── wrapAsync.js             # Wraps async route handlers to catch errors
│
├── views/
│   ├── partials/
│   │   ├── layout.ejs           # HTML boilerplate (head, body, scripts)
│   │   ├── header.ejs           # Sticky navbar with auth-aware links
│   │   ├── footer.ejs           # Footer with cuisine links + nav
│   │   └── flash.ejs            # Success/error flash message banners
│   │
│   ├── home.ejs                 # Home page — hero + search + cuisine grid
│   ├── results.ejs              # Cuisine results page — recipe grid + pagination
│   ├── recipe.ejs               # Full recipe detail — nutrition, steps, voice, translate
│   ├── favourites.ejs           # User's saved recipes
│   ├── login.ejs                # Login form
│   ├── signup.ejs               # Signup form
│   └── error.ejs                # Error page (404, 500, etc.)
│
├── .env                         # Environment variables (not committed to git)
├── .gitignore                   # Ignores node_modules, .env
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
└── server.js                    # Main app — all routes and middleware
```

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- A **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- A **Spoonacular API** key — [Get one free](https://spoonacular.com/food-api)
- An **Azure Translator** resource — [Create one](https://portal.azure.com/) (free tier available)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/priyansh9414/say2cook.git
cd say2cook
```

**2. Install dependencies**

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Add the following variables:

```env
# MongoDB connection string from MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/say2cook

# Spoonacular API key
SPOON_KEY=your_spoonacular_api_key_here

# Azure Cognitive Translator
AZURE_TRANSLATOR_KEY=your_azure_translator_key_here
AZURE_TRANSLATOR_REGION=your_azure_region_here

# Session secret (use a long random string in production)
SESSION_SECRET=your_random_secret_string_here

# Set to 'development' to see stack traces on error page
NODE_ENV=development
```


---

### Running the App

**Development:**

```bash
node server.js
```

The app will start at `http://localhost:3000`

**Or with auto-restart on file changes (install nodemon globally first):**

```bash
npm install -g nodemon
nodemon server.js
```

---

##  API Reference

### Internal Routes

| Method | Route | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | No | Home page with cuisine grid |
| `GET` | `/signup` | No | Signup page |
| `POST` | `/signup` | No | Create new account |
| `GET` | `/login` | No | Login page |
| `POST` | `/login` | No | Authenticate user |
| `GET` | `/logout` | No | Destroy session |
| `GET` | `/cuisine/:name` | Yes | Cuisine results with pagination |
| `GET` | `/api/search` | Yes | Live search JSON endpoint |
| `GET` | `/recipe/:id` | Yes | Full recipe detail page |
| `GET` | `/favourites` | Yes | User's saved recipes |
| `POST` | `/favourite/:id` | Yes | Save recipe to favourites |
| `POST` | `/favourite/:id/remove` | Yes | Remove from favourites |
| `POST` | `/translate` | Yes | Translate ingredients + steps |

### External APIs Used

**Spoonacular API**
```
GET https://api.spoonacular.com/recipes/complexSearch
    ?cuisine=Indian&number=12&offset=0&addRecipeInformation=true&sort=popularity

GET https://api.spoonacular.com/recipes/{id}/information
    ?includeNutrition=true
```

**Azure Cognitive Translator**
```
POST https://api.cognitive.microsofttranslator.com/translate
     ?api-version=3.0&to=hi
Body: [{ "Text": "string to translate" }]
```

---

##  How It Works

### Voice Cooking Flow

```
User clicks "Start"
    ↓
speech.js reads all <li> from #stepsList
    ↓
speakStep(0) is called
    ↓
detectLanguage() checks if text is Hindi (Devanagari unicode) or English
    ↓
isSpeechBlocked() checks if langSelect is set to unsupported language
    ↓
If blocked → show warning text, skip speech
If allowed → SpeechSynthesisUtterance speaks the step
    ↓
getTimerSeconds() scans text for time mentions (e.g. "10 minutes")
    ↓
If time found → countdown timer starts automatically
    ↓
webkitSpeechRecognition listens for voice commands:
    "next"    → nextStep()
    "repeat"  → repeatStep()
    "stop"    → stopCooking()
    "pause"   → pauseTimer()
    "resume"  → resumeTimer()
```

### Translation Flow

```
User selects language from dropdown and clicks "Translate"
    ↓
translate.js collects all .ingredients li and .steps li text
    ↓
POST /translate with { texts: [...], to: "hi" }
    ↓
server.js calls Azure Cognitive Translator API
    ↓
Translated text is returned and written back into the DOM
    ↓
window.steps is updated so speech.js uses the new translated text
```

### Error Handling

```
Any async route error
    ↓
wrapAsync catches it and passes to next(err)
    ↓
ExpressError(404/500, message) for known errors
    ↓
Global error handler renders error.ejs
    ↓
Shows status code + message + stack trace (development only)
```

---

##  Contributing

Contributions are welcome! Here's how to get started:

**1. Fork the repository**

Click the **Fork** button on the top right of the GitHub page.

**2. Clone your fork**

```bash
git clone https://github.com/your-username/say2cook.git
cd say2cook
```

**3. Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

**4. Make your changes**

Follow the existing code style — simple, readable, student-friendly JavaScript. Add comments where logic isn't obvious.

**5. Test your changes**

```bash
node server.js
```

Manually test all affected routes and features.

**6. Commit your changes**

```bash
git add .
git commit -m "Add: brief description of what you added"
```

Use prefixes: `Add:`, `Fix:`, `Update:`, `Remove:`

**7. Push and open a Pull Request**

```bash
git push origin feature/your-feature-name
```

Then go to GitHub and open a Pull Request with a clear description of what you changed and why.

---


##  Future Improvements

- [ ] Deploy on Render / Railway with live demo link
- [ ] Add server-side validation (email format, password strength)
- [ ] Ingredient checklist with `localStorage` persistence
- [ ] Serving size scaler (multiply ingredient quantities)
- [ ] "Find by ingredients" feature using Spoonacular's `/findByIngredients`
- [ ] Dietary filters (Vegetarian, Vegan, Gluten-Free)
- [ ] Recipe notes — personal notes saved per user per recipe
- [ ] Favourite collections / tags (Breakfast, Quick Meals, etc.)
- [ ] Step progress indicator during voice cooking
- [ ] README with real screenshots after deployment

---


##  Contact

**Priyansh Jain**

-  Email: [priyandhjain903@gmail.com](mailto:priyandhjain903@gmail.com)
-  GitHub: [@priyansh9414](https://github.com/priyansh9414)

---

<div align="center">

Made with Love for food lovers

If you found this project helpful, please give it a star on GitHub!

</div>
