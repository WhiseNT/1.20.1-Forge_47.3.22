ItemEvents.rightClicked("stick",event=>{
    let sp = event.player.abilities.getFlyingSpeed()
    let wk = event.player.abilities.getWalkingSpeed()
    //event.player.abilities.setFlyingSpeed(0.1)
    event.player.tell(sp)
    event.player.tell(wk)
})