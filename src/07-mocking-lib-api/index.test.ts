import axios, { AxiosInstance } from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  describe('throttledGetDataFromApi', () => {
    let axiosCreateSpy: jest.SpyInstance;
    let axiosInstance: Partial<AxiosInstance>;
    const responseData = { data: 'mockedData' };
    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      axiosInstance = {
        get: jest.fn().mockResolvedValue(responseData),
      };

      axiosCreateSpy = jest
        .spyOn(axios, 'create')
        .mockReturnValue(axiosInstance as AxiosInstance);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('should create instance with provided base url', async () => {
      const relativePath = '/posts';
      await throttledGetDataFromApi(relativePath);
      expect(axiosCreateSpy).toHaveBeenCalledWith({
        baseURL: 'https://jsonplaceholder.typicode.com',
      });
    });

    test('should perform request to correct provided url', async () => {
      const relativePath = '/posts';
      const resultPromise = throttledGetDataFromApi(relativePath);
      expect(axiosInstance.get).not.toHaveBeenCalled();
      jest.advanceTimersByTime(THROTTLE_TIME);
      await resultPromise;
      expect(axiosInstance.get).toHaveBeenCalledWith(relativePath);
    });

    test('should return response data', async () => {
      const resultPromise = throttledGetDataFromApi('/posts');
      jest.advanceTimersByTime(THROTTLE_TIME);
      const result = await resultPromise;
      expect(result).toEqual(responseData.data);
    });
  });
});
