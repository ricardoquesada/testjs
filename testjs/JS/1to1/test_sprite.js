/*
 * showcasing sprite
 */

/**
 * simple wrappers
 */
cocos.Point.create = function (x, y) {
	var pt = new cocos.Point();
	pt.x = x;
	pt.y = y;
	return pt;
};

cocos.Size.create = function (w, h) {
	var sz = new cocos.Size();
	sz.width = w;
	sz.height = h;
	return sz;
};

cocos.Sprite.create = function (file) {
	var s = new cocos.Sprite();
	s.initWithFile(file);
	return s;
};

cocos.Sprite.createWithFrameName = function (frameName) {
	var s = new cocos.Sprite();
	s.initWithSpriteFrameName(frameName);
	return s;
};


var pointZero = cocos.Point.create(0, 0);
var sizeZero = cocos.Size.create(0, 0);

var director = cocos.Director.sharedDirector();
var winSize = director.winSize;

var scenes = {};
scenes.currentScene = 1;

//
// Non Batch
//
scenes['test_non_batch'] = function () {
	
	var spriteFrameCache = cocos.SpriteFrameCache.sharedSpriteFrameCache();
	spriteFrameCache.addSpriteFramesWithFile("grossini.plist");

	var s1 = new cocos.Sprite.createWithFrameName("grossini_dance_05.png");
	s1.position = cocos.Point.create(winSize.width / 2, winSize.height / 2);

	// Layer
	var layer = new cocos.Layer(); layer.init();
	layer.isTouchEnabled = true;
	layer.ccTouchesBegan = function (touches) {
		for (var i in touches) {
			var pt = touches[i].locationInView();
			pt = director.convertToGL(pt);
			var sprite_filename = "grossini_dance_0" + Math.round( Math.random() * 8 + 1) + ".png";
			var s = new cocos.Sprite.createWithFrameName( sprite_filename );
			s.position = pt;
			this.addChild(s);
		}
	};
	layer.addChild(s1);
	
	var scene = new cocos.Scene(); scene.init();
	scene.addChild(layer);
	
	
	// add the menu
	var menu = createMenuWithSubtitle("Non Batched Sprites", "Tap on the screen");
	scene.addChild(menu, 1);
	
	return scene;
};

//
// Non Batch
//
scenes['test_batch'] = function () {

	var spriteFrameCache = cocos.SpriteFrameCache.sharedSpriteFrameCache();
	spriteFrameCache.addSpriteFramesWithFile("grossini.plist");
	

	// batch Node
	var parent = new cocos.SpriteBatchNode();
	parent.initWithFile("grossini.pvr.gz", 30);
	
	var s1 = new cocos.Sprite.createWithFrameName("grossini_dance_05.png");
	s1.position = cocos.Point.create(winSize.width / 2, winSize.height / 2);
	
	parent.addChild( s1 );
	
	// Layer
	var layer = new cocos.Layer(); layer.init();
	layer.isTouchEnabled = true;
	layer.ccTouchesBegan = function (touches) {
		for (var i in touches) {
			var pt = touches[i].locationInView();
			pt = director.convertToGL(pt);
			var sprite_filename = "grossini_dance_0" + Math.round( Math.random() * 8 + 1) + ".png";
			var s = new cocos.Sprite.createWithFrameName( sprite_filename );
			s.position = pt;
			parent.addChild(s);
		}
	};
	layer.addChild(parent);
	
	var scene = new cocos.Scene(); scene.init();
	scene.addChild(layer);
	
	
	// add the menu
	var menu = createMenuWithSubtitle("Batched Sprites", "Tap on the screen");
	scene.addChild(menu, 1);
	
	return scene;
};

/*********************************************************************************************************/

/**
 * from here on there's code that can be shared between different tests
 * basically is the hud and the scene handling
 */

// changes to the next scene
var nextScene = function () {
	var l = Object.keys(scenes).length;
	scenes.currentScene = (scenes.currentScene + 1) % l;
	if (scenes.currentScene === 0) {
		scenes.currentScene = 1;
	}
	playCurrentScene();
};

// changes to the previous scene
var prevScene = function  () {
	var l = Object.keys(scenes).length;
	scenes.currentScene -= 1;
	if (scenes.currentScene < 1) {
		scenes.currentScene = l - 1;
	}
	playCurrentScene();
};

var playCurrentScene = function () {
	var name = Object.keys(scenes)[scenes.currentScene];
	var scene = scenes[name]();
	// cocos.log("running scene: " + name + "(" + scene + ")");
	if (director.runningScene === null) {
		director.runWithScene(scene);
	} else {
		director.replaceScene(scene);
	}
};

// creates the hud
var createMenuWithSubtitle = function (labelText, subtitleText) {
	var hudMenu = new cocos.Menu();
	hudMenu.init();
	
	var b1 = new cocos.Sprite(); b1.initWithFile("b1.png");
	var b2 = new cocos.Sprite(); b2.initWithFile("b2.png");
	item1 = new cocos.MenuItemSprite();
	item1.initFromNormalSprite(b1, b2);
	item1.action = function () {
		prevScene();
	};
	
	var r1 = new cocos.Sprite(); r1.initWithFile("r1.png");
	var r2 = new cocos.Sprite(); r2.initWithFile("r2.png");
	item2 = new cocos.MenuItemSprite();
	item2.initFromNormalSprite(r1, r2);
	item2.action = function () {
		// cocos.executeScript("JS/1to1/test_actions.js");
		playCurrentScene();
	};
	
	var f1 = new cocos.Sprite(); f1.initWithFile("f1.png");
	var f2 = new cocos.Sprite(); f2.initWithFile("f2.png");
	item3 = new cocos.MenuItemSprite();
	item3.initFromNormalSprite(f1, f2);
	item3.action = function () {
		nextScene();
	};
	
	var c1 = new cocos.Sprite(); c1.initWithFile("r1.png");
	var c2 = new cocos.Sprite(); c2.initWithFile("r2.png");
	item4 = new cocos.MenuItemSprite();
	item4.initFromNormalSprite(c1, c2);
	item4.action = function () {
		cocos.executeScript("JS/1to1/test_ease_actions.js");
	};
	
	item1.position = cocos.Point.create(winSize.width / 2 - 100, 30);
	item2.position = cocos.Point.create(winSize.width / 2      , 30);
	item3.position = cocos.Point.create(winSize.width / 2 + 100, 30);
	item4.position = cocos.Point.create(30, winSize.height - 30);
	
	hudMenu.addChild(item1);
	hudMenu.addChild(item2);
	hudMenu.addChild(item3);
	hudMenu.addChild(item4);
	hudMenu.position = pointZero;
	
	if (labelText) {
		var label = new cocos.LabelTTF();
		// initWithString: text, size, alignment, font, fontSize
		label.initWithString(labelText, sizeZero, 0, "Arial", 32.0);
		label.position = cocos.Point.create(winSize.width / 2, winSize.height - 30);
		hudMenu.addChild(label);
	}
	
	if(subtitleText) {
	   var label = new cocos.LabelTTF();
	   // initWithString: text, size, alignment, font, fontSize
	   label.initWithString(labelText, sizeZero, 0, "Thonburi", 16.0);
	   label.position = cocos.Point.create(winSize.width / 2, winSize.height - 60);
	   hudMenu.addChild(label);
	}
	
	// just to avoid GC
	hudMenu.items = [item1, item2, item3];
	return hudMenu;
};

// creates the hud
var createMenu = function (labelText) {
	return createMenuWithSubtitle(labelText, null);
};

playCurrentScene();
