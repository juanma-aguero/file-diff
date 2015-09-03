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

    /* return number of times that appeare or false */
    var isInArray = function (line, arr) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (line == arr[i] || (arr[i].desc && line == arr[i].desc)) {
                count++;
            }
        }

        if (count > 0) {
            return count;
        }

        return false;
    };


    var resultLine = 0;
    for (var i = 0; i < sourcesFiles[0].lines.length; i++) {
        var resLine = {
            line: resultLine,
            symbol: ' ',
            desc: ""
        };

        /* check exists */
        if (!isInArray(sourcesFiles[0].lines[i], sourcesFiles[1].lines)) {

            /* check diff */
            if (!sourcesFiles[1].lines[i]) {
                resLine.symbol = "-";
                resLine.desc = sourcesFiles[0].lines[i];
            } else {

                /* check exists other way */
                if (!isInArray(sourcesFiles[1].lines[i], sourcesFiles[0].lines)) {

                    /* check change */
                    if (sourcesFiles[0].lines[i] != sourcesFiles[1].lines[i]) {
                        resLine.symbol = "*";
                        resLine.desc = sourcesFiles[0].lines[i] + "|" + sourcesFiles[1].lines[i];
                    } else {
                        /* no changed */
                        resLine.desc = sourcesFiles[0].lines[i];
                    }

                } else {

                    /* source has been removed */
                    resLine.symbol = "-";
                    resLine.desc = sourcesFiles[0].lines[i];
                }
            }
        } else {

            var compare = isInArray(sourcesFiles[1].lines[i], sourcesFiles[0].lines);
            if (!compare) {
                if (i < (sourcesFiles[0].lines.length - 1)) {
                    result.push({
                        line: resultLine,
                        symbol: '-',
                        desc: sourcesFiles[1].lines[i]
                    });

                    resultLine++;

                    /* no changed */
                    resLine.line = resultLine;
                    resLine.desc = sourcesFiles[0].lines[i];

                } else {
                    
                    result.push({
                        line: resultLine,
                        symbol: ' ',
                        desc: sourcesFiles[0].lines[i]
                    });

                    /* no changed */
                    resLine.line = resultLine;
                    resLine.symbol = '+';
                    resLine.desc = sourcesFiles[1].lines[i];


                }


            } else {
                /* no changed */
                resLine.line = resultLine;
                resLine.desc = sourcesFiles[0].lines[i];
            }


        }

        result.push(resLine);

        resultLine++;
    }

    /* bigger */
    if (sourcesFiles[1].lines.length > sourcesFiles[0].lines.length) {
        var from = sourcesFiles[0].lines.length - 1;
        for (var i = from; i < sourcesFiles[1].lines.length; i++) {
            var resLine = {
                line: resultLine,
                symbol: "+",
                desc: sourcesFiles[1].lines[i]
            };
            var howManyInResult = isInArray(sourcesFiles[1].lines[i], result);
            var howManyInSource = isInArray(sourcesFiles[1].lines[i], sourcesFiles[1].lines);

            if (howManyInResult < howManyInSource) {
                result.push(resLine);
            }

            resultLine++;
        }
    }
    res.render('result', {title: 'Result', result: result});

});

module.exports = router;
