//priority:5
//召唤苦力怕
let CreeperSummonList = [
    ["minecraft:creeper",3]

]
//召唤袭击
let RaidSummonList = [
    ["minecraft:pillager",1],
    ["minecraft:vindicator",1]

]
function SummonEntities(event,SummonList,pos,offset) {
    SummonList.forEach(eType=>{
        let entityType = eType[0]
        let amount = eType[1]
        let entityList = Array(amount).fill(entityType);
        entityList.forEach(entity=>{
            let cEntity = event.level.createEntity(entity)
            
            cEntity.setPos(pos)
            cEntity.setPos(cEntity.getRandomX(offset),cEntity.y+1,cEntity.getRandomZ(offset))
            cEntity.spawn()
        })
    })
}