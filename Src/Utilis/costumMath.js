
function roundToPrecision(value, precision) {
    var multiplier = Math.pow(10, precision);

    return Math.round(value * multiplier) / multiplier;
}

export { roundToPrecision };
