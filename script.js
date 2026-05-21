const routes = [
  {
    id: "market",
    name: "Lantern Market",
    tag: "Moon ink lead",
    summary:
      "A jade broker vanished beneath paper lanterns, leaving only a lacquered compass and a receipt marked with moon ink.",
    terrain: "Crowded alleys",
    risk: "Whisper guild",
    reward: "Compass shard",
    clue:
      "The compass shard points west only when lantern light passes through green silk.",
    glow: "rgba(241, 203, 122, 0.2)",
  },
  {
    id: "ruins",
    name: "Monsoon Ruins",
    tag: "Flooded glyphs",
    summary:
      "Rainwater has exposed a stairway beneath the old shrine, where stone tigers guard a jade-stained door.",
    terrain: "Flooded shrine",
    risk: "Rising water",
    reward: "Temple glyph",
    clue:
      "The temple glyph translates to: 'The heart opens when sky, river, and lantern agree.'",
    glow: "rgba(93, 255, 193, 0.18)",
  },
  {
    id: "observatory",
    name: "Jade Observatory",
    tag: "Star chart",
    summary:
      "An abandoned astronomer's tower still tracks the same comet that passed when the Jade Heart disappeared.",
    terrain: "Cliffside tower",
    risk: "Glass bridge",
    reward: "Star lens",
    clue:
      "The star lens reveals a hidden chamber beneath the third brass meridian.",
    glow: "rgba(119, 176, 255, 0.18)",
  },
];

const state = {
  activeRouteId: routes[0].id,
  recovered: new Set(),
  log: [],
};

const routeList = document.querySelector("#route-list");
const activeRouteName = document.querySelector("#active-route-name");
const activeRouteCopy = document.querySelector("#active-route-copy");
const activeRouteTerrain = document.querySelector("#active-route-terrain");
const activeRouteRisk = document.querySelector("#active-route-risk");
const activeRouteReward = document.querySelector("#active-route-reward");
const launchButton = document.querySelector("#launch-expedition");
const scanButton = document.querySelector("#scan-relic");
const resetButton = document.querySelector("#reset-expedition");
const clueLog = document.querySelector("#clue-log");
const fragmentSteps = document.querySelectorAll("#fragment-steps li");
const mapPoints = document.querySelectorAll(".map-point");
const jadeMeter = document.querySelector("#jade-meter");
const sealStatus = document.querySelector("#seal-status");
const cipherResult = document.querySelector("#cipher-result");

function getActiveRoute() {
  return routes.find((route) => route.id === state.activeRouteId) ?? routes[0];
}

function renderRoutes() {
  routeList.innerHTML = routes
    .map((route) => {
      const isActive = route.id === state.activeRouteId;
      const isComplete = state.recovered.has(route.id);

      return `
        <button
          class="route-card ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}"
          style="--route-glow: ${route.glow}"
          type="button"
          data-route="${route.id}"
          aria-pressed="${isActive}"
        >
          <span class="route-tag">${route.tag}</span>
          <h3>${route.name}</h3>
          <p>${route.summary}</p>
          <span class="route-state">${isComplete ? "Fragment recovered" : "Lead available"}</span>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".route-card").forEach((card) => {
    card.addEventListener("click", () => selectRoute(card.dataset.route));
  });
}

function renderActiveRoute() {
  const route = getActiveRoute();
  const isComplete = state.recovered.has(route.id);

  activeRouteName.textContent = route.name;
  activeRouteCopy.textContent = route.summary;
  activeRouteTerrain.textContent = route.terrain;
  activeRouteRisk.textContent = route.risk;
  activeRouteReward.textContent = route.reward;
  launchButton.textContent = isComplete ? "Review recovered clue" : "Advance expedition";
}

function renderProgress() {
  const recoveredCount = state.recovered.size;
  const remaining = routes.length - recoveredCount;
  const percent = Math.round((recoveredCount / routes.length) * 100);

  jadeMeter.style.width = `${percent}%`;
  sealStatus.textContent =
    recoveredCount === routes.length
      ? "The Jade Heart is whole. The hidden gate is listening."
      : `${remaining} fragment${remaining === 1 ? "" : "s"} remain hidden.`;

  fragmentSteps.forEach((step) => {
    step.classList.toggle("complete", state.recovered.has(step.dataset.fragment));
  });

  mapPoints.forEach((point) => {
    const isActive = point.dataset.route === state.activeRouteId;
    point.classList.toggle("active", isActive);
    point.classList.toggle("complete", state.recovered.has(point.dataset.route));
  });
}

function renderLog() {
  if (state.log.length === 0) {
    clueLog.innerHTML = "<li>Select a route and advance the expedition to begin the pursuit.</li>";
    return;
  }

  clueLog.innerHTML = state.log
    .map((entry) => `<li><strong>${entry.name}:</strong> ${entry.clue}</li>`)
    .join("");
}

function renderCipher() {
  if (state.recovered.size === routes.length) {
    cipherResult.textContent =
      "Decoded: follow the western lantern, cross where monsoon water reflects the comet, and press the jade seal beneath the brass meridian.";
    return;
  }

  cipherResult.textContent = "The cipher waits for all three fragments.";
}

function render() {
  renderRoutes();
  renderActiveRoute();
  renderProgress();
  renderLog();
  renderCipher();
}

function selectRoute(routeId) {
  if (!routes.some((route) => route.id === routeId)) {
    return;
  }

  state.activeRouteId = routeId;
  render();
}

function advanceExpedition() {
  const route = getActiveRoute();

  if (!state.recovered.has(route.id)) {
    state.recovered.add(route.id);
    state.log.unshift({ name: route.name, clue: route.clue });
  } else {
    state.log = [
      { name: route.name, clue: `Reviewed clue — ${route.clue}` },
      ...state.log.filter((entry) => entry.name !== route.name),
    ];
  }

  render();
}

function scanRelic() {
  if (state.recovered.size === routes.length) {
    cipherResult.textContent =
      "The Jade Heart flares awake. A stair of green light opens under the observatory — pursuit complete.";
    return;
  }

  const nextRoute = routes.find((route) => !state.recovered.has(route.id));
  selectRoute(nextRoute.id);
  cipherResult.textContent = `${nextRoute.reward} is still missing. The trail points toward ${nextRoute.name}.`;
}

function resetExpedition() {
  state.activeRouteId = routes[0].id;
  state.recovered.clear();
  state.log = [];
  render();
}

launchButton.addEventListener("click", advanceExpedition);
scanButton.addEventListener("click", scanRelic);
resetButton.addEventListener("click", resetExpedition);
mapPoints.forEach((point) => {
  point.addEventListener("click", () => selectRoute(point.dataset.route));
});

render();
