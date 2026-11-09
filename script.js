// ----- Page elements -----
const industrySelect = document.getElementById("industry");
const developersInput = document.getElementById("developers");
const slider = document.getElementById("timeShare");
const sliderValue = document.getElementById("timeShareValue");
const button = document.getElementById("calculate");
const message = document.getElementById("message");
const totalDisplay = document.getElementById("total");
const donut = document.getElementById("donut");
const creationValue = document.getElementById("val-creation");
const testingValue = document.getElementById("val-testing");
const complexityValue = document.getElementById("val-complexity");
const riskValue = document.getElementById("val-risk");

// ----- Assumptions (change these any time) -----
const salaryByIndustry = {
  business: 70000,
  finance: 90000,
  health: 80000,
  retail: 65000
};

const savingsRates = {
  creation: 0.20,
  testing: 0.10,
  complexity: 0.15,
  risk: 0.10
};

// ----- Helper: turn 154000 into "$154,000" -----
function formatMoney(amount) {
  return "$" + Math.round(amount).toLocaleString();
}

// ----- Slider shows its value live -----
slider.addEventListener("input", function () {
  sliderValue.textContent = slider.value + "%";
});

// ----- The calculation -----
function calculate() {
  const developers = Number(developersInput.value);
  const timeShare = Number(slider.value) / 100;
  const salary = salaryByIndustry[industrySelect.value];

  const integrationCost = developers * salary * timeShare;

  const creation = integrationCost * savingsRates.creation;
  const testing = integrationCost * savingsRates.testing;
  const complexity = integrationCost * savingsRates.complexity;
  const risk = integrationCost * savingsRates.risk;

  return {
    creation: creation,
    testing: testing,
    complexity: complexity,
    risk: risk,
    total: creation + testing + complexity + risk
  };
}

// ----- Put the results on the page -----
function showResults(results) {
  totalDisplay.textContent = formatMoney(results.total);
  creationValue.textContent = formatMoney(results.creation);
  testingValue.textContent = formatMoney(results.testing);
  complexityValue.textContent = formatMoney(results.complexity);
  riskValue.textContent = formatMoney(results.risk);

  // If there is nothing to show, draw a plain ring
  if (results.total === 0) {
    donut.style.background = "var(--track)";
    return;
  }

  // Where each colored slice ends, as a percentage
  const creationEnd = (results.creation / results.total) * 100;
  const testingEnd = creationEnd + (results.testing / results.total) * 100;
  const complexityEnd = testingEnd + (results.complexity / results.total) * 100;

  donut.style.background =
    "conic-gradient(" +
    "var(--c1) 0% " + creationEnd + "%, " +
    "var(--c2) " + creationEnd + "% " + testingEnd + "%, " +
    "var(--c3) " + testingEnd + "% " + complexityEnd + "%, " +
    "var(--c4) " + complexityEnd + "% 100%)";
}

// ----- Button click -----
button.addEventListener("click", function () {
  const developers = Number(developersInput.value);

  if (!developers || developers < 1) {
    message.textContent = "Please enter at least 1 developer.";
    return;
  }

  message.textContent = "";
  showResults(calculate());
});

// ----- Show results for the starting values when the page opens -----
showResults(calculate());
