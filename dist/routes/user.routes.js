"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller"); // Importer la fonction du contrôleur
const router = express_1.default.Router();
// Route pour récupérer le profil d'un utilisateur par ID
router.get('/profil/:id', user_controller_1.getUserProfile);
exports.default = router;
