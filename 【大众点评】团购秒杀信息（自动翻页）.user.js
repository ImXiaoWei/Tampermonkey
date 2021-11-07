// ==UserScript==
// @name         【大众点评】团购秒杀信息（自动翻页）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://t.dianping.com/list/*
// @icon         https://www.dpfile.com/app/pc-common/dp_favicon.a4af753914321c8e82e402e2b4be01d7.ico
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

(function() {
	'use strict';
	// Your code here...
	$("#classify").remove() //删除不必要信息
	$(".line").html( //添加筛选条件选项
		"请选择：<a href='http://t.dianping.com/list/shenzhen-category_1?q=单人&sort=price&pageIndex=0'>   <strong class='name'>【单人】</strong>   </a><a href='http://t.dianping.com/list/shenzhen-category_1?q=双人&sort=price&pageIndex=0'>   <strong class='name'>【双人】</strong>   </a><a href='http://t.dianping.com/list/shenzhen-category_1?q=2人&sort=price&pageIndex=0'>   <strong class='name'>【2人】</strong>   </a><a href='http://t.dianping.com/list/shenzhen-category_1?q=自助&sort=price&pageIndex=0'>   <strong class='name'>【自助餐】</strong>   </a><a href='http://t.dianping.com/list/shenzhen-category_1?q=代金&sort=price&pageIndex=0'>   <strong class='name'>【代金券】</strong>   </a>"
	)
	window.onload = function() {
		/* 团购属性 */
		var title //名称
		var priceOriginal //原价
		var price //现价
		var discount //折扣
		var describe //描述

		var list = $(".tg-floor-item") //列表

		//$(".tg-tab-box tg-floor on").empty() //清空原有列表



		/* 遍历列表 */
		for (var i = 0; i < list.length; i++) {
			title = list.eq(i).find("h3").html() //遍历名称
			priceOriginal = list.eq(i).find("del").html() //遍历原价
			price = list.eq(i).find("em").html() //遍历现价
			discount = ((price / priceOriginal * 10)).toFixed(1) //遍历折扣
			describe = list.eq(i).find("h4").text()

			/* 根据筛选显示列表 */
			if (discount > 3 || priceOriginal < 100) { //删除不符合条件的团购
				list.eq(i).remove()
			} else if (discount <= 3 && priceOriginal >= 100) { //控制台输出符合条件的团购
				console.log(title + describe)
			}
		}
		list = $(".tg-floor-item") //获取筛选完毕后的列表

		/* 获取URL参数 */
		function GetUrlByParamName(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var URL = decodeURI(window.location.search);
			var r = URL.substr(1).match(reg);
			if (r != null) {
				//decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
				return decodeURI(r[2]);
			};
			return null;
		}

		var pageIndex = parseInt(GetUrlByParamName("pageIndex")) //获取当前页数
		var condition = GetUrlByParamName("q") //获取筛选条件
		if (list.length == 0 && pageIndex < 50) { //若当前页无内容则自动跳转下一页
			window.location.href = "http://t.dianping.com/list/shenzhen-category_1?q=" + condition +
				"&sort=price&pageIndex=" + parseInt(pageIndex + 1)
		} else if (list.length == 0 && pageIndex == 50) {
			alert("已到最后一页！")
		}
	}
})();
