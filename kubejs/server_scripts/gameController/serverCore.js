const $Player = Java.loadClass('net.minecraft.world.entity.player.Player')
let GameTimerLoop = undefined
let GameTimerTick = 0
let KJSplayerList = []
let KJSwolfList = []
let KJSgameEvents = []
let WinTrigger = false
let CoalChestList = [{x:-27,y:-60,z:160},

]
/**
 * 让游戏启动的函数
 * @param {Internal.ItemClickedEventJS_} event 
 */
//游戏开始设置
function GameStart(event) {
    let serverData = event.server.persistentData
    serverData.merge({GameProgram:"Start"})
    //第一天
    serverData.merge({Days:1})
    
    //重置kjs各项数据
    ItemMap = {}
    KJSplayerList = []
    KJSwolfList = []
    KJSgameEvents = []
    coalList = []
    CoalGUITrigger = {}
    CoalProgress = 0
    CoalInputAmount = {}
    CoalFindAmount = {}
    ItemMap = {}
    
    event.player.runCommandSilent(`kjs reload server_script`)
    //给参与玩家赋予玩家数据
    let playerList = event.server.persistentData.get("involved")
    playerList.forEach(p=>{
        KJSplayerList.push(p)
    })
    let wolfList = event.server.persistentData.get("wolfList")
    wolfList.forEach(p=>{
        KJSwolfList.push(p)
    })
    
    event.server.players.forEach(/**@param {Internal.Player_} player*/player=>{
        let name = player.name.getString()
        let playerFlag = KJSplayerList.indexOf(name)
        let wolfFlag = KJSwolfList.indexOf(player.name.getString())
        event.server.tell(wolfFlag)
        if(playerFlag != -1 && wolfFlag == -1){
            player.persistentData.merge({isPlayer:true})
            player.persistentData.merge({isWolf:false})
            player.stages.add("common")
            let amount = KJSwolfList.length
            player.setStatusMessage('你是§e好人.'+'§f场上总共有 '+amount+' 名狼人')
        }
        if (wolfFlag != -1) {
            player.persistentData.merge({isWolf:true})
            player.stages.add("wolf")
            player.stages.add("common")
            let amount = KJSwolfList.length
            player.setStatusMessage('你是§c狼人.'+'§f场上总共有 '+amount+' 名狼人')
        }
        if (player.inventory.find('minecraft:music_disc_13') != -1) {
            player.inventory.setStackInSlot(player.inventory.find('minecraft:music_disc_13'),'air')
        }
        
    })

    //重新设置箱子战利品表
    CoalChestList.forEach(pos=>{
        let blockPos = new BlockPos(pos.x,pos.y,pos.z)
        let block = event.level.getBlock(blockPos)
        block.mergeEntityData({LootTable:"kubejs:chests/coal_chest"})
    })
    
    
    //设置时间
    event.server.runCommandSilent('time set 0')
    //计时器归零
    GameTimerTick = 0
    if (GameTimerLoop != undefined) {
        GameTimerLoop.clear()
        GameTimerLoop = undefined
    }
    GameTimerLoop = event.server.scheduleRepeatingInTicks(20,()=>{
        let players = event.server.players
        //天数增长部分
        GameTimerTick += 20
        let DayCheck = GameTimerTick/24000
        //第二天
        if (DayCheck>= 1 && DayCheck< 2) {
            serverData.merge({Days:2})
        }
        else if (DayCheck>= 2 && DayCheck< 3) {
            serverData.merge({Days:3})
        }
        else if (DayCheck>= 3 && DayCheck< 4) {
            serverData.merge({Days:4})
        }
        else if (DayCheck>= 4 && DayCheck< 5) {
            serverData.merge({Days:5})
        }
        else if (DayCheck>= 5 && DayCheck< 6) {
            serverData.merge({Days:6})
        }
        //胜利条件判断部分
        if (DayCheck >=6 && !WinTrigger) {
            GameTimerLoop.clear()
            GameTimerLoop = undefined
            //event.server.tell("狼人获胜")

            WinResult(event,WinTrigger)
        }
        let NotWolfList = players.filter(p=>p.spectator == false)
        NotWolfList.filter(p=>p.stages.has('wolf') == false)
        if (NotWolfList.toArray().length <= 0) {
            GameTimerLoop.clear()
            GameTimerLoop = undefined
            WinResult(event,WinTrigger)
        }
        if (WinTrigger) {
            GameTimerLoop.clear()
            GameTimerLoop = undefined
            
            WinResult(event,WinTrigger)
        }
        
        //事件触发部分
        if (GameTimerTick == 12000 || 36000 || 12000 + 24000* 2) {
            
        }
    })
    
}

ItemEvents.rightClicked('minecraft:bone_meal',event=>{
    CoalChestList.forEach(pos=>{
        let blockPos = new BlockPos(pos.x,pos.y,pos.z)
        let block = event.level.getBlock(blockPos)
        block.mergeEntityData({LootTable:"kubejs:chests/coal_chest"})
    })
})

/**
 * 
 * @param {Internal.ItemClickedEventJS_} event 
 */
function DarkEvent(event){

    if(event.level.isDay()) return;
    //只在黑夜尝试触发一次,概率为0.1
    let random = Math.random();
    if (random<0.9) return;

    //已经触发成功的事件不会再次触发
    if (KJSgameEvents.indexOf("DarkEvent") != -1) return;
    KJSgameEvents.push("DarkEvent")
    //event.server.tell("§4今夜似乎格外黑暗")
  
    event.server.players.forEach(
        /**@param {Internal.Player_} player*/
        player=>{
        let flag = player.persistentData.get("isPlayer")
        if(flag == true){
            player.potionEffects.add("minecraft:darkness",10000,0)
        }
    })
}

EntityEvents.death('customnpcs:customnpc',event=>{
    let name = event.entity.name.getString()
    //击杀boss胜利触发
    WinTrigger = true
})

ServerEvents.command(event=>{
    let input = event.input
    let player = event.parseResults.context.source.entity
    let op = false
    if (player instanceof $Player) {
        op = player.isOp()
    }


    
    if (
        input.includes('kjs') ||
        input.includes('kubejs') ||
        input.includes('data')
        
    ) {
        if (!op) {
            player.tell("§c无权限执行该命令")
            event.cancel()
        }
        
    }
    
})
