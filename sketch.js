let table;
let font;
let test, totalRows, title, author, year;
let line1, line2;
let stem;
let yearIndex = 0;
let linearPos = 0;
let angle = 0;

let yearsNew;
let yearsMonthCount;
let columnPairsNew = [];
let uniquePairs;
let columnPairsNewUnique = [];
let currentRow;
let marginGlobal = 50;

let canvasWidth;
let canvasHeight;
let topicColors = {
  physics: "#91FF85",
  mathematics: "#FFB887",
  chemistry: "#87FAFF",
  biology: "#B9BFFF",
  social: "#FF88D5",
  clinical: "#D287FF",
  career: "#FFB9B8",
  environment: "#FFFF83",
  technology: "#C6C6C6",
};

let hoverMonth = "";
let hoverYear = "";

function preload() {
  table = loadTable("DGP_JYI.tsv", "tsv", "header");
  font = loadFont("SouthernBeach.otf");
}

function setup() {
  canvasWidth = windowWidth * 1.5;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, windowHeight);
  angleMode(DEGREES);

  // *Get unique year values from table
  yearsNew = [...new Set(table.getColumn("Year"))];

  const yearMonthCounts = {};
  for (let i = 0; i < table.getRowCount(); i++) {
    const month = table.getRow(i).getString("Month");
    const year = table.getRow(i).getString("Year");

    if (!yearMonthCounts[year]) {
      yearMonthCounts[year] = new Set([month]);
    } else {
      yearMonthCounts[year].add(month);
    }
  }
  yearsMonthCount = Object.entries(yearMonthCounts).map(([year, monthsSet]) => [
    year,
    monthsSet.size,
  ]);

  //this will be used for looping to loop the many "years" I have
  totalRows = table.getRowCount();

  // *Generate column pairs from table, assumes TSV/CSV sorted chronologically
  for (let i = 0; i < table.getRowCount(); i++) {
    columnPairsNew.push([
      table.getRow(i).get("Month"),
      table.getRow(i).get("Year"),
      table.getRow(i).get("Topics"),
      table.getRow(i).get("Title"),
      table.getRow(i).get("Authors"),
    ]);
  }

  columnPairsNewUnique = storeUniqueData(columnPairsNew);
  //console.log("columnPairs-Grouped: ",columnPairsNewUnique);
  console.log(columnPairsNewUnique);

  let availableWidth = width - 2 * marginGlobal; // Calculate available width for displaying years
  let yearSpacing = availableWidth / (yearsNew.length - 1); // Calculate the spacing between years

  //frameRate(2);
}

function draw() {
  clear();
  background("#FEFAE0");
  sketchTitle();
  baseline();
  drawNodes(yearsMonthCount, columnPairsNewUnique);
  // console.log(mouseX,mouseY);
  legendTopics();
  legendAims();
}

function sketchTitle() {
  var sketchTitle = "26 Years of JYI’s News, Features, and Careers Articles";
  textSize(32);
  textAlign(CENTER);
  textFont("helvetica");
  fill("#5C4B99");
  text(sketchTitle, canvasWidth / 2, 50);
  var mutantFlower = "as Colorful Mutant Flowers";
  textSize(32);
  textAlign(CENTER);
  textFont("helvetica");
  fill("#5C4B99");
  text(mutantFlower, canvasWidth / 2, 100);
}

function legendTopics() {
  let topicColorsArray = [];

  // Populate the topicColorsArray from the topicColors object
  for (let topic in topicColors) {
    if (topicColors.hasOwnProperty(topic)) {
      let colorValue = topicColors[topic];
      topicColorsArray.push({ topic: topic, color: colorValue });
    }
  }

  push();
  let ellipseLegendYPos = windowHeight - 650;

  for (let k = 0; k < 9; k++) {
    //translate(0, 10);

    // Get the current topic and color from the topicColorsArray
    let currentTopic = topicColorsArray[k].topic;
    let currentColor = topicColorsArray[k].color;

    // Fill the ellipse with the corresponding color
    fill(currentColor);
    stroke(2);
    ellipseMode(CENTER);
    ellipse(windowWidth + 500, ellipseLegendYPos, 30, 4);

    // Display the topic name
    textAlign(CENTER);
    textFont("helvetica");
    fill("#5C4B99");
    textSize(12);
    text(currentTopic, windowWidth + 570, ellipseLegendYPos);

    ellipseLegendYPos += 20; // Adjust the vertical position for each ellipse and text
  }

  pop();
}

