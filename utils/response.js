module.exports = (result) => { 
    if (typeof result != 'string') {
        result = JSON.stringify(result, undefined, 2);
    }
    result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return JSON.stringify(JSON.parse(result),null,2);
}