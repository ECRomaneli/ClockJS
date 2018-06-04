require('fs').readdirSync(__dirname).forEach(function(file) {
    if (file.substr(0, 5) === 'test-') {
        require('./' + file);
    }
});