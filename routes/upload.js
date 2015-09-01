var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});

var fs = require('fs'), readline = require('readline');


/* POST file upload. */
router.post('/', upload.array('sources', 2), function (req, res, next) {

    var sourcesFiles = [];
    var result = [];

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

    for (var i = 0; i < sourcesFiles[0].lines.length; i++) {
        var resLine = {
            line: i,
            symbol: ' ',
            desc: ""
        };

        /* check exists */
        if (!sourcesFiles[1].lines[i]) {
            resLine.symbol = "-";
            resLine.desc = sourcesFiles[0].lines[i];
        } else {

            /* check change */
            if (sourcesFiles[0].lines[i] != sourcesFiles[1].lines[i]) {
                resLine.symbol = "*";
                resLine.desc = sourcesFiles[0].lines[i] + "|" + sourcesFiles[1].lines[i];
            } else {
                /* no changed */
                resLine.desc = sourcesFiles[0].lines[i];
            }
        }
        result.push(resLine);
    }
    
    /* bigger */
    if (sourcesFiles[1].lines.length > sourcesFiles[0].lines.length) {
        var from = sourcesFiles[0].lines.length;
        for (var i = from; i < sourcesFiles[1].lines.length; i++) {
            var resLine = {
                line: i,
                symbol: "+",
                desc: sourcesFiles[1].lines[i]
            };
            result.push(resLine);
        }
    }
    res.render('result', {title: 'Result', result: result});

});

module.exports = router;
