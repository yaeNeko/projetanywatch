import { Request, Response } from "express";
import client from "../config/db"; // Connexion à la base de données
import bcrypt from "bcrypt";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête

  try {
    // Requête SQL pour récupérer les informations de l'utilisateur
    const result = await client.query(
      "SELECT id, pseudo, email, est_public FROM utilisateurs WHERE id = $1",
      [userId]
    );

    // Si l'utilisateur n'existe pas
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const user = result.rows[0];

    // Vérification de la visibilité : si est_public est false (privé), le profil ne doit pas être montré
    if (user.est_public === false) {
      // Vérification directe de la valeur booléenne
      res.status(403).json({ message: "Ce profil est privé" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Contrôleur pour la mise à jour de la visibilité (passer le profil en public ou privé)

export const updateVisibility = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête
  const { est_public } = req.body; // Récupère la nouvelle visibilité ('f' ou 't')

  const visibility = est_public ? true : false;

  try {
    // Requête SQL pour mettre à jour la visibilité de l'utilisateur
    const result = await client.query(
      "UPDATE utilisateurs SET est_public = $1 WHERE id = $2 RETURNING *",
      [visibility, userId]
    );

    // Si l'utilisateur n'existe pas
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Renvoie une réponse avec les nouvelles informations de l'utilisateur
    const updatedUser = result.rows[0];
    res.status(200).json({
      message: "Visibilité mise à jour",
      utilisateur: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la visibilité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mise à jour des informations de l'utilisateur
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête
  const { pseudo, email, mot_de_passe } = req.body; // Récupère les nouvelles informations de l'utilisateur

  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const result = await client.query(
      "SELECT id FROM utilisateurs WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Construction de la requête SQL pour la mise à jour des informations de l'utilisateur
    let updateQuery = "UPDATE utilisateurs SET";
    const updateValues: any[] = [];
    let index = 1;

    // Ajout des valeurs à la requête pour la mise à jour
    if (pseudo) {
      updateQuery += ` pseudo = $${index++},`;
      updateValues.push(pseudo);
    }
    if (email) {
      updateQuery += ` email = $${index++},`;
      updateValues.push(email);
    }

    // Mise à jour du mot de passe (avec hashage)
    let hashedPassword = null;
    if (mot_de_passe) {
      hashedPassword = await bcrypt.hash(mot_de_passe, 10); // Hash du mot de passe
      updateQuery += ` mot_de_passe = $${index++},`;
      updateValues.push(hashedPassword);
    }

    // Retirer la dernière virgule de la requête
    updateQuery = updateQuery.slice(0, -1);

    // Ajout de la condition WHERE pour cibler l'utilisateur par son ID
    updateQuery += ` WHERE id = $${index}`;
    updateValues.push(userId);

    // Exécution de la requête SQL pour mettre à jour les informations
    const updateResult = await client.query(updateQuery, updateValues);

    // Vérifier si la mise à jour a réussi
    if (updateResult.rowCount === 0) {
      res
        .status(404)
        .json({ message: "Utilisateur non trouvé pour la mise à jour" });
      return;
    }

    // Retourner les informations mises à jour
    res.status(200).json({
      message: "Informations utilisateur mises à jour avec succès",
      updatedUser: {
        id: userId,
        pseudo: pseudo || result.rows[0].pseudo,
        email: email || result.rows[0].email,
        mot_de_passe: mot_de_passe || result.rows[0].mot_de_passe,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du profil utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    // Vérifier si l'utilisateur existe
    const checkUser = await client.query(
      "SELECT * FROM utilisateurs WHERE id = $1",
      [userId]
    );

    if (checkUser.rowCount === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Supprimer les dépendances avant l'utilisateur
    await client.query("DELETE FROM avis WHERE utilisateur_id = $1", [userId]);
    await client.query(
      "DELETE FROM watchlist_ajouts WHERE utilisateur_id = $1",
      [userId]
    );
    await client.query("DELETE FROM abonnes WHERE utilisateur_id = $1", [
      userId,
    ]);
    await client.query("DELETE FROM watchlists WHERE utilisateur_id = $1", [
      userId,
    ]);

    // Supprimer l'utilisateur
    await client.query("DELETE FROM utilisateurs WHERE id = $1", [userId]);

    res
      .status(200)
      .json({ message: "Compte utilisateur supprimé avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du compte utilisateur :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};
