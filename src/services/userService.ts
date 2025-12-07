import User from '../models/user';
import { Op } from 'sequelize';

class UserService {
  async getAllUsers() {
     const findAll = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']],
    });
    return findAll;
  }

  async getUserById(id: number) {
    const findByPk = await User.findByPk(id, {
      attributes: { exclude: ['password']},
    });
    return findByPk;
  }

  async blockUser(id: number) {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await user.save();

    
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async searchUsers(query: string) {
    const findAll = await User.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
    });
    return findAll;
  }
}


export default UserService;