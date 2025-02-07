ClientEvents.paintScreen(event=>{
    
})
ItemEvents.rightClicked('minecraft:bone',event=>{
    
    
    
    let entities = Client.level.getEntities()
    let viewVector = event.player.getViewVector(1.0)
    let pPos = event.player.blockPosition()
    //Client.tell(viewVector.normalize())
    const SHeight = Client.window.guiScaledHeight
    const SWidth = Client.window.guiScaledWidth
    Client.level.entities.forEach(e=>{
        let ePos = e.blockPosition() 

            // 计算从玩家到目标的方向向量（忽略y轴）
            let targetVector = {
                x: ePos.x - pPos.x,
                y: ePos.y - pPos.y,
                z: ePos.z - pPos.z
            };
            // 获取视角向量的x和z分量
            let viewX = viewVector.x();
            let viewZ = viewVector.z();
            let viewY = viewVector.y()
            // 计算两个向量之间的夹角（使用点积公式）
            let dotProduct = viewX * targetVector.x + viewZ * targetVector.z;
            let magnitudeView = Math.sqrt(viewX * viewX + viewZ * viewZ);
            let magnitudeTarget = Math.sqrt(targetVector.x * targetVector.x + targetVector.z * targetVector.z);
            let angle = Math.acos(dotProduct / (magnitudeView * magnitudeTarget)); // 角度在 [0, π] 范围内
           
            // 确定目标是在玩家左侧还是右侧
            // 使用叉乘来判断方向
            let crossProduct = viewX * targetVector.z - viewZ * targetVector.x;
            let YcrossProduct = viewY * targetVector.y
            // 如果crossProduct是负数，那么目标在右边；如果是正数，则在左边
            let paint_x ;
            let paint_y
            if (crossProduct < 0) {
                // 右边
                paint_x = -SWidth/2 * (angle / 3.14)*2;
            } else {
                // 左边
                paint_x = SWidth/2 * (angle / 3.14)*2;
            }
            if (YcrossProduct  < 0) {
                paint_y = -SHeight/2 * (angle / 3.14)*2;
            }else {
                // 左边
                paint_y = SHeight/2 * (angle / 3.14)*2;
            }
            let PaintObj = {}
            PaintObj[e.UUID] = {
                type:"atlas_texture",
                texture:'minecraft:item/raw_copper',
                x:paint_x,
                y:paint_y,
                z:0,
                alignX:'center',
                alignY:'center',
                w:20,
                h:20,
                draw: 'ingame'
                }
            event.player.paint(PaintObj)
    })
    

    
})