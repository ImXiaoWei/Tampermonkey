// ==UserScript==
// @name         【幸福西饼】订单快速提交
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cashier.youzan.com/pay/*
// @icon         https://www.xfxb.net/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

window.onload = function() {

		// 显示 送达时间 窗口
		document.getElementsByClassName("van-submit-bar__button")[0].click(function() {})

		setTimeout(function() {

			// 点击 第二个配送时间点
			document.getElementsByClassName("van-tree-select__item")[1].click(function() {})

		}, 100);

		//点击完成按钮
		setTimeout(function() {

			document.getElementsByTagName("button")[3].click(function() {})

		}, 100);

		//点击提交订单按钮
		setTimeout(function() {

			document.getElementsByClassName("van-button__text")[0].click(function() {})

		}, 100);

	}