import {
  addToWatchlist,
  removeFromWatchlist,
} from "../anywatch/src/controllers/watchlist.controller";
import client from "../anywatch/src/config/db";

jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

//Test de la fonction addToWatchlist
describe("addToWatchlist", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: { watchlistId: "1", serieAnimeId: "10" },
      body: { statut: 2 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("devrait renvoyer une erreur 400 si des IDs sont manquants", async () => {
    req.params.watchlistId = ""; // Simule l'absence de watchlistId
    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "L'id de la watchlist et de la série/animé sont obligatoires",
    });
  });

  it("devrait renvoyer une erreur 404 si la watchlist n'existe pas", async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 }); // Simule une watchlist inexistante

    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Watchlist non trouvée" });
  });

  it("devrait renvoyer une erreur 404 si la série/animé n'existe pas", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Watchlist existe
      .mockResolvedValueOnce({ rowCount: 0 }); // Série inexistante

    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Série/animé non trouvé",
    });
  });

  it("devrait renvoyer une erreur 400 si la série/animé est déjà dans la watchlist", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Watchlist existe
      .mockResolvedValueOnce({ rowCount: 1 }) // Série existe
      .mockResolvedValueOnce({ rowCount: 1 }); // Déjà dans la watchlist

    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cette série/animé est déjà dans la watchlist",
    });
  });

  it("devrait ajouter une série/animé à la watchlist et renvoyer un message de succès", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Watchlist existe
      .mockResolvedValueOnce({ rowCount: 1 }) // Série existe
      .mockResolvedValueOnce({ rowCount: 0 }) // Pas encore dans la watchlist
      .mockResolvedValueOnce({
        rows: [{ id: 1, watchlistId: "1", serieAnimeId: "10", statut: 2 }],
      }); // Ajout réussi

    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Série/animé ajouté à la watchlist avec succès",
      item: { id: 1, watchlistId: "1", serieAnimeId: "10", statut: 2 },
    });
  });

  it("devrait renvoyer une erreur 500 en cas de problème serveur", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Erreur DB"));

    await addToWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

// Test de la fonction removeFromWatchlist
describe("removeFromWatchlist", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: { watchlistId: "1", serieAnimeId: "10" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("devrait renvoyer une erreur 404 si l'élément n'existe pas dans la watchlist", async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 }); // Élément non trouvé

    await removeFromWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Série/animé non trouvé dans la watchlist",
    });
  });

  it("devrait supprimer l'élément et renvoyer un message de succès", async () => {
    (client.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 }) // Élément trouvé dans la watchlist
      .mockResolvedValueOnce({}); // Suppression réussie

    await removeFromWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Série/animé retiré de la watchlist avec succès",
    });
  });

  it("devrait renvoyer une erreur 500 en cas de problème serveur", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Erreur DB"));

    await removeFromWatchlist(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Désactive console.error
});
