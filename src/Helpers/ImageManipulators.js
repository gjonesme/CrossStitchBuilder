let colorsUsed = [];
let colorCount = 0;

/**
    Apply dither to image
    for each y from top to bottom do
      for each x from left to right do
          oldpixel := pixel[x][y]
          newpixel := find_closest_palette_color(oldpixel)
          pixel[x][y] := newpixel
          quant_error := oldpixel - newpixel
          pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error × 7 / 16
          pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error × 3 / 16
          pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error × 5 / 16
          pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error × 1 / 16
  */
export function floydSteinbergDither(imageData, palette) {
  let oldPixelIndicies,
    oldPixel,
    newPixel,
    rightPixelIndicies,
    downLeftPixelIndicies,
    downPixelIndicies,
    downRightPixelIndicies,
    redError,
    greenError,
    blueError,
    width,
    height;

  width = imageData.width;
  height = imageData.data.length / 4 / width;

  // use nested for loop for x and y positions...
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // console.log('x: ', x, ' y: ', y)
      oldPixelIndicies = getColorIndiciesForCoordinates(x, y, width);
      // console.log('oldPixelIndicies: ', oldPixelIndicies)
      oldPixel = [
        imageData.data[oldPixelIndicies[0]],
        imageData.data[oldPixelIndicies[1]],
        imageData.data[oldPixelIndicies[2]],
      ];
      // console.log('oldPixel: ', oldPixel)
      newPixel = findClosestColor(oldPixel, palette);
      // console.log('newPixel: ', newPixel)
      redError = rgbDistance(oldPixel, newPixel, "red");
      // console.log('redError: ', redError)
      greenError = rgbDistance(oldPixel, newPixel, "green");
      // console.log('greenError: ', greenError)
      blueError = rgbDistance(oldPixel, newPixel, "blue");
      // console.log('blueError: ', blueError)

      // update current pixel to valid pallette color
      imageData.data[oldPixelIndicies[0]] = newPixel[0];
      imageData.data[oldPixelIndicies[1]] = newPixel[1];
      imageData.data[oldPixelIndicies[2]] = newPixel[2];
      // apply error to appropriate neighbors
      if (x === 0 || (x + 1) % width !== 0) {
        //if there is another pixel to the right
        //add error to right pixel
        rightPixelIndicies = getColorIndiciesForCoordinates(x + 1, y, width);
        // console.log('right pixel ', x+1, ' , ', y, ' red changed by ', redError*7/16)
        // console.log('     changed from ', imageData.data[rightPixelIndicies[0]], ' to ', imageData.data[rightPixelIndicies[0]] + (redError*7/16))
        imageData.data[rightPixelIndicies[0]] += (redError * 7) / 16;
        imageData.data[rightPixelIndicies[1]] += (greenError * 7) / 16;
        imageData.data[rightPixelIndicies[2]] += (blueError * 7) / 16;
      }
      if (y !== height - 1) {
        //if there is another row
        if (x % width !== 0) {
          //if pixel is not on the far left of the image
          downLeftPixelIndicies = getColorIndiciesForCoordinates(
            x - 1,
            y + 1,
            width
          );
          imageData.data[downLeftPixelIndicies[0]] += (redError * 3) / 16;
          imageData.data[downLeftPixelIndicies[1]] += (greenError * 3) / 16;
          imageData.data[downLeftPixelIndicies[2]] += (blueError * 3) / 16;
        }
        downPixelIndicies = getColorIndiciesForCoordinates(x, y + 1, width);
        imageData.data[downPixelIndicies[0]] += (redError * 5) / 16;
        imageData.data[downPixelIndicies[1]] += (greenError * 5) / 16;
        imageData.data[downPixelIndicies[2]] += (blueError * 5) / 16;
        if (x !== 0 && (x + 1) % width !== 0) {
          downRightPixelIndicies = getColorIndiciesForCoordinates(
            x + 1,
            y + 1,
            width
          );
          imageData.data[downRightPixelIndicies[0]] += (redError * 1) / 16;
          imageData.data[downRightPixelIndicies[1]] += (greenError * 1) / 16;
          imageData.data[downRightPixelIndicies[2]] += (blueError * 1) / 16;
        }
      }
    }
  }

  return imageData;
}

