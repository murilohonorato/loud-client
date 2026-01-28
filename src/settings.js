const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const getSettingsPath = () => path.join(app.getPath('userData'), 'settings.json');

const defaultSettings = {
    fpsCap: -1,
    profile: 'low-latency' // Safer default that still improves performance
};

function loadSettings() {
    try {
        const settingsPath = getSettingsPath();
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            return { ...defaultSettings, ...JSON.parse(data) };
        }
    } catch (error) {
        console.error("Loud Client Error [loadSettings]:", error);
    }
    return defaultSettings;
}

function saveSettings(newSettings) {
    try {
        const settingsPath = getSettingsPath();
        const current = loadSettings();
        const dataToSave = { ...current, ...newSettings };
        fs.writeFileSync(settingsPath, JSON.stringify(dataToSave, null, 4));
    } catch (error) {
        console.error("Loud Client Error [saveSettings]:", error);
    }
}

module.exports = { loadSettings, saveSettings };
