/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { LineReader, LineReaderOptions } from 'linereader2';

export interface LineCounterOptions
  extends Omit<LineReaderOptions, 'bufferEncoding' | 'removeInvisibleUnicode' | 'skipNumbers'> {
  skipEndingLineBreak?: boolean;
}

class LineCounter {
  private static trimString(text: string, search: string) {
    let start = 0;
    let end = text.length;

    while (start < end && text.slice(start, start + search.length) === search)
      start += search.length;
    while (end > start && text.slice(end - search.length) === search) end -= search.length;

    return start > 0 || end < text.length ? text.substring(start, end) : text;
  }
  private static countOccurrences(text: string, search: string, overlap = false) {
    if (text.length === 0 || search.length === 0) return 0;

    const step = overlap ? 1 : search.length;

    let foundTotal = 0;
    let foundAt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      foundAt = text.indexOf(search, foundAt);
      if (foundAt !== -1) {
        foundTotal += 1;
        foundAt += step;
      } else break;
    }

    return foundTotal;
  }

  public static async count(options: LineCounterOptions) {
    options.bufferSize = options.bufferSize || 65536;

    const reader = new LineReader(options);

    if (!reader.lineSeparator) await reader._determineSeparator();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const occurenceSearch = reader.lineSeparator!;
    const regex = new RegExp(`(${occurenceSearch})+`, 'gm');
    const cleanBlankLine = (data: string) => data.replace(regex, occurenceSearch);

    let total = 0;
    while (!reader.isClosed) {
      let data: string = (await reader._nextChunk()) || '';
      if (options.skipBlank) {
        data = this.trimString(cleanBlankLine(data), occurenceSearch);

        if (!data) continue;
      }

      let count = this.countOccurrences(data, occurenceSearch) + 1;

      // skip new line at the end of file
      if (reader.isClosed && options.skipEndingLineBreak) {
        if (data.length === 0 || data.slice(-occurenceSearch.length) === occurenceSearch) {
          count--;
        }
      }

      total += count;
    }

    if (reader.bytesLength === 0) {
      return 0;
    }

    return total;
  }
}

export default LineCounter;
