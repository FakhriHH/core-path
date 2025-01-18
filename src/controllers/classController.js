const { Classes, CategoryClass, Levels, User, Schedule } = require('../models/classModel');
const db = require('../config/knex');
const dayjs = require('dayjs');

// Create Class Controller
const createClass = async (req, res) => {
  const { id_teacher, id_category, id_schedule, id_level, price } = req.body;

  try {
    if (!id_teacher || !id_category || !id_schedule || !id_level || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newClass = {
      id_teacher,
      id_category,
      id_schedule,
      id_level,
      price
    };

    // Insert data ke tabel classes
    const [id_class] = await db('classes').insert(newClass);

    // Ambil detail dari kelas yang baru dibuat
    const classDetails = await Classes.getClassById(id_class);
    const category = await CategoryClass.getCategoryById(classDetails.id_category);
    const level = await Levels.getLevelById(classDetails.id_level);
    const teacher = await User.getUserById(classDetails.id_teacher);

    const response = {
      id_class: classDetails.id_class,
      category_name: category.name_category,
      id_schedule: classDetails.id_schedule,
      name_teacher: teacher.name,
      level_name: level.level_name,
      price: classDetails.price
    };

    res.status(201).json({ message: "Class created successfully", class: response });
  } catch (err) {
    res.status(500).json({ message: "Error creating class", error: err.message });
  }
};

// Read Classes Controller
const getClasses = async (req, res) => {
  try {
    const classes = await Classes.getAllClasses();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving classes", error: err.message });
  }
};

const getAllCategoryById = async (req, res) => {
  const { id_category } = req.params;

  try {
    const categoryDetails = await CategoryClass.getAllCategoryById(id_category);
    if (!categoryDetails) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(categoryDetails);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving category details", error: err.message });
  }
};

// Update Class Controller
const updateClass = async (req, res) => {
  const { id_class } = req.params;
  const { id_teacher, id_category, id_schedule, id_level, price } = req.body;

  try {
    if (!id_teacher || !id_category || !id_schedule || !id_level || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedClass = await Classes.updateClass(id_class, {
      id_teacher,
      id_category,
      id_schedule,
      id_level,
      price
    });

    if (updatedClass) {
      res.status(200).json({ message: "Class updated successfully" });
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating class", error: err.message });
  }
};

// Delete Class Controller
const deleteClass = async (req, res) => {
  const { id_class } = req.params;

  try {

    const deletedClass = await Classes.deleteClass(id_class);

    if (deletedClass) {
      res.status(200).json({ message: "Class deleted successfully" });
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting class", error: err.message });
  }
};

// Read Classes Controller - getAllDataClassByCategory
const getClassesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {

    const classesByCategory = await Classes.getAllDataClassByCategory(categoryId);
    const formattedSchedules = classesByCategory.map((schedule) => ({
      ...schedule,
      day: getDayName(schedule.day),
    }));

    res.status(200).json(formattedSchedules);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving classes by category", error: err.message });
  }
};

// Read Classes Controller - getAllDataClassByRole
const getClassesByRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const classesByRole = await Classes.getAllDataClassByRole(roleId);
    res.status(200).json(classesByRole);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving classes by role", error: err.message });
  }
};

// Read Classes Controller - getAllDataClassByLevel
const getClassesByLevel = async (req, res) => {
  const { levelId } = req.params;

  try {
    const classesByLevel = await Classes.getAllDataClassByLevel(levelId);
    res.status(200).json(classesByLevel);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving classes by level", error: err.message });
  }
};

const getAllDataLevel = async (req, res) => {
  try {
    const levels = await db('levels').select('*');
    res.status(200).json({ levels });
  } catch (error) {
    console.error('Error in getAllDataLevel:', error.message);
    res.status(500).json({ error: 'Failed to fetch levels data' });
  }
};

const getAllDataCategory = async (req, res) => {
  try {
    const category = await db('category_class').select('*');
    res.status(200).json({ category });
  } catch (error) {
    console.error('Error in getAllDataCategory:', error.message);
    res.status(500).json({ error: 'Failed to fetch class category data' });
  }
};

const getAllClassesById = async (req, res) => {
  const { id_class } = req.params;

  try {
    const classDetails = await Classes.getAllClassesById(id_class);
    if (!classDetails) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classDetails);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving class details", error: err.message });
  }
};

const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getScheduleByLevel = async (req, res) => {
  const { id_level } = req.params;

  console.log("Request to get schedules for level:", id_level);

  try {
    const schedules = await Schedule.getScheduleByLevel(id_level);

    const formattedSchedules = schedules.map((schedule) => ({
      ...schedule,
      day: getDayName(schedule.day),
    }));

    console.log("Formatted schedules:", formattedSchedules);

    res.status(200).json(formattedSchedules);
    
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving schedule", error: error.message });
  }
}

const getLevelsByCategory = async (req, res) => {
  const { id_category } = req.params;

  try {
    const levels = await Levels.getLevelsByCategory(id_category);

    res.status(200).json(levels);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching levels.',
    });
  }
};


module.exports = { createClass, getClasses, updateClass, deleteClass, getClassesByCategory, getClassesByRole, getClassesByLevel, getAllDataLevel, getAllDataCategory, getAllClassesById, getAllCategoryById, getScheduleByLevel, getScheduleByLevel, getLevelsByCategory };