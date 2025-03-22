const swaggerAutogen = require('swagger-autogen')();

// Fichier de sortie où la documentation Swagger sera générée
const outputFile = './swagger-output.json';

// Spécifier les fichiers de routes à scanner pour générer la documentation
const endpointsFiles = ['./routes/**/*.ts'];  

// Documentation de base pour Swagger
const doc = {
  info: {
    title: 'API REST',
    description: 'Documentation de l\'API Anywatch',
    version: '1.0.0',
  },
  host: 'localhost:4000',  
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger doc generated!');
});
