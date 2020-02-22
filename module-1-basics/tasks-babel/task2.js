#!/usr/bin/env node
'use strict';

var csv = require('csvtojson');
var fs = require('fs');

var csvFileName = './csv/source.csv';
var jsonFileName = './csv/target.txt';

var readStream = fs.createReadStream(csvFileName).on('error', function (error) {
    console.error('Failed to open .csv file.');
    console.error(error);
});

var writeStream = fs.createWriteStream(jsonFileName).on('error', function (error) {
    console.error('Failed to save to .txt file.');
    console.error(error);
});

var cvsParameters = {
    ignoreColumns: /Amount/i,
    colParser: {
        "price": "number"
    }
};

var converter = csv(cvsParameters).preFileLine(function (line, index) {
    if (index === 0) {
        return line.toLowerCase();
    }
    return line;
}).on('done', function (error) {
    if (error) {
        console.log("Failed to convert");
    } else {
        console.log("Successfully converted");
    }
});

readStream.pipe(converter).pipe(writeStream);