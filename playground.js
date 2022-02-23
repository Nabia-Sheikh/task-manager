const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("Numbers must be non-negative");
      }
      resolve(a + b);
    }, 2000);
  });
};

// let sum1 = add(2,3)
// .then(data => sum1 = data)
// .catch(err => console.log(err))

// setTimeout(() => {
//     console.log(sum1);
//     add(sum1,3)
// .then(data => console.log(data))
// .catch(err => console.log(err))
// }, 3000);

// add(2,3)
// .then(sum => add(sum , -5))
// .then(res => console.log(res))
// .catch(err => console.log(err))

// const results = async () => {
//     try {
//         const sum1 = await add(2 ,2)
//     const sum2 = await add(sum1 , -4)
//     const sum3 = await add(sum2 , 5)
//     console.log(sum3);
//     } catch (error) {
//         console.log(error);
//     }
// }

// results()

const jwt = require("jsonwebtoken");
const token = jwt.sign({ name: " Hellow orld" }, "slkfjasljfdlkasjd", {
  expiresIn: "1h",
});
console.log(token);
const verify = jwt.verify(token, "slkfjasljfdlkasjd");
