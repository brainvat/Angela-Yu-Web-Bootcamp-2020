function bmiCalculator(weight, height) {
    var bmi = Math.floor(10 * weight/(height*height))/10;

    var interpretation = "Your BMI is " + bmi;
    if (bmi < 18.5) {
        interpretation += ", so you are underweight.";
    } else if (bmi <= 24.9) {
        interpretation += ", so you have a normal weight.";
    } else {
        interpretation += ", so you are overweight.";
    }
    return interpretation;
}

console.log( bmiCalculator(65, 1.8));
