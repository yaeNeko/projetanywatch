import { deleteUser } from "../src/controllers/user.controller";
import client from "../src/config/db";

jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

// Test de la fonction deleteUser
describe("deleteUser", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { params: { userId: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("devrait renvoyer une erreur 404 si l'utilisateur n'existe pas", async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
  });

  it("devrait supprimer l'utilisateur et renvoyer un message de succès", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Vérification utilisateur existe
      .mockResolvedValueOnce({}) // Suppression avis
      .mockResolvedValueOnce({}) // Suppression watchlist_ajouts
      .mockResolvedValueOnce({}) // Suppression abonnés
      .mockResolvedValueOnce({}) // Suppression watchlists
      .mockResolvedValueOnce({}); // Suppression utilisateur

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Compte utilisateur supprimé avec succès" });
  });

  it("devrait renvoyer une erreur 500 en cas de problème serveur", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Erreur DB"));

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Désactive console.error
});
