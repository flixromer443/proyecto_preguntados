declare global {
  interface Window {
    __env: any;
  }
}


export const environment = {
  production: true,
  apiUrl: 'http://localhost:8081',
  apiGame: 'http://localhost:8081/api/game.php'
};