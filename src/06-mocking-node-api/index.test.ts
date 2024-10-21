import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

jest.mock('path', () => ({
  __esModule: true,
  ...jest.requireActual('path'),
}));

jest.mock('fs', () => ({
  __esModule: true,
  ...jest.requireActual('fs'),
}));

jest.mock('fs/promises', () => ({
  __esModule: true,
  ...jest.requireActual('fs/promises'),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const timeout = 1000;

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const interval = 1000;

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, interval);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'path/to/file';
    const joinSpy = jest.spyOn(await import('path'), 'join');
    await readFileAsynchronously(pathToFile);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(await import('fs'), 'existsSync').mockReturnValueOnce(false);
    await expect(readFileAsynchronously('path/to/file')).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(await import('fs'), 'existsSync').mockReturnValueOnce(true);
    const fileContent = 'content';
    jest
      .spyOn(await import('fs/promises'), 'readFile')
      .mockResolvedValue(fileContent);
    await expect(readFileAsynchronously('path/to/file')).resolves.toBe(
      fileContent,
    );
  });
});
