import { Router } from 'express';
import { getUserProfile } from '../controllers/user.controller';

const router = Router();

// Définition de la route pour récupérer un profil par ID
router.get('/:id', getUserProfile);

export default router;
