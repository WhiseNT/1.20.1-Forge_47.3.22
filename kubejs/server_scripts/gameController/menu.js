function OpDataSender(event,channel,data) {
    event.server.players.forEach(/**@param {Internal.ServerPlayer} player*/player=>{
        if (player.isOp()) {
            player.sendData(channel,data)
        }
    })
}
/**
 * 用于设定参与玩家的界面
 * @param {Internal.ItemClickedEventJS} event 
 */
function gamePlayerSettingGUI(event) {
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    player.openChestGUI("设定参与玩家",5,gui=>{
        //设定参与玩家
        let nameList = event.server.playerNames
        gui.slot(3,4,slot=>{
            slot.item = Item.of('minecraft:ender_pearl','{setting:true}')
            slot.leftClicked = () =>{
                gameSettingMain(event)
            }
        })
        gui.slot(4,4,slot=>{
            slot.item = Item.of('minecraft:ender_eye','{setting:true}')
            slot.leftClicked = () =>{
                gameWolfSettingGUI(event)
            }
        }) 
        for (let  i = 0; i < nameList.length; i++) {
            let name = nameList[i];
            let nbt = "{SkullOwner:" + name.toString() + "}"
             
            gui.slot( i,0,slot=>{
                  
                slot.item = Item.of('minecraft:player_head',nbt)
                slot.leftClicked = () =>{
                    let nameArray = event.server.persistentData.get("involved")
                    nameArray = nameArray.filter(e=> e == name.toString())
                    nameArray = nameArray.toString()
                
                    if (!nameArray.includes(name.toString())) {
                        event.server.persistentData.involved.push(name)
                        let array = event.server.persistentData.get("involved")
                        OpDataSender(event,"PlayerInvoled",{involed:array})

                        
                    }
                }
                slot.rightClicked = () =>{
                    let nameArray = event.server.persistentData.involved
                    nameArray = nameArray.filter(e=>e != name.toString())
                    event.server.persistentData.involved = nameArray

                    let array = event.server.persistentData.get("involved")    
                    OpDataSender(event,"PlayerInvoled",{involed:array})
                }
            })
        }
    
        
    })
}

/**
 * 用于设定狼人的界面
 * @param {Internal.ItemClickedEventJS} event 
 */
function gameWolfSettingGUI(event) {
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    player.openChestGUI("设定狼人",5,gui=>{
        //设定狼人
        //获取参与玩家列表
        let nameList = event.server.persistentData.get("involved")
        gui.slot(8,4,slot=>{
            slot.item = Item.of('minecraft:golden_carrot','{setting:true}')
            slot.leftClicked = () =>{
                player.closeMenu()
                GameStart(event)
            }
        })
        gui.slot(3,4,slot=>{
            slot.item = Item.of('minecraft:ender_pearl','{setting:true}')
            slot.leftClicked = () =>{
                gamePlayerSettingGUI(event)
            }
        })
        //设定狼人数量,用于不手动指定狼人时进行随机抽取
        gui.slot(0,4,slot=>{
            let WolfAmount = event.server.persistentData.getInt("WolfAmount")
            slot.item = Item.of('minecraft:feather',WolfAmount,'{setting:true}')
            slot.leftClicked = () =>{
                WolfAmount += 1
                event.server.persistentData.merge({WolfAmount:WolfAmount})
                slot.item = Item.of('minecraft:feather',WolfAmount,'{setting:true}')
            }
            slot.rightClicked = () =>{
                WolfAmount -= 1
                event.server.persistentData.merge({WolfAmount:WolfAmount})
                slot.item = Item.of('minecraft:feather',WolfAmount,'{setting:true}')
            }
        })
        gui.slot(1,4,slot=>{
            slot.item = Item.of('minecraft:snowball','{setting:true}')
            slot.leftClicked = () =>{
                let WolfNewList = []
                let WolfAmount = event.server.persistentData.getInt("WolfAmount")
                let PlayerList = event.server.persistentData.get("involved")
                let PlayerCounts = PlayerList.length
                if (PlayerList.length < WolfAmount) {
                    event.server.persistentData.merge({wolfList:PlayerList})
                }else {
                    for (let i = 0; i < WolfAmount; i++) {
                        let random = Math.floor(Math.random()*PlayerList.length)
                        WolfNewList.push(PlayerList[random])
                        PlayerList = PlayerList.filter(e=> e != PlayerList[random])
                    }
                    event.server.persistentData.merge({wolfList:WolfNewList})
                    event.server.players.sendData("PlayerIsWolf",{wolfList:WolfNewList})
                }

                
            }
            
            
        })
        for (let i = 0; i < nameList.length; i++) {
            //放置玩家头颅
            let name = nameList[i];
            let xOffset = i
            let nbt = "{SkullOwner:" + name.toString() + "}"
            gui.slot(xOffset,0,slot=>{
                slot.item = Item.of('minecraft:player_head',nbt)
                slot.leftClicked = () =>{
                    //狼人计算
                    let nameArray = event.server.persistentData.get("wolfList")
                    //event.server.persistentData.merge({wolfList:[]})
                    nameArray = nameArray.filter(e=> e == name.toString())
                    nameArray = nameArray.toString()
                    if (!nameArray.includes(name.toString())) {
                        event.server.persistentData.wolfList.push(name)
                        let array = event.server.persistentData.get("wolfList")
                        OpDataSender(event,"PlayerIsWolf",{wolfList:array})
                        
                    }
                }
                slot.rightClicked = () =>{
                    let nameArray = event.server.persistentData.wolfList
                    nameArray = nameArray.filter(e=>e != name.toString())
                    event.server.persistentData.wolfList = nameArray

                    let array = event.server.persistentData.get("wolfList")    
                    OpDataSender(event,"PlayerIsWolf",{wolfList:array})
                }
            })
        }
        
    })
}
/**
 * 重置数据
 * @param {Internal.ItemClickedEventJS} event 
 */
