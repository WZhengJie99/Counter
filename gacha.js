/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/

let shopOpened = false;
let gachaShop = false;
//selectedItemIndex set to 0 to select the original red ball by default.
let selectedItemIndex = 0;
let gachaInterval;
let obtainedItems = [];

async function loadObtainedItems() {
    const data = await window.api.loadObtainedItems();
    if (data) {
        obtainedItems = data.obtainedItems || [];
        selectedItemIndex = data.selectedItemIndex || 0;
    } else {
        obtainedItems = [];
        selectedItemIndex = 0;
    }

    if (obtainedItems.length === 0) {
        // Initialize with the default red ball if no items are loaded
        obtainedItems.push({
            name: 'Red Ball',
            color: [255, 0, 0],
            size: 20,
            probability: 0.0,
            ballAddRate: 1000 // Default ballAddRate for the red ball
        });
    }

    applyItemEffect(obtainedItems[selectedItemIndex]); // Apply the effect of the selected item
    currentSkins(); // Render the current skins
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
    fill(255);
    text('Current Skins', (width / 5) * 3, 135);


    // Draw the gacha roll button
    fill(200, 0, 0);
    rect(20, 55 + (height / 10) * 2, 200, (height / 10) * 6 + 40); // Draw the rectangle
    fill(255);
    textSize(24);
    text('Roll Gacha', 60, 55 + (height / 10) * 8); // Display the text
}

function currentSkins() {
    gachaShop = false;
    fill(255);
    text('Open Gacha', (width / 5), 135);
    fill(0);
    text('Current Skins', (width / 5) * 3, 135);

    let horizontalSpacing = 160; // Space between items horizontally
    let verticalSpacing = 110; // Space between items vertically
    let itemsPerRow = floor((width) / horizontalSpacing); // Calculate how many items can fit per row

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
                item.size * 5,); // Rectangle surrounding the item

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


async function rollGacha() {
    let totalProbability = gachaItems.reduce((sum, item) => sum + item.probability, 0);
    let random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (let i = 0; i < gachaItems.length; i++) {
        let item = gachaItems[i];
        cumulativeProbability += item.probability;
        if (random < cumulativeProbability) {
            alert(`You got: ${item.name}`);

            // Check if the obtained item is already in the obtainedItems array
            let found = obtainedItems.some(obtained => obtained.name === item.name);
            if (!found) {
                // Create a new object without the 'effect' function
                const newItem = { ...item };
                delete newItem.effect;

                obtainedItems.push(newItem); // Add the obtained item to the list if it's not already there
                saveObtainedItems(); // Save the obtained items
            }
            break;
        }
    }
}