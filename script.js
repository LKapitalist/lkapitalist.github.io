/* =========================================================
   IMPORTATION
   ========================================================= */

const app = document.getElementById("app");
const fileInput = document.getElementById("fileInput");


/* =========================================================
   KEEP IN MEMORY
   ========================================================= */

const storage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
        }
    }
};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let character = null;
let companion = null;

let currentPage = "skills";
let companionPage = "skills";

let spellFilterLevel = 0;

let headerCollapsed =
    storage.getItem("jdrHeaderCollapsed") === "1";


let zoom =
    Number(
        storage.getItem("jdrZoom")
    ) || 1;


/* =========================================================
   VARIABLE
   ========================================================= */

const ABILITIES = {
    force: "FOR",
    dexterite: "DEX",
    constitution: "CON",
    intelligence: "INT",
    sagesse: "SAG",
    charisme: "CHA"
};


const ABILITY_NAMES = {
    force: "Force",
    dexterite: "Dextérité",
    constitution: "Constitution",
    intelligence: "Intelligence",
    sagesse: "Sagesse",
    charisme: "Charisme"
};


const SKILL_DESCRIPTIONS = {
    Athletisme: "Sauter, nager, grimper ou bousculer.",
    Acrobaties: "Garder l'équilibre ou faire des acrobaties.",
    Discretion: "Se cacher ou se déplacer sans bruit.",
    Escamotage: "Faire les poches ou cacher un petit objet.",
    Arcanes: "Connaissance de la magie et des plans.",
    Histoire: "Souvenirs du passé, des guerres et des royaumes.",
    Investigation: "Chercher des indices ou déduire des informations.",
    Nature: "Connaissance des plantes, des animaux et du climat.",
    Religion: "Connaissance des dieux et des rites.",
    Dressage: "Calmer ou interagir avec un animal.",
    Intuition: "Déceler les mensonges ou les intentions cachées.",
    Medecine: "Stabiliser un mourant ou identifier une maladie.",
    Perception: "Écouter, voir ou remarquer un danger caché.",
    Survie: "Suivre des pistes, chasser ou prévoir la météo.",
    Tromperie: "Mentir ou bluffer avec aplomb.",
    Intimidation: "Faire peur par les mots ou les menaces.",
    Performance: "Chanter, jouer d'un instrument ou danser.",
    Persuasion: "Convaincre ou négocier pacifiquement."
};


const SKILL_ABILITIES = {
    Athletisme: "force",
    Acrobaties: "dexterite",
    Discretion: "dexterite",
    Escamotage: "dexterite",
    Arcanes: "intelligence",
    Histoire: "intelligence",
    Investigation: "intelligence",
    Nature: "intelligence",
    Religion: "intelligence",
    Dressage: "sagesse",
    Intuition: "sagesse",
    Medecine: "sagesse",
    Perception: "sagesse",
    Survie: "sagesse",
    Tromperie: "charisme",
    Intimidation: "charisme",
    Performance: "charisme",
    Persuasion: "charisme"
};


const DAMAGE_TYPES = {
    acide: "Acide",
    contondant: "Contondant",
    feu: "Feu",
    force: "Force",
    foudre: "Foudre",
    froid: "Froid",
    necrotique: "Nécrotique",
    perforant: "Perforant",
    poison: "Poison",
    psychique: "Psychique",
    radiant: "Radiant",
    tonnerre: "Tonnerre",
    tranchant: "Tranchant"
};


const DAMAGE_COLORS = {
    acide: "#ECF500",
    contondant: "#CDCDCD",
    feu: "#EF7000",
    force: "#AA4F51",
    foudre: "#4D83D1",
    froid: "#8BCDE4",
    necrotique: "#5DA67A",
    perforant: "#CDCDCD",
    poison: "#A7BD52",
    psychique: "#C279B1",
    radiant: "#FBDF84",
    tonnerre: "#AA86DB",
    tranchant: "#CDCDCD"
};


const DAMAGE_DICE = [4, 6, 8, 10, 12, 20];


const RESISTANCE_STATES = {
    aucun: "Aucun",
    resistance: "Résistance",
    immunite: "Immunité",
    vulnerabilite: "Vulnérabilité"
};


const ACTION_TYPES = [
    "Arme",
    "Action de Race",
    "Action de Classe",
    "Trait notable",
    "Sort"
];


const ACTION_COSTS = [
    "Action",
    "Action bonus",
    "Réaction",
    "Passif",
    "Aucune action"
];


const COMPANION_COSTS = [
    "Action",
    "Action bonus",
    "Réaction",
    "Action légendaire",
    "Passif",
    "Trait notable"
];


const CREATURE_SIZES = [
    "TP",
    "P",
    "M",
    "G",
    "TG",
    "Gig"
];


/* =========================================================
   BLANK CHARACTER
   ========================================================= */

const blankSkills = () => {

    const skills = {};

    Object.keys(SKILL_ABILITIES).forEach(name => {

        skills[name] = {
            ability: SKILL_ABILITIES[name],
            proficient: false
        };

    });

    return skills;
};


const blankResistances = () => {

    const resistances = {};

    Object.keys(DAMAGE_TYPES).forEach(key => {
        resistances[key] = "aucun";
    });

    return resistances;
};


const blankCharacter = () => ({
    kind: "character",

    name: "",
    className: "",
    level: 1,
    race: "",

    hpMax: 10,
    hp: 10,
    tempHp: 0,
    ac: 10,
    initiative: 0,
    speed: 9,

    proficiencyBonus: 2,

    spellAbility: "intelligence",

    abilities: {
        force: 10,
        dexterite: 10,
        constitution: 10,
        intelligence: 10,
        sagesse: 10,
        charisme: 10
    },

    savingThrows: {
        force: false,
        dexterite: false,
        constitution: false,
        intelligence: false,
        sagesse: false,
        charisme: false
    },

    skills: blankSkills(),

    resistances: blankResistances(),

    proficiencies: [],
    languages: [],

    details: {
        age: "",
        height: "",
        weight: "",
        eyes: "",
        skin: "",
        hair: ""
    },

    personality: {
        traits: "",
        ideals: "",
        bonds: "",
        flaws: ""
    },

    backstory: "",

    money: {
        po: 0,
        pa: 0,
        pc: 0
    },

    inventory: [],

    slots: {
        1: { max: 0, used: 0 },
        2: { max: 0, used: 0 },
        3: { max: 0, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 }
    },

    actions: []
});


/* =========================================================
   BLANK COMPANION
   ========================================================= */

const blankCompanionSkills = () => {

    const skills = {};

    Object.keys(SKILL_ABILITIES).forEach(name => {

        skills[name] = {
            ability: SKILL_ABILITIES[name],
            value: ""
        };

    });

    return skills;
};


const blankCompanion = () => ({
    kind: "companion",

    name: "",
    creatureType: "",
    size: "M",
    alignment: "",

    ac: 10,
    hpMax: 10,
    hp: 10,
    tempHp: 0,

    speed: 9,
    hasFly: false,
    flySpeed: 0,

    cr: "1/4",

    abilities: {
        force: 10,
        dexterite: 10,
        constitution: 10,
        intelligence: 10,
        sagesse: 10,
        charisme: 10
    },

    skills: blankCompanionSkills(),

    resistances: blankResistances(),

    languages: [],
    senses: [],

    actions: []
});


/* =========================================================
   HOME
   ========================================================= */

function home() {

    character = null;
    companion = null;

    app.innerHTML = `
        <button
            class="theme-corner-btn"
            onclick="openThemeModal()"
        >
            Choisir le thème
        </button>

        <div class="center">

            <div class="home">

                <h1 class="logo">
                    Créateur de Personnage D&D (WORK IN PROGRESS)
                </h1>

                <p class="subtitle">
                    [Par Kapi]
                </p>

                <div class="home-actions">

                    <button
                        class="primary"
                        onclick="newCharacter()"
                    >
                        Créer un personnage
                    </button>

                    <button
                        class="primary"
                        onclick="newCompanion()"
                    >
                        Créer un companion
                    </button>

                    <button onclick="loadFile()">
                        Charger un personnage
                    </button>

                    <button onclick="loadFile()">
                        Charger un companion
                    </button>

                </div>

                <div
                    id="folderPanel"
                    class="card folder-panel"
                ></div>

                <p class="update">
                    V8.3
                </p>

            </div>

        </div>
    `;

    renderFolderPanel();

    restoreFolder();
}


/* =========================================================
   FOLDER — DATABASE
   ========================================================= */

let folderHandle = null;
let folderFiles = [];
let folderNeedsPermission = false;


function openHandleDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open("jdr-app", 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore("handles");
        };

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });
}


async function getHandle(key) {

    try {

        const db = await openHandleDatabase();

        return await new Promise((resolve, reject) => {

            const request =
                db
                    .transaction("handles", "readonly")
                    .objectStore("handles")
                    .get(key);

            request.onsuccess = () => resolve(request.result);

            request.onerror = () => reject(request.error);

        });

    } catch (e) {

        return null;

    }
}


async function setHandle(key, value) {

    try {

        const db = await openHandleDatabase();

        await new Promise((resolve, reject) => {

            const request =
                db
                    .transaction("handles", "readwrite")
                    .objectStore("handles")
                    .put(value, key);

            request.onsuccess = () => resolve();

            request.onerror = () => reject(request.error);

        });

    } catch (e) {
    }
}


async function deleteHandle(key) {

    try {

        const db = await openHandleDatabase();

        await new Promise((resolve, reject) => {

            const request =
                db
                    .transaction("handles", "readwrite")
                    .objectStore("handles")
                    .delete(key);

            request.onsuccess = () => resolve();

            request.onerror = () => reject(request.error);

        });

    } catch (e) {
    }
}


/* =========================================================
   FOLDER — QUICK ACCESS
   ========================================================= */

function folderSupported() {

    return typeof window.showDirectoryPicker === "function";
}


async function pickFolder() {

    if (!folderSupported()) {
        return;
    }

    try {

        folderHandle =
            await window.showDirectoryPicker();

        folderNeedsPermission = false;

        await setHandle("folder", folderHandle);

        await refreshFolder();

    } catch (e) {
    }
}


async function restoreFolder() {

    if (!folderSupported()) {
        return;
    }

    const handle = await getHandle("folder");

    if (!handle) {
        return;
    }

    folderHandle = handle;

    const permission =
        await handle.queryPermission({ mode: "readwrite" });

    if (permission === "granted") {

        folderNeedsPermission = false;

        await refreshFolder();

    } else {

        folderNeedsPermission = true;

        renderFolderPanel();

    }
}


async function grantFolder() {

    if (!folderHandle) {
        return;
    }

    const permission =
        await folderHandle.requestPermission({ mode: "readwrite" });

    if (permission === "granted") {

        folderNeedsPermission = false;

        await refreshFolder();

    }
}


async function ensureFolderPermission() {

    if (!folderHandle) {
        return false;
    }

    let permission =
        await folderHandle.queryPermission({ mode: "readwrite" });

    if (permission !== "granted") {

        permission =
            await folderHandle.requestPermission({ mode: "readwrite" });

    }

    return permission === "granted";
}


async function refreshFolder() {

    if (!folderHandle) {
        return;
    }

    folderFiles = [];

    try {

        for await (const entry of folderHandle.values()) {

            if (
                entry.kind === "file" &&
                entry.name.toLowerCase().endsWith(".json")
            ) {

                folderFiles.push(entry.name);

            }

        }

        folderFiles.sort();

    } catch (e) {

        folderNeedsPermission = true;

    }

    renderFolderPanel();
}


async function forgetFolder() {

    folderHandle = null;
    folderFiles = [];
    folderNeedsPermission = false;

    await deleteHandle("folder");

    renderFolderPanel();
}


async function openFromFolder(name) {

    if (!await ensureFolderPermission()) {
        return;
    }

    try {

        const fileHandle =
            await folderHandle.getFileHandle(name);

        const file = await fileHandle.getFile();

        loadData(
            JSON.parse(await file.text())
        );

    } catch (e) {

        console.error(e);

        alert("Fichier invalide.");

    }
}


async function saveToFolder(text, filename) {

    const fileHandle =
        await folderHandle.getFileHandle(
            filename,
            { create: true }
        );

    const writable = await fileHandle.createWritable();

    await writable.write(text);

    await writable.close();

    await refreshFolder();
}


