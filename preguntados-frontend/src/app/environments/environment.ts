const env = (window as any).__env || {};

export const environment = {
    production: false,
    apiGame: env.API_GAME_URL,
    apiAuth: env.API_AUTH_URL,
    apiGeoref: env.API_GEOREF_URL
};