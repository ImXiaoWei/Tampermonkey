// ==UserScript==
// @name         【大众点评】团购助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://t.dianping.com/list/*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// ==/UserScript==

window.onload = function() {

	//秒杀复选框模板
	var seckillTemplate =
		'<div class="tg-classify-wrap Fix" data-id="classify-item" id="seckill"><dl class="tg-classify-tag tg-classify-simplecheck Fix"><dt class=""><a href="#"><i class="icon"></i><span>秒杀</span><b class="icon"></b></a></dt></dl></div>'

	//自动跳转复选框模板
	var autonextTemplate =
		'<div class="tg-classify-wrap Fix" data-id="classify-item" id="autonext"><dl class="tg-classify-tag tg-classify-simplecheck Fix"><dt class=""><a href="#"><i class="icon"></i><span>自动翻页</span><b class="icon"></b></a></dt></dl></div>'

	//添加秒杀复选框
	$(".tg-sort-wrap").append(seckillTemplate)

	//根据Cookie设置复选框判断用户是否选中秒杀
	if ($.cookie('seckill') == 'true') {

		$(".tg-sort-wrap").append(autonextTemplate) //添加自动翻页复选框

		//根据Cookie设置复选框判断用户是否选中自动翻页
		if ($.cookie('autonext') == 'true') {
			$("#autonext").find("dt").attr("class", "on")
		} else {
			$("#autonext").find("dt").attr("class", "")
		}
		$("#seckill").find("dt").attr("class", "on") //设置秒杀复选框选中状态

		var title
		var describe
		var price
		var oPrice
		var discount
		var count
		var id

		var delList = new Array() //临时移除数组

		var total = $(".tg-floor-title").size() //获取当前团购数量
		var url
		var page

		//筛选秒杀团购
		for (var i = 0; i < total; i++) {
			price = parseFloat($("em").eq(i).text()) //现价
			oPrice = parseFloat($("del").eq(i).text()) //原价
			discount = price / oPrice

			//筛选条件
			if (discount > 0.15 || oPrice < 50) {
				delList.push(i) //添加不符合条件的团购入临时移除数组
			}
		}

		delList.reverse() //反转数组

		//移除条件外的团购
		for (var x = 0; x < delList.length; x++) {
			$(".tg-floor-item").eq(delList[x]).remove()
		}


		total = $(".tg-floor-title").size() //获取当前筛选后的团购数量
		url = window.location.href //获取当前URL
		page = parseInt(getUrlParam('pageIndex')) //获取当前页码

		//自动跳转下一页
		if (total == 0 && $.cookie('autonext') == 'true') {
			if (url.indexOf("pageIndex") == -1 && url.indexOf("?") >= 0) { //在第一页有参数下跳转下一页
				window.location.href = url + "&pageIndex=1"
			} else if (url.indexOf("pageIndex") == -1 && url.indexOf("?") == -1) { //在第一页无参数下跳转下一页
				window.location.href = url + "?pageIndex=1"
			} else if (page < 50) { //后续页自动跳转
				window.location.href = url.replace("pageIndex=" + page, "pageIndex=" + (page + 1))
			}
		}

		//标记新单
		for (var z = 0; z < total; z++) {
			count = parseInt($(".tg-floor-sold").eq(z).text().replace("半年消费", "").replace("已售", "").replace("年售卖",
				"").replace("90天消费", ""))
			if (count < 5) {
				$(".tg-floor-item-wrap").eq(z).css("border-top", "10px solid #FF8400") //为新单上方添加边框标记
			}
		}

		//控制台输出
		for (var i = 0; i < total; i++) {
			title = $(".tg-floor-title").eq(i).children("h3").text().replace(/\s+/g, "")
			describe = $("h4").eq(i).text().replace("，提供免费WiFi", "").replace(/\s+/g, "")
			price = parseFloat($("em").eq(i).text()) //现价
			oPrice = parseFloat($("del").eq(i).text()) //原价

			console.log(title + "\n——————————————————\n" + describe)
		}

	} else {
		$("#seckill").find("dt").attr("class", "")
		//console.log("当前未选中秒杀");
	}

	//秒杀复选框点击事件
	$("#seckill").find("dt").click(function() {
		if ($.cookie('seckill') == 'true') {
			$.cookie('seckill', '', {
				expires: 7
			})
			$("#seckill").find("dt").attr("class", "")
			window.location.reload()
		} else {
			$.cookie('seckill', 'true', {
				expires: 7
			})
			$("#seckill").find("dt").attr("class", "on")
			window.location.reload()
		}
	})

	//自动翻页复选框点击事件
	$("#autonext").find("dt").click(function() {
		if ($.cookie('autonext') == 'true') {
			$.cookie('autonext', '', {
				expires: 7
			})
			$("#autonext").find("dt").attr("class", "")
			window.location.reload()
		} else {
			$.cookie('autonext', 'true', {
				expires: 7
			})
			$("#autonext").find("dt").attr("class", "on")
			window.location.reload()
		}
	})

	/* 获取URL */
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if (r != null) return encodeURI(r[2]);
		return null; //返回参数值
	}
}
