import express from 'express';
import { getUserProfile } from '../controllers/user.controller'; // Importer la fonction du contrôleur

const router = express.Router();

// Route pour récupérer le profil d'un utilisateur par ID
router.get('/profil/:id', getUserProfile);

export default router;
