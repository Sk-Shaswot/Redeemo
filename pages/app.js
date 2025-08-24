// Constants
const COOLDOWN_HOURS = 24; // cooldown period for quests
const COOLDOWN_MILLISECONDS = COOLDOWN_HOURS * 3600 * 1000;

// Quest reward points by ID
const questCoins = {
  1: 200, 2: 250, 3: 250, 4: 150, 5: 69, 6: 400,
  7: 50, 8: 100, 9: 150, 10: 350, 11: 180, 12: 120,
  13: 200, 14: 80, 15: 150
};

// Initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("coins")) localStorage.setItem("coins", "0");
  if (!localStorage.getItem("claimed")) localStorage.setItem("claimed", "{}");
  if (!localStorage.getItem("redeemed")) localStorage.setItem("redeemed", "[]");

  updateAllQuestButtons();
  updateRedeemedRewards();
  updateCoinBalance();
  updateNavCoinBalance();
});

// Claim a quest with cooldown check
function claimQuest(id) {
  const now = Date.now();
  let claimed = JSON.parse(localStorage.getItem("claimed") || "{}");

  if (claimed[id] && (now - claimed[id]) < COOLDOWN_MILLISECONDS) {
    let msRemaining = COOLDOWN_MILLISECONDS - (now - claimed[id]);
    let hrsRemaining = (msRemaining / (3600 * 1000)).toFixed(2);
    alert(`You can claim this quest again after ${hrsRemaining} hours.`);
    return;
  }

  let coins = parseInt(localStorage.getItem("coins") || "0", 10);
  coins += questCoins[id] || 0;
  localStorage.setItem("coins", coins.toString());

  claimed[id] = now;
  localStorage.setItem("claimed", JSON.stringify(claimed));

  updateQuestButton(id);
  updateCoinBalance();
  updateNavCoinBalance();

  alert(`You earned ${questCoins[id]} coins! Total: ${coins}`);
}

// Update individual quest button based on cooldown status
function updateQuestButton(id) {
  const button = document.getElementById("quest-" + id);
  if (!button) return;

  const now = Date.now();
  let claimed = JSON.parse(localStorage.getItem("claimed") || "{}");

  if (claimed[id]) {
    let elapsed = now - claimed[id];
    if (elapsed >= COOLDOWN_MILLISECONDS) {
      button.disabled = false;
      button.innerText = "Claim";
      if (button.timerInterval) {
        clearInterval(button.timerInterval);
        button.timerInterval = null;
      }
    } else {
      button.disabled = true;
      // Timer update function
      function updateTimer() {
        let remaining = COOLDOWN_MILLISECONDS - (Date.now() - claimed[id]);
        if (remaining <= 0) {
          button.disabled = false;
          button.innerText = "Claim";
          clearInterval(button.timerInterval);
          button.timerInterval = null;
        } else {
          let hours = Math.floor(remaining / (3600 * 1000));
          let mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
          let secs = Math.floor((remaining % (60 * 1000)) / 1000);
          button.innerText = `Wait ${hours}h ${mins}m ${secs}s`;
        }
      }
      updateTimer();
      if (button.timerInterval) clearInterval(button.timerInterval);
      button.timerInterval = setInterval(updateTimer, 1000);
    }
  } else {
    button.disabled = false;
    button.innerText = "Claim";
    if (button.timerInterval) {
      clearInterval(button.timerInterval);
      button.timerInterval = null;
    }
  }
}

// Update all quest buttons on page load
function updateAllQuestButtons() {
  Object.keys(questCoins).forEach(id => {
    updateQuestButton(id);
  });
}

// Reward costs matching your redeem.html buttons
const rewardCosts = {
  "Roblox Robux": 1000,
  "Spotify Premium": 1200,
  "Fortnite V-Bucks": 1500,
  "PUBG UC": 2200,
  "Free Fire Diamonds": 1800,
  "ML Diamonds": 1800,
  "Clash Of Clans Gems": 1500,
  "Google Play Gift Card": 800,
  "iTunes Gift Card": 800,
  "PayPal Cash": 1500,
  "Esewa Top-up": 1000,
  "Axie Infinity SLP": 1200,
  "The Sandbox SAND": 2000,
  "Illuvium ILV Tokens": 1500,
  "Gala Games GALA Tokens": 1600,
  "Decentraland MANA Tokens": 2200,
  "Amazon Gift Card": 1800,
  "Steam Gift Card": 2000,
  "eBay Gift Card": 1700,
  "Apple Gift Card": 2500,
  "Charity Donation": 1000,
  "Food Bank Support": 1200,
  "Environment Fund": 1500,
  "Education Support": 1300
};

// Redeem a reward if coins sufficient
function redeem(cost, item) {
  let coins = parseInt(localStorage.getItem("coins") || "0", 10);

  if (coins < cost) {
    alert(`❌ Not enough coins to redeem ${item}`);
    return;
  }

  coins -= cost;
  localStorage.setItem("coins", coins.toString());

  let redeemed = JSON.parse(localStorage.getItem("redeemed") || "[]");
  if (!redeemed.includes(item)) {
    redeemed.push(item);
    localStorage.setItem("redeemed", JSON.stringify(redeemed));
  }

  updateCoinBalance();
  updateNavCoinBalance();
  updateRedeemedRewards();

  alert(`🎉 Successfully redeemed ${item}! Remaining coins: ${coins}`);
}

// Disable and label redeemed reward buttons
function updateRedeemedRewards() {
  let redeemed = JSON.parse(localStorage.getItem("redeemed") || "[]");

  const grid = document.getElementById("redeemGrid");
  if (!grid) return;

  const buttons = grid.querySelectorAll("button");

  buttons.forEach(button => {
    // Get item name from onclick attribute redeem(cost, 'item name')
    let onclickAttr = button.getAttribute("onclick") || "";
    let match = onclickAttr.match(/redeem\(\d+,\s*'([^']+)'\)/);
    if (match) {
      let itemName = match[1];
      if (redeemed.includes(itemName)) {
        button.disabled = true;
        button.innerText = "Redeemed";
      }
    }
  });
}

// Update coin balance display in page (if exists)
function updateCoinBalance() {
  const el = document.getElementById("coin-balance");
  if (el) {
    el.innerText = localStorage.getItem("coins") || "0";
  }
}

// Update coin balance display in navbar
function updateNavCoinBalance() {
  const navbarEl = document.getElementById("nav-coin-balance");
  if (navbarEl) {
    navbarEl.innerText = localStorage.getItem("coins") || "0";
  }
}
