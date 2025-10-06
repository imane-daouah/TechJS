
//1
console.log("Program started");

// 2
const myPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Promise resolved");
  }, 3000);
});

// 3
console.log(myPromise);

// 4
console.log("Program in progress");

// 5
myPromise.then((message) => {
  console.log(message);
  console.log("Program complete");
});
