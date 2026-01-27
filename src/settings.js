const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const getSettingsPath = () => path.join(app.getPath('userData'), 'settings.json');

const defaultSettings = {
    fpsCap: -1,
    profile: 'default'
};

/**
 * Carrega as configurações do arquivo JSON.
 * @returns {Object} As configurações carregadas ou as padrões.
 */
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

/**
 * Salva as configurações no arquivo JSON.
 * @param {Object} newSettings Objeto com as novas configurações a serem mescladas.
 */
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
