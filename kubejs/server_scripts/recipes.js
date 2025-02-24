//对配方进行修改

//总map  用于记录游戏内制造的东西 前一表示id  后一表示是否有被下毒
let ItemMap = {
    'crockpot:monster_lasagna':[[0,1]],

}
//构建Shapeless配方对象, 输出为key,value包含输入和stage 用以直接向配方和tag事件注入
//如果不需要职业就能合成 请写 "no"
/**@type {Object} */
let ShapelessRecipes = {
    'crockpot:monster_lasagna':
        [[
        'minecraft:bread','minecraft:rotten_flesh',
		'minecraft:bread','minecraft:rotten_flesh','minecraft:bread'
        ],
        "chef",
        "food"
        ]

}
let ShapedRecipes = {
    'minecraft:beetroot':
        [[
            [
                'DW ',
                '   ',
                '   '
            ], {
                D: 'minecraft:diamond',
                W: 'minecraft:white_wool'
            }
        ],
        "doctor",
        "food"
        ],
    

}
/**
 * 
 * @param {Internal.ObjectSet} obj
 */

ServerEvents.recipes(event=>{
    
    Object.entries(ShapelessRecipes).forEach(([output, data])  => {
        event.shapeless(output,data[0]).modifyResult(
            /**@param {Internal.Item} outputItem*/
            (inputItems,outputItem)=>{
                let flag = 0
                let items = inputItems.findAll()
                for (let i = 0; i < items.length; i++) {
                    if (items[i].hasNBT() && items[i].nbt.id != undefined) {
                        flag = ItemMap[items[i].id][items[i].nbt.id][1]
                    }
                }
                
                
            let stringID = outputItem.id
            let nbt = {id:ItemMap[stringID].length}
            ItemMap[stringID].push([ItemMap[stringID].length,flag])
            return Item.of(outputItem).withNBT(nbt)
        }).stage(data[1])
    });
    Object.entries(ShapedRecipes).forEach(([output, data])  => {
        event.shaped(output,data[0][0],data[0][1]).modifyResult(
            /**@param {Internal.ItemStack_} outputItem*/
            (inputItems,outputItem)=>{
                let flag = 0
                let items = inputItems.findAll()
                for (let i = 0; i < items.length; i++) {
                    if (items[i].hasNBT() && items[i].nbt.id != undefined) {
                        flag = ItemMap[items[i].id][items[i].nbt.id][1]
                    }
                }
            let stringID = outputItem.id
            let nbt = {}
            if (ItemMap[stringID] == undefined) {
                nbt = {id:0}
                ItemMap[stringID] = []
                ItemMap[stringID].push([0,flag])
            } else {
                nbt = {id:ItemMap[stringID].length}
                ItemMap[stringID].push([ItemMap[stringID].length,flag])
            }
            return Item.of(outputItem).withNBT(nbt)
        }).stage(data[1])
        
    });
})

//对于特定职业才能进行合成的物品，我们对其打上特定的tag以便于tooltip提示合成需求
ServerEvents.tags("item",event=>{
    Object.entries(ShapelessRecipes).forEach(([output, data])  => {
        let tagKey = "kubejs:"+data[1]
        event.add(tagKey,output)
    });
    Object.entries(ShapedRecipes).forEach(([output, data])  => {
        let tagKey = "kubejs:"+data[1]
        
        event.add(tagKey,output)
    });
    event.add("kubejs:toxin",'minecraft:spider_eye')

    //为食物和合成食物的材料打上食物标签
    Object.entries(ShapelessRecipes).forEach(([output, data])  => {
        if (data[2] != "food") {
            return
        }
        let tagKey = "kubejs:"+data[2]
        data[0].forEach(item=>{
            event.add(tagKey,item)
        })
        event.add(tagKey,output)
    });
    //为食物和合成食物的材料打上食物标签
    Object.entries(ShapedRecipes).forEach(([output, data])  => {
        if (data[2] != "food") {
            return
        }
        let tagKey = "kubejs:"+data[2]
        let items = Object.values(data[0][1])
        items.forEach(i=>{
            event.add(tagKey,i)
        })
        event.add(tagKey,output)
    });
    
})
function isFood(item,player) {
    return item.getFoodProperties(player) != null
}

//下毒配方
ServerEvents.recipes(event=>{
    event.shapeless(Item.of('minecraft:bread',"{setting:true}"),
    ["#kubejs:food","#kubejs:toxin"])
    //.stage("wolf")
    .modifyResult((inputItems,outputItem)=>{
        let items = inputItems.findAll()
        for (let i = 0; i < items.length; i++) {
            if (items[i].hasTag("kubejs:food")) {
                let stringID = items[i].id
                if (ItemMap[stringID] == undefined) {
                    ItemMap[stringID] = []
                }
                let nbt = {id:ItemMap[stringID].length}
                ItemMap[stringID].push([ItemMap[stringID].length,1])    
                return items[i].withNBT(nbt)
            }
            
        }
    })
})
