ItemEvents.foodEaten(event=>{
    if (!event.item.hasNBT()) {
        return
    }
    let flag = ItemMap[event.item.id][event.item.nbt.id][1]
    if (flag != 1) {
        return
    }
    event.player.tell(flag)
    //event.player.potionEffects.add("slow_falling",100,1,true,true)
    event.server.scheduleInTicks(20*60,()=>{
        event.player.tell("§c§l你发现你中毒了")
        event.player.runCommandSilent(`playsound minecraft:block.note_block.didgeridoo block @s ~ ~ ~ 1 0`)
        event.player.tell("§c请在6分钟内寻找解药")
        event.player.sendData("poison")
    })
    
})
//狼人吃食物能获得温度和更多饱食度
ItemEvents.foodEaten(event=>{
    let player = event.player
    if (player.persistentData.isWolf == true) {
        player.setSaturation(player.getSaturation()+3)
        let tem = coldsweat.getTemperature(player,'core')
        coldsweat.setTemperature(player,'core',tem+20)
    }
})