function renderFolderPanel() {

    const panel =
        document.getElementById("folderPanel");

    if (!panel) {
        return;
    }

    if (!folderSupported()) {

        panel.innerHTML = `
            <h2>Dossier de sauvegarde</h2>

            <p class="label">
                Non supporté par ce navigateur.
            </p>
        `;

        return;
    }

    if (!folderHandle) {

        panel.innerHTML = `
            <h2>Dossier de sauvegarde</h2>

            <p class="label">
                Choisis un dossier pour l'accès rapide
                à tes fiches.
            </p>

            <button onclick="pickFolder()">
                Choisir un dossier
            </button>
        `;

        return;
    }

    if (folderNeedsPermission) {

        panel.innerHTML = `
            <h2>Dossier de sauvegarde</h2>

            <p class="label">
                ${esc(folderHandle.name)}
            </p>

            <div class="folder-actions">

                <button
                    class="primary"
                    onclick="grantFolder()"
                >
                    Autoriser l'accès
                </button>

                <button onclick="forgetFolder()">
                    Oublier
                </button>

            </div>
        `;

        return;
    }

    panel.innerHTML = `
        <h2>Dossier de sauvegarde</h2>

        <p class="label">
            ${esc(folderHandle.name)}
        </p>

        <div class="folder-list">

            ${
                folderFiles.length
                ?
                folderFiles
                    .map(
                        (name, i) => `
                            <button
                                class="folder-file"
                                onclick="openFromFolder(folderFiles[${i}])"
                            >
                                ${esc(name.replace(/\.json$/i, ""))}
                            </button>
                        `
                    )
                    .join("")
                :
                `<p class="label">Aucune fiche dans ce dossier.</p>`
            }

        </div>

        <div class="folder-actions">

            <button onclick="refreshFolder()">
                Actualiser
            </button>

            <button onclick="pickFolder()">
                Changer de dossier
            </button>

            <button
                class="danger"
                onclick="forgetFolder()"
            >
                Oublier
            </button>

        </div>
    `;
}


/* =========================================================
   THEME
   ========================================================= */

