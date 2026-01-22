let infos = (Data.infos.group ??= {});

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */
infos.settings = `Available options:\n\n- <options>`;

infos.kick_add = `*Include the number/Reply/tag the target to be <cmd> from the group!*\n\nExample: \n\n*Method #1* => _By replying to the target's message_\n - <prefix><cmd>\n \n*Method #2* => _By tagging the target_\n - <prefix><cmd> @rifza \n \n*Method #3* => _By using the target's number_\n - <prefix><cmd> +62 831-xxxx-xxxx`;

infos.on = (cmd, input) =>
  `Successfully ${cmd == 'on' ? 'enabled' : 'disabled'} *${input}* in this group!`;

infos.nallowPlayGame =
  'Playing games is not allowed here!\n_To allow it, you can type *.on playgame* (can only be done by admin/owner)_';

infos.registerNeeded = `˖ ݁𖥔 ݁˖  Hii there

𐙚  It seems you're not yet registered in our system database.
⌗  To start playing and save your progress,
please type the following command:

.register your-name | your-age | pria/wanita

﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
example:  .register Elaina | 18`