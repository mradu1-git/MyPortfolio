/**
 * @typedef {Object} ActivityPlatform
 * @property {'github' | 'invent'} id
 * @property {string} label
 * @property {string} username
 * @property {string} profileUrl
 */

/** @type {{ github: ActivityPlatform; invent: ActivityPlatform; commitLimit: number }} */
export const activity = {
  github: {
    id: 'github',
    label: 'GitHub',
    username: 'mradu1-git',
    profileUrl: 'https://github.com/mradu1-git',
  },
  invent: {
    id: 'invent',
    label: 'invent.kde.org',
    username: 'mradul',
    profileUrl: 'https://invent.kde.org/mradul',
  },
  commitLimit: 8,
};
