function Distance(params) {
    
}


PlayerEvents.chat(event=>{
    /**@type {Internal.ServerPlayer_} */
    let player = event.player
    //
    let {x,y,z} = player
    let msg = event.component.string
    let sender ='<'+ player.name.string +'>' +' '
    let entities = event.level.getEntitiesWithin(AABB.of(x,y,z,x,y,z).inflate(32))
    /*
    entities.forEach(entity=>{
        entity.potionEffects.add('glowing',10,1,false,false)
    })
    */

   if (msg.charAt(0) == 33 && (player.isSpectator() || player.isCreative())) {
    event.server.players.forEach(p=>{
        let data = {
            L:'§6[全体] ',
            sender:'§f'+sender,
            msg:msg.slice(1)
        }
        p.sendData('ChatChannel',data)
    })
    event.cancel()
   }else if(!player.isSpectator() && !player.isCreative()){
    let playerList = entities.filter(e=>e.player)
    let spectatorList = event.server.players.filter(p=>p.spectator||p.isCreative())
    playerList.forEach(p=>{
        let data = {
            L:'[L] ',
            sender:sender,
            msg:msg
        }
        if(spectatorList.indexOf(p) == -1){
            p.sendData('ChatChannel',data)
        }
    })
    spectatorList.forEach(p=>{
        let data = {
            L:'§f[监听] ',
            sender:sender,
            msg:msg
        }
        p.sendData('ChatChannel',data)
    })
    event.cancel()
   }
   else if (player.isSpectator() || player.isCreative()){
    let spectatorList = event.server.players.filter(p=>p.spectator||p.isCreative())
    
    spectatorList.forEach(p=>{
        let data = {
            L:'§d[观察者] ',
            sender:'§f'+sender,
            msg:msg
        }
        p.sendData('ChatChannel',data)
    })
    event.cancel()
}
    
    
    
})