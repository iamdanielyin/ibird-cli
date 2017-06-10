#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const pkgjson = require('../package.json');

program
.version(pkgjson.version, '-v, --version')
.usage('COMMAND')
.command('create', 'Create a new project')
.command('model', 'Generate model')
.command('route', 'Generate routing')
.command('mdl', 'Generate middleware')
.command('task', 'Generate scheduling task')
.command('unmodel', 'Undo the generated model')
.command('unroute', 'Undo the generated routing')
.command('unmdl', 'Undo the generated middleware')
.command('untask', 'Undo the of the generated scheduling task')
.parse(process.argv);