jQuery( document).ready( function() {
    init();
});

function init() {
    createJSInit();
}

var canvas;
var stage;
var skeletonData;
var texture1x;

function createJSInit() {
    canvas = document.getElementById("canvas");
    stage  = new createjs.Stage(canvas);

    $.getJSON(
        "/theknightbefore/assets/json/knightmare.json",
        function(data) {
            skeletonData = data;
            dragonBonesInit();
            loadTexture();
        }
    )
}

function loadTexture() {

    texture1x = new Image();
    texture1x.onload = function() {
        $.getJSON(
            "/theknightbefore/assets/json/texture.json",
            function(data) {
                textureData1x = data;
                buildArmature("knightmare", texture1x, textureData1x, 1, 1);
            }
        );
    }
    texture1x.src = "/theknightbefore/assets/json/texture.png";
}

var factory;
var armatures;

function dragonBonesInit() {
    factory = new dragonBones.factorys.CreateJSFactory();
    // Animation name
    factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData), "knightmare");

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", update);

    canvas.onclick = changeAnimation;

    armatures = [];
}

function buildArmature(textureAtlasName, texture, textureData, scale, x, y) {
    factory.addTextureAtlas(new dragonBones.textures.CreateJSTextureAtlas(texture, textureData, scale), textureAtlasName);
    // Armature name, then animation name
    var armature = factory.buildArmature("Knightmare", null, "knightmare", textureAtlasName);
    armature.getDisplay().x = x;
    armature.getDisplay().y = y;

    dragonBones.animation.WorldClock.clock.add(armature);
    armatures.push(armature);
    stage.addChild(armature.getDisplay());

    changeAnimation();
}

function update() {
    dragonBones.animation.WorldClock.clock.advanceTime(1 / 60);
    stage.update();
}

function changeAnimation() {
    var armature = armatures[0];
    if (armature) {
        do {
            var animationName = armature.animation.animationNameList[Math.floor(Math.random() * armature.animation.animationNameList.length)];
        }
        while (animationName == armature.animation.getLastAnimationName());

        for (var index in armatures) {
            armature = armatures[index];
            armature.animation.gotoAndPlay(animationName);
        }
    }
}