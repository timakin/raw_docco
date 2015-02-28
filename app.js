var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();




//////////////////for docco

var fs = require('fs');
var lineReader = require('line-reader');
var _ = require('underscore');


var filePath = './app.js';

var getCodeTextHash = fs.readFile(filePath, function(error, buffer) {
    var code, sections, parsedCode;
    if (error) {
        return callback(error);
    }
    code = buffer.toString();
    parsedCode = parse(code.split('\n'), filePath);
    console.log(parsedCode);
    return parsedCode;
});

var Docco, buildMatchers, commander, configure, defaults, document, format, fs, getLanguage, highlightjs, languages, marked, parse, path, run, version, write, _,
    __slice = [].slice;

var parse = function(lines, filePath) {
    var languages = JSON.parse(fs.readFileSync('node_modules/docco/resources/languages.json'));

    var buildMatchers = function(languages) {
        var ext, l;
        for (ext in languages) {
            l = languages[ext];
            l.commentMatcher = RegExp("^\\s*" + l.symbol + "\\s?");
            l.commentFilter = /(^#![/]|^\s*#\{)/;
        }
        return languages;
    };

    var langs = buildMatchers(languages);

    var getLanguage = function(config, filePath) {
        var codeExt, codeLang, ext, lang, _ref;
        console.log(path.basename(filePath));
        var filename = path.basename(filePath);
        var selectedLang = '.js';
        ext = path.extname('test') || selectedLang;
        lang = ((_ref = config.languages) != null ? _ref[ext] : void 0) || languages[ext];
        return lang;
    };

    var lang = getLanguage(langs, filePath);
    var codeText, docsText, hasCode, i, isText, lang, line, lines, match, maybeCode, save, sections, _i, _j, _len, _len1;
    sections = [];
    hasCode = docsText = codeText = '';
    save = function() {
        sections.push({
            docsText: docsText,
            codeText: codeText
        });
        return hasCode = docsText = codeText = '';
    };
    for (_j = 0, _len1 = lines.length; _j < _len1; _j++) {
        line = lines[_j];
        if (line.match(lang.commentMatcher) && !line.match(lang.commentFilter)) {
            if (hasCode) {
                save();
            }
            docsText += (line = line.replace(lang.commentMatcher, '')) + '\n';
            if (/^(---+|===+)$/.test(line)) {
                save();
            }
        } else {
            hasCode = true;
            codeText += line + '\n';
        }
    }
    save();
    return sections;
};

/////////////////////////////


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
