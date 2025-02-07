
//用于修改在职业选择器中各个职业的文本
ItemEvents.tooltip(event=>{
    event.addAdvanced("crockpot:crock_pot",(item,advanced,text)=>{
        if(item.nbt == null) return
        if (item.nbt.contains("identity")) {
            text.remove(0)
            text.add(0,Text.of("选择成为厨师"))
            text.add(1,Text.of("解锁厨师配方合成"))
            text.add(2,Text.of("获取厨师套装"))
        }})
    event.addAdvanced("minecraft:golden_apple",(item,advanced,text)=>{
        if(item.nbt == null) return
        if (item.nbt.contains("identity")) {
            text.remove(0)
            text.add(0,Text.of("选择成为医生"))
            text.add(1,Text.of("解锁医生配方合成"))
            text.add(2,Text.of("获取医生套装"))
        }})
}
)

//职业特别物品tooltip
ItemEvents.tooltip(event=>{

    event.addAdvanced("#kubejs:chef",(item,advanced,text)=>{
        if (identityClient != "chef") {
            text.add(1,Text.of("§c需要成为厨师才能合成该物品"))
        }});
    event.addAdvanced("#kubejs:doctor",(item,advanced,text)=>{
        if (identityClient != "doctor") {
            text.add(1,Text.of("§c需要成为医生才能合成该物品"))
        }})
})
//菜单tooltip
ItemEvents.tooltip(event=>{
    //
    event.addAdvanced("player_head",(item,advanced,text)=>{
        let name = item.nbt.get("SkullOwner").Name

        let flag = PlayerInvoledList.filter(e=>e == name).toString()
        let wolfFlag = PlayerWolfList.filter(e=>e == name).toString()
        if(flag.includes(name)){
            text.add(1,Text.of("§6玩家已参与游戏"))
        }else{
            text.add(1,Text.of("§8玩家未参与游戏"))
        }
        if(wolfFlag.includes(name)){
            text.add(1,Text.of("§c狼人"))
        }
        });
    event.addAdvanced('minecraft:ender_eye',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§3后一页"))
        }
    })
    event.addAdvanced('minecraft:ender_pearl',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§3前一页"))
        }
    })
    event.addAdvanced('minecraft:feather',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§6狼人数量"))
        }
    })
    event.addAdvanced('minecraft:snowball',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§6随机抽取狼人"))
        }
    })
    event.addAdvanced('minecraft:nether_star',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§e玩家-狼人设置"))
        }
    })
    event.addAdvanced('minecraft:golden_carrot',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§e开始游戏"))
        }
    })
    event.addAdvanced('minecraft:lava_bucket',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§c清空数据"))
            text.add(1,Text.of('§4(!清除长效数据,连续游戏不必点击)'))
        }   
    })
    event.addAdvanced('minecraft:clock',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§6跳过一天"))
        }
    })
    event.addAdvanced('minecraft:paper',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.list == 1){
            text.remove(0)
            text.add(0,Text.of("§6游戏数据"))
        }
    })
    event.addAdvanced('minecraft:paper',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.list == 2){
            text.remove(0)
            text.add(0,Text.of("§6排行榜"))
        }
    })



    //狼人物品tooltip
    event.addAdvanced('minecraft:spider_eye',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.add(1,Text.of("§c毒物"))
            text.add(2,Text.of("§c与食材进行合成可使其带有毒性"))
            text.add(3,Text.of("§c中毒者在7分钟后会死亡"))
        }
    })
    event.addAdvanced('minecraft:bread',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.add(1,Text.of("§c物品仅做展示,下毒能正常匹配对应的物品"))
        }
    })

    event.addAdvanced('minecraft:sculk_sensor',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§c§l黑暗诅咒"))
            text.add(1,Text.of("§c让所有非狼人玩家失明20秒"))
        }
    })
    event.addAdvanced('minecraft:creeper_spawn_egg',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§c§l爆炸诅咒"))
            text.add(1,Text.of("§c在某位玩家的附近召唤数只苦力怕"))
        }
    })
    event.addAdvanced('minecraft:pillager_spawn_egg',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.setting == true){
            text.remove(0)
            text.add(0,Text.of("§c§l袭击诅咒"))
            text.add(1,Text.of("§c在某位玩家的附近召唤召唤袭击"))
        }
    })
    event.addAdvanced('minecraft:ender_pearl',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.wolf == true){
            text.remove(0)
            text.add(0,Text.of("§b§l灵魂疾行"))
            text.add(1,Text.of("§b进入观察者模式10秒"))
        }
    })
    event.addAdvanced('minecraft:gold_nugget',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.type == "blindness"){
            text.remove(0)
            text.add(0,Text.of("§c黑暗诅咒"))
        }
    })
    event.addAdvanced('minecraft:gold_nugget',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.type == "creeper"){
            text.remove(0)
            text.add(0,Text.of("§c爆炸诅咒"))
        }
    })
    event.addAdvanced('minecraft:gold_nugget',(item,advanced,text)=>{
        if(item.nbt == null) return
        if(item.nbt.type == "pillager"){
            text.remove(0)
            text.add(0,Text.of("§c袭击诅咒"))
        }
    })

})
