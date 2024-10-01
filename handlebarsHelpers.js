const handlebars = require('handlebars');

handlebars.registerHelper('increment', function(value) {
    return parseInt(value) + 1;
});

handlebars.registerHelper('decrement', function(value) {
    return parseInt(value) - 1;
});

handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

module.exports = handlebars;
