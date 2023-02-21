let colorsUsed = [];
let colorCount = 0;
let newPalette = [];

function buildPixelObject(imageData) {
  let targetPixelIndicies, targetPixel, pixelObject, pixelArray;
  pixelArray = [];
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      //iterate through each pixel
      targetPixelIndicies = getColorIndiciesForCoordinates(
        x,
        y,
        imageData.width
      );
      targetPixel = [
        imageData.data[targetPixelIndicies[0]],
        imageData.data[targetPixelIndicies[1]],
        imageData.data[targetPixelIndicies[2]],
      ];

      // build a pixel object so it's easier to manipulate pixel data.
      pixelObject = {
        red: targetPixel[0],
        green: targetPixel[1],
        blue: targetPixel[2],
      };

      pixelArray.push(pixelObject); // push this "pixel" onto an array that will contain all image pixels
    }
  }
  return pixelArray;
}
function getRgbRanges(pixelArray) {
  let minR, maxR, minG, maxG, minB, maxB;
  let rangeR, rangeG, rangeB;
  for (let i = 0; i < pixelArray.length; i++) {
    if (i === 0) {
      minR = maxR = pixelArray[i].red; //set min and max RGB values to corresponding RGB of the first pixel
      minG = maxG = pixelArray[i].green;
      minB = maxB = pixelArray[i].blue;
    } else {
      if (pixelArray[i].red > maxR) {
        //and if the current pixel red value is greater than the greatest red value we have found so far
        maxR = pixelArray[i].red; //set max red value to the newly found, greatest red value
      }
      if (pixelArray[i].red < minR) {
        //same as previous but for min red value; ignore "equal to" case as value is already accounted for.
        minR = pixelArray[i].red;
      }
      if (pixelArray[i].green > maxG) {
        maxG = pixelArray[i].green;
      }
      if (pixelArray[i].green < minG) {
        minG = pixelArray[i].green;
      }
      if (pixelArray[i].green > maxB) {
        maxB = pixelArray[i].green;
      }
      if (pixelArray[i].green < minB) {
        minB = pixelArray[i].green;
      }
    }
  }
  rangeR = maxR - minR;
  rangeG = maxG - minG;
  rangeB = maxB - minB;

  return [rangeR, rangeG, rangeB];
}

function sortByGreatestRange(rangeR, rangeG, rangeB, pixelArray) {
  if (rangeR === Math.max(rangeR, rangeG, rangeB)) {
    pixelArray.sort(compareR);
  } else if (rangeG === Math.max(rangeR, rangeG, rangeB)) {
    pixelArray.sort(compareG);
  } else if (rangeB === Math.max(rangeR, rangeG, rangeB)) {
    pixelArray.sort(compareB);
  }
  return pixelArray;
}

/**
    returns a quantized palette object
    reduces number of colors used to managable number... < targets maxDesiredColors
  */

//some bug with MaxDesiredColors where fewer than the specific colors are being selected... need to enter
//a HUGE allotment in order to get higher quanity of colors...

export function medianCutQuantization(imageData, maxDesiredColors, palette) {
  let rangeR, rangeG, rangeB, targetPixelIndicies, targetPixel;
  let minR, maxR, minG, maxG, minB, maxB, newpalette, pixelArray, pixelObject;
  pixelArray = []; //array of each image pixel.

  //   newpalette = []; //array containing each color in the palette identfied by MCQ

  pixelArray = buildPixelObject(imageData);

  // 1) determine which values have the greatest range (R G or B)

  [rangeR, rangeG, rangeB] = getRgbRanges(pixelArray);

  // 2) sort all pixels based on color with greatest range

  pixelArray = sortByGreatestRange(rangeR, rangeG, rangeB, pixelArray);

  // 3) divide sorted list in two at the median, this forms 2 buckets
  // 4) repeat divisions as desired, each bucket will become a color
  // 5) average remaing values in each bucket to get the 'color' of that bucket

  //why are we getting 80 buckets when 64 is entered as the target number of colors?

  //currently using target "bucket size" to determine when stop recusive bucket builder function, is there a better way?
  let bucketSize = (pixelArray.length / maxDesiredColors).toFixed();
  console.log(bucketSize);
  bucketBuilder(pixelArray, bucketSize, palette);



  return newPalette;
}

