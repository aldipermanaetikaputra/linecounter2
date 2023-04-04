#!/usr/bin/env node

import minimist from 'minimist';
import LineCounter, { LineCounterOptions } from './LineCounter';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const args = process.argv.slice(2);
if (args.length) {
  const argv = minimist(args) as Record<string, string>;
  argv.filePath = argv.filePath || argv['_']?.[0];
  if (argv.filePath) {
    LineCounter.count(argv as unknown as LineCounterOptions)
      .then(console.info)
      .catch(console.error);
  }
}
