// ==UserScript==
// @name         【大众点评】详情速看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://t.dianping.com/deal/*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @grant        none
// ==/UserScript==

window.onload = function() {
	var expiryDate //使用日期
	var exceptDate //除外日期
	var useTime //使用时间
	var reserve //是否需要预约

	expiryDate = document.getElementsByClassName("listitem")[0].innerText
	exceptDate = document.getElementsByClassName("listitem")[1].innerText
	useTime = document.getElementsByClassName("listitem")[2].innerText.replace("团购券使用时间：", "")
	reserve = document.getElementsByClassName("listitem")[3].innerText

	console.log("📆使用日期：" + expiryDate + "\n⛔除外日期：" + exceptDate + "\n⌛使用时间：" + useTime + "\n🗒预约提醒：" + reserve);
}
