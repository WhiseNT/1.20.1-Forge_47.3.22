ClientEvents.tick(event=>{
    if (poisonState != true) {
        event.player.paint({Time:{type:"text",remove:true}})
        return
    }
    //poisonTime = 7 * 60 * 20
    let MinuteTime = KMath.floor(poisonTime/20/60) 
    let SecondTime = KMath.floor((poisonTime /20 - MinuteTime*60))
    let RS = SecondTime.toString()
    if (SecondTime < 10) {
        RS = "0" + SecondTime.toString()
    }
    
    event.player.paint({Time:{
            type:"text",x:0,y:-50,
            text: MinuteTime.toString()+":"+RS,
            color:"red",
            scale: 3,
            alignX:"center",alignY:"center",draw: 'ingame'
        }})
    poisonTime -= 1
    if (poisonTime<= 0) {
        poisonState = false
    }
})