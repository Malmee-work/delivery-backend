import moment from 'moment';
import config from '../config';
import redis from 'redis';

const redisClient = redis.createClient();
const WINDOW_SIZE_IN_MINUTES = config.WINDOW_SIZE_IN_MINUTES;
const MAX_WINDOW_REQUEST_COUNT = config.MAX_WINDOW_REQUEST_COUNT;
const WINDOW_LOG_INTERVAL_IN_SECONDS = config.WINDOW_LOG_INTERVAL_IN_SECONDS;

export const requestLimiter = (req: any, res: any, next: any) => {
  // check that redis client exists
  if (!redisClient) {
    throw new Error('Redis client does not exist!');
  }

  // fetch records of current user using user object {id, role}, returns null when no record is found
  redisClient.get(
    `${req.user.role}-${req.user.id}`,
    function (err: any, record: any) {
      if (err) throw err;
      const currentRequestTime = moment();
      //  if no record is found , create a new record for user and store to redis
      if (record === null) {
        const newRecord = [];
        const requestLog = {
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1
        };
        newRecord.push(requestLog);
        redisClient.set(
          `${req.user.role}-${req.user.id}`,
          JSON.stringify(newRecord)
        );
        next();
      } else {
        // if record is found, parse it's value and calculate number of requests users has made within the last window
        const data = record && JSON.parse(record);
        const windowStartTimestamp = moment()
          .subtract(WINDOW_SIZE_IN_MINUTES, 'minutes')
          .unix();
        const requestsWithinWindow = data.filter(
          (entry: { requestTimeStamp: number }) => {
            return entry.requestTimeStamp > windowStartTimestamp;
          }
        );
        const totalWindowRequestsCount = requestsWithinWindow.reduce(
          (accumulator: any, entry: { requestCount: any }) => {
            return accumulator + entry.requestCount;
          },
          0
        );
        // if number of requests made is greater than or equal to the desired maximum, return error
        if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
          res
            .status(429)
            .send(
              `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_MINUTES} minute${
                WINDOW_SIZE_IN_MINUTES > 1 ? 's' : ''
              } limit!`
            );
        } else {
          // if number of requests made is less than allowed maximum, log new entry
          const lastRequestLog = data[data.length - 1];
          const potentialCurrentWindowIntervalStartTimeStamp =
            currentRequestTime
              .subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
              .unix();
          //  if interval has not passed since last request log, increment counter
          if (
            lastRequestLog.requestTimeStamp >
            potentialCurrentWindowIntervalStartTimeStamp
          ) {
            lastRequestLog.requestCount++;
            data[data.length - 1] = lastRequestLog;
          } else {
            //  if interval has passed, log new entry for current user and timestamp
            data.push({
              requestTimeStamp: currentRequestTime.unix(),
              requestCount: 1
            });
          }
          redisClient.set(
            `${req.user.role}-${req.user.id}`,
            JSON.stringify(data)
          );
          next();
        }
      }
    }
  );
};
