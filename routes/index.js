import AppController from '../controllers/AppController';

const routes = (app) => {
  app.get('/', AppController.getHome);
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

export default routes;
module.exports = routes;
