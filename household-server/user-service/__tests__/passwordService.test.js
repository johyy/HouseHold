const { hashPassword } = require('../services/passwordService')

test('password is hashed', async () => {
  const password = 'password';
  const hashedPassword = await hashPassword(password);

  expect(hashedPassword).not.toEqual(password)
  expect(hashedPassword.length).toBeGreaterThan(0)
});