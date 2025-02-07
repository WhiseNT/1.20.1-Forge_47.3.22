// priority: 1000

//用于向客户端传递玩家当前职业数据的事件
let identityClient = ''
let PlayerInvoledList = []
let PlayerWolfList = []
let poisonState = false
let poisonTime = 7 * 60 * 20
NetworkEvents.dataReceived("identityToClient",event=>{
    identityClient = event.data.get("identity")

})

NetworkEvents.dataReceived("PlayerInvoled",event=>{
    
    PlayerInvoledList = event.data.involed
})
NetworkEvents.dataReceived("PlayerIsWolf",event=>{
    
    PlayerWolfList = event.data.wolfList
})
NetworkEvents.dataReceived("poison",event=>{
    poisonState = true
    if (poisonTime < 6 * 60 * 20) {
        return
    }
    poisonTime = 6 * 60 * 20
})
NetworkEvents.dataReceived("spectator",event=>{
    let data = event.data
    let time = data.getInt("time")
    event.player.paint({spectator:{
        type:"text",x:0,y:-50,
        text: (time/20).toFixed(0).toString(),
        color:"red",
        scale: 3,
        alignX:"center",alignY:"center",draw: 'ingame'
    }})
    let loop = Client.scheduleRepeatingInTicks(20,()=>{
        time -= 20
        event.player.paint({spectator:{
            type:"text",x:0,y:-50,
            text: (time/20).toFixed(0).toString(),
            color:"red",
            scale: 3,
            alignX:"center",alignY:"center",draw: 'ingame'
        }})
        
        if (time == 0) {
            loop.clear()
            event.player.paint({spectator:{type:"text",remove:true}})
        }
    })
})

NetworkEvents.dataReceived("furnace",event=>{
    let data = event.data
    let block = event.level.getBlock(data.x,data.y,data.z)
    event.level.blockUpdated(block.pos,"blast_furnace")
})

NetworkEvents.dataReceived('ChatChannel',event=>{
    let data = event.data
    Client.tell(data.L+data.sender+data.msg)
})
