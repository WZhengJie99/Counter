/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/

let achievementsPanelOpened = false;
const fs = require('fs');

const achievementsFile = 'achievements.json';


let achievements = [
    {
        name: "High Score Pro",
        description: "Achieve a high score of 1000 or more.",
        requirement: 1000,
        unlocked: false,
        reward: "Gold Medal"
    },
    {
        name: "Speedy Player",
        description: "Add 100 balls in 60 seconds or less.",
        requirement: 100,
        timeLimit: 60, // in seconds
        unlocked: false,
        reward: "Silver Medal"
    },
];

// Track progress towards achievements
function trackAchievements() {
    // Check for high score achievement
    if (ballCount >= 1000 && !achievements[0].unlocked) {
        achievements[0].unlocked = true;
        notifyAchievementUnlocked(achievements[0]);
        // Provide reward
        // Update UI
    }

    // Check for speedy player achievement
    // Implement similar logic for other achievements
}


function notifyAchievementUnlocked(achievement) {
    alert(`Congratulations! You have unlocked the achievement "${achievement.name}".`);
}


function displayAchievements() {
    fill(225, 225, 225, 240);
    noStroke();
    rect(0, 0, width, height);

    // red gacha shop nav bar
    fill(255, 0, 0);
    noStroke();
    rect(10, 100, width - 20, 50);
}

setInterval(trackAchievements, 1000);


function saveAchievementsData(data) {
    fs.writeFileSync(achievementsFile, JSON.stringify(data, null, 2));
}


function loadAchievementsData() {
    try {
        const data = fs.readFileSync(achievementsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading achievements data:', error);
        return [];
    }
}

achievements = loadAchievementsData();


function updateAchievementsData() {
    saveAchievementsData(achievements);
}

module.exports = {
    achievements,
    updateAchievementsData
};
