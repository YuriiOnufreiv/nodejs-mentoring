#!/usr/bin/env node

const csv = require('csvtojson')
const fs = require('fs')

const csvFileName = './csv/source.csv'
const jsonFileName = './csv/target.txt'

var readStream = fs.createReadStream(csvFileName)
    .on('error', (error) => {
        console.error('Failed to open .csv file.');
        console.error(error);
    });

var writeStream = fs.createWriteStream(jsonFileName)
    .on('error', (error) => {
        console.error('Failed to save to .txt file.');
        console.error(error);
    });

var cvsParameters = {
    ignoreColumns: /Amount/i,
    colParser: {
        "price": "number"
    }
}

var converter = csv(cvsParameters)
    .preFileLine((line, index) => {
        if (index === 0) {
            return line.toLowerCase();
        }
        return line;
    })
    .on('done', (error) => {
        if (error) {
            console.log("Failed to convert");
        } else {
            console.log("Successfully converted")
        }
    });

readStream
    .pipe(converter)
    .pipe(writeStream);