let WolfChosen = {}
ItemEvents.rightClicked('minecraft:gold_nugget',event=>{
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    //event.player.tell()
    if (!event.item.hasNBT()) {
        player.openChestGUI("§4邪恶注入",2,gui=>{
            gui.slot(2,0,slot=>{
                slot.item = Item.of('minecraft:ender_pearl',"{wolf:true}")
                slot.leftClicked = () =>{
                    player.closeMenu()
                    WolfChosen[event.player.name] = "spectator"
                }
            })
            gui.slot(3,0,slot=>{
                slot.item = Item.of('minecraft:sculk_sensor',"{setting:true}")
                slot.leftClicked = () =>{
                    player.closeMenu()
                    WolfChosen[event.player.name] = "blindness"
                }
            })
            gui.slot(4,0,slot=>{
                slot.item = Item.of('minecraft:creeper_spawn_egg',"{setting:true}")
                slot.leftClicked = () =>{
                    SummonChooseGUI(event,CreeperSummonList,8)
                }
            })
            gui.slot(5,0,slot=>{
                slot.item = Item.of('minecraft:pillager_spawn_egg',"{setting:true}")
                slot.leftClicked = () =>{
                    SummonChooseGUI(event,RaidSummonList,8)
                }
            })
        })
    }else{
        
        let stringName = event.item.nbt.get("type")
        if (stringName != "creeper" && 
            stringName != "pillager" && 
            stringName != "blindness" &&
            stringName != "spectator") {
            return
        }

        if (stringName == "blindness") {
            event.server.players.forEach(/**@param {Internal.Player} player*/player=>{
                let flag1 = player.persistentData.get("isPlayer") == true
                let flag2 = player.persistentData.get("isWolf") == true
                if (flag1&&!flag2) {
                    player.potionEffects.add("blindness",20*4,0,false,false)
                    event.item.removeTag()
                }
            })
        }
        //观察者模式
        if (stringName == "spectator"){
            let spectatorTime = 20*10

            let creative = player.gameMode.creative
            player.sendData("spectator",{time:spectatorTime})

            player.setGameMode("spectator")
            /*
            player.abilities.mayfly = true
            player.onUpdateAbilities()
            player.potionEffects.add("invisibility",spectatorTime,1,false,false)
            player.potionEffects.add("resistance",spectatorTime,5,false,false)
            player.potionEffects.add("speed",spectatorTime,2,false,false)
            player.potionEffects.add("night_vision",spectatorTime,1,false,false)
            player.potionEffects.add("weakness",spectatorTime,10,false,false)
            */
            player.inventory.allItems.forEach(item=>{
                player.cooldowns.addCooldown(item,spectatorTime)
            })
            
            event.server.scheduleInTicks(spectatorTime,()=>{
                if (creative) {
                    player.setGameMode("creative")
                }
                else{
                    /*
                    player.abilities.mayfly = false
                    player.abilities.flying = false
                    player.onUpdateAbilities()
                    */
                    player.setGameMode("adventure")
                }
            })
            event.item.removeTag()
        }
    
        
    }
    
})

PlayerEvents.inventoryChanged('minecraft:gold_nugget',event=>{
    if (WolfChosen[event.player.name] == undefined) {
        return
    }
    let item = event.player.mainHandItem
    let string = WolfChosen[event.player.name]
    
    if (!item.hasNBT()) {
        item.getOrCreateTag()
    }
    item.nbt.merge({type:string})
    WolfChosen[event.player.name] = undefined
})

/**
 * 用于设定参与玩家的界面
 * @param {Internal.ItemClickedEventJS} event 
 */
function SummonChooseGUI(event,SummonList,offset) {
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    player.openChestGUI("§c诅咒召唤地点",2,gui=>{
        //设定参与玩家
        let playerL = event.server.players.filter(p=>p.persistentData.get("isPlayer") == true)
        let nameList = []
        playerL.forEach(p=>{
            nameList.push(p.name)
        })
        for (let  i = 0; i < nameList.length; i++) {
            let name = nameList[i].string;
            let nbt = "{SkullOwner:" + name + "}"
            gui.slot( i,0,slot=>{
                slot.item = Item.of('minecraft:player_head',nbt)
                slot.leftClicked = () =>{
                    let players = event.server.players
                    players.forEach(p=>{
                        if (p.name.string == name) {
                            let pos = new BlockPos(p.x,p.y,p.z)
                            SummonEntities(event,SummonList,pos,offset)
                        }
                    })
                    player.closeMenu()
                }
            })
        }
        
        
    })
}