/*!-======[ Plugin Manager (custom) ]======-!*/
/*
  Taruh file ini di: ./helpers/Events/pluginManager.js

  Commands (owner-only):
    - plugstat  : ringkas status event/command
    - plgreload : reload handler (untuk perubahan di file yang sudah terdaftar)
    - plgrescan : rescan folder Events + reload (untuk file baru tanpa restart)
*/

const { readdirSync } = 'fs'.import();

export default async function on({ ev, cht }) {
  ev.on(
    {
      cmd: ['plugstat', 'pluginstat'],
      listmenu: ['plugstat'],
      tag: 'owner',
      isOwner: true,
      energy: 0
    },
    async ({ cht: c }) => {
      const eventFiles = Array.from(Data.Events?.keys?.() || []);
      const totalFiles = eventFiles.length;

      const commands = Object.keys(Data.events || {});
      const totalCmd = commands.length;

      const sample = commands
        .slice(0, 25)
        .map((x) => `- ${x}`)
        .join('\n');

      return (c || cht).reply(
        `*Plugin/Event Stats*\n` +
          `• Event files cached: ${totalFiles}\n` +
          `• Commands registered: ${totalCmd}\n\n` +
          `*Sample commands (first 25)*\n${sample}`
      );
    }
  );

  ev.on(
    {
      cmd: ['plgreload', 'reloadplugin', 'reloadevent'],
      listmenu: ['plgreload'],
      tag: 'owner',
      isOwner: true,
      energy: 0
    },
    async ({ cht: c }) => {
      await ev.reloadEventHandlers();
      return (c || cht).reply('Reload selesai. Handler direfresh (tanpa rescan).');
    }
  );

  ev.on(
    {
      cmd: ['plgrescan', 'rescanplugin', 'rescanevent'],
      listmenu: ['plgrescan'],
      tag: 'owner',
      isOwner: true,
      energy: 0
    },
    async ({ cht: c }) => {
      // refresh daftar file event dari folder
      ev.eventFiles = readdirSync(fol[7]).filter((file) => file.endsWith('.js'));
      await ev.reloadEventHandlers();
      return (c || cht).reply(
        `Rescan + reload selesai. Total file event terdeteksi: ${ev.eventFiles.length}`
      );
    }
  );
}