function legendAims() {
  let yAims = windowHeight - 650;
  let aims =
    "The general theme of this sketch is gratitude. I want to extend my gratitude towards the Journal of Young Investigators and the writers in the News and Careers Department. This is expressed through highlighting JYI writers' contributions. Each petal represents a publication, which viewers can see when their cursor hovers over a specific petal. By creating this, I hope to encourage viewers of this sketch to walk down the memory lane by digging into JYI archives on JYI's website and read their stories.";
  textAlign(LEFT);
  text(aims, windowWidth - 1410, yAims, windowWidth - 990, yAims + 500);
}

function baseline() {
  push();
  stroke("#A76F6F");
  strokeWeight(5);
  line1 = line(0, windowHeight - 50, canvasWidth, windowHeight - 50);
  noStroke();
  pop();
}

function drawNodes(years, colPairsUnique) {
  let margin = marginGlobal; // Adjust this value to define the margin from both ends
  let availableWidth = width - 2 * margin; // Calculate available width for displaying years
  let yearSpacing = availableWidth / (years.length - 1); // Calculate the spacing between years
  let yScale = 18;

  // go through each year
  for (let i = 0; i < years.length; i++) {
    noStroke();
    fill("#5C4B99");
    textSize(20);

    // Calculate the x-position based on the year index and spacing and draws the Year labels on axis
    let stemXPosStart = margin + i * yearSpacing;
    text(years[i][0], stemXPosStart, windowHeight - 20);

    // Count the unique months for this year
    let uniqueMonths = new Set();

    for (let j = 0; j < colPairsUnique.length; j++) {
      if (colPairsUnique[j].year == years[i][0]) {
        uniqueMonths.add(colPairsUnique[j].month);
      }
    }

    let stemsInYear = uniqueMonths.size;
    //console.log(stemsInYear);
    let stemYPosStart = windowHeight - 48;

    // Calculate the angle between stems based on the number of stems
    let totalStems = stemsInYear;
    let maxAngle = 5; // Maximum angle to deviate from the vertical line
    let angleIncrement = (maxAngle * 2) / (totalStems - 1);

    // Flag to alternate between left and right angles
    let angleDirection = 1;

    // Draw stems (month) - goes through each entry and search for matching year
    for (let j = 0; j < colPairsUnique.length; j++) {
      if (colPairsUnique[j].year == years[i][0]) {
        let angleOffset = angleDirection * maxAngle;
        let stemYPosEnd =
          stemYPosStart - colPairsUnique[j].publications.length * yScale;

        // Calculate stemXPosEnd based on angleOffset
        let stemXPosEnd = stemXPosStart + angleOffset * 5; // Adjust the '5' for the distance between stems

        stroke("green");
        strokeWeight(1);
        line(stemXPosStart, stemYPosStart, stemXPosEnd, stemYPosEnd);
        drawFlower(stemXPosEnd, stemYPosEnd, colPairsUnique[j]);
        noStroke();
        textSize(16);

        // text((colPairsUnique[j].publications.length)+' articles', stemXPosEnd, stemYPosEnd);
        // text((colPairsUnique[j].month), stemXPosEnd, stemYPosEnd-12);

        // Toggle angle direction for the next stem
        angleDirection *= -1;
        maxAngle -= 1.25;
      }
    }
  }
}

function drawFlower(xVar, yVar, flowerObj) {
  push();
  strokeWeight(0.5);
  let diameter = 10;
  let petals = flowerObj.publications.length;
  let degIncrement = 360 / petals;

  // Section for petal drawing
  push();
  degStart = 0;
  for (let i = 0; i < petals; i++) {
    push(); // Push the current transformation matrix
    let topic = flowerObj.publications[i].topic.toLowerCase();
    let petalColor = topicColors[topic];
    translate(xVar, yVar); // Translate the origin to the center of the circle
    rotate(degStart); // Rotate by the desired angle in radians
    fill(petalColor);
    //circle(10, 0, 15); // Draw the petal at (10, 0) relative to the translated origin
    ellipseMode(CENTER);
    ellipse(10, 0, 30, 4);

   // Check if the mouse is hovering over a petal
    let petalX = xVar + cos(degStart) * 30;
    let petalY = yVar + sin(degStart) * 30;

    if (dist(mouseX, mouseY, petalX, petalY) < 5) {
      let publication = flowerObj.publications[i];
      hoverInfo(petalX, petalY, publication);
    }

    pop();
    degStart += degIncrement;
  }
  pop();
  
  // Section for center flower drawing
  push();
  fill("#DF2E38");
  circle(xVar, yVar, diameter);

 // Check if the mouse is hovering over the center flower
  if (dist(mouseX, mouseY, xVar, yVar) < diameter / 2) {
    let hoverMonth = flowerObj.month;
    hoverInfo(xVar, yVar, { month: hoverMonth });
  }

  pop();
}

