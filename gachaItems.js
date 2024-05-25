/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/


let gachaItems = [
    {
        name: 'Blue Ball',
        color: [0, 0, 255],
        size: 20,
        probability: 0.5,
        effect: () => {
            ballColor = [0, 0, 255];
            ballSize = 20;
            ballAddRate = 1000;
            clearInterval(gachaInterval);
            gachaInterval = setInterval(addBall, ballAddRate);
        }
    },
    {
        name: 'Green Ball',
        color: [0, 255, 0],
        size: 20,
        probability: 0.5,
        effect: () => {
            ballColor = [0, 255, 0];
            ballSize = 20;
            ballAddRate = 1000;
            clearInterval(gachaInterval);
            gachaInterval = setInterval(addBall, ballAddRate);
        }
    },
    {
        name: 'Fast Red Ball',
        color: [255, 0, 0],
        size: 20,
        probability: 0.2,
        ballAddRate: 100, // Specify ballAddRate for the Fast Ball
        effect: () => {
            ballColor = [255, 0, 0];
            ballSize = 20;
            ballAddRate = 100;
            clearInterval(gachaInterval);
            gachaInterval = setInterval(addBall, ballAddRate);
        }
    },
    {
        name: 'Orange Ball',
        color: [255, 128, 0],
        size: 20,
        probability: 0.5,
        effect: () => {
            ballColor = [255, 128, 0];
            ballSize = 20;
            ballAddRate = 1000;
            clearInterval(gachaInterval);
            gachaInterval = setInterval(addBall, ballAddRate);
        }
    },
    {
        name: 'Yellow Ball',
        color: [255, 255, 0],
        size: 20,
        probability: 0.5,
        effect: () => {
            ballColor = [255, 255, 0];
            ballSize = 20;
            ballAddRate = 1000;
            clearInterval(gachaInterval);
            gachaInterval = setInterval(addBall, ballAddRate);
        }
    }
];