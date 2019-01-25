import React, { Component } from 'react';

import './App.css';
import * as PIXI from 'pixi.js'

class App extends Component {
  componentDidMount() {
    let Application = PIXI.Application,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Sprite = PIXI.Sprite;
    let TextureCache = PIXI.utils.TextureCache
    var app = new Application({
      width: 800,
      height: 600,
      antialias: true,  //抗锯齿
      transparent: false, //透明度
      resolution: 1.5,   //分辨率
      backgroundColor: 0xf1f1f1
    });
    // app.renderer.resize(800, 600); //缩放画布的大小
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    this.box.appendChild(app.view);

    // var container = new PIXI.Container();

    // app.stage.addChild(container);
    console.log(this.box)
    // var texture = PIXI.Texture.fromImage('http://xueersiimg.xrspy.com/logo.png');
    // center the sprite's anchor point
    loader
      .add(['http://xueersiimg.xrspy.com/material.png',
     
      ])
      .on("progress", loadProgressHandler)
      .load(setup);
    function loadProgressHandler(loader, resource) {
      console.log("progress: " + loader.progress + "%");
    }
    function setup() {
      console.log('load')
      let sprite = new Sprite(resources["http://xueersiimg.xrspy.com/material.png"].texture);
      // sprite.x = 400;
      // sprite.y = 200;
      sprite.position.set(450, 250) //移动位置
      sprite.scale.set(1.5,1.5); //缩放
      // sprite.width=500
      // sprite.height=200
      sprite.anchor.set(.5, .5)
      sprite.rotation = 0.5;
      app.stage.addChild(sprite); //添加精灵

      // app.stage.removeChild(sprite)  //删除精灵
      // sprite.visible = false; //隐藏精灵
    }


    // for (var i = 0; i < 10; i++) {
    //   var bunny = new PIXI.Sprite(texture);
    //   bunny.anchor.set(0.5);
    //   bunny.x = (i % 2) * 800;
    //   bunny.y = Math.floor(i / 2) * 90;
    //   container.addChild(bunny);
    // }
    // container.x = app.screen.width / 2;
    // container.y = app.screen.height / 2;
    // // container.anchor.set(0.5);

    // // move the sprite to the center of the screen
    // container.pivot.x = container.width / 2;
    // container.pivot.y = container.height / 2;
    // // app.stage.addChild(bunny);
    // container.scale.x *= .2;
    // container.scale.y *= .2;
    // Listen for animate update
    // app.ticker.add(function (delta) {
    //   // just for fun, let's rotate mr rabbit a little
    //   // delta is 1 if running at 100% performance
    //   // creates frame-independent transformation
    //   container.rotation += 0.001 * delta;
    // });
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
