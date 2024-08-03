const svg = d3.select("#chart")
  .append("svg")
  .attr("width", "100%")
  .attr("height", 500);

let squareData = {};
let currentSquare = null;

// DOM Elements
const modal = document.getElementById("myModal");
const modalText = document.getElementById("modal-text");
const btnSaveLabel = document.getElementById("save-label");
const btnViewScale = document.getElementById("view-scale");
const btnViewScope = document.getElementById("view-scope");
const btnInclude = document.getElementById("include");
const btnCancel = document.getElementById("cancel");
const labelInput = document.getElementById("label-input");
const form = document.getElementById("squareForm");

// Event Listeners
window.addEventListener("load", function () {
  loadData();
  initializeVisualization(squareData);
  bindEventListeners();
});

function bindEventListeners() {
  btnViewScope.addEventListener("click", handleViewScopeClick);
  btnViewScale.addEventListener("click", handleViewScaleClick);
  btnInclude.addEventListener("click", handleIncludeClick);
  form.addEventListener("submit", handleFormSubmit);
  btnCancel.addEventListener("click", () => closeModal());
  adjustFruitOpacityOnLeafHover();
}

// Data Management
function loadData() {
  fetch('/squares')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      squareData = data;
      saveData();
      initializeVisualization(squareData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function saveData() {
  if (squareData) {
    localStorage.setItem("squareData", JSON.stringify(squareData));
  } else {
    console.error("No data to save");
  }
}

// Visualization Functions
function initializeVisualization(data) {
  svg.selectAll("*").remove();
  drawSquare(svg, data, 300, 50, 100, getColor(data.class), data.depth);
}

function drawSquare(svg, square, x, y, size, color, depth) {
  svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", size)
    .attr("height", size)
    .attr("fill", color)
    .attr("opacity", square.included ? 1 : 0.3)
    .attr("rx", 4)
    .attr("ry", 4)
    .on("click", () => showSquareModal(square));

  svg.append('text')
    .attr('x', x + size / 2)
    .attr('y', y + size / 2)
    .attr('font-family', 'Arial, sans-serif')
    .attr('font-size', '12px')
    .attr('fill', '#333')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(square.title);

  if (square.children) {
    const childSize = size / 2;
    const childSpacing = size / 3;
    let childX = x + size / 2 - (square.children.length * (childSize + childSpacing)) / 2;
    let childY = y + size + childSpacing;

    for (const child of square.children) {
      drawSquare(svg, child, childX, childY, childSize, getColor(child.class), depth + 1);
      childX += childSize + childSpacing;
    }
  }
}

function getColor(className) {
  const colors = {
    root: "lightblue",
    branch: "lightgray",
    leaf: "lightgreen",
    fruit: "lightcoral"
  };
  return colors[className] || "lightgrey";
}

// Modal Functions
function showSquareModal(square) {
  currentSquare = square;
  modal.style.display = "block";
  modalText.innerText = `Edit Square: ${square.title}`;
  labelInput.value = square.title;

  btnSaveLabel.onclick = () => handleSaveLabel(square);
}

function handleSaveLabel(square) {
  const updatedTitle = labelInput.value;
  const updatedSquareData = { ...square, title: updatedTitle };

  fetch(`/save-square`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedSquareData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    square.title = updatedTitle;
    closeModal();
    initializeVisualization(squareData);
  })
  .catch(error => {
    console.error('Error saving data:', error);
  });
}

function closeModal() {
  modal.style.display = "none";
}

// Form Handling
function handleFormSubmit(event) {
  event.preventDefault();
  const newSquareData = {
    name: form.name.value,
    size: form.size.value,
    color: form.color.value,
    type: form.type.value,
    parent_id: form.parent_id.value,
    class: currentSquare ? currentSquare.class : "",
  };
  saveSquareData(newSquareData);
  closeModal();
}

function saveSquareData(squareData) {
  fetch('/save-square', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(squareData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    initializeVisualization(squareData);
  })
  .catch(error => {
    console.error('Error saving data:', error);
  });
}

// Utility Functions
function adjustFruitOpacityOnLeafHover() {
  const leafSquares = document.querySelectorAll('.leaf');
  const fruitSquares = document.querySelectorAll('.fruit');

  leafSquares.forEach(leaf => {
    leaf.addEventListener('mouseover', () => {
      fruitSquares.forEach(fruit => {
        fruit.style.opacity = '1';
      });
    });

    leaf.addEventListener('mouseout', () => {
      fruitSquares.forEach(fruit => {
        fruit.style.opacity = '0.3';
      });
    });
  });
}

function filterSquares(data, className) {
  const filterRecursive = (data) => {
    if (data.class === className) return data;
    if (data.children) {
      data.children = data.children.map(filterRecursive).filter(Boolean);
      return data.children.length ? data : null;
    }
    return null;
  };
  return filterRecursive(data);
}

// Event Handlers
function handleViewScaleClick() {
  const zoomScale = 2;
  const translateX = svg.attr("width") / 2;
  const translateY = svg.attr("height") / 2;

  svg.transition().duration(300).attr("transform", `translate(${translateX}, ${translateY}) scale(${zoomScale})`);
}

function handleIncludeClick() {
  currentSquare.included = !currentSquare.included;
  initializeVisualization(squareData);
}

function handleViewScopeClick() {
  const selectedClass = prompt("Enter class to filter (e.g., leaf, fruit):");
  const filteredData = filterSquares(squareData, selectedClass);
  initializeVisualization(filteredData);
}
