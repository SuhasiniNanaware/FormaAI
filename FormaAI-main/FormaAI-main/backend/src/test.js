const User = require("./models/User");

async function test() {
  const user = new User({
    username: "Dinesh",
    email: "dinesh@test.com",
    password: "123456",
  });

  await user.save();

  console.log(user);
}

test();