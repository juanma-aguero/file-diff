
/**
 * 
 * Diff lines.
 * 
 * @param array lines1
 * @param array lines2
 * @returns array lines diff.
 */
function linesArrDiff(lines1, lines2) {
    var result = [];

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
    for (var i = 0; i < lines1.lines.length; i++) {
        var resLine = {
            line: resultLine,
            symbol: ' ',
            desc: ""
        };

        /* check exists */
        if (!isInArray(lines1.lines[i], lines2.lines)) {

            /* check diff */
            if (!lines2.lines[i]) {
                resLine.symbol = "-";
                resLine.desc = lines1.lines[i];
            } else {

                /* check exists other way */
                if (!isInArray(lines2.lines[i], lines1.lines)) {

                    /* check change */
                    if (lines1.lines[i] != lines2.lines[i]) {
                        resLine.symbol = "*";
                        resLine.desc = lines1.lines[i] + "|" + lines2.lines[i];
                    } else {
                        /* no changed */
                        resLine.desc = lines1.lines[i];
                    }

                } else {

                    /* source has been removed */
                    resLine.symbol = "-";
                    resLine.desc = lines1.lines[i];
                }
            }
        } else {

            var compare = isInArray(lines2.lines[i], lines1.lines);
            if (!compare) {
                if (i < (lines1.lines.length - 1)) {
                    result.push({
                        line: resultLine,
                        symbol: '-',
                        desc: lines2.lines[i]
                    });

                    resultLine++;

                    /* no changed */
                    resLine.line = resultLine;
                    resLine.desc = lines1.lines[i];

                } else {

                    result.push({
                        line: resultLine,
                        symbol: ' ',
                        desc: lines1.lines[i]
                    });

                    /* no changed */
                    resLine.line = resultLine;
                    resLine.symbol = '+';
                    resLine.desc = lines2.lines[i];


                }


            } else {
                /* no changed */
                resLine.line = resultLine;
                resLine.desc = lines1.lines[i];
            }


        }

        result.push(resLine);

        resultLine++;
    }

    /* bigger */
    if (lines2.lines.length > lines1.lines.length) {
        var from = lines1.lines.length - 1;
        for (var i = from; i < lines2.lines.length; i++) {
            var resLine = {
                line: resultLine,
                symbol: "+",
                desc: lines2.lines[i]
            };
            var howManyInResult = isInArray(lines2.lines[i], result);
            var howManyInSource = isInArray(lines2.lines[i], lines2.lines);

            if (howManyInResult < howManyInSource) {
                result.push(resLine);
            }

            resultLine++;
        }
    }

    return result;

};

module.exports = linesArrDiff;