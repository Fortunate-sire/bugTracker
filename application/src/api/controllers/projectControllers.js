const userModel = require('../models/userModel');
const projectModel = require('../models/projectModels');
const notificationModel = require('../models/notificationModels');
/**
 * Get
 * get project page
 */

exports.project = async (req, res) => {
  const locals = {
    title: 'projects',
    messages: req.flash('messages'),
  };
  const user = await userModel.findOne({ _id: req.session.userId });
  let projects;
  if (user.role === 'admin') {
    projects = await projectModel.find({}).populate('contributors');
  } else {
    projects = await projectModel.find({
      $or: [
        { owner: user.userName },
        { contributors: req.session.userId },
      ],
    }).populate('contributors');
  }
  const templateData = {
    ...locals, user, projects,
  };
  res.render('pages/dashBoard/project', templateData);
};

/**
 * Post
 * add new project
 */

exports.addProject = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.userId });
  const { title, description, contributors } = req.body;
  const users = await userModel.find({ userName: { $in: contributors } });
  try {
    await projectModel.create({
      owner: user.userName, title, description, contributors: users,
    });

    for (let i = 0; i < users.length; i += 1) {
      // eslint-disable-next-line
      await notificationModel.create({
        userId: users[i].id,
        notification: `you where added to ${title} project `,
      });
    }
    req.flash('messages', { type: 'success', text: 'project created successfully' });
    res.redirect('/project');
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'sorry some error occured' });
    res.redirect('./project');
  }
};

exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await projectModel.findOne({ _id: projectId }).populate('contributors');
  if (project) {
    return res.status(200).json(project);
  }
  return res.status(404).json('project not found');
};

exports.editProject = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.userId });
  const { projectId } = req.params;
  const { title, description, contributors } = req.body;
  const users = await userModel.find({ userName: { $in: contributors } });
  const data = { title, description, contributors: users };
  try {
    const project = await projectModel.findOne({ _id: projectId });
    if (project.owner === user.userName || user.role === 'admin') {
      await projectModel.updateOne({ _id: projectId }, data);
      for (let i = 0; i < users.length; i += 1) {
        // eslint-disable-next-line
        await notificationModel.create({
          userId: users[i].id,
          notification: `you where added to ${title} project `,
        });
      }
      req.flash('messages', { type: 'success', text: 'Project edited successfully' });
      return res.redirect('/project');
    }
    req.flash('messages', { type: 'warning', text: 'You are not authorized to edit this project' });
    return res.redirect('/project');
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    return res.redirect('/project');
  }
};

exports.searchProjects = async (req, res) => {
  const { payload } = req.body;
  const user = await userModel.findOne({ _id: req.session.userId });
  let search;
  if (user.role === 'admin') {
    search = await projectModel.find({
      title: { $regex: new RegExp(`^${payload}.*`, 'i') },
    }).populate('contributors');
  } else {
    search = await projectModel.find({
      $and: [
        {
          $or: [
            { owner: user.userName },
            { contributors: req.session.userId },
          ],
        },
        { title: { $regex: new RegExp(`^${payload}.*`, 'i') } },
      ],
    }).populate('contributors');
  }

  res.send({ payload: search });
};

exports.searchProjectContributors = async (req, res) => {
  const { payload } = req.body;
  const search = await userModel.find({
    $or: [
      // eslint-disable-next-line
      { userName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
      // eslint-disable-next-line
      { firstName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
    ],
  }).populate('position').exec();
  res.send({ payload: search });
};
exports.deleteProject = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.userId });
  const { projectId } = req.params;
  try {
    const project = await projectModel.findOne({ _id: projectId });
    if (project.owner === user.userName || user.role === 'admin') {
      await projectModel.deleteOne({ _id: projectId });
      req.flash('messages', { type: 'success', text: 'Project deleted successfully' });
      return res.redirect('/project');
    }
    req.flash('messages', { type: 'warning', text: 'You are not authorized to delete this project' });
    return res.redirect('/project');
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    return res.redirect('/project');
  }
};

exports.getProjectContributors = async (req, res) => {
  const { projectId } = req.params;
  const contributors = await projectModel.findOne({ _id: projectId }).populate('contributors');
  const users = [];
  for (let i = 0; i < contributors.contributors.length; i += 1) {
    users.push(contributors.contributors[i]);
  }
  res.status(200).json(users);
};

exports.deleteMultipleProjects = async (req, res) => {
  const { selected } = req.body;

  try {
    if (typeof selected === 'string') {
      const project = await projectModel.findById(selected);
      if (project) {
        await project.deleteOne({ _id: selected });
      }
    } else {
      await selected.forEach(async (projectId) => {
        const project = await projectModel.findById(projectId);
        if (project) {
          await project.deleteOne({ _id: projectId });
        }
      });
    }
    req.flash('messages', { type: 'success', text: 'projects deleted successfully' });
    res.redirect('/project');
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    res.redirect('/project');
  }
};
