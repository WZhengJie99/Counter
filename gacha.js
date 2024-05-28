/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/

let shopOpened = false;
let gachaShop = false;
let selectedItemIndex = 0;
let gachaInterval;
let obtainedItems = [];


async function loadObtainedItems() {
    const data = await window.api.loadObtainedItems();
    if (data) {
        obtainedItems = data.obtainedItems || [];
        selectedItemIndex = data.selectedItemIndex || 0;

        // Sync obtained items with gachaItems
        obtainedItems.forEach(item => {
            let gachaItem = gachaItems.find(gItem => gItem.name === item.name);
            if (gachaItem) {
                item.color = gachaItem.color;
                item.size = gachaItem.size;
                item.ballAddRate = gachaItem.ballAddRate;
            }
        });
    } else {
        obtainedItems = [];
        selectedItemIndex = 0;
    }

    if (obtainedItems.length === 0) {
        obtainedItems.push({
            name: 'Red Ball',
            color: [255, 0, 0],
            size: 20,
            probability: 0.0,
            ballAddRate: 1000
        });
    }

    sortObtainedItems();
    applyItemEffect(obtainedItems[selectedItemIndex]);
    currentSkins();
}


function sortObtainedItems() {
    obtainedItems.sort((a, b) => {
        let indexA = gachaItems.findIndex(item => item.name === a.name);
        let indexB = gachaItems.findIndex(item => item.name === b.name);
        return indexA - indexB;
    });
}

function saveObtainedItems() {
    console.log("saved");
    window.api.saveObtainedItems({ obtainedItems, selectedItemIndex });
}


function applyItemEffect(item) {
    ballColor = item.color;
    ballSize = item.size;
    ballAddRate = item.ballAddRate || 1000;
    clearInterval(gachaInterval);
    gachaInterval = setInterval(addBall, ballAddRate);
}

loadObtainedItems();

function openShop() {
    shopOpened = true;
    gachaShop = true;
}

function closeShop() {
    shopOpened = false;
}

//Gacha shop tabs

function openGacha() {
    gachaShop = true;
    fill(0);
    text('Open Gacha', (width / 5), 135);
    //fill(255);
    //text('Current Skins', (width / 5) * 3, 135);
    applyTextShadow((width / 5) * 3 - 50, 100, textWidth('Current Skins') + 100, 50, 'Current Skins', (width / 5) * 3, 135,);

    // Draw the gacha roll button
    textSize(24);
    //1x
    fill(200, 0, 0);
    rect(20, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40); // Draw the rectangle
    applyTextShadow(20, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40, 'Gacha 1x', 65, 5 + (height / 10) * 8, 'Count -100', 60, 55 + (height / 10) * 8);

    //10x
    fill(150, 0, 0);
    rect(240, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40); // Draw the rectangle
    applyTextShadow(240, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40, 'Gacha 10x', 280, 5 + (height / 10) * 8, 'Count -1000', 275, 55 + (height / 10) * 8);

    // Coming Soon...
    fill(100, 0, 0);
    rect(460, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40); // Draw the rectangle
    applyTextShadow(460, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40, 'Coming Soon...', 480, 5 + (height / 10) * 8, '', 0, 0);
}

function applyTextShadow(x, y, w, h, text1, text1X, text1Y, text2, text2X, text2Y) {
    fill(255);

    // Check if the mouse is inside the rectangle
    let isHovered = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    // Apply shadow if hovered
    if (isHovered) {
        drawingContext.shadowOffsetX = 3;
        drawingContext.shadowOffsetY = 3;
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = 'rgba(0, 0, 0, 1)';
    } else {
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
    }

    text(text1, text1X, text1Y);
    if (text2) {
        text(text2, text2X, text2Y);
    }

    // Reset shadow for other drawings
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';
}


function currentSkins() {
    gachaShop = false;
    //fill(255);
    //text('Open Gacha', (width / 5), 135);
    applyTextShadow((width / 5) - 50, 100, textWidth('Open Gacha') + 100, 50, 'Open Gacha', (width / 5), 135);
    fill(0);
    text('Current Skins', (width / 5) * 3, 135);

    let horizontalSpacing = 160; // Space between items horizontally
    let verticalSpacing = 110; // Space between items vertically
    let itemsPerRow = floor(width / horizontalSpacing); // Calculate how many items can fit per row

    // Show gacha items
    for (let i = 0; i < obtainedItems.length; i++) {
        let item = obtainedItems[i];

        // Calculate row and column for current item
        let col = i % itemsPerRow;
        let row = floor(i / itemsPerRow);

        // Calculate position considering row, column, and scroll
        let posX = 80 + col * horizontalSpacing;
        let posY = 200 + row * verticalSpacing - scrollY;

        if (posY > 150 && posY < height) { // Only draw if within visible range
            if (i === selectedItemIndex) {
                fill(200); // Grey color for selected item
            } else {
                noFill();
            }

            stroke(5);
            rect(posX - item.size * 3.72,
                posY - item.size * 2,
                item.size * 7.45,
                item.size * 5); // Rectangle surrounding the item

            fill(item.color);
            noStroke();
            ellipse(posX, posY, item.size * 2); // Draw the gacha item as a circle

            textSize(24);
            fill(0);
            text(item.name, posX - textWidth(item.name) / 2, posY + item.size + 30);
        }
    }

    // Limit scrolling
    let totalRows = ceil(obtainedItems.length / itemsPerRow);
    scrollY = constrain(scrollY, 0, max(0, totalRows * verticalSpacing - height + 200));
}


async function rollGacha(count = 1) {
    let totalProbability = gachaItems.reduce((sum, item) => sum + item.probability, 0);
    for (let j = 0; j < count; j++) {
        let random = Math.random() * totalProbability;
        let cumulativeProbability = 0;

        if (ballCount >= 100) {
            for (let i = 0; i < gachaItems.length; i++) {
                let item = gachaItems[i];
                cumulativeProbability += item.probability;
                if (random < cumulativeProbability) {
                    alert(`You got: ${item.name}`);

                    // Check if the obtained item is already in the obtainedItems array
                    let found = obtainedItems.some(obtained => obtained.name === item.name);
                    if (!found) {
                        const newItem = { ...item };

                        obtainedItems.push(newItem); // Add the obtained item to the list if it's not already there
                        saveObtainedItems();
                        sortObtainedItems();
                    }

                    ballCount -= 100;
                    break;
                }
            }
        } else {
            alert(`You do not have enough balls!`);
            break;
        }
    }
}

async function rollGachaMultiple() {
    if (ballCount >= 1000) {
        await rollGacha(10); // Call rollGacha with count 10 for 10x pull
    } else {
        alert('You do not have enough balls for 10x gacha pull!');
    }
}
