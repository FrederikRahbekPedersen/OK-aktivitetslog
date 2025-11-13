// -----------------------------
// Modtager JSON og indlæser det
// -----------------------------
let logs = {};

function loadLogData(data) {

    // Konverter enkelt objekt til array
    if (!Array.isArray(data)) {
        data = [data];
    }

    // Konverter array til dictionary baseret på logId
    logs = {};
    data.forEach(item => {
        logs[item.logId] = item;
    });

    renderLogList();
    // Auto-vælg første
    if (data.length > 0) selectLog(data[0].logId);
}

// -----------------------------
// Byg liste dynamisk
// -----------------------------
function renderLogList() {
    const listContainer = document.getElementById("log-list");
    listContainer.innerHTML = "";

    Object.values(logs).forEach(log => {
        const div = document.createElement("div");
        div.className = "log-item";
        div.dataset.id = log.logId;

        const date = new Date(log.timestamp * 1000).toLocaleString("da-DK");

        div.innerHTML = `
            <div class="item-title">${log.content.summary}</div>
            <div class="item-meta">${date} • ${log.sourceSystem} • ${log.productArea}</div>
        `;

        div.onclick = () => selectLog(log.logId);

        listContainer.appendChild(div);
    });
}

// -----------------------------
// Opdater detaljevisningen
// -----------------------------
function selectLog(id) {
    const log = logs[id];
    if (!log) return;

    const sourceLink = document.getElementById("detail-source");
    const linkToSystem = log.links?.linkToSystem;

    sourceLink.textContent = log.sourceSystem || "—";
    if (linkToSystem) {
        sourceLink.href = linkToSystem;
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
        sourceLink.removeAttribute("aria-disabled");
    } else {
        sourceLink.href = "#";
        sourceLink.removeAttribute("target");
        sourceLink.removeAttribute("rel");
        sourceLink.setAttribute("aria-disabled", "true");
    }

    document.getElementById("detail-type").textContent = log.type;
    document.getElementById("detail-channel").textContent = log.channel;
    document.getElementById("detail-product").textContent = log.productArea;

    document.getElementById("detail-summary").textContent = log.content.summary;
    document.getElementById("detail-details").textContent = log.content.details || "—";

    const ownerInfo = log.owner?.ownerMail
        ? `${log.owner.ownerType} (${log.owner.ownerMail})`
        : log.owner?.ownerType || "—";

    document.getElementById("detail-owner").textContent = ownerInfo;

    // Markér valgt element
    document.querySelectorAll(".log-item").forEach(el => el.classList.remove("active"));
    const activeEl = document.querySelector(`[data-id='${id}']`);
    if (activeEl) activeEl.classList.add("active");
}

async function init() {
    try {
        const response = await fetch("logs.json");
        if (!response.ok) {
            throw new Error(`Kunne ikke indlæse logs.json (status ${response.status})`);
        }
        const data = await response.json();
        loadLogData(data);
    } catch (error) {
        console.error(error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
