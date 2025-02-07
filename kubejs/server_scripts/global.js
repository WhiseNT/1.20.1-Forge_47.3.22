//priority:10


let BossHurtObject = {}
let PlayerHurtObject = {}
/**
 * 玩家造成伤害的核心计算函数
 * @param {Internal.LivingDamageEvent_} event 
 * @returns
 */
global.DamageCoreByPlayer = event => {

    let player =event.source.player
    let name = player.name.getString()
    let type = event.entity.getType()
    if (type == 'customnpcs:customnpc') {
        
        if (BossHurtObject[name] == undefined) {
            BossHurtObject[name] = event.amount
        }
        BossHurtObject[name] += event.amount
        event.source.player.tell(BossHurtObject[name])
    }
}

/**
 * 非玩家造成伤害的核心计算函数
 * @param {Internal.LivingDamageEvent_} event 
 * @returns
 */
global.DamageCoreByOther = event => {
    if (event.entity instanceof $Player) {
        let name = event.entity.name.getString()
        if (PlayerHurtObject[name] == undefined) {
            PlayerHurtObject[name] = event.amount
        }
        PlayerHurtObject[name] += event.amount
        //event.entity.tell(PlayerHurtObject[name])
         
    }
    
    
}
