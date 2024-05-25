
function roundToPrecision(value, precision) {
    var multiplier = Math.pow(10, precision);

    return Math.round(value * multiplier) / multiplier;
}

function rotatePoint(x, y, angle) {
    var newX = x * Math.cos(angle) - y * Math.sin(angle);
    var newY = x * Math.sin(angle) + y * Math.cos(angle);

    return { x: newX, y: newY };
}

export { roundToPrecision, rotatePoint };