function openThemeModal() {

    document.getElementById("themeModal")?.remove();

    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div
            id="themeModal"
            class="modal theme-modal"
            onclick="closeThemeModal(event)"
        >

            <div class="modal-content">

                <button
                    class="close"
                    onclick="closeThemeModal()"
                >
                    ×
                </button>

                <h2>Choisir un thème</h2>

                <p>
                    Choisis la couleur principale
                    de ton interface.
                </p>

                <div class="theme-grid">

                    <button
                        class="theme-option theme-purple-option"
                        onclick="setTheme('purple')"
                    >
                        <span></span>
                        Violet
                    </button>

                    <button
                        class="theme-option theme-blue-option"
                        onclick="setTheme('blue')"
                    >
                        <span></span>
                        Bleu
                    </button>

                    <button
                        class="theme-option theme-green-option"
                        onclick="setTheme('green')"
                    >
                        <span></span>
                        Vert
                    </button>

                    <button
                        class="theme-option theme-red-option"
                        onclick="setTheme('red')"
                    >
                        <span></span>
                        Rouge
                    </button>

                    <button
                        class="theme-option theme-orange-option"
                        onclick="setTheme('orange')"
                    >
                        <span></span>
                        Orange
                    </button>

                    <button
                        class="theme-option theme-cyan-option"
                        onclick="setTheme('cyan')"
                    >
                        <span></span>
                        Cyan
                    </button>

                    <button
                        class="theme-option theme-pink-option"
                        onclick="setTheme('pink')"
                    >
                        <span></span>
                        Rose
                    </button>

                </div>

            </div>

        </div>
        `
    );
}


function setTheme(theme) {

    const themes = [
        "purple",
        "blue",
        "green",
        "red",
        "orange",
        "cyan",
        "pink"
    ];

    themes.forEach(t => {
        document.body.classList.remove(
            "theme-" + t
        );
    });

    document.body.classList.add(
        "theme-" + theme
    );

    storage.setItem(
        "jdr-theme",
        theme
    );

    closeThemeModal();
}


function loadTheme() {

    const theme =
        storage.getItem("jdr-theme") ||
        "purple";

    setThemeWithoutClosing(theme);
}


function setThemeWithoutClosing(theme) {

    const themes = [
        "purple",
        "blue",
        "green",
        "red",
        "orange",
        "cyan",
        "pink"
    ];

    themes.forEach(t => {
        document.body.classList.remove(
            "theme-" + t
        );
    });

    if (themes.includes(theme)) {
        document.body.classList.add(
            "theme-" + theme
        );
    }
}


function closeThemeModal(e) {

    if (
        !e ||
        e.target.id === "themeModal"
    ) {

        document
            .getElementById("themeModal")
            ?.remove();

    }
}


/* =========================================================
   NEW CHARACTER
   ========================================================= */

function newCharacter() {

    character = blankCharacter();

    companion = null;

    currentPage = "skills";

    spellFilterLevel = 0;

    editor();
}


/* =========================================================
   NEW COMPANION
   ========================================================= */

function newCompanion() {

    companion = blankCompanion();

    character = null;

    companionPage = "skills";

    companionEditor();
}


/* =========================================================
   LOAD FILE
   ========================================================= */

function loadFile() {

    fileInput.value = "";

    fileInput.click();
}


fileInput.onchange = async (e) => {

    const file = e.target.files[0];

    if (!file) {
        return;
    }

    try {

        loadData(
            JSON.parse(
                await file.text()
            )
        );

    } catch (err) {

        console.error(err);

        alert(
            "Fichier invalide."
        );

    }
};


function loadData(data) {

    if (data?.kind === "companion") {

        companion = data;

        character = null;

        normalizeCompanion();

        companionPage = "skills";

        companionSheet();

        return;
    }

    character = data;

    companion = null;

    normalize();

    currentPage = "skills";

    spellFilterLevel = 0;

    sheet();
}


/* =========================================================
   NORMALIZE CHARACTER
   ========================================================= */

function normalize() {

    const b = blankCharacter();

    character = {

        ...b,
        ...character,

        kind: "character",

        abilities: {
            ...b.abilities,
            ...(character.abilities || {})
        },

        savingThrows: {
            ...b.savingThrows,
            ...(character.savingThrows || {})
        },

        resistances: {
            ...b.resistances,
            ...(character.resistances || {})
        },

        details: {
            ...b.details,
            ...(character.details || {})
        },

        personality: {
            ...b.personality,
            ...(character.personality || {})
        },

        money: {
            ...b.money,
            ...(character.money || {})
        },

        slots: {
            ...b.slots,
            ...(character.slots || {})
        },

        proficiencies:
            Array.isArray(character.proficiencies)
                ? character.proficiencies
                : [],

        languages:
            Array.isArray(character.languages)
                ? character.languages
                : [],

        inventory:
            Array.isArray(character.inventory)
                ? character.inventory
                : [],

        actions:
            Array.isArray(character.actions)
                ? character.actions
                : []

    };


    const oldSkills =
        character.skills || {};

    character.skills = {};

    Object.keys(b.skills).forEach(skill => {

        const old =
            oldSkills[skill];

        character.skills[skill] = {

            ability:
                old?.ability ||
                b.skills[skill].ability,

            proficient:
                old?.proficient === true

        };

    });


    if (character.tempHp == null) {
        character.tempHp = 0;
    }


    character.inventory =
        character.inventory.map(item => ({

            name:
                item.name ||
                "Nouvel objet",

            quantity:
                Number(item.quantity ?? 1),

            weight:
                Number(item.weight ?? 0),

            equipped:
                item.equipped === true,

            description:
                item.description || ""

        }));


    character.actions =
        character.actions.map(action => ({

            name:
                action.name ||
                "Nouvelle action",

            cost:
                normalizeCost(action.cost),

            type:
                action.type ||
                "Action de Classe",

            level:
                action.level ?? "",

            damage:
                action.damage || "",

            description:
                action.description || "",

            weaponAbility:
                action.weaponAbility ||
                "force",

            weaponFinesse:
                action.weaponFinesse === true,

            spellAbility:
                action.spellAbility ||
                character.spellAbility ||
                "intelligence",

            image:
                action.image || "",

            castingTime:
                action.castingTime || "",

            range:
                action.range || "",

            components:
                action.components || "",

            duration:
                action.duration || ""

        }));


    delete character.resources;


    if (!character.proficiencyBonus) {
        character.proficiencyBonus = 2;
    }
}


function normalizeCost(cost) {

    if (ACTION_COSTS.includes(cost)) {
        return cost;
    }

    return "Action";
}


/* =========================================================
   NORMALIZE COMPANION
   ========================================================= */

function normalizeCompanion() {

    const b = blankCompanion();

    companion = {

        ...b,
        ...companion,

        kind: "companion",

        abilities: {
            ...b.abilities,
            ...(companion.abilities || {})
        },

        resistances: {
            ...b.resistances,
            ...(companion.resistances || {})
        },

        languages:
            Array.isArray(companion.languages)
                ? companion.languages
                : [],

        senses:
            Array.isArray(companion.senses)
                ? companion.senses
                : [],

        actions:
            Array.isArray(companion.actions)
                ? companion.actions
                : []

    };


    const oldSkills =
        companion.skills || {};

    companion.skills = {};

    Object.keys(b.skills).forEach(skill => {

        const old =
            oldSkills[skill];

        companion.skills[skill] = {

            ability:
                old?.ability ||
                b.skills[skill].ability,

            value:
                old?.value === 0 || old?.value
                    ? String(old.value)
                    : ""

        };

    });


    if (companion.tempHp == null) {
        companion.tempHp = 0;
    }


    companion.actions =
        companion.actions.map(action => ({

            name:
                action.name ||
                "Nouvelle action",

            cost:
                COMPANION_COSTS.includes(action.cost)
                    ? action.cost
                    : "Action",

            damage:
                action.damage || "",

            description:
                action.description || "",

            image:
                action.image || ""

        }));
}


/* =========================================================
   SAVE FILE
   ========================================================= */

function fileNameFor(name, fallback) {

    return (
        String(name || "")
            .replace(
                /[^a-z0-9_-]+/gi,
                "_"
            )
        ||
        fallback
    )
    + ".json";
}


function downloadFile(text, filename) {

    const blob =
        new Blob(
            [text],
            {
                type:
                    "application/json"
            }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download = filename;

    a.click();

    URL.revokeObjectURL(a.href);
}


async function saveData(data, filename) {

    const text =
        JSON.stringify(
            data,
            null,
            2
        );

    if (
        folderHandle &&
        await ensureFolderPermission()
    ) {

        try {

            await saveToFolder(text, filename);

            alert(
                "Sauvegardé dans le dossier " +
                folderHandle.name +
                "."
            );

            return;

        } catch (e) {

            console.error(e);

        }

    }

    downloadFile(text, filename);
}


function saveFile() {

    if (!character?.name) {

        alert(
            "Donnez d'abord un nom au personnage."
        );

        return;
    }

    saveData(
        character,
        fileNameFor(character.name, "personnage")
    );
}


function saveCompanionFile() {

    if (!companion?.name) {

        alert(
            "Donnez d'abord un nom au companion."
        );

        return;
    }

    saveData(
        companion,
        fileNameFor(companion.name, "companion")
    );
}


/* =========================================================
   LIST EDITOR
   ========================================================= */

const LIST_TARGETS = {

    charProficiencies: () => character.proficiencies,

    charLanguages: () => character.languages,

    compLanguages: () => companion.languages,

    compSenses: () => companion.senses

};


function addListItem(key) {

    LIST_TARGETS[key]().push("");

    renderListEditor(key);
}


function removeListItem(key, index) {

    LIST_TARGETS[key]().splice(index, 1);

    renderListEditor(key);
}


function renderListEditor(key) {

    const el =
        document.getElementById("list_" + key);

    if (!el) {
        return;
    }

    const list = LIST_TARGETS[key]();

    el.innerHTML =
        list
        .map(
            (value, i) => `

                <div class="list-row">

                    <input
                        data-list="${key}"
                        data-index="${i}"
                        value="${esc(value)}"
                    >

                    <button
                        class="danger"
                        onclick="removeListItem('${key}', ${i})"
                    >
                        ×
                    </button>

                </div>

            `
        )
        .join("");


    el
        .querySelectorAll("[data-list]")
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    LIST_TARGETS[key]()[
                        Number(input.dataset.index)
                    ] = input.value;

                }
            );

        });
}


/* =========================================================
   CHARACTER EDITOR
   ========================================================= */

function editor() {

    const c = character;

    app.innerHTML = `

        <div class="app">

            <header>

                <div>

                    <h1>
                        Créer un personnage
                    </h1>

                    <p>
                        Configure ton personnage.
                    </p>

                </div>

                <div class="header-actions">
                    <button onclick="home()">
                        Annuler
                    </button>
                </div>

            </header>


            <div class="card form">

                <h2>Identité</h2>

                <div class="form-row">

                    <div class="field">

                        <label>Nom</label>

                        <input
                            id="name"
                            value="${esc(c.name)}"
                        >

                    </div>

                    <div class="field">

                        <label>Race</label>

                        <input
                            id="race"
                            value="${esc(c.race)}"
                        >

                    </div>

                </div>


                <div class="form-row">

                    <div class="field">

                        <label>Classe</label>

                        <select id="className">

                            ${[
                                "Barbare",
                                "Guerrier",
                                "Moine",
                                "Paladin",
                                "Clerc",
                                "Rodeur",
                                "Druide",
                                "Roublard",
                                "Barde",
                                "Mage",
                                "Ensorceleur",
                                "Occultiste"
                            ]
                            .map(
                                name => `
                                    <option
                                        value="${name}"
                                        ${
                                            c.className === name
                                            ? "selected"
                                            : ""
                                        }
                                    >
                                        ${name}
                                    </option>
                                `
                            )
                            .join("")}

                        </select>

                    </div>

                    <div class="field">

                        <label>Niveau</label>

                        <input
                            id="level"
                            type="number"
                            min="1"
                            value="${c.level}"
                        >

                    </div>

                </div>


                <div class="form-row">

                    <div class="field">

                        <label>
                            Bonus de maîtrise
                        </label>

                        <input
                            id="proficiencyBonus"
                            type="number"
                            value="${c.proficiencyBonus}"
                        >

                    </div>


                    <div class="field">

                        <label>
                            Caractéristique de lancement de sorts
                        </label>

                        <select id="spellAbility">

                            ${Object.entries(
                                ABILITY_NAMES
                            )
                            .map(
                                ([key, name]) => `
                                    <option
                                        value="${key}"
                                        ${
                                            c.spellAbility === key
                                            ? "selected"
                                            : ""
                                        }
                                    >
                                        ${name}
                                    </option>
                                `
                            )
                            .join("")}

                        </select>

                    </div>

                </div>

            </div>


            <div class="card">

                <h2>Combat</h2>

                <div class="form-row">

                    ${[
                        ["hpMax", "PV maximum"],
                        ["hp", "PV actuels"],
                        ["ac", "CA"],
                        ["initiative", "Initiative"],
                        ["speed", "Vitesse"]
                    ]
                    .map(
                        ([id, label]) => `
                            <div class="field">

                                <label>${label}</label>

                                <input
                                    id="${id}"
                                    type="number"
                                    value="${c[id]}"
                                >

                            </div>
                        `
                    )
                    .join("")}

                </div>

            </div>


            <div class="card">

                <h2>Caractéristiques</h2>

                <div class="abilities">

                    ${Object.entries(ABILITIES)
                    .map(
                        ([key, short]) => `

                            <div class="ability">

                                <div class="label">
                                    ${short}
                                </div>

                                <img
                                    class="ability-image"
                                    src="icons/${key}.png"
                                    alt=""
                                >

                                <input
                                    id="ab_${key}"
                                    type="number"
                                    value="${c.abilities[key]}"
                                >

                            </div>

                        `
                    )
                    .join("")}

                </div>

            </div>


            <div class="card">

                <h2>Compétences</h2>

                <p class="label">

                    Coche les compétences maîtrisées.
                    Le bonus de maîtrise sera ajouté
                    automatiquement.

                </p>

                <div class="editor-list">

                    ${Object.entries(c.skills)
                    .map(
                        ([name, skill]) => `

                            <div class="editor-item">

                                <div>

                                    <strong class="skill-name">
                                        <img
                                            src="icons/${name}.png"
                                            class="skill-icon"
                                            alt=""
                                        >
                                        ${esc(name)}
                                    </strong>

                                    <small>
                                        ${abilityShortName(
                                            skill.ability
                                        )}
                                        -
                                        ${SKILL_DESCRIPTIONS[name]}
                                    </small>

                                </div>

                                <label class="checkbox-row">

                                    <input
                                        type="checkbox"
                                        id="mastery_${name}"
                                        ${
                                            skill.proficient
                                            ? "checked"
                                            : ""
                                        }
                                    >

                                    Maîtrisé

                                </label>

                            </div>

                        `
                    )
                    .join("")}

                </div>

            </div>


            <div class="card">

                <h2>Jets de sauvegarde</h2>

                <p class="label">

                    Coche les jets de sauvegarde
                    que le personnage maîtrise.

                </p>

                <div class="editor-list">

                    ${Object.entries(ABILITY_NAMES)
                    .map(
                        ([key, name]) => `

                            <div
                                class="
                                    editor-item
                                    ${
                                        c.savingThrows[key]
                                        ? "mastered"
                                        : ""
                                    }
                                "
                            >

                                <div>

                                    <strong class="skill-name">
                                        <img
                                            src="icons/${key}.png"
                                            class="skill-icon"
                                            alt=""
                                        >
                                        ${esc(name)}

                                        ${abilityShortName(key)}
                                    </strong>


                                </div>

                                <label class="checkbox-row">

                                    <input
                                        type="checkbox"
                                        id="save_${key}"
                                        ${
                                            c.savingThrows[key]
                                            ? "checked"
                                            : ""
                                        }
                                    >

                                    Maîtrisé

                                </label>

                            </div>

                        `
                    )
                    .join("")}

                </div>

            </div>


            ${renderResistanceEditor(c.resistances)}


            <div class="card">

                <h2>Maîtrises & Langues</h2>

                <div class="form-row">

                    <div class="field">

                        <label>
                            Maîtrises (armures, armes, outils)
                        </label>

                        <div
                            id="list_charProficiencies"
                            class="list-editor"
                        ></div>

                        <button onclick="addListItem('charProficiencies')">
                            + Ajouter une maîtrise
                        </button>

                    </div>


                    <div class="field">

                        <label>Langues</label>

                        <div
                            id="list_charLanguages"
                            class="list-editor"
                        ></div>

                        <button onclick="addListItem('charLanguages')">
                            + Ajouter une langue
                        </button>

                    </div>

                </div>

            </div>


            <div class="card">

                <h2>Personnage</h2>

                <div class="form-row form-row-3">

                    ${[
                        ["age", "Âge"],
                        ["height", "Taille"],
                        ["weight", "Poids"],
                        ["eyes", "Yeux"],
                        ["skin", "Peau"],
                        ["hair", "Cheveux"]
                    ]
                    .map(
                        ([id, label]) => `
                            <div class="field">

                                <label>${label}</label>

                                <input
                                    id="det_${id}"
                                    value="${esc(c.details[id])}"
                                >

                            </div>
                        `
                    )
                    .join("")}

                </div>


                <div class="form-row">

                    ${[
                        ["traits", "Traits de personnalité"],
                        ["ideals", "Idéaux"],
                        ["bonds", "Liens"],
                        ["flaws", "Défauts"]
                    ]
                    .map(
                        ([id, label]) => `
                            <div class="field">

                                <label>${label}</label>

                                <textarea
                                    id="pers_${id}"
                                >${esc(c.personality[id])}</textarea>

                            </div>
                        `
                    )
                    .join("")}

                </div>


                <div class="field">

                    <label>Histoire</label>

                    <textarea
                        id="backstory"
                        class="tall"
                    >${esc(c.backstory)}</textarea>

                </div>

            </div>


            <div class="card">

                <h2>Inventaire</h2>

                <div class="form-row form-row-3">

                    ${[
                        ["po", "Pièces d'or"],
                        ["pa", "Pièces d'argent"],
                        ["pc", "Pièces de cuivre"]
                    ]
                    .map(
                        ([id, label]) => `
                            <div class="field">

                                <label>${label}</label>

                                <input
                                    id="money_${id}"
                                    type="number"
                                    min="0"
                                    value="${c.money[id]}"
                                >

                            </div>
                        `
                    )
                    .join("")}

                </div>

                <div
                    id="editorInventory"
                    class="editor-list editor-list-single"
                ></div>

                <button onclick="addInventoryItem()">
                    + Ajouter un objet
                </button>

            </div>


            <div class="card">

                <h2>Emplacements de sorts</h2>

                ${[
                    1,2,3,4,5,6,7,8,9
                ]
                .map(
                    n => `

                        <div class="form-row">

                            <div class="field">

                                <label>
                                    Niveau ${n} — maximum
                                </label>

                                <input
                                    id="sm_${n}"
                                    type="number"
                                    min="0"
                                    value="${c.slots[n].max}"
                                >

                            </div>

                            <div class="field">

                                <label>
                                    Déjà utilisés
                                </label>

                                <input
                                    id="su_${n}"
                                    type="number"
                                    min="0"
                                    value="${c.slots[n].used}"
                                >

                            </div>

                        </div>

                    `
                )
                .join("")}

            </div>


            <div class="card">

                <h2>
                    Actions, armes et sorts
                </h2>

                <div
                    id="editorActions"
                    class="editor-list"
                ></div>

                <button onclick="addActionForm()">
                    + Ajouter une action
                </button>

            </div>


            <button
                class="primary"
                onclick="createFromEditor()"
            >
                Créer la fiche
            </button>

        </div>

    `;

    renderListEditor("charProficiencies");

    renderListEditor("charLanguages");

    renderInventoryEditor();

    renderEditorActions();
}


/* =========================================================
   RESISTANCE EDITOR
   ========================================================= */

function renderResistanceEditor(resistances) {

    return `

        <div class="card">

            <h2>Résistances</h2>

            <p class="label">

                Définis l'état de chaque type de dégâts.

            </p>

            <div class="resist-editor">

                ${Object.entries(DAMAGE_TYPES)
                .map(
                    ([key, name]) => `

                        <div class="field">

                            <label class="resist-label">

                                <img
                                    src="icons/resistances/${key}.png"
                                    class="resist-icon"
                                    alt=""
                                >

                                ${name}

                            </label>

                            <select id="res_${key}">

                                ${Object.entries(RESISTANCE_STATES)
                                .map(
                                    ([state, stateName]) => `
                                        <option
                                            value="${state}"
                                            ${
                                                resistances[key] === state
                                                ? "selected"
                                                : ""
                                            }
                                        >
                                            ${stateName}
                                        </option>
                                    `
                                )
                                .join("")}

                            </select>

                        </div>

                    `
                )
                .join("")}

            </div>

        </div>

    `;
}


function readResistanceEditor(resistances) {

    Object.keys(DAMAGE_TYPES).forEach(key => {

        const el =
            document.getElementById("res_" + key);

        if (el) {
            resistances[key] = el.value;
        }

    });
}


/* =========================================================
   INVENTORY EDITOR
   ========================================================= */

function addInventoryItem() {

    character.inventory.push({

        name: "Nouvel objet",

        quantity: 1,

        weight: 0,

        equipped: false,

        description: ""

    });

    renderInventoryEditor();
}


function renderInventoryEditor() {

    const el =
        document.getElementById("editorInventory");

    if (!el) {
        return;
    }

    el.innerHTML =
        character.inventory
        .map(
            (item, i) => `

                <div class="editor-item">

                    <div class="form-row form-row-3">

                        <div class="field">

                            <label>Nom</label>

                            <input
                                data-i="${i}"
                                data-k="name"
                                value="${esc(item.name)}"
                            >

                        </div>

                        <div class="field">

                            <label>Quantité</label>

                            <input
                                data-i="${i}"
                                data-k="quantity"
                                type="number"
                                min="0"
                                value="${item.quantity}"
                            >

                        </div>

                        <div class="field">

                            <label>Poids (kg)</label>

                            <input
                                data-i="${i}"
                                data-k="weight"
                                type="number"
                                min="0"
                                step="0.1"
                                value="${item.weight}"
                            >

                        </div>

                    </div>


                    <label class="checkbox-row">

                        <input
                            type="checkbox"
                            data-i="${i}"
                            data-k="equipped"
                            ${
                                item.equipped
                                ? "checked"
                                : ""
                            }
                        >

                        Équipé

                    </label>


                    <div class="field">

                        <label>Description</label>

                        <textarea
                            data-i="${i}"
                            data-k="description"
                        >${esc(item.description)}</textarea>

                    </div>


                    <button
                        class="danger"
                        onclick="
                            character.inventory.splice(${i}, 1);
                            renderInventoryEditor();
                        "
                    >
                        Supprimer
                    </button>

                </div>

            `
        )
        .join("");


    el
        .querySelectorAll("[data-i][data-k]")
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    const item =
                        character.inventory[
                            Number(input.dataset.i)
                        ];

                    const key = input.dataset.k;

                    if (input.type === "checkbox") {

                        item[key] = input.checked;

                    } else if (input.type === "number") {

                        item[key] = Number(input.value);

                    } else {

                        item[key] = input.value;

                    }

                }
            );

        });
}


/* =========================================================
   ACTION FORM
   ========================================================= */

function addActionForm() {

    character.actions.push({

        name: "Nouvelle action",

        cost: "Action",

        type: "Action de Classe",

        level: "",

        damage: "",

        description: "",

        weaponAbility: "force",

        weaponFinesse: false,

        spellAbility:
            character.spellAbility,

        image: "",

        castingTime: "",
        range: "",
        components: "",
        duration: ""

    });

    renderEditorActions();
}


function renderEditorActions() {

    const el =
        document.getElementById(
            "editorActions"
        );

    if (!el) {
        return;
    }

    el.innerHTML =
        character.actions
        .map(
            (x, i) => `

                <div class="editor-item">

                    <div class="form-row">

                        <div class="field">

                            <label>Nom</label>

                            <input
                                data-a="${i}"
                                data-k="name"
                                value="${esc(x.name)}"
                            >

                        </div>


                        <div class="field">

                            <label>Type</label>

                            <select
                                data-a="${i}"
                                data-k="type"
                                onchange="
                                    character.actions[${i}].type = this.value;
                                    renderEditorActions();
                                "
                            >

                                ${ACTION_TYPES
                                .map(
                                    type => `
                                        <option
                                            value="${type}"
                                            ${
                                                x.type === type
                                                ? "selected"
                                                : ""
                                            }
                                        >
                                            ${type}
                                        </option>
                                    `
                                )
                                .join("")}

                            </select>

                        </div>


                        <div class="field">

                            <label>Coût</label>

                            <select
                                data-a="${i}"
                                data-k="cost"
                            >

                                ${ACTION_COSTS
                                .map(
                                    cost => `
                                        <option
                                            value="${cost}"
                                            ${
                                                x.cost === cost
                                                ? "selected"
                                                : ""
                                            }
                                        >
                                            ${cost}
                                        </option>
                                    `
                                )
                                .join("")}

                            </select>

                        </div>


                        ${
                            x.type === "Sort"
                            ?
                            `

                                <div class="field">

                                    <label>
                                        Niveau de sort
                                    </label>

                                    <input
                                        data-a="${i}"
                                        data-k="level"
                                        type="number"
                                        min="0"
                                        value="${x.level || 0}"
                                    >

                                </div>

                            `
                            :
                            ""
                        }


                        <div class="field">

                            <label>Dégâts</label>

                            <input
                                data-a="${i}"
                                data-k="damage"
                                placeholder="1d8 + 3"
                                value="${esc(x.damage)}"
                            >

                        </div>


                        <div class="field">

                            <label>Image</label>

                            <input
                                type="file"
                                accept="image/*"
                                onchange="
                                    handleImageUpload(
                                        ${i},
                                        this
                                    )
                                "
                            >

                            ${
                                x.image
                                ?
                                `
                                    <div class="image-preview">

                                        <img
                                            src="${x.image}"
                                        >

                                    </div>
                                `
                                :
                                ""
                            }

                        </div>


                        <div
                            class="field"
                            style="grid-column:1/-1"
                        >

                            <label>Description</label>

                            <textarea
                                data-a="${i}"
                                data-k="description"
                            >${esc(x.description)}</textarea>

                        </div>

                    </div>


                    ${
                        x.type === "Arme"
                        ?
                        `

                            <div class="card">

                                <h3>
                                    Configuration de l'arme
                                </h3>

                                <div class="form-row">

                                    <div class="field">

                                        <label>
                                            Caractéristique
                                        </label>

                                        <select
                                            data-a="${i}"
                                            data-k="weaponAbility"
                                        >

                                            <option
                                                value="force"
                                                ${
                                                    x.weaponAbility === "force"
                                                    ? "selected"
                                                    : ""
                                                }
                                            >
                                                Force
                                            </option>

                                            <option
                                                value="dexterite"
                                                ${
                                                    x.weaponAbility === "dexterite"
                                                    ? "selected"
                                                    : ""
                                                }
                                            >
                                                Dextérité
                                            </option>

                                        </select>

                                    </div>


                                    <label class="checkbox-row">

                                        <input
                                            type="checkbox"
                                            data-a="${i}"
                                            data-k="weaponFinesse"
                                            ${
                                                x.weaponFinesse
                                                ? "checked"
                                                : ""
                                            }
                                        >

                                        Arme de finesse

                                    </label>

                                </div>

                            </div>

                        `
                        :
                        ""
                    }


                    ${
                        x.type === "Sort"
                        ?
                        `

                            <div class="card">

                                <h3>
                                    Configuration du sort
                                </h3>

                                <div class="form-row">

                                    <div class="field">

                                        <label>
                                            Caractéristique magique
                                        </label>

                                        <select
                                            data-a="${i}"
                                            data-k="spellAbility"
                                        >

                                            ${Object.entries(
                                                ABILITY_NAMES
                                            )
                                            .map(
                                                ([key, name]) => `
                                                    <option
                                                        value="${key}"
                                                        ${
                                                            x.spellAbility === key
                                                            ? "selected"
                                                            : ""
                                                        }
                                                    >
                                                        ${name}
                                                    </option>
                                                `
                                            )
                                            .join("")}

                                        </select>

                                    </div>


                                    <div class="field">

                                        <label>
                                            Temps d'incantation
                                        </label>

                                        <input
                                            data-a="${i}"
                                            data-k="castingTime"
                                            placeholder="1 action"
                                            value="${esc(x.castingTime)}"
                                        >

                                    </div>


                                    <div class="field">

                                        <label>
                                            Portée
                                        </label>

                                        <input
                                            data-a="${i}"
                                            data-k="range"
                                            placeholder="18 mètres"
                                            value="${esc(x.range)}"
                                        >

                                    </div>


                                    <div class="field">

                                        <label>
                                            Composantes
                                        </label>

                                        <input
                                            data-a="${i}"
                                            data-k="components"
                                            placeholder="V, S, M"
                                            value="${esc(x.components)}"
                                        >

                                    </div>


                                    <div class="field">

                                        <label>
                                            Durée
                                        </label>

                                        <input
                                            data-a="${i}"
                                            data-k="duration"
                                            placeholder="Instantanée"
                                            value="${esc(x.duration)}"
                                        >

                                    </div>

                                </div>

                            </div>

                        `
                        :
                        ""
                    }


                    <button
                        class="danger"
                        onclick="
                            character.actions.splice(
                                ${i},
                                1
                            );

                            renderEditorActions();
                        "
                    >
                        Supprimer
                    </button>

                </div>

            `
        )
        .join("");


    el
        .querySelectorAll("[data-a][data-k]")
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    const i =
                        Number(
                            input.dataset.a
                        );

                    const key =
                        input.dataset.k;

                    if (
                        input.type === "checkbox"
                    ) {

                        character.actions[i][key] =
                            input.checked;

                    } else {

                        character.actions[i][key] =
                            input.value;

                    }

                }
            );

        });
}


/* =========================================================
   EDITOR - IMAGE
   ========================================================= */

function handleImageUpload(index, input) {

    const file =
        input.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith("image/")
    ) {

        alert(
            "Le fichier doit être une image."
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = () => {

        character.actions[index].image =
            reader.result;

        renderEditorActions();

    };

    reader.readAsDataURL(file);
}


/* =========================================================
   EDITOR - CONFIRMATION
   ========================================================= */

function createFromEditor() {

    const ids = [
        "name",
        "race",
        "className",
        "level",
        "hpMax",
        "hp",
        "ac",
        "initiative",
        "speed"
    ];

    ids.forEach(id => {

        const el =
            document.getElementById(id);

        if (!el) {
            return;
        }

        character[id] =
            el.type === "number"
                ? Number(el.value)
                : el.value;

    });


    character.proficiencyBonus =
        Number(
            document.getElementById(
                "proficiencyBonus"
            ).value
        );


    character.spellAbility =
        document.getElementById(
            "spellAbility"
        ).value;


    Object.keys(
        character.abilities
    )
    .forEach(key => {

        character.abilities[key] =
            Number(
                document.getElementById(
                    "ab_" + key
                ).value
            );

    });


    Object.keys(
        character.skills
    )
    .forEach(skill => {

        const checkbox =
            document.getElementById(
                "mastery_" + skill
            );

        if (checkbox) {

            character.skills[
                skill
            ].proficient =
                checkbox.checked;

        }

    });


    Object.keys(
        character.savingThrows
    )
    .forEach(ability => {

        const checkbox =
            document.getElementById(
                "save_" + ability
            );

        character.savingThrows[ability] =
            checkbox
                ? checkbox.checked
                : false;

    });


    readResistanceEditor(character.resistances);


    Object.keys(character.details).forEach(key => {

        const el =
            document.getElementById("det_" + key);

        if (el) {
            character.details[key] = el.value;
        }

    });


    Object.keys(character.personality).forEach(key => {

        const el =
            document.getElementById("pers_" + key);

        if (el) {
            character.personality[key] = el.value;
        }

    });


    character.backstory =
        document.getElementById("backstory").value;


    Object.keys(character.money).forEach(key => {

        const el =
            document.getElementById("money_" + key);

        if (el) {
            character.money[key] = Number(el.value);
        }

    });


    character.proficiencies =
        character.proficiencies.filter(
            value => value.trim() !== ""
        );

    character.languages =
        character.languages.filter(
            value => value.trim() !== ""
        );


    for (
        let n = 1;
        n <= 9;
        n++
    ) {

        character.slots[n].max =
            Number(
                document.getElementById(
                    "sm_" + n
                ).value
            );

        character.slots[n].used =
            Number(
                document.getElementById(
                    "su_" + n
                ).value
            );

    }


    if (
        !character.name.trim()
    ) {

        alert(
            "Le personnage doit avoir un nom."
        );

        return;
    }


    normalize();

    currentPage = "skills";

    spellFilterLevel = 0;

    sheet();
}


/* =========================================================
   SHEET - GLOBAL FORM
   ========================================================= */

function sheet() {

    normalize();

    const c = character;

    app.innerHTML = `

        <div class="app">

            <div class="character-header ${headerCollapsed ? "collapsed" : ""}">

                <header>

                    <button
                        class="damage-toggle"
                        onclick="openDamageRoller()"
                    >
                        Dégâts
                    </button>

                    <img
                        src="icons/${c.className}.png"
                        class="class-icon"
                        alt=""
                    >

                    <div class="header-info">

                        <h1>
                            ${esc(c.name)}
                        </h1>

                        <p>

                            ${esc(c.race || "•")}

                            ·

                            ${esc(c.className || "•")}

                            ·

                            Niveau ${c.level}

                        </p>

                    </div>


                    <div class="header-actions">

                        <button onclick="editor()">
                            Modifier
                        </button>

                        <button
                            class="primary"
                            onclick="saveFile()"
                        >
                            Sauvegarder
                        </button>

                        <button onclick="home()">
                            Accueil
                        </button>

                    </div>

                </header>


                <button
                    class="collapse-toggle"
                    onclick="toggleHeaderCollapse()"
                >
                    ${
                        headerCollapsed
                        ? "▼ Afficher PV / Carac. / Sauvegardes"
                        : "▲ Réduire PV / Carac. / Sauvegardes"
                    }
                </button>


                <div class="sheet-stats">

                <div class="character-bar">

                    <div
                        class="character-stat hp-stat"
                        onclick="openHpEditor()"
                    >

                        <span>PV</span>

                        <strong class="hp-display">

                            ${c.hp}/${c.hpMax}

                            ${
                                c.tempHp > 0
                                ? `<div class="temp-hp">+${c.tempHp}</div>`
                                : ""
                            }

                        </strong>

                    </div>

                    <div class="character-stat">
                        <span>CA</span>
                        <strong>${c.ac}</strong>
                    </div>

                    <div class="character-stat">
                        <span>Initiative</span>
                        <strong>
                            ${fmt(c.initiative)}
                        </strong>
                    </div>

                    <div class="character-stat">
                        <span>Vitesse</span>
                        <strong>
                            ${c.speed} m
                        </strong>
                    </div>

                </div>


                <div class="character-abilities">

                    ${Object.entries(ABILITIES)
                    .map(
                        ([key, short]) => {

                            const value = c.abilities[key];

                            const modifier =
                                Math.floor((value - 10) / 2);

                            const savingThrowMastered =
                                c.savingThrows[key];

                            return `

                                <div
                                    class="
                                        character-ability
                                        ${savingThrowMastered
                                            ? "ability-mastered"
                                            : ""
                                        }
                                    "
                                >

                                    <span class="ability-name">
                                        ${short}
                                    </span>

                                    <img
                                        class="ability-image"
                                        src="icons/${key}.png"
                                        alt=""
                                    >

                                    <strong class="ability-value">
                                        ${value}
                                    </strong>

                                    <p class="ability-bonus">
                                        ${fmt(modifier)}
                                    </p>

                                </div>

                            `;

                        }
                    )
                    .join("")}

                </div>

                </div>


                <div class="page-nav">

                    <button
                        class="${currentPage === "skills" ? "active" : ""}"
                        onclick="changePage('skills')"
                    >
                        Compétences
                    </button>

                    <button
                        class="${currentPage === "actions" ? "active" : ""}"
                        onclick="changePage('actions')"
                    >
                        Actions
                    </button>

                    <button
                        class="${currentPage === "traits" ? "active" : ""}"
                        onclick="changePage('traits')"
                    >
                        Trait notable
                    </button>

                    <button
                        class="${currentPage === "spells" ? "active" : ""}"
                        onclick="changePage('spells')"
                    >
                        Sorts
                    </button>

                    <button
                        class="${currentPage === "inventory" ? "active" : ""}"
                        onclick="changePage('inventory')"
                    >
                        Inventaire
                    </button>

                    <button
                        class="${currentPage === "character" ? "active" : ""}"
                        onclick="changePage('character')"
                    >
                        Personnage
                    </button>

                </div>

            </div>


            <main>
                ${renderCurrentPage()}
            </main>


            <div class="zoom-controls">

                <button onclick="changeZoom(-0.1)">
                    −
                </button>

                <button onclick="resetZoom()">
                    100%
                </button>

                <button onclick="changeZoom(0.1)">
                    +
                </button>

            </div>

        </div>

        <p class="update">
            V8.3
        </p>

    `;
}


/* =========================================================
   SHEET - MINIMIZE HEADER
   ========================================================= */

function toggleHeaderCollapse() {

    headerCollapsed = !headerCollapsed;

    storage.setItem(
        "jdrHeaderCollapsed",
        headerCollapsed ? "1" : "0"
    );

    if (companion) {

        companionSheet();

        return;
    }

    sheet();
}


/* =========================================================
   SHEET — CHANGE PAGE
   ========================================================= */

function changePage(page) {

    currentPage = page;

    if (page !== "spells") {
        spellFilterLevel = 0;
    }

    sheet();
}


function renderCurrentPage() {

    switch (currentPage) {

        case "skills":
            return renderSkillsPage();

        case "actions":
            return renderActionsPage();

        case "traits":
            return renderTraitsPage();

        case "spells":
            return renderSpellsPage();

        case "inventory":
            return renderInventoryPage();

        case "character":
            return renderCharacterPage();

        default:
            return renderSkillsPage();

    }
}


/* =========================================================
   SHEET — SAVING THROW
   ========================================================= */

function getSavingThrowBonus(ability) {

    let bonus =
        getAbilityModifier(ability);

    if (
        character.savingThrows[ability]
    ) {

        bonus += Number(
            character.proficiencyBonus || 0
        );

    }

    return bonus;
}


function rollSavingThrow(
    ability,
    name
) {

    const bonus =
        getSavingThrowBonus(
            ability
        );

    const d =
        Math.floor(
            Math.random() * 20
        ) + 1;

    const total =
        d + bonus;

    showResult(
        `${name} : ${d} + ${fmt(bonus)} = ${total}`
    );
}


/* =========================================================
   SHEET — PV TEMPO
   ========================================================= */

function openHpEditor() {

    openHpEditorFor(character, "saveHpEditor()");
}


function openCompanionHpEditor() {

    openHpEditorFor(companion, "saveCompanionHpEditor()");
}


function openHpEditorFor(target, saveCall) {

    const currentHp = target.hp ?? target.hpMax;
    const tempHp = target.tempHp ?? 0;

    const overlay = document.createElement("div");

    overlay.className = "hp-editor-overlay";

    overlay.innerHTML = `

        <div class="hp-editor">

            <h2>Modifier les PV</h2>

            <div class="hp-field">

                <label for="edit-current-hp">
                    PV actuels
                </label>

                <input
                    id="edit-current-hp"
                    type="number"
                    min="0"
                    max="${target.hpMax}"
                    value="${currentHp}"
                >

                <small>
                    Maximum : ${target.hpMax}
                </small>

            </div>


            <div class="hp-field">

                <label for="edit-temp-hp">
                    PV temporaires
                </label>

                <input
                    id="edit-temp-hp"
                    type="number"
                    min="0"
                    value="${tempHp}"
                >

            </div>


            <div class="hp-editor-actions">

                <button
                    onclick="closeHpEditor()"
                >
                    Annuler
                </button>

                <button
                    class="primary"
                    onclick="${saveCall}"
                >
                    Valider
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);
}


