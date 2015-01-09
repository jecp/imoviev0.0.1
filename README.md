//2014年开始学着写的，拖到现在，效率奇低
慕课网 前端开发 nodeJS scott node建站攻略（一）
讲师: scott
笔者: jecp

一期就实现简单的几个页面，经多平台测试（mac,W7-64）可以正常运行
需要依赖的模块视频里说的很清楚，正常安装即可，最大的问题在于express3->4的变化，
解决这个当然可以用问答里的方法，比如单独使用body-parser，
markdown:我的建议：npm install express@3.2.2
原因就不说了，你懂的。
还有jade语法问题，可以参看scott的jade视频〜

mongoDB常用命令
跟mysql不太一样，
use dbname
show dbs;
show tables;
db.collection.find/remove
