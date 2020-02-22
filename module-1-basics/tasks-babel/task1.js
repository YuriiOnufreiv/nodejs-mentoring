#!/usr/bin/env node
'use strict';

var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (input) {
	return console.log(reverseString(input));
});

function reverseString(str) {
	return str.split('').reverse().join('');
}