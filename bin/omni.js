#!/usr/bin/env node
const { program } = require('commander');
const start = require('../lib/commands/start');
const stage = require('../lib/commands/stage');
const snap = require('../lib/commands/snap');
const sprout = require('../lib/commands/sprout');
const blend = require('../lib/commands/blend');
const send = require('../lib/commands/send');
const fetch = require('../lib/commands/fetch');
const undo = require('../lib/commands/undo');
const history = require('../lib/commands/history');

program
  .command('start')
  .description('Initialize a new Omni repository')
  .action(start);

program
  .command('stage <file>')
  .description('Stage files for the next snapshot')
  .action(stage);

program
  .command('snap <message>')
  .description('Create a snapshot of the staged files')
  .action(snap);

program
  .command('sprout <branch>')
  .description('Create a new branch')
  .action(sprout);

program
  .command('blend <branch>')
  .description('Blend another branch into the current branch')
  .action(blend);

program
  .command('send')
  .description('Send your snapshots to the remote repository')
  .action(send);

program
  .command('fetch')
  .description('Fetch updates from the remote repository')
  .action(fetch);

program
  .command('undo <commit>')
  .description('Undo a specific commit')
  .action(undo);

program
  .command('history')
  .description('View the history of snapshots')
  .action(history);

program.parse(process.argv);
