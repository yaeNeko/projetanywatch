const express = require("express");
const app = express();
const indexRoutes = require("./routes/index"); // Importation des routes

const PORT = 3000;

app.use("/", indexRoutes); // Utilisation des routes

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
