let coalList = []
let CoalGUITrigger = {}
let CoalProgress = 0
let CoalInputAmount = {}
let CoalFindAmount = {}
let WinCoalAmount = 100
let $Blasting_Furnance = Java.loadClass('net.minecraft.world.level.block.BlastFurnaceBlock')
let $BlockStateProperties = Java.loadClass('net.minecraft.world.level.block.state.properties.BlockStateProperties')
const $Boolean = Java.loadClass('java.lang.Boolean')

PlayerEvents.chestOpened("generic_9x3",event=>{
    let block = event.block
    
    let inv = event.inventory
    let name = event.player.name.getString()
    inv.allItems.forEach(item=>{
        if (item.id == "minecraft:coal" && !item.hasNBT()){
            let id = coalList.length
            coalList.push(id)
            let objNbt = {
                id:id,
                finder:name
            }
            item.setNbt(objNbt)
            if (CoalFindAmount[name] == undefined) {
                CoalFindAmount[name] = 1
            } else{
                CoalFindAmount[name] += 1
            }
            
        }
    })
})
/**
 * 
 * @param {Internal.TickEvent$ServerTickEvent} event 
 * @param {Internal.Block_} block
 * 
 */
function setFurnaceLITorNot(event,block,time) {
    let pos = block.pos
    
    if (block.blockState.block instanceof $Blasting_Furnance) {
        
        if (time>0) {
            
            //event.level.setBlock(pos,bs,1)
        }else{
            let litFalse = block.blockState.setValue($BlockStateProperties.LIT,$Boolean.FALSE)
            event.server.getLevel('minecraft:overworld').setBlock(pos,litFalse,0)

            //event.level.setBlock(pos,bs,1) 
        }
    }
}
const $ListTag = Java.loadClass('net.minecraft.nbt.ListTag')
ItemEvents.firstRightClicked('minecraft:blaze_rod',event=>{
    let block = event.player.rayTrace(16,false).block
    if (block == null) {
        return
    }
    event.server.persistentData.merge({FurnaceLocation:{x:block.x,y:block.y,z:block.z}})

    //event.server.persistentData.remove("te")
})

ServerEvents.tick(event=>{
    let array = event.server.persistentData.get("involved")
    OpDataSender(event,"PlayerInvoled",{involed:array})
    let WolfArray = event.server.persistentData.get("wolfList")
    OpDataSender(event,"PlayerIsWolf",{wolfList:WolfArray})

    if (event.server.persistentData.get("FurnaceLocation") != undefined) {
        let pos = event.server.persistentData.get("FurnaceLocation")
        let block = event.server.getLevel('minecraft:overworld').getBlock(pos.x,pos.y,pos.z)
        if (block.entityData.getInt("BurnTime") == null) {
            block.setEntityData({BurnTime:0})
        }
        let time = block.entityData.getInt("BurnTime")
        setFurnaceLITorNot(event,block,time)
        if (time > 0) {
            let players = event.server.getLevel('minecraft:overworld').getEntitiesWithin(AABB.of(pos.x,pos.y,pos.z,pos.x,pos.y,pos.z).inflate(6))
            players.forEach(player=>{
                let tem = coldsweat.getTemperature(player,'core')
                if (tem < 40) {
                    coldsweat.setTemperature(player,'core',tem+0.1)
                }
            })
        }
    }
})

PlayerEvents.inventoryOpened("blast_furnace",event=>{

    let block = event.player.rayTrace(16,false).block
    let inv = event.inventoryContainer
    let coalItem = inv.slots.get(1).getItem()
    let gunpowderItem = inv.slots.get(2).getItem()
    
    CoalGUITrigger[event.player.name] = event.server.scheduleRepeatingInTicks(1,()=>{
        
        gunpowderItem = inv.slots.get(0).getItem()
        coalItem = inv.slots.get(1).getItem()
        event.player.paint({
            coalGUI:{
                type:"atlas_texture",
                texture:"minecraft:item/coal",
                x:-4,y:-28,
                alignX:'center',alignY:'center',
                w:10,h:10,draw: 'gui'

            },
            coalText:{
                type:"text",
                text:CoalProgress.toString(),
                color:"red",
                x:-3,y:-16,
                alignX:'center',alignY:'center',draw: 'gui'
            },
            coalTextBackground:{
                type:"text",text:'/'+WinCoalAmount.toString(),color:"red",
                x:17,y:-8,
                alignX:'center',alignY:'center',scale:1.5,draw: 'gui'
            }
        })
        if (coalItem.id == "minecraft:coal") {
            if (!coalItem.hasNBT()) {
            let id = coalList.length
            coalList.push(id)
            coalItem.setNbt({id:id,finder:event.player.name.getString()})
            }
            let finder = coalItem.nbt.get("finder")
            if (CoalInputAmount[finder] == undefined) {
                CoalInputAmount[finder] = 1
            }else{
                CoalInputAmount[finder] += 1
            }
            
            let litTrue = block.blockState.setValue($BlockStateProperties.LIT,$Boolean.TRUE)
            let litFalse = block.blockState.setValue($BlockStateProperties.LIT,$Boolean.FALSE)
            event.level.setBlock(block.pos,litTrue,1)
            event.level.sendBlockUpdated(block.pos,litFalse,litTrue,1)
            coalItem.shrink(1)
            let time = block.entityData.getInt("BurnTime")
            block.mergeEntityData({BurnTime:time+720})
            CoalProgress += 1
            //煤炭搜集胜利触发
            if (CoalProgress >= WinCoalAmount) {
                WinTrigger = true
            }
            

        }
        if(gunpowderItem.id == 'minecraft:gunpowder'){
            if (CoalProgress < 1) {
                return
            }
                gunpowderItem.shrink(1)
                let time = block.entityData.getInt("BurnTime")
                if (time > 240) {
                    block.mergeEntityData({BurnTime:time-240})
                }else if(time <240 && time > 0){
                    block.mergeEntityData({BurnTime:0})
                }
                CoalProgress -= 1
        }
    })
})

PlayerEvents.inventoryClosed("blast_furnace",event=>{
    if (CoalGUITrigger[event.player.name] == undefined) {
        return
    }
    CoalGUITrigger[event.player.name].clear()
    CoalGUITrigger[event.player.name] = undefined
    event.player.paint({coalGUI:{type:"atlas_texture",remove:true},
        coalText:{type:"text",remove:true},coalTextBackground:{type:"text",remove:true}})
})