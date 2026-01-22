export const makeInMemoryStore = () => {

  let messages = {}

  let presences = {}

  const loadMessage = async (jir, id) => {

    return messages[jir]

      ? (messages[jir].array || []).find((a) => a.key.id == id)

      : null

  }

  const bind = (ev) => {

    ev.on("messages.upsert", ({ messages: Messages }) => {

      const cht = { ...Messages[0], id: Messages[0].key.remoteJid }

      let isMessage = cht?.message

      let isStubType = cht?.messageStubType

      if (!(isMessage || isStubType)) return

      if (isStubType == "2") return

      messages[cht.id] ||= { array: [] }

      messages[cht.id].array.push(cht)

    })

    ev.on("presence.update", (u) => {

      const id = u?.id

      const ps = u?.presences

      if (!id || !ps || typeof ps !== "object") return

      presences[id] ||= {}

      const now = Date.now()

      for (const jid of Object.keys(ps)) {

        const p = ps[jid]

        if (!p || typeof p !== "object") continue

        presences[id][jid] = { ...p, _t: now }

      }

    })

  }

  return {

    messages,

    presences,

    bind,

    loadMessage

  }

}
