// ===== 1. Find the elements on the page =====
const systemCostInput = document.getElementById("systemCost");
const installCostInput = document.getElementById("installCost");
const runningCostInput = document.getElementById("runningCost");
const monthlySavingInput = document.getElementById("monthlySaving");
const monthsSelect = document.getElementById("months");
const calculateBtn = document.getElementById("calculateBtn");
const errorMessage = document.getElementById("errorMessage");
const totalCostDisplay = document.getElementById("totalCost");
const totalBenefitDisplay = document.getElementById("totalBenefit");
const netGainDisplay = document.getElementById("netGain");
const roiDisplay = document.getElementById("roiResult");
const paybackDisplay = document.getElementById("paybackResult");
const verdictText = document.getElementById("verdictText");

// ===== 2. Helper functions =====

// Turns 1480000 into "₦1,480,000" (and -5000 into "-₦5,000")
function formatNaira(amount) {
  const sign = amount < 0 ? "-" : "";
  return sign + "₦" + Math.abs(Math.round(amount)).toLocaleString("en-NG");
}

// Empties all the result lines
function clearResults() {
  totalCostDisplay.textContent = "";
  totalBenefitDisplay.textContent = "";
  netGainDisplay.textContent = "";
  roiDisplay.textContent = "";
  paybackDisplay.textContent = "";
  verdictText.textContent = "";
  verdictText.className = "";
}

// ===== 3. When the button is tapped =====
calculateBtn.addEventListener("click", function () {
  // Read the five values as numbers
  const systemCost = Number(systemCostInput.value);
  const installCost = Number(installCostInput.value);
  const runningCost = Number(runningCostInput.value);
  const monthlySaving = Number(monthlySavingInput.value);
  const months = Number(monthsSelect.value);

  // Check the input before calculating
  if (
    systemCostInput.value === "" ||
    installCostInput.value === "" ||
    runningCostInput.value === "" ||
    monthlySavingInput.value === ""
  ) {
    errorMessage.textContent = "Please fill in all four money boxes.";
    clearResults();
    return;
  }

  if (systemCost <= 0) {
    errorMessage.textContent = "The cost of the solar system must be more than zero.";
    clearResults();
    return;
  }

  if (installCost < 0 || runningCost < 0 || monthlySaving < 0) {
    errorMessage.textContent = "Amounts cannot be negative.";
    clearResults();
    return;
  }

  errorMessage.textContent = "";

  // The formulas
  const totalCost = systemCost + installCost + runningCost * months;
  const totalBenefit = monthlySaving * months;
  const netGain = totalBenefit - totalCost;
  const roi = (netGain / totalCost) * 100;

  // Show the first four results
  totalCostDisplay.textContent = formatNaira(totalCost);
  totalBenefitDisplay.textContent = formatNaira(totalBenefit);
  netGainDisplay.textContent = formatNaira(netGain);
  roiDisplay.textContent = roi.toFixed(1) + "%";

  // Payback and verdict
  const monthlyNet = monthlySaving - runningCost;

  if (monthlyNet <= 0) {
    paybackDisplay.textContent = "Never";
    verdictText.textContent =
      "Not a good idea. You save less each month than it costs to run, so you will never get your money back.";
    verdictText.className = "slow";
    return;
  }

  const payback = (systemCost + installCost) / monthlyNet;
  paybackDisplay.textContent = payback.toFixed(1) + " months";

  if (payback < 12) {
    verdictText.textContent = "Good deal! Solar should pay for itself in under a year.";
    verdictText.className = "good";
  } else if (payback <= 24) {
    verdictText.textContent = "Okay. It pays for itself in 1 to 2 years, so think it over.";
    verdictText.className = "okay";
  } else {
    verdictText.textContent = "Slow. It takes more than 2 years to pay back, so be careful.";
    verdictText.className = "slow";
  }
});