function readHpEditor(target) {

    let hp =
        Number(
            document.getElementById("edit-current-hp").value
        );

    let tempHp =
        Number(
            document.getElementById("edit-temp-hp").value
        );

    if (!Number.isFinite(hp)) {
        hp = target.hpMax;
    }

    if (!Number.isFinite(tempHp)) {
        tempHp = 0;
    }

    target.hp = Math.max(0, Math.min(hp, target.hpMax));

    target.tempHp = Math.max(0, tempHp);

    closeHpEditor();
}


function saveHpEditor() {

    readHpEditor(character);

    sheet();
}


function saveCompanionHpEditor() {

    readHpEditor(companion);

    companionSheet();
}


function closeHpEditor() {

    const overlay =
        document.querySelector(".hp-editor-overlay");

    if (overlay) {
        overlay.remove();
    }

}


/* =========================================================
   SHEET — ZOOM
   ========================================================= */

function applyZoom() {

    zoom =
        Math.max(
            0.7,
            Math.min(
                1.5,
                zoom
            )
        );

    document.documentElement
        .style
        .setProperty(
            "--zoom",
            zoom
        );

    storage.setItem(
        "jdrZoom",
        zoom
    );
}


function changeZoom(amount) {

    zoom += amount;

    zoom =
        Math.round(
            zoom * 10
        ) / 10;

    applyZoom();
}


