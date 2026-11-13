// Interrupteurs des sections du site. Passer une valeur à true puis pousser sur main pour la réactiver.
// Section à false : absente du menu, et son adresse renvoie vers /menu. Le code reste intact.
export const features = {
  /** Page /mailing-list et sa ligne dans le menu. */
  mailingList: false,
  /** Formulaire d'inscription de /mailing-list. À false : la page affiche « UNDER CONSTRUCTION ». */
  mailingListForm: false,
  /** Page /articles et sa ligne dans le menu. Contenu dans src/data/articles.ts (encore fictif). */
  articles: false,
};
