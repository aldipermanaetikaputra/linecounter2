# linecounter2

⚡ Fastest and memory-efficient async file line counter with customizable buffer size and separator.

Allow you to count the lines of a huge file by reading chunk by chunk without buffering the whole file in memory. Has the ability to customize a line separator (multiple characters allowed), and skip blank lines.

- Fast & memory-efficient.
- Well-tested with Jest.
- Written in TypeScript.
- CLI supported.

## Install

```bash
# using npm
npm install linecounter2
# using yarn
yarn add linecounter2
```

## Usage

#### Import

```js
// in ESM
import { LineCounter } from 'linecounter2';
// in CommonJS
const { LineCounter } = require('linecounter2');
```

#### Example

```js
const total = await LineCounter.count({ filePath: './file.txt' });
console.log(total);
```

## API

#### `LineCounter.count(options: LineCounterOptions): Promise<number>`

It returns the total lines in the file. The options you can pass are:

| Name                | Type      | Default | Description                                                                                                                             |
| ------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| filePath            | `string`  | none    | The path or location of your file **(required)**                                                                                        |
| bufferSize          | `number`  | `65536` | Chunk/buffer size in bytes. Default: `64 KB`                                                                                            |
| lineSeparator       | `string`  | none    | Separator to separate between lines (multiple characters allowed). Will be automatically determined between `'\r\n'`, `'\n'`, or `'\r'` |
| skipBlank           | `boolean` | `false` | Used to skip blank lines (including whitespace lines)                                                                                   |
| skipEndingLineBreak | `boolean` | `false` | Used to skip the last blank line (if any) of the file. See the example below                                                            |

Example:

```js
const total1 = await LineCounter.count({ filePath: './file.txt' });
console.log('total lines =', total1);

const total2 = await LineCounter.count({ filePath: './file.txt', skipBlank: true });
console.log('total lines [skip blank] =', total2);

const total3 = await LineCounter.count({ filePath: './file.txt', skipEndingLineBreak: true });
console.log('total lines [skip ending line break] =', total3);
```

`./file.txt`

```txt
1111
2222
3333

5555
6666
7777
8888
9999
\t
```

Output:

```
total lines = 10
total lines [skip blank] = 8
total lines [skip ending line break] = 9
```

## CLI

This library supports CLI in an easy way.

Example:

```bash
# using npm
npx linecounter2 ./file.txt
# using yarn
yarn linecounter2 ./file.txt
```

`./file.txt`

```txt
1111
2222
3333

5555
```

Output:

```bash
5
```

You can pass additional options as arguments as follows:

```bash
# using npm
npx linecounter2 ./file.txt --skipBlank --bufferSize=1024 --lineSeparator=\\n
# using yarn
yarn linecounter2 ./file.txt --skipBlank --bufferSize=1024 --lineSeparator=\\n
```

Output:

```bash
4
```

## Testing

This library is well tested. You can test the code as follows:

```bash
# use npm
npm test
# use yarn
yarn test
```

## Related

- [chunkreader2](https://github.com/aldipermanaetikaputra/chunkreader2) - Asynchronous, buffered, chunk-by-chunk file reader with customizable buffer size.
- [linereader2](https://github.com/aldipermanaetikaputra/linereader2) - Asynchronous, buffered, chunk-by-chunk file reader with customizable buffer size. **(This library uses this package internally)**

## Contribute

If you have anything to contribute, or functionality that you lack - you are more than welcome to participate in this!

## License

Feel free to use this library under the conditions of the MIT license.