// hoverInfo from ChatGPT
// Create a custom hoverInfo function to display the title and authors
function hoverInfo(x, y, data) {
  push();
  resetMatrix();
  textSize(16);
  textAlign(CENTER);
  textFont("helvetica");
  fill("#5C4B99");

  if (data.title) {
    // Display information for a petal (publication)
    text(data.title, canvasWidth / 2, height / 2 - 100);
    text("by", canvasWidth / 2, height / 2 - 80);
    text(data.authors, canvasWidth / 2, height / 2 - 60); // Adjust vertical spacing
  } else if (data.month) {
    // Display information for the center flower (month and year)
    text(data.month, canvasWidth / 2, height / 2 - 100);
  }

  pop();
}


// Create a custom function for your hover object here; you can also change the function name and parameters
// function hoverInfo(x, y, hoverData) {
//   push();
//   translate(0, 0);
//   noStroke();
//   fill("#5C4B99");
//   textSize(24);
//   // text(hoverData.topic, 800, 500);
//   // text(hoverData.title, 800, 600);
//   // text(hoverData.authors, 800, 600);
//   //text(hoverData.topic, x, y-20);
//   //text(hoverData.title, x, y-32);
//   //text(hoverData.authors, x, y-40);
//   pop();
// }

function drawYear(years) {}

function drawStemNew(columnPair, iterator, xPos, yPos) {}

// JSON version
function storeUniqueData(pairsArray) {
  const uniquePairsMap = new Map();

  pairsArray.forEach((pair) => {
    const [month, year, ...remainingData] = pair;

    const key = `${month}-${year}`;

    if (!uniquePairsMap.has(key)) {
      uniquePairsMap.set(key, {
        month,
        year,
        publications: [
          {
            topic: remainingData[0],
            title: remainingData[1],
            authors: remainingData[2],
          },
        ],
      });
    } else {
      const existingData = uniquePairsMap.get(key);
      existingData.publications.push({
        topic: remainingData[0],
        title: remainingData[1],
        authors: remainingData[2],
      });
    }
  });

  const resultArray = Array.from(uniquePairsMap.values());

  return resultArray;
}

// // Array-only version ==========================================================================================

// function storeUniqueData(pairsArray) {
//   const uniquePairsMap = new Map();

//   pairsArray.forEach(pair => {
//     const [month, year, ...remainingData] = pair;

//     const key = `${month}-${year}`;

//     if (!uniquePairsMap.has(key)) {
//       uniquePairsMap.set(key, [month, year, [remainingData]]);
//     } else {
//       const existingData = uniquePairsMap.get(key);
//       existingData[2].push(remainingData);
//     }
//   });

//   const resultArray = Array.from(uniquePairsMap.values());

//   return resultArray;
// }

// function drawNodes(years,colPairsUnique) {
//   let margin = marginGlobal; // Adjust this value to define the margin from both ends
//   let availableWidth = width - 2 * margin; // Calculate available width for displaying years
//   let yearSpacing = availableWidth / (years.length - 1); // Calculate the spacing between years

//   // go through each year
//   for (i = 0; i < years.length; i++) {
//     noStroke();
//     fill("#5C4B99");
//     textSize(20);

//     // Calculate the x-position based on the year index and spacing
//     let xPos = margin + i * yearSpacing;
//     text(years[i][0], xPos, windowHeight - 20);

//     let stemsInYear=years[i][1];
//     let stemPosition=xPos-(stemsInYear*5);
//     // console.log("Stems in",years[i][0],stemsInYear);

//     // draw stems (month) -- goes through each entry and search for matching year
//     for(j=0;j<colPairsUnique.length;j++) {
//       // console.log("Current pair: ",colPairsUnique[j]);
//       if (colPairsUnique[j][1]==years[i][0]) {
//         // console.log(years[i],"=",colPairsUnique[j][1])
//         stroke("green");
//         line(xPos, windowHeight-48, stemPosition, windowHeight-48-(colPairsUnique[j][2].length*20));
//         noStroke();
//         textSize(16);
//         text((colPairsUnique[j][2].length)+' articles',stemPosition, windowHeight-48-(colPairsUnique[j][2]).length*20);
//         text((colPairsUnique[j][0]), stemPosition, windowHeight-64-(colPairsUnique[j][2]).length*20);
//       }
//       stemsInYear-=1;
//     }

//     // console.log("MatchMonCount",years[i],":",matchingMonthCount);
//   }
// }
