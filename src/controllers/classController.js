const ClassModel = require('../models/classModel');

// GET semua kelas
const getAllClasses = async (req, res) => {
    try {
      const classes = await ClassModel.getAllClasses();
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching classes', error: err.message });
    }
  };
  
  // GET kelas berdasarkan ID
  const getClassById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const classData = await ClassModel.getClassById(id);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json(classData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching class', error: err.message });
    }
  };
  
  // CREATE kelas baru
  const createClass = async (req, res) => {
    const { name_class, id_user, id_category, id_schedule, price } = req.body;
  
    try {
      await ClassModel.createClass({
        name_class,
        id_user,
        id_category,
        price,
      });
      res.status(201).json({ message: 'Class created successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error creating class', error: err.message });
    }
  };
  
  // UPDATE kelas
  const updateClass = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const result = await ClassModel.updateClass(id, updateData);
      if (!result) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating class', error: err.message });
    }
  };
  
  // DELETE kelas
  const deleteClass = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await ClassModel.deleteClass(id);
      if (!result) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting class', error: err.message });
    }
  };
  
  module.exports = { getAllClasses, getClassById, createClass, updateClass, deleteClass };