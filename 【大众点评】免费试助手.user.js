// ==UserScript==
// @name         【大众点评】免费试助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.dianping.com/freemeal/index*
// @icon         https://www.dpfile.com/app/pc-common/dp_favicon.a4af753914321c8e82e402e2b4be01d7.ico
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	var content =
		`

		<table id="hor-minimalist-a" summary="Employee Pay Sheet">
			<thead>
				<tr>
					<th scope="col" style="border-bottom:none">
					<input type='button' id='superBtnV' class='btn' value='一键报名(橙V用户)' onclick='superBtnV' disabled ='disabled'/>
					<input type='button' id='superBtn' class='btn' value='一键报名(普通用户)' onclick='superBtn' disabled ='disabled'/>
					<input type='button' id='login' class='btn' value='登录' onclick='login' disabled ='disabled'/>
					<span id='wait'>请稍候，正在加载...</span>
					</th>
				</tr>
				<tr>
					<th scope="col">名称</th>
					<th scope="col">类型</th>
					<th scope="col">价值</th>
					<th scope="col">地区</th>
					<th scope="col">标签</th>
					<th scope="col">中奖人数</th>
					<th scope="col">报名人数</th>
					<th scope="col">中奖几率</th>
					<th scope="col">是否报名</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
       `

	var css =
		`
	   <style type="text/css">
	   	body {
	   		line-height: 1.6em;
	   	}

	   	#hor-minimalist-a {
	   		font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
	   		font-size: 12px;
	   		background: #fff;
	   		margin: 45px;
	   		width: 1080px;
	   		border-collapse: collapse;
	   		text-align: left;
	   	}

	   	#hor-minimalist-a th {
	   		font-size: 14px;
	   		font-weight: normal;
	   		color: #039;
	   		padding: 10px 8px;
	   		border-bottom: 2px solid #6678b1;
	   	}

	   	#hor-minimalist-a td {
	   		color: #669;
	   		padding: 9px 8px 0px 8px;
	   	}

	   	#hor-minimalist-a tbody tr:hover td {
	   		color: #009;
	   	}

		.btn{
			padding:10px
		}


		a{
			color: #039;
		}

		a:hover {
			color: #009;
		}

	   </style>

       `
	$("body").html("").append(content)
	$("head").eq(0).append(css)

	//免费试属性
	var id; //ID
	var title; //标题
	var type; //类型
	var cost; //价值
	var regionName; //地区
	var tagName; //标签
	var userWinCount; //中奖人数
	var applyCount; //报名人数
	var probability; //中奖几率
	var detailUrl //免费试URL
	var applyed; //是否报名

	var shopId; //免费试ID
	var applyBeginTime; //开始时间
	var applyEndTime; //结束时间
	var timeLeft //剩余时间

	var listArr = new Array() //免费试列表数组
	var newListArr = new Array() //未报名列表数组
	var obj //免费试对象
	var total = 0 //免费试总数

	var loginStatus //登录状态



	for (var i = 0; i < 20; i++) {
		(function(i) {
			//发送Ajax请求
			$.ajax({
				url: "https://m.dianping.com/astro-plat/freemeal/loadLotteryList?page=" + i +
					"&regionParentId=0&regionId=0&category=1&sort=0&filter=0&cityid=7&latitude=&longitude=&env=dp",
				success: function(res) {
					//请求成功回调函数
					if (res.data.lotteryActivityList.length == 0) return
					for (var x = 0; x < res.data.lotteryActivityList.length; x++) {
						//console.log(res.data.lotteryActivityList[x].title)

						id = res.data.lotteryActivityList[x].offlineActivityId //免费试ID

						//发送Ajax请求详情
						$.ajax({
							url: "https://m.dianping.com/astro-plat/freemeal/bwcDetailPackage?offlineActivityId=" +
								id +
								"&busiType=0&env=1&lat=0&lng=0&cityId=&appCityId=&uuidSwitch=true",
							async: false,
							success: function(result) {
								shopId = result.data.bwcData.activityShopInfoList[
										0] //免费试商品ID
									.shopId
								tagName = result.data.bwcData.lightVipOnly //标签
								applyBeginTime = result.data.bwcData
									.applyBeginTime //开始时间
								applyEndTime = result.data.bwcData.applyEndTime //结束时间
								loginStatus = result.data.bwcData.loginStatus //登录状态
							}
						});

						title = res.data.lotteryActivityList[x].title //标题

						if (res.data.lotteryActivityList[x].type == 1) { //类型
							type = "美食"
						}
						cost = res.data.lotteryActivityList[x].cost //价值
						regionName = res.data.lotteryActivityList[x].regionName //地区
						if (tagName == true) { //标签
							tagName = "V专享"
						} else {
							tagName = "大众"
						}
						userWinCount = res.data.lotteryActivityList[x].userWinCount //中奖人数
						applyCount = res.data.lotteryActivityList[x].applyCount //报名人数
						probability = userWinCount / applyCount * 100 //中奖率
						detailUrl = res.data.lotteryActivityList[x].detailUrl //免费试链接
						if (res.data.lotteryActivityList[x].applyed == true) { //报名状态
							applyed = "已报名"
						} else {
							applyed = "未报名"
						}


						//创建免费试对象
						obj = {
							id,
							title,
							type,
							cost,
							regionName,
							tagName,
							userWinCount,
							applyCount,
							probability,
							detailUrl,
							applyed,
							shopId,
							loginStatus
						}

						//往列表数组添加数据
						listArr.push(obj)

						//总和+1
						total++
					}
				}
			});
		})(i)
	}

	//往表格渲染数据
	setTimeout(function() {
		console.log("是否登录：" + loginStatus)
		if (loginStatus == false) {
			alert("注意：你还未登录，仅可查看列表，无法进行报名！")
			$("#wait").text("←去登录")
			$("#login").attr("disabled", false);
		} else if (loginStatus == true) {
			$("#wait").text("")
			$("#superBtnV").attr("disabled", false);
			$("#superBtn").attr("disabled", false);
		}
		for (var i = 0; i < listArr.length; i++) {
			$("#hor-minimalist-a").append("<tr><td><a href='" + listArr[i].detailUrl +
				"' target='view_window'>" + listArr[i].title + "</a></td><td>" + listArr[i].type +
				"</td><td>￥" + listArr[i].cost + "</td><td>" + listArr[i].regionName + "</td><td>" +
				listArr[i].tagName + "</td><td>" + listArr[i].userWinCount + "人</td><td>" + listArr[i]
				.applyCount + "人</td><td>" + listArr[i].probability.toFixed(2) + "%</td><td>" + listArr[
					i]
				.applyed + "</td></tr>")
		}
	}, 1000);

	//一键报名V
	$("#superBtnV").click(function() {
		$("#superBtnV").attr("disabled", true);
		$("#superBtn").attr("disabled", true);
		setTimeout(function() {
			for (var i = 0; i < listArr.length; i++) { //寻找未报名的免费试
				if (listArr[i].applyed == "未报名") {
					id = listArr[i].id
					title = listArr[i].title
					type = listArr[i].type
					cost = listArr[i].cost
					regionName = listArr[i].regionName
					tagName = listArr[i].tagName
					userWinCount = listArr[i].userWinCount
					applyCount = listArr[i].applyCount
					probability = listArr[i].probability
					detailUrl = listArr[i].detailUrl
					applyed = listArr[i].applyed
					shopId = listArr[i].shopId

					obj = {
						id,
						title,
						type,
						cost,
						regionName,
						tagName,
						userWinCount,
						applyCount,
						probability,
						detailUrl,
						applyed,
						shopId
					}
					//往列表数组添加数据
					newListArr.push(obj)
				}
			}
			console.log(newListArr)

			//遍历未报名的iframe
			if (newListArr.length == 0) {
				alert("你已经报名了所有的霸王餐啦！")
			}
			for (var x = 0; x < newListArr.length; x++) {
				$("body").append(
					"<iframe src='https://m.dianping.com/mobile/dinendish/apply/" + newListArr[
						x].id + "?a=1&source=null&utm_source=517bwcxq0507&showShopId=" +
					newListArr[x].shopId + "&token=%2a'></iframe>");
			}





		}, 2000);
	})

	$("#superBtn").click(function() {
		$("#superBtnV").attr("disabled", true);
		$("#superBtn").attr("disabled", true);
		setTimeout(function() {
			for (var i = 0; i < listArr.length; i++) { //寻找未报名的免费试
				if (listArr[i].applyed == "未报名" && listArr[i].tagName != "V专享") {
					id = listArr[i].id
					title = listArr[i].title
					type = listArr[i].type
					cost = listArr[i].cost
					regionName = listArr[i].regionName
					tagName = listArr[i].tagName
					userWinCount = listArr[i].userWinCount
					applyCount = listArr[i].applyCount
					probability = listArr[i].probability
					detailUrl = listArr[i].detailUrl
					applyed = listArr[i].applyed
					shopId = listArr[i].shopId

					obj = {
						id,
						title,
						type,
						cost,
						regionName,
						tagName,
						userWinCount,
						applyCount,
						probability,
						detailUrl,
						applyed,
						shopId
					}
					//往列表数组添加数据
					newListArr.push(obj)
				}
			}
			console.log(newListArr)

			//遍历未报名的iframe
			if (newListArr.length == 0) {
				alert("你已经报名了所有的霸王餐啦！")
			}
			for (var x = 0; x < newListArr.length; x++) {
				$("body").append(
					"<iframe src='https://m.dianping.com/mobile/dinendish/apply/" + newListArr[
						x].id + "?a=1&source=null&utm_source=517bwcxq0507&showShopId=" +
					newListArr[x].shopId + "&token=%2a'></iframe>");
			}

		}, 2000);
	})

	$("#login").click(function() {
		window.open("https://maccount.dianping.com/login")
	})

})();