function resetZoom() {

    zoom = 1;

    applyZoom();
}


/* =========================================================
   SKILL PAGE
   ========================================================= */

function renderSkillsPage() {

    const c = character;

    return `

        <div class="card">

            <h2>Compétences</h2>

            <p class="label">

                Bonus de maîtrise :
                <strong>
                    ${fmt(c.proficiencyBonus)}
                </strong>

            </p>

            <div class="skills">

                ${Object.entries(c.skills)
                .map(
                    ([name, skill]) => {

                        const bonus =
                            getSkillBonus(name);

                        return `

                            <button
                                class="
                                    skill
                                    ${
                                        skill.proficient
                                        ? "skill-mastered"
                                        : ""
                                    }
                                "
                            >

                                <span class="skill-info">

                                    <strong class="skill-name">
                                        <img
                                            src="icons/${name}.png"
                                            class="skill-icon"
                                            alt=""
                                        >
                                        ${esc(name)}
                                    </strong>

                                    <small>
                                        ${abilityShortName(
                                            skill.ability
                                        )}
                                    </small>

                                </span>

                                <b>
                                    ${fmt(bonus)}
                                </b>

                            </button>

                        `;

                    }
                )
                .join("")}

            </div>

        </div>

    `;
}


function getSkillBonus(skillName) {

    const skill =
        character.skills[skillName];

    if (!skill) {
        return 0;
    }

    let bonus =
        getAbilityModifier(
            skill.ability
        );

    if (skill.proficient) {

        bonus += Number(
            character.proficiencyBonus
        );

    }

    return bonus;
}


function rollSkill(skillName) {

    const bonus =
        getSkillBonus(skillName);

    const d =
        Math.floor(
            Math.random() * 20
        ) + 1;

    showResult(
        `${skillName} : ${d} + ${fmt(bonus)} = ${d + bonus}`
    );
}


/* =========================================================
   ACTIONS PAGE
   ========================================================= */

function renderActionsPage() {

    const actions =
        character.actions.filter(
            x => x.type !== "Sort"
        );

    return `

        ${renderActionIsland(
            "Actions",
            actions.filter(x => x.cost === "Action")
        )}

        ${renderActionIsland(
            "Actions bonus",
            actions.filter(x => x.cost === "Action bonus")
        )}

        ${renderActionIsland(
            "Réactions",
            actions.filter(x => x.cost === "Réaction")
        )}

    `;
}


function renderActionIsland(title, actions) {

    return `

        <div class="card">

            <h2>${title}</h2>

            ${
                actions.length
                ?
                `<div class="actions">

                    ${actions
                    .map(
                        x => renderActionCard(x)
                    )
                    .join("")}

                </div>`
                :
                `<p class="label">
                    Aucune entrée.
                </p>`
            }

        </div>

    `;
}


/* =========================================================
   TRAITS PAGE
   ========================================================= */

function renderTraitsPage() {

    const c = character;

    const passives =
        c.actions.filter(
            x => x.cost === "Passif"
        );

    const traits =
        c.actions.filter(
            x =>
                x.type === "Trait notable" &&
                x.cost !== "Passif"
        );

    return `

        ${renderResistanceIsland(c.resistances)}

        ${renderActionIsland("Passifs", passives)}

        ${
            traits.length
            ? renderActionIsland("Traits notables", traits)
            : ""
        }

        <div class="card">

            <h2>Maîtrises & Langues</h2>

            <div class="tag-columns">

                <div>

                    <h3>Maîtrises</h3>

                    ${renderTagList(c.proficiencies)}

                </div>

                <div>

                    <h3>Langues</h3>

                    ${renderTagList(c.languages)}

                </div>

            </div>

        </div>

    `;
}


function renderTagList(list) {

    if (!list.length) {

        return `<p class="label">Aucune entrée.</p>`;
    }

    return `

        <div class="tag-list">

            ${list
            .map(
                value => `
                    <span class="tag">
                        ${esc(value)}
                    </span>
                `
            )
            .join("")}

        </div>

    `;
}


/* =========================================================
   RESISTANCE ISLAND
   ========================================================= */

function renderResistanceIsland(resistances) {

    const entries =
        Object.entries(resistances)
            .filter(
                ([, state]) =>
                    state && state !== "aucun"
            );

    if (!entries.length) {
        return "";
    }

    return `

        <div class="card">

            <h2>Résistances</h2>

            <div class="resist-grid">

                ${entries
                .map(
                    ([key, state]) => `

                        <div class="resist-case resist-${state}">

                            <img
                                src="icons/resistances/${key}.png"
                                class="resist-icon"
                                alt=""
                            >

                            <strong>
                                ${DAMAGE_TYPES[key] || key}
                            </strong>

                            <small>
                                ${RESISTANCE_STATES[state]}
                            </small>

                        </div>

                    `
                )
                .join("")}

            </div>

        </div>

    `;
}


/* =========================================================
   INVENTORY PAGE
   ========================================================= */

function renderInventoryPage() {

    const c = character;

    const totalWeight =
        c.inventory.reduce(
            (total, item) =>
                total +
                Number(item.weight || 0) *
                Number(item.quantity || 0),
            0
        );

    return `

        <div class="card">

            <h2>Bourse</h2>

            <div class="money-grid">

                <div class="money">
                    <span>Or</span>
                    <strong>${c.money.po}</strong>
                </div>

                <div class="money">
                    <span>Argent</span>
                    <strong>${c.money.pa}</strong>
                </div>

                <div class="money">
                    <span>Cuivre</span>
                    <strong>${c.money.pc}</strong>
                </div>

            </div>

        </div>


        <div class="card">

            <h2>Inventaire</h2>

            <p class="label">

                Poids total :
                <strong>
                    ${Math.round(totalWeight * 10) / 10} kg
                </strong>

            </p>

            ${
                c.inventory.length
                ?
                `<div class="inventory-list">

                    ${c.inventory
                    .map(
                        (item, i) => `

                            <div
                                class="
                                    inventory-item
                                    ${item.equipped ? "equipped" : ""}
                                "
                            >

                                <div class="inventory-info">

                                    <strong>
                                        ${esc(item.name)}
                                        ${
                                            item.equipped
                                            ? `<span class="mastery-badge">Équipé</span>`
                                            : ""
                                        }
                                    </strong>

                                    <small>
                                        ${
                                            Number(item.weight) > 0
                                            ? `${item.weight} kg · `
                                            : ""
                                        }
                                        ${esc(item.description || "—")}
                                    </small>

                                </div>

                                <div class="inventory-quantity">

                                    <button onclick="changeItemQuantity(${i}, -1)">
                                        −
                                    </button>

                                    <b>${item.quantity}</b>

                                    <button onclick="changeItemQuantity(${i}, 1)">
                                        +
                                    </button>

                                </div>

                            </div>

                        `
                    )
                    .join("")}

                </div>`
                :
                `<p class="label">
                    Aucun objet.
                </p>`
            }

        </div>

    `;
}


function changeItemQuantity(index, amount) {

    const item =
        character.inventory[index];

    if (!item) {
        return;
    }

    item.quantity =
        Math.max(
            0,
            Number(item.quantity || 0) + amount
        );

    sheet();
}


/* =========================================================
   CHARACTER PAGE
   ========================================================= */

