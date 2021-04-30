exports.snakeToCamel = text => text.replace(/_(\w)/g, match => match[1].toUpperCase());

exports.camelToSnake = text => text.replace(/[a-z][A-Z]/g, match => `${match[0]}_${match[1].toLowerCase()}`);