function DataClean(event) {
    event.server.persistentData.GameProgram = "Not Started"
    event.server.persistentData.Days = 0
    event.server.persistentData.involved = []
    event.server.persistentData.wolfList = []
    event.server.players.forEach(
        /**@param {Internal.ServerPlayer} player*/
        player=>{
        player.persistentData.merge({isPlayer:false})
        player.persistentData.merge({isWolf:false})
        player.persistentData.merge({identity:'null'})
        player.stages.clear()
    })
}
/**
 * 设置首页
 * @param {Internal.ItemClickedEventJS} event 
 */
function gameSettingMain(event) {
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    player.openChestGUI("游戏控制器",5,gui=>{
        gui.slot(0,0,slot=>{
            slot.item = Item.of('minecraft:nether_star',"{setting:true}")
            slot.leftClicked = () =>{
                player.closeMenu()
                gamePlayerSettingGUI(event)
            }
        })
        gui.slot(9*2,0,slot=>{
            slot.item = Item.of('minecraft:paper',"{list:1}")
            slot.leftClicked = () =>{
                player.closeMenu()
                GameDataStat(event,player)

            }
        })
        gui.slot(9*2+1,0,slot=>{
            slot.item = Item.of('minecraft:paper',"{list:2}")
            slot.leftClicked = () =>{
                player.closeMenu()
                RankingList(player)
                
            }
        })
        gui.slot(9*2+1,1,slot=>{
            slot.item = Item.of('minecraft:clock',"{setting:true}")
            slot.leftClicked = () =>{
                if (event.server.persistentData.GameProgram != 'Start') {
                    event.player.tell('游戏并未开始')
                    return
                }
                event.player.runCommandSilent(`time add 24000`)
                GameTimerTick += 24000
                event.player.tell('时间跳过一天')
                
            }
        })
        gui.slot(9*2,1,slot=>{
            slot.item = Item.of('minecraft:lava_bucket',"{setting:true}")
            slot.leftClicked = () =>{
                player.closeMenu()
                DataClean(event)
            }
        })
    })
}

//物品触发
ItemEvents.rightClicked('minecraft:music_disc_pigstep',event=>{
    gameSettingMain(event)
})
function GameDataStat(event,player) {
    let program = event.server.persistentData.GameProgram
    let players = event.server.persistentData.involved
    let CoalFindAmount = coalList.length
    let wolves = event.server.persistentData.wolfList
    let days = event.server.persistentData.Days
    player.tell('§f-------')
    player.tell('§a游戏状态:' +'§6' +program)
    player.tell('§a已发现燃料:' +'§c' +CoalFindAmount)
    player.tell('§a燃料进度:' +'§c' +CoalProgress)
    player.tell('§a天数:' +'§d' +days)
    player.tell('§a包含玩家:' +'§b' +players)
    player.tell('§a包含狼人:' +'§c' +wolves)
    player.tell('§f-------')
}
function RankingList(player) {
    let sortedInputObj = Object.entries(CoalInputAmount).sort((a, b) => b[1] - a[1])
    let sortedFindObj = Object.entries(CoalFindAmount).sort((a, b) => b[1] - a[1])
    let sortedBossHurtObj = Object.entries(BossHurtObject).sort((a, b) => b[1] - a[1])
    let sortedPlayerHurtObj = Object.entries(PlayerHurtObject).sort((a, b) => b[1] - a[1])
    player.tell('§f-------')
    player.tell('§a燃料发现榜:' )
    sortedFindObj.forEach(([key,value])=>{
        player.tell(`§b${key}  §c${value}`)
    })
    player.tell('§f--')
    player.tell('§a燃料投入榜:' )
    sortedInputObj.forEach(([key,value])=>{
        player.tell(`§b${key.slice(1,-1)}  §c${value}`)
    })
    player.tell('§f--')
    player.tell('§aBOSS伤害榜:' )
    sortedBossHurtObj.forEach(([key,value])=>{
        player.tell(`§b${key}  §c${Math.round(value*10)/10}`)
    })
    player.tell('§f--')
    player.tell('§a玩家受伤榜:' )
    sortedPlayerHurtObj.forEach(([key,value])=>{
        player.tell(`§b${key}  §c${Math.round(value*10)/10}`)
    })
    player.tell('§f-------')
}