let CommonCoalChestLoot = [
    ["minecraft:gunpowder",0.1],
    ['minecraft:wheat',0.5],
]



ServerEvents.chestLootTables(event=>{
    event.addChest('kubejs:coal_chest',loot=>{
        loot.addPool(p=>{
            
            p.addTag('air',false)
            p.rolls = 3
        })
    })
})
LootJS.modifiers(event=>{
    CommonCoalChestLoot.forEach(ctx=>{
        event.addLootTableModifier("kubejs:chests/coal_chest")
        .randomChance(ctx[1])
        .addLoot(ctx[0])
    })
})