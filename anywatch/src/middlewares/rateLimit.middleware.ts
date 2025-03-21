import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs: number, max: number) => {
	return rateLimit({
		windowMs, // Période en millisecondes
		max, // Nombre maximal de requêtes autorisées dans la fenêtre
		message: "Trop de demandes pour cette IP, veuillez réessayer plus tard.",
		standardHeaders: true, // Retourne les informations dans les headers `RateLimit-*`
		legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
	});
};