function renderCharacterPage() {

    const c = character;

    return `

        <div class="card">

            <h2>Personnalité</h2>

            <div class="text-blocks">

                ${[
                    ["traits", "Traits de personnalité"],
                    ["ideals", "Idéaux"],
                    ["bonds", "Liens"],
                    ["flaws", "Défauts"]
                ]
                .map(
                    ([key, label]) => `

                        <div class="text-block">

                            <h3>${label}</h3>

                            <p>
                                ${esc(c.personality[key] || "-")}
                            </p>

                        </div>

                    `
                )
                .join("")}

            </div>

        </div>


        <div class="card">

            <h2>Description</h2>

            <div class="info-grid">

                ${[
                    ["age", "Âge"],
                    ["height", "Taille"],
                    ["weight", "Poids"],
                    ["eyes", "Yeux"],
                    ["skin", "Peau"],
                    ["hair", "Cheveux"]
                ]
                .map(
                    ([key, label]) => `

                        <div class="info-box">

                            <span>${label}</span>

                            <strong>
                                ${esc(
                                    c.details[key] || "—"
                                )}
                            </strong>

                        </div>

                    `
                )
                .join("")}

            </div>

        </div>


        <div class="card">

            <h2>Histoire</h2>

            <p class="story">
                ${esc(c.backstory || "-")}
            </p>

        </div>

    `;
}


/* =========================================================
   SPELL PAGE
   ========================================================= */

function renderSpellsPage() {

    const allSpells =
        sortActions(
            character.actions.filter(
                x =>
                    x.type === "Sort"
            )
        );

    const spells =
        spellFilterLevel === 0
            ? allSpells
            : allSpells.filter(
                spell =>
                    Number(spell.level || 0) === spellFilterLevel
            );


    return `

        <div class="card">

            <h2>Sorts</h2>

            <div class="resources">

                <div class="resource">

                    DD des sorts

                    <b>
                        ${getSpellSaveDC()}
                    </b>

                </div>

                <div class="resource">

                    Attaque de sort

                    <b>
                        ${fmt(
                            getSpellAttackBonus()
                        )}
                    </b>

                </div>

                <div class="resource">

                    Bonus de maîtrise

                    <b>
                        ${fmt(
                            character.proficiencyBonus
                        )}
                    </b>

                </div>

            </div>

            ${renderSpellSlots()}


            <div class="spell-filter">

                <label for="spellFilter">
                    Afficher les sorts
                </label>

                <select
                    id="spellFilter"
                    onchange="
                        spellFilterLevel = Number(this.value);
                        sheet();
                    "
                >

                    <option
                        value="0"
                        ${
                            spellFilterLevel === 0
                            ? "selected"
                            : ""
                        }
                    >
                        Tous les sorts
                    </option>


                    ${[1,2,3,4,5,6,7,8,9]
                    .map(
                        n => `
                            <option
                                value="${n}"
                                ${
                                    spellFilterLevel === n
                                    ? "selected"
                                    : ""
                                }
                            >
                                Niveau ${n}
                            </option>
                        `
                    )
                    .join("")}

                </select>

            </div>

        </div>


        ${
            spells.length
            ?
            spells
                .map(
                    spell =>
                        renderSpellCard(spell)
                )
                .join("")
            :
            `<div class="card">
                <p>
                    ${
                        spellFilterLevel > 0
                        ? `Aucun sort de niveau ${spellFilterLevel}.`
                        : "Aucun sort."
                    }
                </p>
            </div>`
        }

        ${renderDice()}

    `;
}


function renderSpellCard(x) {

    const index =
        character.actions.indexOf(x);

    return `

        <div class="card spell-card">

            <div class="spell-image">

                ${
                    x.image
                    ?
                    `
                        <img
                            src="${x.image}"
                            alt=""
                        >
                    `
                    :
                    `<span></span>`
                }

            </div>


            <div class="spell-info">

                <h3>
                    ${esc(x.name)}
                </h3>

                <div class="spell-meta">

                    ${esc(x.cost)}

                    ${
                        x.level &&
                        Number(x.level) > 0
                        ?
                        " · Niveau " + x.level
                        :
                        ""
                    }

                </div>

                <div class="spell-details">

                    ${
                        x.castingTime
                        ?
                        `
                            <div>
                                <strong>
                                    Temps d'incantation
                                </strong>
                                <span>
                                    ${esc(x.castingTime)}
                                </span>
                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        x.range
                        ?
                        `
                            <div>
                                <strong>
                                    Portée
                                </strong>
                                <span>
                                    ${esc(x.range)}
                                </span>
                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        x.components
                        ?
                        `
                            <div>
                                <strong>
                                    Composantes
                                </strong>
                                <span>
                                    ${esc(x.components)}
                                </span>
                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        x.duration
                        ?
                        `
                            <div>
                                <strong>
                                    Durée
                                </strong>
                                <span>
                                    ${esc(x.duration)}
                                </span>
                            </div>
                        `
                        :
                        ""
                    }

                </div>


                ${
                    x.damage
                    ?
                    `<div class="damage">
                        ${esc(x.damage)}
                    </div>`
                    :
                    ""
                }

                <button
                    class="primary"
                    onclick="showAction(${index})"
                >
                    Ouvrir
                </button>

            </div>

        </div>

    `;
}


function renderSpellSlots() {

    const c = character;

    return `

        <div class="card spell-slots-card">

            <h2>
                Emplacements de sorts
            </h2>

            <div class="slots">

                ${
                    [1,2,3,4,5,6,7,8,9]
                    .filter(
                        n =>
                            c.slots[n].max > 0
                    )
                    .map(
                        n => `

                            <div>

                                <span>
                                    Niveau ${n}
                                </span>

                                <div class="slot-row">

                                    ${
                                        Array.from(
                                            {
                                                length:
                                                    c.slots[n].max
                                            },
                                            (_, i) => `

                                                <button
                                                    class="
                                                        slot
                                                        ${
                                                            i >= c.slots[n].max - c.slots[n].used
                                                            ? "used"
                                                            : ""
                                                        }
                                                    "
                                                    onclick="
                                                        toggleSlot(
                                                            ${n},
                                                            ${i}
                                                        )
                                                    "
                                                ></button>

                                            `
                                        )
                                        .join("")
                                    }

                                </div>

                            </div>

                        `
                    )
                    .join("")
                    ||
                    "<p>Aucun emplacement configuré.</p>"
                }

            </div>

        </div>

    `;
}


function toggleSlot(n, i) {

    const s = character.slots[n];

    const usedFromRight =
        s.max - i;

    if (usedFromRight <= s.used) {
        s.used--;
    } else {
        s.used++;
    }

    sheet();
}


/* =========================================================
   DAMAGE ROLLER
   ========================================================= */

let damageDice = {};

let damageBonus = 0;

let damageHistory = [];

let damageTypesOpen = false;


function openDamageRoller() {

    document.getElementById("damageModal")?.remove();

    document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div
            id="damageModal"
            class="modal"
            onclick="closeDamageRoller(event)"
        >

            <div class="modal-content damage-modal">

                <button
                    class="close"
                    onclick="closeDamageRoller()"
                >
                    ×
                </button>

                <h2>Calcul de dégâts</h2>

                <div id="damageBody"></div>

            </div>

        </div>

        `
    );

    renderDamageRoller();
}


function closeDamageRoller(event) {

    if (
        event &&
        event.target.id !== "damageModal"
    ) {
        return;
    }

    damageTypesOpen = false;

    document.getElementById("damageModal")?.remove();
}


function renderDamageRoller() {

    const body =
        document.getElementById("damageBody");

    if (!body) {
        return;
    }

    body.innerHTML = `

        <div class="damage-dice">

            ${DAMAGE_DICE
            .map(
                n => `

                    <button
                        class="
                            damage-die
                            ${
                                damageDice[n]
                                ? "selected"
                                : ""
                            }
                        "
                        onclick="addDamageDie(${n})"
                        oncontextmenu="
                            removeDamageDie(${n});
                            return false;
                        "
                    >

                        d${n}

                        ${
                            damageDice[n]
                            ? `<span class="damage-count">${damageDice[n]}</span>`
                            : ""
                        }

                    </button>

                `
            )
            .join("")}

        </div>


        <div class="damage-bonus">

            <label for="damageBonusInput">
                Bonus
            </label>

            <input
                id="damageBonusInput"
                type="number"
                value="${damageBonus}"
                oninput="damageBonus = Number(this.value) || 0"
            >

        </div>


        <div class="damage-formula">
            ${esc(damageFormula() || "Aucun dé sélectionné")}
        </div>


        <div class="damage-actions">

            <button
                class="primary"
                onclick="toggleDamageTypes()"
            >
                Choisir le type
            </button>

            <button onclick="resetDamageSelection()">
                Réinitialiser
            </button>

        </div>


        ${
            damageTypesOpen
            ?
            `<div class="damage-types">

                ${Object.keys(DAMAGE_TYPES)
                .map(
                    key => `

                        <button
                            class="damage-type"
                            style="
                                border-color: ${DAMAGE_COLORS[key]};
                                color: ${DAMAGE_COLORS[key]};
                            "
                            onclick="rollDamage('${key}')"
                        >

                            <img
                                src="icons/resistances/${key}.png"
                                class="damage-type-icon"
                                alt=""
                            >

                            ${DAMAGE_TYPES[key]}

                        </button>

                    `
                )
                .join("")}

            </div>`
            :
            ""
        }


        <div class="damage-history">

            ${
                damageHistory.length
                ?
                damageHistory
                    .map(
                        entry => `

                            <div
                                class="damage-entry"
                                style="color: ${DAMAGE_COLORS[entry.type]}"
                            >

                                <span class="damage-entry-formula">
                                    ${esc(entry.formula)} =
                                </span>

                                <strong>
                                    ${entry.total}
                                </strong>

                                <span>
                                    ${DAMAGE_TYPES[entry.type]}
                                </span>

                                <img
                                    src="icons/resistances/${entry.type}.png"
                                    class="damage-entry-icon"
                                    alt=""
                                >

                            </div>

                        `
                    )
                    .join("")
                :
                `<p class="label">Aucun calcul.</p>`
            }

        </div>


        <button
            class="danger"
            onclick="clearDamageHistory()"
        >
            Vider l'historique
        </button>

    `;
}


function damageFormula() {

    const parts =
        DAMAGE_DICE
            .filter(n => damageDice[n])
            .map(n => `${damageDice[n]}d${n}`);

    if (!parts.length) {
        return "";
    }

    return (
        parts.join(" + ") +
        (
            damageBonus
            ? ` ${damageBonus > 0 ? "+" : "−"} ${Math.abs(damageBonus)}`
            : ""
        )
    );
}


function addDamageDie(n) {

    damageDice[n] =
        (damageDice[n] || 0) + 1;

    renderDamageRoller();
}


function removeDamageDie(n) {

    damageDice[n] =
        Math.max(
            0,
            (damageDice[n] || 0) - 1
        );

    renderDamageRoller();
}


function resetDamageSelection() {

    damageDice = {};

    damageBonus = 0;

    damageTypesOpen = false;

    renderDamageRoller();
}


function toggleDamageTypes() {

    if (!damageFormula()) {
        return;
    }

    damageTypesOpen = !damageTypesOpen;

    renderDamageRoller();
}


function rollDamage(type) {

    const formula = damageFormula();

    if (!formula) {
        return;
    }

    let total = damageBonus;

    DAMAGE_DICE.forEach(n => {

        for (let i = 0; i < (damageDice[n] || 0); i++) {

            total +=
                Math.floor(
                    Math.random() * n
                ) + 1;

        }

    });

    damageHistory.push({
        formula,
        total: Math.max(0, total),
        type
    });

    damageDice = {};

    damageBonus = 0;

    damageTypesOpen = false;

    renderDamageRoller();
}


function clearDamageHistory() {

    damageHistory = [];

    renderDamageRoller();
}


function renderDice() {

    return `

        <div class="card">

            <h2>Lancer de dés</h2>

            <div class="dice">

                ${[
                    20,
                    12,
                    10,
                    8,
                    6,
                    4
                ]
                .map(
                    n => `

                        <button
                            onclick="quickRoll(${n})"
                        >
                            d${n}
                        </button>

                    `
                )
                .join("")}

                <div
                    id="result"
                    class="result"
                >
                    —
                </div>

            </div>

        </div>

    `;
}


function quickRoll(n) {

    const result =
        Math.floor(
            Math.random() * n
        ) + 1;

    showResult(
        `d${n} → ${result}`
    );
}


function showResult(text) {

    const result =
        document.getElementById("result");

    if (result) {
        result.textContent = text;
    }
}


function getSpellSaveDC(
    ability = character.spellAbility
) {

    return (
        8 +
        Number(
            character.proficiencyBonus
        ) +
        getAbilityModifier(ability)
    );
}


function getSpellAttackBonus(
    ability = character.spellAbility
) {

    return (
        Number(
            character.proficiencyBonus
        ) +
        getAbilityModifier(ability)
    );
}


