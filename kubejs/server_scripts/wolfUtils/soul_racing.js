ItemEvents.rightClicked('minecraft:disc_fragment_5',event=>{
    /**@type {Internal.ServerPlayer} */
    let p = event.server.players.filter(p=>p.persistentData.get("isPlayer") == true)
})