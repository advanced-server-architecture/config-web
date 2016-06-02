var fs = require('fs');
var htmlEncode = require('htmlencode').htmlEncode;

var data = './src/components/PageSceneManagement/PageSceneManagement.js\nModule build failed: SyntaxError: /Users/Joesonw/daai-admin/src/components/PageSceneManagement/PageSceneManagement.js: Unexpected token (120:4)\n\u001b[0m  118 | \t\t\t\u001b[1m<\u001b[22m\u001b[1m/\u001b[22mdiv\u001b[1m>\u001b[22m\u001b[32m}\u001b[39m\n  119 | \t\t\tkey\u001b[1m=\u001b[22m\u001b[32m{\u001b[39mprefix\u001b[32m}\u001b[39m\n> 120 | \t\t\t\u001b[32m{\u001b[39m\u001b[34m\u001b[1m(\u001b[22m\u001b[39mnode\u001b[1m.\u001b[22mchildren \u001b[1m||\u001b[22m \u001b[33m[\u001b[39m\u001b[33m]\u001b[39m\u001b[34m\u001b[1m)\u001b[22m\u001b[39m\n      |     ^\n  121 | \t\t\t\t\u001b[1m.\u001b[22mmap\u001b[34m\u001b[1m(\u001b[22m\u001b[39m\u001b[34m\u001b[1m(\u001b[22m\u001b[39mchild\u001b[1m,\u001b[22m i\u001b[34m\u001b[1m)\u001b[22m\u001b[39m \u001b[1m=>\u001b[22m self\u001b[1m.\u001b[22mmakeRecursiveTree\u001b[34m\u001b[1m(\u001b[22m\u001b[39mchild\u001b[1m,\u001b[22m \u001b[31m`${prefix}-${i}`\u001b[39m\u001b[34m\u001b[1m)\u001b[22m\u001b[39m \u001b[34m\u001b[1m)\u001b[22m\u001b[39m\u001b[32m}\u001b[39m\n  122 | \t\t\u001b[1m<\u001b[22m\u001b[1m/\u001b[22mTree\u001b[1m.\u001b[22mTreeNode\u001b[1m>\u001b[22m\u001b[34m\u001b[1m)\u001b[22m\u001b[39m\u001b[1m;\u001b[22m\n  123 | \t\u001b[32m}\u001b[39m\u001b[0m\n    at Parser.pp.raise (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:1412:13)\n    at Parser.pp.unexpected (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:2895:8)\n    at Parser.pp.expect (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:2889:33)\n    at Parser.pp.jsxParseAttribute (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:4267:10)\n    at Parser.pp.jsxParseOpeningElementAt (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:4284:31)\n    at Parser.pp.jsxParseElementAt (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:4306:29)\n    at Parser.pp.jsxParseElement (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:4355:15)\n    at Parser.parseExprAtom (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:4367:21)\n    at Parser.pp.parseExprSubscripts (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:504:19)\n    at Parser.pp.parseMaybeUnary (/Users/Joesonw/daai-admin/node_modules/babel-core/node_modules/babylon/index.js:484:19)\n @ ./src/App.js 25:27-90'

function f(str) {
	var ret = '';
	var i = 0;
	for (var s of str.split('\n')) {
		ret += wrapLine(s);
	}
	return '<div style="display:block;text-align:left;font-size:14px;font-family:Menlo,Courier New;background:black;color:white;">' + ret + '</div>';
}

function wrapLine(str) {
	if (str.length === 0) return '';
	var ret = '';
	for (var s of str.split('\t')) {
		var t = wrapTab(s) ;
		ret += t;
	}
	return '<p style="line-hight: 1;margin: 0; padding: 0">' + ret + '</p>';
}

function wrapTab(str) {
	var ret = replaceFormat(str);
	return '<span style="padding-left: 4em">' + ret + '</span>';
}

function replaceFormat(s) {
	if (s === '') return '';
	var formatRegex = /\u001b\[([0-9]*)m/gi;
	var match;
	var ret = '<span>';
	var p = 0;
	while(match = formatRegex.exec(s)) {
		ret += htmlEncode(s.substr(p, match.index - p)) + '</span>';
		p = match.index + match[0].toString().length;
		ret += format(match[1]);
	}
	ret += '</span>' + s.substr(p);

	return ret;
}


function format(s) {
	if (s === '31') {
		return '<span style="color: red;">';
	} else if (s === '32') {
		return '<span style="color: green;">';
	} else if (s === '33') {
		return '<span style="color: yellow;">';
	} else if (s === '34') {
		return '<span style="color: blue;">';
	} else if (s === '35') {
		return '<span style="color: magenta;">';
	} else if (s === '36') {
		return '<span style="color: cyan;">';
	} else if (s === '37') {
		return '<span style="color: lightgray;">';
	}
	return '<span>';
}

module.exports = f;