/* =========================================================
   WEAPONS
   ========================================================= */

function getWeaponAbility(weapon) {

    if (weapon.weaponFinesse) {
        return "dexterite";
    }

    return (
        weapon.weaponAbility ||
        "force"
    );
}


function getWeaponAttackBonus(
    ability
) {

    return (
        Number(
            character.proficiencyBonus
        ) +
        getAbilityModifier(ability)
    );
}


function changeHP(n) {

    character.hp =
        Math.max(
            0,
            Math.min(
                Number(character.hpMax),
                Number(character.hp) + n
            )
        );

    sheet();
}


/* =========================================================
   ACTIONS — CARD, SORT & MODAL
   ========================================================= */

function renderActionCard(x) {

    const index =
        character.actions.indexOf(x);

    if (index === -1) {
        return "";
    }

    return `

        <div class="card action-card">

            ${
                x.image
                ?
                `
                    <div class="action-image">

                        <img
                            src="${x.image}"
                            alt=""
                        >

                    </div>
                `
                :
                ""
            }


            <div class="action-info">

                <div class="action-header">

                    <div>

                        <h3>
                            ${esc(x.name)}
                        </h3>

                        <div class="action-meta">

                            ${esc(x.type)}

                            ·

                            ${esc(x.cost)}

                            ${
                                x.type === "Sort" &&
                                Number(x.level || 0) > 0
                                ?
                                ` · Niveau ${x.level}`
                                :
                                ""
                            }

                        </div>

                    </div>

                </div>


                ${
                    x.damage
                    ?
                    `
                        <div class="damage">
                            ${esc(x.damage)}
                        </div>
                    `
                    :
                    ""
                }

                <button
                    class="primary"
                    onclick="showAction(${index})"
                >
                    Ouvrir
                </button>

            </div>

        </div>

    `;
}


function getCostOrder(cost) {

    switch (cost) {

        case "Passif":
            return 0;

        case "Action":
            return 1;

        case "Action bonus":
            return 2;

        case "Réaction":
            return 3;

        case "Aucune action":
            return 4;

        default:
            return 4;

    }
}


function sortActions(actions) {

    return [...actions].sort(
        (a, b) =>
            getCostOrder(a.cost) -
            getCostOrder(b.cost)
    );
}


