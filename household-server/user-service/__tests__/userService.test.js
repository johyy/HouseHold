const { getUserByUsername } = require('../services/userService');
const User = require('../models/user')

jest.mock('../models/user', () => ({
  findOne: jest.fn(),
}))

describe('getUserByUsername', () => {
  it('should return a user if found', async () => {
    const mockUser = { username: 'testuser', password: 'password' };

    User.findOne.mockResolvedValue(mockUser);

    const username = 'testuser'
    const result = await getUserByUsername(username)

    expect(User.findOne).toHaveBeenCalledWith({ username });
    expect(result).toEqual(mockUser);
  })

  it('should return null if no user is found', async () => {
    User.findOne.mockResolvedValue(null)

    const username = 'nulluser';
    const result = await getUserByUsername(username)

    expect(User.findOne).toHaveBeenCalledWith({ username })
    expect(result).toBeNull()
  })
})
