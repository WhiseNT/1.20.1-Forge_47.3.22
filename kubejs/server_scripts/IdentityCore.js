/**
 * 身份： 通用、厨师、医生、    狼人
 *        common、cook doctor   wolf
 */
let identityTrigger = {}
/**
 * 本函数用于赋予玩家指定的职业
 * @param {*} event
 * @param {String} identityName
 */
function identitySetting(event,identityName) {
    let player = event.player
    player.persistentData.merge({identity:identityName})
                player.sendData("identityToClient",{identity:identityName})
                //保证玩家只有一个职业（阶段）
                event.player.stages.getAll().forEach(stg=>{
                    event.player.stages.remove(stg)
                })
                player.stages.add(identityName)
}
ItemEvents.rightClicked('minecraft:music_disc_13',event=>{
    /**@type {Internal.ServerPlayer} */
    let player = event.player
    identityTrigger[player.name] = true
    player.openChestGUI("身份选择器",3,gui=>{
        
        gui.slot(0,0,slot=>{
            slot.item = Item.of('crockpot:crock_pot',"{identity:true}")
            slot.leftClicked = () =>{
                identitySetting(event,"chef")
                player.closeMenu()
            }
        })
        gui.slot(1,0,slot=>{
            slot.item = Item.of('minecraft:golden_apple', "{identity:true}")
            slot.leftClicked = () =>{
                identitySetting(event,"doctor")
                player.closeMenu()
            }
        })
    })
})
//职业对应的职业装备编写
let IdentitySets = {
    chef:[
        "minecraft:beef",
        "minecraft:beef"
    ],
    doctor:[
        'minecraft:apple'
    ]
}
/**
 * 用于赋予玩家职业套装的函数
 * @param {Internal.InventoryChangedEventJS_} event 
 * @param {Internal.Inventory} inv 
 * @param {String} identity 
 */
function identitySetGive(event,inv,identity) {
    inv.clear()
    inv.setStackInSlot(0,'minecraft:music_disc_13')
    IdentitySets[identity].forEach(item=>{
        event.player.give(item)
    })
}
//负责监听玩家退出身份选择器界面的脚本 在退出后赋予职业套装
PlayerEvents.inventoryChanged(event=>{
    if (identityTrigger[event.player.name] == undefined) {
        return
    }
    identityTrigger[event.player.name] = undefined
    let identity = event.player.persistentData.getString("identity")
    let inv = event.player.inventory
    //依照职业赋予装备
    switch (identity) {
        case "chef":
            identitySetGive(event,inv,identity)
            event.player.tell("你现在是一名厨师")
            break;
        case "doctor":
            identitySetGive(event,inv,identity)
            event.player.tell("你现在是一名医生")
            break;
        default:
            break;
    }
})

