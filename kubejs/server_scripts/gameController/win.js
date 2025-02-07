ItemEvents.rightClicked('minecraft:scute',event=>{
    DataClean(event)
})
ItemEvents.rightClicked('minecraft:ghast_tear',event=>{

    let NotWolfList = event.server.players.filter(p=>p.spectator == false)
    NotWolfList.filter(p=>p.stages.has('wolf') == false)
    NotWolfList.filter(p=>p.persistentData.isPlayer == true )
    if (NotWolfList.toArray().length <= 0) {
        WinResult(event,WinTrigger)
    }
})
/**
 * 
 * @param {Internal.ItemClickedEventJS_} event 
 * @param {*} WinTrigger 
 */
function WinResult(event,WinTrigger){
    event.server.persistentData.GameProgram = "Not Started"
    event.server.players.forEach(/**@param {Internal.Player_} p*/p=>{
        if (p.spectator || !(p.persistentData.isPlayer)) {
            return
        }
        p.inventory.clear()
        GameDataStat(event,p)
        
    })
    event.server.scheduleInTicks(40,()=>{
        event.server.players.forEach(/**@param {Internal.Player_} p*/p=>{
            if (p.spectator || !(p.persistentData.isPlayer)) {
                return
            }
            p.give('music_disc_13')
            RankingList(p)
            
        })
    })
    if (WinTrigger) {
        event.server.players.forEach(/**@param {Internal.ServerPlayer_} p*/p=>{
            p.runCommandSilent(`playsound minecraft:ui.toast.challenge_complete player @s ~ ~ ~ 1 1`)
        })
        event.server.runCommandSilent(`title @a subtitle "§3离开诅咒之地,拥抱未来."`)
        event.server.runCommandSilent(`title @a title "§b人类获胜"`)
    }else{
        event.server.players.forEach(/**@param {Internal.ServerPlayer_} p*/p=>{
            p.runCommandSilent(`playsound minecraft:entity.wolf.growl player @s ~ ~ ~ 1 0`)
            p.runCommandSilent(`playsound minecraft:entity.ender_dragon.growl player @a ~ ~ ~ 0.7 0`)
            
        })
        event.server.runCommandSilent(`title @a subtitle "§4极寒之中,无人走出."`)
        event.server.runCommandSilent(`title @a title "§c狼人获胜"`)
    }
}