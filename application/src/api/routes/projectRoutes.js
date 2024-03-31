// routes.js - Routes configuration
const express = require('express');
const { isAuthenticated } = require('../middlewares/authorization');
const {
  project, addProject, deleteProject, getProjectById, editProject,
  searchProjectContributors, deleteMultipleProjects, searchProjects,
  getProjectContributors,
} = require('../controllers/projectControllers');

const router = express.Router();

router.get('/project', isAuthenticated, project);
router.post('/addProject', isAuthenticated, addProject);
router.get('/getProject/:projectId', isAuthenticated, getProjectById);
router.post('/searchProjects', isAuthenticated, searchProjects);
router.get('/getProjectContributors/:projectId', isAuthenticated, getProjectContributors);
router.post('/editProject/:projectId', isAuthenticated, editProject);
router.post('/searchProjectContributors', isAuthenticated, searchProjectContributors);
router.post('/deleteMultipleProjects', isAuthenticated, deleteMultipleProjects);
router.get('/deleteProject/:projectId', isAuthenticated, deleteProject);

module.exports = router;