/**
    gets the distance between two Colors
    @param {array} targetColor array with RGB values of a target color
    @param {array} testColor array with RGB values of a test color

    @return {number} distance between two input colors
  */
function distanceFromPaletteColor(targetColor, testColor) {
  // sRGB Euclidean Distance...
  return Math.sqrt(
    Math.pow(testColor[0] - targetColor[0], 2) +
      Math.pow(testColor[1] - targetColor[1], 2) +
      Math.pow(testColor[2] - targetColor[2], 2)
  );
}

/**

  */
function rgbDistance(oldColor, newColor, RGB) {
  if ("red" === RGB) {
    return oldColor[0] - newColor[0];
  }
  if ("green" === RGB) {
    return oldColor[1] - newColor[1];
  }
  return oldColor[2] - newColor[2];
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
  return closestColor;
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

export function buildStitchSquares(imageData, numStitchesWide) {
  let imageHeight = imageData.height;
  let imageWidth = imageData.width;

  let stitchEdgeLength = Math.floor(imageWidth / numStitchesWide);

  // console.log(stitchEdgeLength);
  // console.log(imageHeight / stitchEdgeLength);

  let totalStitches =
    Math.floor(imageWidth / stitchEdgeLength) *
    Math.floor(imageHeight / stitchEdgeLength);

  console.log("total stitches: " + totalStitches);

  //iterate over entire image
  for (let i = 0; i < imageWidth; i += stitchEdgeLength) {
    for (let j = 0; j < imageHeight; j += stitchEdgeLength) {
      //read over stitch square to calculate average value
      let avgRed = 0;
      let avgGreen = 0;
      let avgBlue = 0;
      let avgAlpha = 0;
      for (let rowIndex = i; rowIndex < i + stitchEdgeLength; rowIndex++) {
        for (let colIndex = j; colIndex < j + stitchEdgeLength; colIndex++) {
          let colorIndicies = getColorIndiciesForCoordinates(
            rowIndex,
            colIndex,
            imageWidth
          );
          // if (undefined === avgRed) {
          //   avgRed = imageData.data[colorIndicies[0]];
          //   avgGreen = imageData.data[colorIndicies[1]];
          //   avgBlue = imageData.data[colorIndicies[2]];
          //   avgAlpha = imageData.data[colorIndicies[3]];
          // } else {
          avgRed += imageData.data[colorIndicies[0]];
          avgGreen += imageData.data[colorIndicies[1]];
          avgBlue += imageData.data[colorIndicies[2]];
          avgAlpha += imageData.data[colorIndicies[3]];
          // }
        }
      }
      //after colors are added witthin averaging square, divide by # values
      avgRed /= stitchEdgeLength * stitchEdgeLength;
      avgGreen /= stitchEdgeLength * stitchEdgeLength;
      avgBlue /= stitchEdgeLength * stitchEdgeLength;
      avgAlpha /= stitchEdgeLength * stitchEdgeLength;
      //write over stitch square with average value
      for (let rowIndex = i; rowIndex < i + stitchEdgeLength; rowIndex++) {
        for (let colIndex = j; colIndex < j + stitchEdgeLength; colIndex++) {
          let colorIndicies = getColorIndiciesForCoordinates(
            rowIndex,
            colIndex,
            imageWidth
          );
          imageData.data[colorIndicies[0]] = avgRed;
          imageData.data[colorIndicies[1]] = avgGreen;
          imageData.data[colorIndicies[2]] = avgBlue;
          imageData.data[colorIndicies[3]] = avgAlpha;
        }
      }
    }
  }

  return imageData;
}

export function alignImageToPalette(imageData, palette) {
  let red, green, blue, alpha, closestRed, closestGreen, closestBlue;
  for (let i = 0; i < imageData.width; i++) {
    for (let j = 0; j < imageData.height; j++) {
      [red, green, blue, alpha] = getColorIndiciesForCoordinates(
        i,
        j,
        imageData.width
      );
      [closestRed, closestGreen, closestBlue] = findClosestColor(
        [imageData.data[red], imageData.data[green], imageData.data[blue]],
        palette
      );
      
      // overwrite imageData:
      imageData.data[red] = closestRed;
      imageData.data[green] = closestGreen;
      imageData.data[blue] = closestBlue;
    }
  }
  // console.log(colorsUsed)
  return imageData;
}
