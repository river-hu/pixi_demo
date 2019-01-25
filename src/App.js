import React, { Component } from 'react';

import './App.css';
import * as PIXI from 'pixi.js'
function randomInt(min, max) { //随机数据
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}
function keyboard(keyCode) { //键盘监听函数
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
function hitTestRectangle(r1, r2) { //碰撞检测函数

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;  //定义计算变量

  //hit will determine whether there's a collision
  hit = false;  //碰撞结果

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2; //计算两个元素的中心位置
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;  //计算两个元素的半宽半高
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
   
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX; //计算两个元素的中心点的横向差与纵向差
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth; // 计算两个元素的半宽的和
  combinedHalfHeights = r1.halfHeight + r2.halfHeight; //计算两个元素的半高的和

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) { //检测横向坐标有没有碰撞

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {//检测纵向坐标有没有碰撞

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
function contain(sprite, container) { //生成周围的墙

  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}
class App extends Component {
  componentDidMount() {
    let left = keyboard(37), //监听上下左右
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  
    let Application = PIXI.Application, //设置别名
      loader = PIXI.loader,
      Sprite = PIXI.Sprite,
      Container = PIXI.Container;
    let TextureCache = PIXI.utils.TextureCache

    var app = new Application({ //创建画布
      width: 520,
      height: 520,
      antialias: true,  //抗锯齿
      transparent: false, //透明度
      resolution: 1.5,   //分辨率
      backgroundColor: 0xffffff
    });

    // app.renderer.resize(800, 600); //缩放画布的大小
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.left = "40%";
    app.renderer.view.style.top = "50%";
    app.renderer.view.style.marginLeft = "-275px";
    app.renderer.view.style.marginTop = "-375px";
    let dungeon, explorer, treasure, id; //素材名

    this.box.appendChild(app.view); //将画布添加到页面上去
    let gameScene = new Container(); //游戏内容容器
    app.stage.addChild(gameScene);

    let gameOverScene = new Container(); //游戏结束容器
    app.stage.addChild(gameOverScene);
    gameOverScene.visible = false;

    let gameController = new Container(); //游戏控制器容器
    app.stage.addChild(gameController);
    
    loader
      .add("http://xueersiimg.xrspy.com/game1treasureHunter.json")
      .load(setup);
    function setup() { //加载页面资源
      let dungeonTexture = TextureCache["dungeon.png"]; //加载背景图
      dungeon = new Sprite(dungeonTexture);
      gameScene.addChild(dungeon);
      explorer = new Sprite(  //加载人物
        PIXI.loader.resources["http://xueersiimg.xrspy.com/game1treasureHunter.json"].textures["explorer.png"]
      );
      explorer.x = 68;
      explorer.y = app.stage.height / 2 - explorer.height / 2;
      gameScene.addChild(explorer); //将人物添加到页面上
      id = PIXI.loader.resources["http://xueersiimg.xrspy.com/game1treasureHunter.json"].textures; //注册id
      treasure = new Sprite(id["treasure.png"]); //加载宝箱
      gameScene.addChild(treasure); //将宝箱添加到页面上
      treasure.x = app.stage.width - treasure.width - 48;
      treasure.y = app.stage.height / 2 - treasure.height / 2;
      gameScene.addChild(treasure); //配置页面属性
      let door = new Sprite(id["door.png"]); //加载门
      door.position.set(32, 0); //定位门的位置
      gameScene.addChild(door); //将门添加到页面上
      let numberOfBlobs = 6,  //幽灵的数量
        spacing = 48,  //幽灵的宽度
        xOffset = 150, //幽灵的间隔
        speed = 5,
         direction = 1;
         let blobs = [];
      //Make as many blobs as there are `numberOfBlobs`
      for (let i = 0; i < numberOfBlobs; i++) {

        //Make a blob
        let blob = new Sprite(id["blob.png"]); //加载幽灵资源

        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        //at which the first blob should be added.
        let x = spacing * i + xOffset; //横向偏移距离

        //Give the blob a random y position
        //(`randomInt` is a custom function - see below)
        let y = randomInt(20, app.stage.height - blob.height - 35); //随机纵向距离

        //Set the blob's position
        blob.x = x;
        blob.y = y;
        blob.vy = speed * direction;
        direction *= -1;
        blobs.push(blob);
        //Add the blob sprite to the stage
        gameScene.addChild(blob);  //将幽灵添加到页面上
       
      }
      //Create the health bar
      console.log(app.view.width)
    let healthBar = new PIXI.DisplayObjectContainer(); //制作血条
    healthBar.position.set(375, 3)
    gameScene.addChild(healthBar);
      //-----------------------------------------------------------------------------------------
    //Create the black background rectangle
    let innerBar = new PIXI.Graphics(); //绘制血条
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    //Create the front red rectangle
    let outerBar = new PIXI.Graphics(); //剩余血量
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);
    healthBar.outer = outerBar; 
    healthBar.outer.width = 128;
      //-----------------------------创建文字----------------------------------------------------------------
      let style = new PIXI.TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "black"
      });
    let message = new PIXI.Text("The End!", style);
    message.x = 120;
    message.y = app.stage.height / 2 - 32;
    gameOverScene.addChild(message);
 
      //-------------------------------绘制难度设置--------------------------------------

      //------------------------------------------------------------------
      explorer.vx = 0;  //人物横向的速度
      explorer.vy = 0; //人物纵向的速度
      let state = null ;
      state = play;
      app.ticker.add(delta => gameLoop(delta)); //加载需要移动的动画

        function gameLoop(delta){ //移动刷新
          state();
          
        } 
       
        function play(delta){ //游戏执行的代码
                
          //Move the cat 1 pixel
          explorer.x += explorer.vx;
          explorer.y += explorer.vy;
          let explorerHit = false; //怪物的碰撞检测
          //----------------------------移动怪物----------------------------------------------------
          blobs.forEach(function(blob) { // 怪物循环检测

            //Move the blob
            blob.y += blob.vy;
          
            //Check the blob's screen boundaries
            let blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480}); //与墙的碰撞检测
          
            //If the blob hits the top or bottom of the stage, reverse
            //its direction
            if (blobHitsWall === "top" || blobHitsWall === "bottom") { //到达顶部或者底部修改方向
              blob.vy *= -1;
            }
            
            //Test for a collision. If any of the enemies are touching
            //the explorer, set `explorerHit` to `true`
            if(hitTestRectangle(explorer, blob)) { //检测精灵与怪物的碰撞
              explorerHit = true;
            }
            if(explorerHit) { //检测碰撞血量检测
                  
              //Make the explorer semi-transparent
              explorer.alpha = 0.5;
            
              //Reduce the width of the health bar's inner rectangle by 1 pixel
              healthBar.outer.width -= 5;
              
            } else { //恢复人物透明度
              
              //Make the explorer fully opaque (non-transparent) if it hasn't been hit
              explorer.alpha = 1;
            }
            //-----------------------检测人物与墙的碰撞------------------------------------------
            let explorerWall = contain(explorer, {x: 28, y: 10, width: 488, height: 480}); //与墙的碰撞检测
            if(explorerWall==='left'){
              explorer.vx = 0
            } 
            if(explorerWall==='right'){
              explorer.vx = 0
            } 
            if(explorerWall==='top'){
              explorer.vy = 0
            } 
            if(explorerWall==='bottom'){
              explorer.vy = 0
            } 
            if (healthBar.outer.width <= 0) {
              state = end;
              message.text = "You lost!";
            }
            if (hitTestRectangle(explorer, treasure)) { //检测人物与宝箱的碰撞
              treasure.x = explorer.x + 8;
              treasure.y = explorer.y + 8;
            }
            if (hitTestRectangle(treasure, door)) {
              state = end;
              message.text = "You won!";
            }
          });
        }
        function end(){ //游戏结束的代码
          gameOverScene.visible=true
          // gameScene.visible=false
        }
        left.press = () => { //左移
          //Change the cat's velocity when the key is pressed
          explorer.vx = -5;
          explorer.vy = 0;
        };
      
        //Left arrow key `release` method
        left.release = () => { //释放左移
          //If the left arrow has been released, and the right arrow isn't down,
          //and the explorer isn't moving vertically:
          //Stop the explorer
          if (!right.isDown && explorer.vy === 0) {
            explorer.vx = 0;
          }
        };
      
        //Up
        up.press = () => { //上移
          explorer.vy = -5;
          explorer.vx = 0;
        };
        up.release = () => { //释放上移
          if (!down.isDown && explorer.vx === 0) {
            explorer.vy = 0;
          }
        };
      
        //Right
        right.press = () => { //右移
          explorer.vx = 5;
          explorer.vy = 0;
        };
        right.release = () => { //释放右移
          if (!left.isDown && explorer.vy === 0) {
            explorer.vx = 0;
          }
        };
      
        //Down
        down.press = () => { //下移
          explorer.vy = 5;
          explorer.vx = 0;
        };
        down.release = () => { //释放下移
          if (!up.isDown && explorer.vx === 0) {
            explorer.vy = 0;
          }
        };
    }
  }
  render() {
    return (
      <div className="App">
        <div ref={(box) => { this.box = box; }}></div>
      </div>
    );
  }
}

export default App;
