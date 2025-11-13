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

    document.getElementById("detail-source").textContent = log.sourceSystem;
    document.getElementById("detail-type").textContent = log.type;
    document.getElementById("detail-channel").textContent = log.channel;
    document.getElementById("detail-product").textContent = log.productArea;

    document.getElementById("detail-summary").textContent = log.content.summary;
    document.getElementById("detail-details").textContent = log.content.details || "—";

    document.getElementById("detail-link").href = log.links?.linkToSystem || "#";

    const ownerInfo = log.owner?.ownerMail
        ? `${log.owner.ownerType} (${log.owner.ownerMail})`
        : log.owner?.ownerType || "—";

    document.getElementById("detail-owner").textContent = ownerInfo;

    // Markér valgt element
    document.querySelectorAll(".log-item").forEach(el => el.classList.remove("active"));
    const activeEl = document.querySelector(`[data-id='${id}']`);
    if (activeEl) activeEl.classList.add("active");
}

// ---------------------------------------
// EKSEMPEL: Kørsel med JSON (kan fjernes)
// ---------------------------------------
const demoJSON = [
    {
        "logId": "LOG-1",
        "customerId": "CUST-1",
        "sourceSystem": "Egis",
        "timestamp": 1730812800,
        "type": "contractChange",
        "channel": "portal",
        "productArea": "el",
        "content": {
            "summary": "Kunde skiftede abonnement",
            "details": "Aftale ændret via kundeportal"
        },
        "links": { "linkToSystem": "https://crm.ok.dk/1" },
        "owner": { "ownerType": "mobilitet", "ownerMail": "xx@ok.dk" }
    },
    {
        "logId": "LOG-2",
        "customerId": "CUST-2",
        "sourceSystem": "Miralix",
        "timestamp": 1730550000,
        "type": "phoneCall",
        "channel": "telefon",
        "productArea": "vask",
        "content": {
            "summary": "Indgående opkald",
            "details": "Kunden ringede ind vedr. vaskemaskine"
        },
        "links": { "linkToSystem": "https://crm.ok.dk/2" },
        "owner": { "ownerType": "kundeservice", "ownerMail": "yy@ok.dk" }
    }
];

loadLogData(demoJSON);
