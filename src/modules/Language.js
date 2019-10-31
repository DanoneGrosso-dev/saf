const Util = require('util');
const Fs = require("fs");
const I18next = require('i18next');
const TranslationBackend = require('i18next-node-fs-backend');

module.exports = class LanguageModule {
  constructor(client) {
    this.name = "LanguageModule";
    this.client = client;
    this.language = {
      i18next: I18next
    };
  };

  async load() { 
    this.client.language = this.language;
    return this.initializeLanguage().then(() => {
      this.client.log('Imported Language!', this.name)
    });
  };

  async initializeLanguage(path = 'src/locales') {
    try{
      await I18next.use(TranslationBackend).init({
        ns: [
          'commands',
          'categories',
          'errors',
          'permissions',
          'events',          
        ],
        preload: await LanguageModule.readdir(path),
        fallbackLng: 'pt-BR',
        backend: {
          loadPath: `${path}/{{lng}}/{{ns}}.json`
        },
        interpolation: {
          escapeValue: false
        },
        returnEmptyString: false,
      });
      return true;
    } catch (e) {
      this.client.logError(e, 'InitializeLanguage');
      return false;
    }
  }
};

module.exports.readdir = Util.promisify(Fs.readdir);