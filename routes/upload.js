var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var linesArrDiff = require('../lib/filediff');

var fs = require('fs'), readline = require('readline');


/* POST file upload. */
router.post('/', upload.array('sources', 2), function (req, res, next) {

    var sourcesFiles = [];


    /* load files */
    for (var i = 0; i < req.files.length; i++) {

        var fileDesc = {
            filename: req.files[i].filename,
            lines: []
        };

        fs.readFileSync(req.files[i].path).toString().split(/\r?\n/).forEach(function (line) {
            fileDesc.lines.push(line);
        });

        sourcesFiles.push(fileDesc);
    }

    var result = linesArrDiff(sourcesFiles[0], sourcesFiles[1]);

    res.render('result', {title: 'Result', result: result});

});

module.exports = router;
