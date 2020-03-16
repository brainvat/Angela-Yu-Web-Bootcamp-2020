function isLeap(year) {

/**************Don't change the code above****************/

    //Write your code here.

    var isLeapYear = "Leap year.";
    var isNotLeapYear = "Not leap year.";
    var response = isNotLeapYear;

    if (year % 4 === 0) {
      if (year % 100 === 0) {
        if (year % 400 === 0) {
          response = isLeapYear;
        }
      }
    }

    return response;


/**************Don't change the code below****************/

}

console.log(isLeap(2000)); // Leap
console.log(isLeap(2100)); // Not leap
console.log(isLeap(2400)); // Leap
console.log(isLeap(1989)); // Not leap
console.log(isLeap(1948)); // Leap
