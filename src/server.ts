import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    
    await sequelize.sync({ force: false });
    console.log('Database synced');

    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();