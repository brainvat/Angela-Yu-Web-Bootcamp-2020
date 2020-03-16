function fibonacciGenerator (n) {
//Do NOT change any of the code above 👆

    //Write your code here:
    var fibSequence = [0, 1];

    if (n < 3) {
      return fibSequence.slice(0, n);
    }

    for (var i = 3; i <= n; i++) {
      var t = fibSequence.length;
      fibSequence.push(fibSequence[t - 1] + fibSequence[t-2]);
    }

    return fibSequence;






    //Return an array of fibonacci numbers starting from 0.

//Do NOT change any of the code below 👇
}
console.log(fibonacciGenerator(5));
console.log(fibonacciGenerator(1));
console.log(fibonacciGenerator(2));
console.log(fibonacciGenerator(10));
console.log(fibonacciGenerator(15));
