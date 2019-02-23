if (!String.prototype.format) {
    String.prototype.format = function() {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
} else {
    throw new Error("String.prototype.format is now defined! Please check the usages of string.format!");
}

if (!Array.prototype.random ) {
    Array.prototype.random = function () {
        return this[Math.floor((Math.random()*this.length))];
    };
} else {
    throw new Error("Array.prototype.random  is now defined! Please check the usages of string.format!");
}

if (!Array.prototype.contains ) {
    Array.prototype.contains = function (element) {
        return this.indexOf(element) >= 0;
    };
} else {
    throw new Error("Array.prototype.random  is now defined! Please check the usages of string.format!");
}