function bucketBuilder(bucket, maxBucketSize, palette) {
  let b1RangeR, b1RangeG, b1RangeB, b2RangeR, b2RangeG, b2RangeB;
  let newBucket1 = bucket.slice(0, bucket.length / 2);
  let newBucket2 = bucket.slice(bucket.length / 2);

    // console.log("bucket builder palette")
    // console.log(palette)
  if (newBucket1.length <= maxBucketSize) {
    [b1RangeR, b1RangeG, b1RangeB] = getRgbRanges(newBucket1);
    newBucket1 = sortByGreatestRange(b1RangeR, b1RangeG, b1RangeB, newBucket1);
    bucketColorAverager(newBucket1, palette);
  } else {
    bucketBuilder(newBucket1, maxBucketSize, palette);
  }

  if (newBucket2.length <= maxBucketSize) {
    [b2RangeR, b2RangeG, b2RangeB] = getRgbRanges(newBucket2);
    newBucket2 = sortByGreatestRange(b2RangeR, b2RangeG, b2RangeB, newBucket2);
    bucketColorAverager(newBucket2, palette);
  } else {
    bucketBuilder(newBucket2, maxBucketSize, palette);
  }
}

/*
Takes a bucket of pixels, averages their values, and then finds the closest palette color.
*/
function bucketColorAverager(bucket, palette) {
  let bucketRavg = 0;
  let bucketGavg = 0;
  let bucketBavg = 0;
  for (let i = 0; i < bucket.length; i++) {
    bucketRavg += bucket[i].red;
    bucketGavg += bucket[i].green;
    bucketBavg += bucket[i].blue;
  }
  let newpaletteColor = {
    Red: (bucketRavg / bucket.length).toFixed(),
    Green: (bucketGavg / bucket.length).toFixed(),
    Blue: (bucketBavg / bucket.length).toFixed(),
  };
  let availableColor = findClosestColor(
    [newpaletteColor.Red, newpaletteColor.Green, newpaletteColor.Blue],
    palette
  );
  newPalette.push({
    Red: availableColor[0],
    Green: availableColor[1],
    Blue: availableColor[2],
  });
}

/**
    Gets the index position of a image pixel's red, green, blue, and alpha components

    @param {number} x the x position of the image pixel (far left posiion is 0)
    @param {number} y the y position of the image pixel (top position is 0)
    @param {width} width the width, in pixels, of the image
    @return {array} array with red, green, blue, and alpha indicies
  */
function getColorIndiciesForCoordinates(x, y, width) {
  let red = y * (width * 4) + x * 4;

  return [red, red + 1, red + 2, red + 3];
}

function compareR(a, b) {
  const rValueA = a.red;
  const rValueB = b.red;
  let comparison = 0;

  if (rValueA > rValueB) {
    comparison = 1;
  } else if (rValueA < rValueB) {
    comparison = -1;
  }
  return comparison;
}

function compareG(a, b) {
  const rValueA = a.green;
  const rValueB = b.green;
  let comparison = 0;

  if (rValueA > rValueB) {
    comparison = 1;
  } else if (rValueA < rValueB) {
    comparison = -1;
  }
  return comparison;
}

function compareB(a, b) {
  const rValueA = a.blue;
  const rValueB = b.blue;
  let comparison = 0;

  if (rValueA > rValueB) {
    comparison = 1;
  } else if (rValueA < rValueB) {
    comparison = -1;
  }
  return comparison;
}

function findClosestColor(targetColor, palette) {
  let closestColor = [undefined, undefined, undefined];
  let bestDistance, distance, colorName;

  for (let i = 0; i < palette.length; i++) {
    let paletteColor = [palette[i].Red, palette[i].Green, palette[i].Blue];
    if (i === 0) {
      bestDistance = distanceFromPaletteColor(targetColor, paletteColor);
      closestColor = paletteColor;
      colorName = palette[i]["Floss Name"];
    } else {
      distance = distanceFromPaletteColor(targetColor, paletteColor);
      if (distance < bestDistance) {
        bestDistance = distance;
        closestColor = paletteColor;
        colorName = palette[i]["Floss Name"];
      }
    }
  }
  // console.log(colorsUsed)
  if (!colorsUsed.includes(colorName)) {
    colorsUsed.push(colorName);
    colorCount += 1;
  }

  //   //show duplicates:
  //   colorsUsed.push(colorName);
  //   colorCount += 1;

  // console.log(colorName)
  // console.log(bestDistance)
  return closestColor;
}

function distanceFromPaletteColor(targetColor, testColor) {
  // sRGB Euclidean Distance...

  return Math.sqrt(
    Math.pow(testColor[0] - targetColor[0], 2) +
      Math.pow(testColor[1] - targetColor[1], 2) +
      Math.pow(testColor[2] - targetColor[2], 2)
  );
}
