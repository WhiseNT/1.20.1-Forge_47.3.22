/**
 * @param {Internal.LivingEntityHurtEventJS_} event
 */
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingDamageEvent', event => {
    if (event.source.player){
        global.DamageCoreByPlayer(event)
    }
    else{
        global.DamageCoreByOther(event)
    }
})



ForgeEvents.onEvent('net.minecraftforge.client.event.ContainerScreenEvent$Render$Foreground',event=>{
    global.render(event)
})
const $InventoryScreen = Java.loadClass('net.minecraft.client.gui.screens.inventory.AnvilScreen')

/**
 * 
 * @param {Internal.ContainerScreenEvent$Render} event 
 */
global.render = event =>{

    let gui = event.guiGraphics
    if (Client.screen instanceof $InventoryScreen) {
        gui.blit('minecraft:textures/item/acacia_boat.png',
            20,80,
            0,0,
            32,32,
            32,32)
        gui.blit
    }
   
    
}

ForgeEvents.onEvent('net.minecraftforge.client.event.ComputeFovModifierEvent',event=>{
    global.FovModifier(event)
})
/**@param {Internal.ComputeFovModifierEvent_} event*/
global.FovModifier = event =>{
    let player = event.getPlayer()
    let fov = event.getFovModifier()
    if (player.isUsingItem()) {
        let item = player.useItem
        if (item == 'minecraft:enchanted_golden_apple') {
            let tick = player.getTicksUsingItem()
            let f1 = tick/20
            if (f1 > 1.0) {
                f1 = 1.0;
            }else {f1 *= f1;}
            fov *= 1.0 - f1 * 2;
        }
    }
    event.setNewFovModifier(fov);
}