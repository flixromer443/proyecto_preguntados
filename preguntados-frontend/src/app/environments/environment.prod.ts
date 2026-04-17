declare global {
  interface Window {
    __env: any;
  }
}


export const environment = {
  production: true,
  apiUrl: 'http://localhost:8081',
  apiGame: 'http://localhost:8081/api/game.php',
  apiAuth: 'http://localhost:8081/api/auth.php',
  apiGeoref: 'https://apis.datos.gob.ar/georef/api/v2.0'

};