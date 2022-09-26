/* eslint-disable space-before-function-paren */

import robot from 'robotjs';

let interval: NodeJS.Timeout | null = null;

export const startAntiAFKScript = () => {
  interval = setInterval(async () => {
    await doStuff();

    robot.keyTap('f1', 'control');
    await sleep(getRandomInt(3000, 5000));

    await doStuff();
  }, 1000 * getRandomInt(55, 65) * 4);

  return {
    stop: function () {
      if (interval) {
        clearInterval(interval);
      }
    }
  };
};

const doStuff = async () => {
  robot.keyTap('enter');
  await sleep(1000 * getRandomInt(15, 20));
  robot.keyTap('enter');
};

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