function showAction(i) {

    const x =
        character.actions[i];

    if (!x) {
        return;
    }

    const lvl =
        Number(x.level || 0);

    let calculation = "";


    /* ---------- ARME ---------- */

    if (x.type === "Arme") {

        const ability =
            getWeaponAbility(x);

        const abilityMod =
            getAbilityModifier(ability);

        const attackBonus =
            Number(
                character.proficiencyBonus || 0
            ) +
            abilityMod;

        const damageBonus =
            abilityMod;


        calculation = `

            <div class="combat-calculation">

                <div class="calculation-box">

                    <span class="label">
                        Bonus pour toucher
                    </span>

                    <strong>
                        ${fmt(attackBonus)}
                    </strong>

                    <small>

                        ${fmt(
                            character.proficiencyBonus
                        )}
                        BM
                        +
                        ${fmt(abilityMod)}
                        ${abilityShortName(ability)}

                    </small>

                </div>


                <div class="calculation-box">

                    <span class="label">
                        Bonus aux dégâts
                    </span>

                    <strong>
                        ${fmt(damageBonus)}
                    </strong>

                    <small>
                        ${abilityShortName(ability)}
                    </small>

                </div>

            </div>

        `;
    }


    document.getElementById("modal")?.remove();


    document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div
            id="modal"
            class="modal"
            onclick="closeModal(event)"
        >

            <div class="modal-content">

                <button
                    class="close"
                    onclick="closeModal()"
                >
                    ×
                </button>


                ${
                    x.image
                    ?
                    `
                        <div class="modal-action-image">

                            <img
                                src="${x.image}"
                                alt=""
                            >

                        </div>
                    `
                    :
                    ""
                }


                <h2>
                    ${esc(x.name)}
                </h2>


                <span>

                    ${esc(x.type)}

                    ·

                    ${esc(x.cost)}

                    ${
                        lvl && x.type === "Sort"
                        ?
                        " · Niveau " + lvl
                        :
                        ""
                    }

                </span>


                ${calculation}


                ${
                    x.type === "Sort"
                    ?
                    `
                        <div class="spell-details modal-spell-details">

                            ${
                                x.castingTime
                                ?
                                `
                                    <div>
                                        <strong>
                                            Temps d'incantation
                                        </strong>
                                        <span>
                                            ${esc(x.castingTime)}
                                        </span>
                                    </div>
                                `
                                :
                                ""
                            }


                            ${
                                x.range
                                ?
                                `
                                    <div>
                                        <strong>
                                            Portée
                                        </strong>
                                        <span>
                                            ${esc(x.range)}
                                        </span>
                                    </div>
                                `
                                :
                                ""
                            }


                            ${
                                x.components
                                ?
                                `
                                    <div>
                                        <strong>
                                            Composantes
                                        </strong>
                                        <span>
                                            ${esc(x.components)}
                                        </span>
                                    </div>
                                `
                                :
                                ""
                            }


                            ${
                                x.duration
                                ?
                                `
                                    <div>
                                        <strong>
                                            Durée
                                        </strong>
                                        <span>
                                            ${esc(x.duration)}
                                        </span>
                                    </div>
                                `
                                :
                                ""
                            }

                        </div>
                    `
                    :
                    ""
                }


                <div class="damage">
                    ${esc(x.damage || "—")}
                </div>


                <p>
                    ${esc(
                        x.description ||
                        "Aucune description."
                    )}
                </p>

            </div>

        </div>

        `
    );
}


function closeModal(e) {

    if (
        !e ||
        e.target.id === "modal"
    ) {

        document
            .getElementById("modal")
            ?.remove();

    }
}


/* =========================================================
   COMPANION EDITOR
   ========================================================= */

function companionEditor() {

    const c = companion;

    app.innerHTML = `

        <div class="app">

            <header>

                <div>

                    <h1>
                        Créer un companion
                    </h1>

                    <p>
                        Configure ta créature.
                    </p>

                </div>

                <div class="header-actions">
                    <button onclick="home()">
                        Annuler
                    </button>
                </div>

            </header>


            <div class="card form">

                <h2>Identité</h2>

                <div class="form-row">

                    <div class="field">

                        <label>Nom</label>

                        <input
                            id="comp_name"
                            value="${esc(c.name)}"
                        >

                    </div>

                    <div class="field">

                        <label>Type</label>

                        <input
                            id="comp_creatureType"
                            placeholder="Bête, Mort-vivant..."
                            value="${esc(c.creatureType)}"
                        >

                    </div>

                </div>


                <div class="form-row form-row-3">

                    <div class="field">

                        <label>Taille</label>

                        <select id="comp_size">

                            ${CREATURE_SIZES
                            .map(
                                size => `
                                    <option
                                        value="${size}"
                                        ${
                                            c.size === size
                                            ? "selected"
                                            : ""
                                        }
                                    >
                                        ${size}
                                    </option>
                                `
                            )
                            .join("")}

                        </select>

                    </div>

                    <div class="field">

                        <label>Alignement</label>

                        <input
                            id="comp_alignment"
                            placeholder="Neutre"
                            value="${esc(c.alignment)}"
                        >

                    </div>

                    <div class="field">

                        <label>FP</label>

                        <input
                            id="comp_cr"
                            placeholder="1/4"
                            value="${esc(c.cr)}"
                        >

                    </div>

                </div>

            </div>


            <div class="card">

                <h2>Combat</h2>

                <div class="form-row form-row-3">

                    ${[
                        ["ac", "CA"],
                        ["hpMax", "PV maximum"],
                        ["hp", "PV actuels"],
                        ["speed", "Vitesse"]
                    ]
                    .map(
                        ([id, label]) => `
                            <div class="field">

                                <label>${label}</label>

                                <input
                                    id="comp_${id}"
                                    type="number"
                                    value="${c[id]}"
                                >

                            </div>
                        `
                    )
                    .join("")}

                </div>


                <div class="form-row">

                    <label class="checkbox-row">

                        <input
                            type="checkbox"
                            id="comp_hasFly"
                            ${
                                c.hasFly
                                ? "checked"
                                : ""
                            }
                        >

                        Vitesse de vol

                    </label>


                    <div class="field">

                        <label>Vitesse de vol</label>

                        <input
                            id="comp_flySpeed"
                            type="number"
                            min="0"
                            value="${c.flySpeed}"
                        >

                    </div>

                </div>

            </div>


            <div class="card">

                <h2>Caractéristiques</h2>

                <div class="abilities">

                    ${Object.entries(ABILITIES)
                    .map(
                        ([key, short]) => `

                            <div class="ability">

                                <div class="label">
                                    ${short}
                                </div>

                                <img
                                    class="ability-image"
                                    src="icons/${key}.png"
                                    alt=""
                                >

                                <input
                                    id="comp_ab_${key}"
                                    type="number"
                                    value="${c.abilities[key]}"
                                >

                            </div>

                        `
                    )
                    .join("")}

                </div>

            </div>


            <div class="card">

                <h2>Compétences</h2>

                <p class="label">

                    Entre manuellement la valeur d'une compétence.
                    Laisse vide pour utiliser le modificateur
                    de caractéristique.

                </p>

                <div class="editor-list">

                    ${Object.entries(c.skills)
                    .map(
                        ([name, skill]) => `

                            <div
                                class="
                                    editor-item
                                    ${
                                        skill.value !== ""
                                        ? "mastered"
                                        : ""
                                    }
                                "
                            >

                                <div>

                                    <strong class="skill-name">
                                        <img
                                            src="icons/${name}.png"
                                            class="skill-icon"
                                            alt=""
                                        >
                                        ${esc(name)}
                                    </strong>

                                    <small>
                                        ${abilityShortName(
                                            skill.ability
                                        )}
                                        -
                                        ${SKILL_DESCRIPTIONS[name]}
                                    </small>

                                </div>

                                <div class="field">

                                    <label>Valeur</label>

                                    <input
                                        id="comp_skill_${name}"
                                        type="number"
                                        placeholder="auto"
                                        value="${esc(skill.value)}"
                                    >

                                </div>

                            </div>

                        `
                    )
                    .join("")}

                </div>

            </div>


            <div class="card">

                <h2>Langues & Sens</h2>

                <div class="form-row">

                    <div class="field">

                        <label>Langues</label>

                        <div
                            id="list_compLanguages"
                            class="list-editor"
                        ></div>

                        <button onclick="addListItem('compLanguages')">
                            + Ajouter une langue
                        </button>

                    </div>


                    <div class="field">

                        <label>Sens</label>

                        <div
                            id="list_compSenses"
                            class="list-editor"
                        ></div>

                        <button onclick="addListItem('compSenses')">
                            + Ajouter un sens
                        </button>

                    </div>

                </div>

            </div>


            ${renderResistanceEditor(c.resistances)}


            <div class="card">

                <h2>Actions et traits</h2>

                <div
                    id="editorCompanionActions"
                    class="editor-list"
                ></div>

                <button onclick="addCompanionActionForm()">
                    + Ajouter une action
                </button>

            </div>


            <button
                class="primary"
                onclick="createCompanionFromEditor()"
            >
                Créer la fiche
            </button>

        </div>

    `;

    renderListEditor("compLanguages");

    renderListEditor("compSenses");

    renderCompanionEditorActions();
}


/* =========================================================
   COMPANION ACTION FORM
   ========================================================= */

function addCompanionActionForm() {

    companion.actions.push({

        name: "Nouvelle action",

        cost: "Action",

        damage: "",

        description: "",

        image: ""

    });

    renderCompanionEditorActions();
}


function renderCompanionEditorActions() {

    const el =
        document.getElementById(
            "editorCompanionActions"
        );

    if (!el) {
        return;
    }

    el.innerHTML =
        companion.actions
        .map(
            (x, i) => `

                <div class="editor-item">

                    <div class="form-row">

                        <div class="field">

                            <label>Nom</label>

                            <input
                                data-c="${i}"
                                data-k="name"
                                value="${esc(x.name)}"
                            >

                        </div>


                        <div class="field">

                            <label>Type</label>

                            <select
                                data-c="${i}"
                                data-k="cost"
                            >

                                ${COMPANION_COSTS
                                .map(
                                    cost => `
                                        <option
                                            value="${cost}"
                                            ${
                                                x.cost === cost
                                                ? "selected"
                                                : ""
                                            }
                                        >
                                            ${cost}
                                        </option>
                                    `
                                )
                                .join("")}

                            </select>

                        </div>


                        <div class="field">

                            <label>Dégâts</label>

                            <input
                                data-c="${i}"
                                data-k="damage"
                                placeholder="1d6 + 2"
                                value="${esc(x.damage)}"
                            >

                        </div>


                        <div class="field">

                            <label>Image</label>

                            <input
                                type="file"
                                accept="image/*"
                                onchange="
                                    handleCompanionImageUpload(
                                        ${i},
                                        this
                                    )
                                "
                            >

                            ${
                                x.image
                                ?
                                `
                                    <div class="image-preview">

                                        <img
                                            src="${x.image}"
                                        >

                                    </div>
                                `
                                :
                                ""
                            }

                        </div>


                        <div
                            class="field"
                            style="grid-column:1/-1"
                        >

                            <label>Description</label>

                            <textarea
                                data-c="${i}"
                                data-k="description"
                            >${esc(x.description)}</textarea>

                        </div>

                    </div>


                    <button
                        class="danger"
                        onclick="
                            companion.actions.splice(${i}, 1);
                            renderCompanionEditorActions();
                        "
                    >
                        Supprimer
                    </button>

                </div>

            `
        )
        .join("");


    el
        .querySelectorAll("[data-c][data-k]")
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    companion.actions[
                        Number(input.dataset.c)
                    ][
                        input.dataset.k
                    ] = input.value;

                }
            );

        });
}


function handleCompanionImageUpload(index, input) {

    const file =
        input.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith("image/")
    ) {

        alert(
            "Le fichier doit être une image."
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = () => {

        companion.actions[index].image =
            reader.result;

        renderCompanionEditorActions();

    };

    reader.readAsDataURL(file);
}


/* =========================================================
   COMPANION EDITOR - CONFIRMATION
   ========================================================= */

function createCompanionFromEditor() {

    [
        "name",
        "creatureType",
        "size",
        "alignment",
        "cr"
    ]
    .forEach(id => {

        companion[id] =
            document.getElementById("comp_" + id).value;

    });


    [
        "ac",
        "hpMax",
        "hp",
        "speed",
        "flySpeed"
    ]
    .forEach(id => {

        companion[id] =
            Number(
                document.getElementById("comp_" + id).value
            );

    });


    companion.hasFly =
        document.getElementById("comp_hasFly").checked;


    Object.keys(companion.abilities).forEach(key => {

        companion.abilities[key] =
            Number(
                document.getElementById(
                    "comp_ab_" + key
                ).value
            );

    });


    Object.keys(companion.skills).forEach(name => {

        const el =
            document.getElementById("comp_skill_" + name);

        companion.skills[name].value =
            el && el.value !== ""
                ? String(Number(el.value))
                : "";

    });


    readResistanceEditor(companion.resistances);


    companion.languages =
        companion.languages.filter(
            value => value.trim() !== ""
        );

    companion.senses =
        companion.senses.filter(
            value => value.trim() !== ""
        );


    if (!companion.name.trim()) {

        alert(
            "Le companion doit avoir un nom."
        );

        return;
    }


    normalizeCompanion();

    companionPage = "skills";

    companionSheet();
}


/* =========================================================
   COMPANION SHEET
   ========================================================= */

function companionSheet() {

    normalizeCompanion();

    const c = companion;

    app.innerHTML = `

        <div class="app">

            <div class="character-header ${headerCollapsed ? "collapsed" : ""}">

                <header>

                    <button
                        class="damage-toggle"
                        onclick="openDamageRoller()"
                    >
                        Dégâts
                    </button>

                    <div class="header-info">

                        <h1>
                            ${esc(c.name)}
                        </h1>

                        <p>

                            ${esc(c.size || "•")}

                            ·

                            ${esc(c.creatureType || "•")}

                            ·

                            ${esc(c.alignment || "•")}

                        </p>

                    </div>


                    <div class="header-actions">

                        <button onclick="companionEditor()">
                            Modifier
                        </button>

                        <button
                            class="primary"
                            onclick="saveCompanionFile()"
                        >
                            Sauvegarder
                        </button>

                        <button onclick="home()">
                            Accueil
                        </button>

                    </div>

                </header>


                <button
                    class="collapse-toggle"
                    onclick="toggleHeaderCollapse()"
                >
                    ${
                        headerCollapsed
                        ? "▼ Afficher PV / Carac."
                        : "▲ Réduire PV / Carac."
                    }
                </button>


                <div class="sheet-stats">

                    <div class="character-bar">

                        <div
                            class="character-stat hp-stat"
                            onclick="openCompanionHpEditor()"
                        >

                            <span>PV</span>

                            <strong class="hp-display">

                                ${c.hp}/${c.hpMax}

                                ${
                                    c.tempHp > 0
                                    ? `<div class="temp-hp">+${c.tempHp}</div>`
                                    : ""
                                }

                            </strong>

                        </div>

                        <div class="character-stat">
                            <span>CA</span>
                            <strong>${c.ac}</strong>
                        </div>

                        <div class="character-stat">
                            <span>Vitesse</span>
                            <strong>
                                ${c.speed} m
                                ${
                                    c.hasFly
                                    ? `<div class="temp-hp">${c.flySpeed} m vol</div>`
                                    : ""
                                }
                            </strong>
                        </div>

                        <div class="character-stat">
                            <span>FP</span>
                            <strong>${esc(c.cr || "—")}</strong>
                        </div>

                    </div>


                    <div class="character-abilities">

                        ${Object.entries(ABILITIES)
                        .map(
                            ([key, short]) => {

                                const value = c.abilities[key];

                                const modifier =
                                    abilityModifier(value);

                                return `

                                    <div class="character-ability">

                                        <span class="ability-name">
                                            ${short}
                                        </span>

                                        <img
                                            class="ability-image"
                                            src="icons/${key}.png"
                                            alt=""
                                        >

                                        <strong class="ability-value">
                                            ${value}
                                        </strong>

                                        <p class="ability-bonus">
                                            ${fmt(modifier)}
                                        </p>

                                    </div>

                                `;

                            }
                        )
                        .join("")}

                    </div>

                </div>


                <div class="page-nav">

                    <button
                        class="${companionPage === "skills" ? "active" : ""}"
                        onclick="changeCompanionPage('skills')"
                    >
                        Compétences
                    </button>

                    <button
                        class="${companionPage === "traits" ? "active" : ""}"
                        onclick="changeCompanionPage('traits')"
                    >
                        Trait notable
                    </button>

                    <button
                        class="${companionPage === "actions" ? "active" : ""}"
                        onclick="changeCompanionPage('actions')"
                    >
                        Actions
                    </button>

                </div>

            </div>


            <main>
                ${renderCompanionPage()}
            </main>


            <div class="zoom-controls">

                <button onclick="changeZoom(-0.1)">
                    −
                </button>

                <button onclick="resetZoom()">
                    100%
                </button>

                <button onclick="changeZoom(0.1)">
                    +
                </button>

            </div>

        </div>

        <p class="update">
            V8.3
        </p>

    `;
}


function changeCompanionPage(page) {

    companionPage = page;

    companionSheet();
}


function renderCompanionPage() {

    switch (companionPage) {

        case "skills":
            return renderCompanionSkillsPage();

        case "traits":
            return renderCompanionTraitsPage();

        case "actions":
            return renderCompanionActionsPage();

        default:
            return renderCompanionSkillsPage();

    }
}


/* =========================================================
   COMPANION SKILL PAGE
   ========================================================= */

function renderCompanionSkillsPage() {

    const c = companion;

    return `

        <div class="card">

            <h2>Compétences</h2>

            <div class="skills">

                ${Object.entries(c.skills)
                .map(
                    ([name, skill]) => {

                        const manual =
                            skill.value !== "";

                        const bonus =
                            manual
                                ? Number(skill.value)
                                : abilityModifier(
                                    c.abilities[skill.ability]
                                );

                        return `

                            <button
                                class="
                                    skill
                                    ${
                                        manual
                                        ? "skill-mastered"
                                        : ""
                                    }
                                "
                            >

                                <span class="skill-info">

                                    <strong class="skill-name">
                                        <img
                                            src="icons/${name}.png"
                                            class="skill-icon"
                                            alt=""
                                        >
                                        ${esc(name)}
                                    </strong>

                                    <small>
                                        ${abilityShortName(
                                            skill.ability
                                        )}
                                    </small>

                                </span>

                                <b>
                                    ${fmt(bonus)}
                                </b>

                            </button>

                        `;

                    }
                )
                .join("")}

            </div>

        </div>


        <div class="card">

            <h2>Langues</h2>

            ${renderTagList(c.languages)}

        </div>


        <div class="card">

            <h2>Sens</h2>

            ${renderTagList(c.senses)}

        </div>

    `;
}


/* =========================================================
   COMPANION TRAITS PAGE
   ========================================================= */

function renderCompanionTraitsPage() {

    const c = companion;

    const passives =
        c.actions.filter(
            x => x.cost === "Passif"
        );

    const traits =
        c.actions.filter(
            x => x.cost === "Trait notable"
        );

    return `

        ${renderResistanceIsland(c.resistances)}

        ${renderCompanionActionIsland("Passifs", passives)}

        ${renderCompanionActionIsland("Traits notables", traits)}

    `;
}


/* =========================================================
   COMPANION ACTIONS PAGE
   ========================================================= */

function renderCompanionActionsPage() {

    const c = companion;

    return `

        ${renderCompanionActionIsland(
            "Actions",
            c.actions.filter(x => x.cost === "Action")
        )}

        ${renderCompanionActionIsland(
            "Actions bonus",
            c.actions.filter(x => x.cost === "Action bonus")
        )}

        ${renderCompanionActionIsland(
            "Réactions",
            c.actions.filter(x => x.cost === "Réaction")
        )}

        ${renderCompanionActionIsland(
            "Actions légendaires",
            c.actions.filter(x => x.cost === "Action légendaire")
        )}

    `;
}


function renderCompanionActionIsland(title, actions) {

    return `

        <div class="card">

            <h2>${title}</h2>

            ${
                actions.length
                ?
                `<div class="actions">

                    ${actions
                    .map(
                        x => renderCompanionActionCard(x)
                    )
                    .join("")}

                </div>`
                :
                `<p class="label">
                    Aucune entrée.
                </p>`
            }

        </div>

    `;
}


function renderCompanionActionCard(x) {

    const index =
        companion.actions.indexOf(x);

    if (index === -1) {
        return "";
    }

    return `

        <div class="card action-card">

            ${
                x.image
                ?
                `
                    <div class="action-image">

                        <img
                            src="${x.image}"
                            alt=""
                        >

                    </div>
                `
                :
                ""
            }


            <div class="action-info">

                <h3>
                    ${esc(x.name)}
                </h3>

                <div class="action-meta">
                    ${esc(x.cost)}
                </div>

                ${
                    x.damage
                    ?
                    `<div class="damage">
                        ${esc(x.damage)}
                    </div>`
                    :
                    ""
                }

                <button
                    class="primary"
                    onclick="showCompanionAction(${index})"
                >
                    Ouvrir
                </button>

            </div>

        </div>

    `;
}


function showCompanionAction(i) {

    const x =
        companion.actions[i];

    if (!x) {
        return;
    }

    document.getElementById("modal")?.remove();

    document.body.insertAdjacentHTML(
        "beforeend",

        `

        <div
            id="modal"
            class="modal"
            onclick="closeModal(event)"
        >

            <div class="modal-content">

                <button
                    class="close"
                    onclick="closeModal()"
                >
                    ×
                </button>


                ${
                    x.image
                    ?
                    `
                        <div class="modal-action-image">

                            <img
                                src="${x.image}"
                                alt=""
                            >

                        </div>
                    `
                    :
                    ""
                }


                <h2>
                    ${esc(x.name)}
                </h2>


                <span>
                    ${esc(x.cost)}
                </span>


                <div class="damage">
                    ${esc(x.damage || "—")}
                </div>


                <p>
                    ${esc(
                        x.description ||
                        "Aucune description."
                    )}
                </p>

            </div>

        </div>

        `
    );
}


/* =========================================================
   ABILITY MODIFIER
   ========================================================= */

function abilityModifier(score) {

    return Math.floor(
        (Number(score) - 10) / 2
    );
}


function getAbilityModifier(ability) {

    return abilityModifier(
        character.abilities[ability] || 10
    );
}


/* =========================================================
   ABILITY
   ========================================================= */

function abilityName(ability) {

    return (
        ABILITY_NAMES[ability] ||
        ability
    );
}


function abilityShortName(ability) {

    return (
        ABILITIES[ability] ||
        ability
    );
}


function fmt(n) {

    n = Number(n);

    return n >= 0
        ? "+" + n
        : String(n);
}


function esc(s) {

    return String(
        s ?? ""
    )
    .replace(
        /[&<>"']/g,
        m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[m])
    );
}


/* =========================================================
   START
   ========================================================= */

applyZoom();


loadTheme();


home();
