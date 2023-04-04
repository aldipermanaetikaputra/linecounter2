import LineCounter from './LineCounter.js';
import tmp from 'tmp';
import fs from 'fs';

tmp.setGracefulCleanup();

const random = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const minLineLength = 4;
const maxLineLength = 1024;
const bufferSizes = [64, 4096, 65536];

describe('Without Separator', () => {
  test('Count empty lines', async () => {
    const total = 0;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, '');

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(total);
  });

  test('Count single line', async () => {
    const file = tmp.fileSync();
    const total = 230;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join('');

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(1);
  });
});

describe('Windows Separator', () => {
  const lineSeparator = '\r\n';

  test('Count 1000 lines', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(total);
  });

  test('Count 1000 lines with padding line breaks', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(total + 2);
  });

  test('Count 1000 lines with padding line breaks + skip blank lines', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with random 500 blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(
        total + blank
      );
  });

  test('Count 1000 lines with random 500 blank lines + skip blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipEndingLineBreak: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with no line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipEndingLineBreak: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip blank lines + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          bufferSize,
          filePath: file.name,
          skipBlank: true,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });
});

describe('Linux Separator', () => {
  const lineSeparator = '\n';

  test('Count 1000 lines', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(total);
  });

  test('Count 1000 lines with padding line breaks', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(total + 2);
  });

  test('Count 1000 lines with padding line breaks + skip blank lines', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with random 500 blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(LineCounter.count({ bufferSize, filePath: file.name })).resolves.toBe(
        total + blank
      );
  });

  test('Count 1000 lines with random 500 blank lines + skip blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipEndingLineBreak: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with no line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ bufferSize, filePath: file.name, skipEndingLineBreak: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip blank lines + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          bufferSize,
          filePath: file.name,
          skipBlank: true,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });
});

describe('Custom Separator', () => {
  const lineSeparator = 'P';

  test('Count 1000 lines', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with padding line breaks', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total + 2);
  });

  test('Count 1000 lines with padding line breaks + skip blank lines', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with random 500 blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total + blank);
  });

  test('Count 1000 lines with random 500 blank lines + skip blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with no line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip blank lines + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipBlank: true,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });
});

describe('Custom Separator (Multiple Char)', () => {
  const lineSeparator = 'HII';

  test('Count 1000 lines', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with padding line breaks', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total + 2);
  });

  test('Count 1000 lines with padding line breaks + skip blank lines', async () => {
    const total = 1000;
    const content =
      lineSeparator +
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) +
      lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with random 500 blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name })
      ).resolves.toBe(total + blank);
  });

  test('Count 1000 lines with random 500 blank lines + skip blank lines', async () => {
    const total = 1000;
    const lines = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)));
    const blank = 500;

    for (let i = 0; i < blank; i++) {
      lines.splice(random(0, lines.length), 0, '');
    }

    const content = lines.join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({ lineSeparator, bufferSize, filePath: file.name, skipBlank: true })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with no line break at the ending + skip ending line break', async () => {
    const total = 1000;
    const content = Array(total)
      .fill(null)
      .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
      .join(lineSeparator);
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });

  test('Count 1000 lines with line break at the ending + skip blank lines + skip ending line break', async () => {
    const total = 1000;
    const content =
      Array(total)
        .fill(null)
        .map(() => '_'.repeat(random(minLineLength, maxLineLength)))
        .join(lineSeparator) + lineSeparator;
    const file = tmp.fileSync();

    fs.writeFileSync(file.name, content);

    for (const bufferSize of bufferSizes)
      await expect(
        LineCounter.count({
          lineSeparator,
          bufferSize,
          filePath: file.name,
          skipBlank: true,
          skipEndingLineBreak: true,
        })
      ).resolves.toBe(total);
  });
});
