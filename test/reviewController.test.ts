import { createReview } from "../src/controllers/review.controller";
import client from "../src/config/db";
import { Request, Response, NextFunction } from "express";

// Mock de la base de données
jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

// Test de la fonction createReview
describe("createReview", () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { id: 1 }, // Utilisateur authentifié
      body: {
        serie_anime_id: 10,
        note: 4,
        commentaire: "Super série",
        pseudo_anonyme: false,
        type: "anime",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("devrait renvoyer une erreur 401 si l'utilisateur n'est pas authentifié", async () => {
    req.user = undefined; // Utilisateur non authentifié

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non authentifié." });
  });

  it("devrait renvoyer une erreur 400 si les données sont invalides (serie_anime_id)", async () => {
    req.body.serie_anime_id = "invalid"; // ID invalide

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "serie_anime_id est requis et doit être un nombre valide." });
  });

  it("devrait renvoyer une erreur 400 si la note est invalide", async () => {
    req.body.note = 6; // Note invalide (au-delà de la plage autorisée)

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "La note est requise et doit être 1, 2, 3, 4 ou 5." });
  });

  it("devrait renvoyer une erreur 404 si la série/animé n'existe pas", async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 }); // Série/animé non trouvé

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "La série/animé spécifiée n'existe pas." });
  });

  it("devrait ajouter un avis et renvoyer un message de succès", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Série/animé trouvé
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            utilisateur_id: 1,
            serie_anime_id: 10,
            note: 4,
            commentaire: "Super série",
            pseudo_anonyme: false,
            date_creation: "2025-03-20",
            type: "anime",
          },
        ],
      }); // Avis ajouté avec succès

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Avis ajouté avec succès.",
      review: expect.objectContaining({
        id: 1,
        utilisateur_id: 1,
        serie_anime_id: 10,
        note: 4,
        commentaire: "Super série",
      }),
    });
  });

  it("devrait renvoyer une erreur 500 si une erreur survient lors de la vérification de l'existence de la série/animé", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Erreur DB")); // Simule une erreur lors de la vérification de l'existence
  
    await createReview(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur lors de la vérification de l'existence de la série/animé." });
  });  
});

beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Désactive console.error
});
  