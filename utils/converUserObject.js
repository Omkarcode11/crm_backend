exports.userResponse = (users) => {
  let userResult = [];
  users.array.forEach((user) => {
    userResult.push({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
    });
  });
  return userResult;
};
