const validateBooking = (req, res, next) => {
    const { id_user, id_class } = req.body;
  
    if (!id_user || !id_class) {
      return res.status(400).json({ message: 'id_user and id_class are required' });
    }
  
    next();
  };
  
  module.exports = validateBooking;
  