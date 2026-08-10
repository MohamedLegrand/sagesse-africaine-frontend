import i18n from '../../../i18n';

/**
 * Retraduit le titre/message d'une notification dans la langue active à
 * partir de son `code` + `donnees` quand ils sont présents. Repli sur le
 * `titre`/`message` stockés (toujours en français) pour les notifications
 * créées avant l'ajout de ce champ, ou si le code n'est pas reconnu.
 */
export function traduireNotification(notification) {
  const { code, donnees, titre, message } = notification;

  if (code && i18n.exists(`contenu.${code}.titre`, { ns: 'notifications' })) {
    return {
      titre: i18n.t(`contenu.${code}.titre`, { ns: 'notifications', ...donnees }),
      message: i18n.t(`contenu.${code}.message`, { ns: 'notifications', ...donnees }),
    };
  }

  return { titre, message };
}

export default traduireNotification;
