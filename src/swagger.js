const swaggerAutogen = require('swagger-autogen')();

// Fichier de sortie où la documentation Swagger sera générée
const outputFile = './swagger-output.json';

// Spécifier les fichiers de routes à scanner pour générer la documentation
// Remarque : Utilise des chemins relatifs vers tes fichiers de routes
const endpointsFiles = ['./routes/**/*.ts'];  // Si tu utilises TypeScript
// const endpointsFiles = ['./routes/**/*.js']; // Si tu utilises JavaScript

// Documentation de base pour Swagger
const doc = {
  info: {
    title: 'API REST',
    description: 'Documentation de l\'API de l\'application',
    version: '1.0.0',
  },
  host: 'localhost:4000',  // Modifie selon ton hôte et ton port
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger doc generated!');
});
