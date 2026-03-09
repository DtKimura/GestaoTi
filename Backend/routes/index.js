const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AirTagController = require('../controllers/AirTagController');
const ComputadorController = require('../controllers/ComputadorController');
const CelularController = require('../controllers/CelularController');
const UsoMoviDispController = require('../controllers/UsoMoviDispController');
const InfraestruturaController = require('../controllers/InfraestruturaController');

// Routes for users
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Routes for airtags
router.get('/airtags', AirTagController.getAllAirTags);
router.get('/airtags/:id', AirTagController.getAirTagById);
router.post('/airtags', AirTagController.createAirTag);
router.put('/airtags/:id', AirTagController.updateAirTag);
router.delete('/airtags/:id', AirTagController.deleteAirTag);

// Routes for computadores
router.get('/computadores', ComputadorController.getAllComputadores);
router.get('/computadores/:id', ComputadorController.getComputadorById);
router.post('/computadores', ComputadorController.createComputador);
router.put('/computadores/:id', ComputadorController.updateComputador);
router.delete('/computadores/:id', ComputadorController.deleteComputador);

// Routes for celulares
router.get('/celulares', CelularController.getAllCelulares);
router.get('/celulares/:id', CelularController.getCelularById);
router.post('/celulares', CelularController.createCelular);
router.put('/celulares/:id', CelularController.updateCelular);
router.delete('/celulares/:id', CelularController.deleteCelular);

// Routes for uso_movi_disp
router.get('/uso-movi-disp', UsoMoviDispController.getAllUsoMoviDisp);
router.get('/uso-movi-disp/:id', UsoMoviDispController.getUsoMoviDispById);
router.post('/uso-movi-disp', UsoMoviDispController.createUsoMoviDisp);
router.put('/uso-movi-disp/:id', UsoMoviDispController.updateUsoMoviDisp);
router.delete('/uso-movi-disp/:id', UsoMoviDispController.deleteUsoMoviDisp);

// Routes for infraestrutura
router.get('/infraestrutura', InfraestruturaController.getAllInfraestrutura);
router.get('/infraestrutura/:id', InfraestruturaController.getInfraestruturaById);
router.post('/infraestrutura', InfraestruturaController.createInfraestrutura);
router.put('/infraestrutura/:id', InfraestruturaController.updateInfraestrutura);
router.delete('/infraestrutura/:id', InfraestruturaController.deleteInfraestrutura);

module.exports = router;
