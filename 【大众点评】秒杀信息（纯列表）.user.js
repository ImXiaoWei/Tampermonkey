// ==UserScript==
// @name         【大众点评】秒杀信息（纯列表）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.dianping.com/tuan/ajax/moreAggregatedItemList*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @grant        none
// ==/UserScript==
window.onload = function() {
	/* 团购信息 */
	var shopName //商家名称
	var aggr //团购描述
	var oPrice //团购原价
	var price //团购现价
	var count //团购销量
	var id //团购ID

	/* 团购列表 */
	var itemList //团购列表
	var itemListLength //团购数量
	var itemObj //团购对象
	var list = new Array() //筛选团购列表
	var page //当前页码

	var itemDiscount //商品折扣

	itemList = document.getElementsByClassName("table-cell Fix") //获取初始列表DOM
	itemListLength = document.getElementsByClassName("table-cell Fix").length //获取初始列表长度

	/* 列表渲染 */

	function getQueryVariable(variable) { //URL参数获取方法
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	}


	var content =
		`

			<table id="hor-minimalist-a" summary="Employee Pay Sheet">
				<thead>
					<tr>
						<th scope="col" style="border-bottom:none">
						<input type='button' class='btn' value='单人餐' id='onePerson'/>
						<input type='button' class='btn' value='二人餐' id='twoPerson'/>
						</th>
						<th style="border-bottom:none">
						<input type='text' id='keywordInput' />
						<input type='button'  value='搜索' id='searchBtn'/>
						</th>
						<th style="border-bottom:none"></th>
						<th style="border-bottom:none"></th>
						<th style="border-bottom:none">
						<input type='button'  class='btn' value='上一页' id='preBtn'/>
						<input type='text' class='input' id='pageInput'/>
						<input type='button'  class='btn' value='下一页' id='nextBtn'/>
						</th>
					</tr>
					<tr>
						<th scope="col">商家</th>
						<th scope="col" style="width:300px">描述</th>
						<th scope="col">原价</th>
						<th scope="col">现价</th>
						<th scope="col">销量</th>
					</tr>
				</thead>
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
				padding:10px;
			}


			a{
				color: #039;
				text-decoration: none;
			}

			a:hover {
				color: #009;
			}

			.input {
				width:30px;
				height:30px;
				text-align:center
			}

			#keywordInput {
				width:80px
			}

		   </style>

	       `

	/* 遍历列表数据 */
	for (var i = 0; i < itemListLength; i++) {
		shopName = itemList[i].getElementsByClassName("shopName")[0].innerText //商家名称
		aggr = itemList[i].getElementsByClassName("aggr")[0].innerText.replace("，提供免费WiFi", "") //团购描述
		price = parseFloat(itemList[i].getElementsByTagName("strong")[0].innerText) //团购现价
		if (itemList[i].getElementsByClassName("o-price")[0]) { //团购原价（判断原价与现价是否相等）
			oPrice = oPrice = parseFloat(itemList[i].getElementsByClassName("o-price")[0].innerText.replace("¥",
				""))
			itemDiscount = parseFloat(price / oPrice * 10).toFixed(2)
		} else {
			oPrice = price
			itemDiscount = 1
		}

		if (itemList[i].getElementsByClassName("count")[0]) { //团购销量（判断是否有销量）
			count = parseInt(itemList[i].getElementsByClassName("count")[0].innerText.replace("已售", ""))
		} else {
			count = 0
		}
		id = itemList[i].getAttribute("href").split("l/")[1] //团购ID


		/* 数据筛选 */
		if (oPrice >= 100) {
			itemObj = { //生成列表对象
				shopName,
				aggr,
				oPrice,
				price,
				count,
				id,
				itemDiscount
			}
			list.push(itemObj)
			console.log(shopName + " " + aggr);
		}
	}

	/* 渲染数据 */

	setTimeout(function() {
		document.body.style.display = "block"
		var page = parseInt(getQueryVariable("currentPage")) //页码参数
		var keyword = parseInt(getQueryVariable("keyword")) //关键字参数
		var url = window.location.href //原始URL

		document.getElementById("pageInput").value = page + 1 //页码+1

		if (list.length == 0) { //如果当前页没有数据，则跳转下一页
			add()
		}


		var table = document.getElementById("hor-minimalist-a")

		for (var i = 0; i < list.length; i++) { //向表格渲染数据
			var dom = document.createElement('tr');
			dom.innerHTML = "<td><a href='http://t.dianping.com/deal/" + list[i].id + "' target='_blank'>" +
				list[i]
				.shopName + "</a></td><td>" + list[i].aggr + "</td><td>" + list[i]
				.oPrice +
				"</td><td>" + list[i].price + "</td><td>" + list[i].count + "</td>";
			table.appendChild(dom);
		}

		/* 页码拼接 */

		if (page == 0) { //判断当前页码是否为0
			document.getElementById("preBtn").setAttribute("disabled", "disabled")
		}

		document.getElementById("nextBtn").onclick = function() { //下一页按钮
			add()
		}

		document.getElementById("preBtn").onclick = function() { //上一页按钮
			reduce()
		}

		document.getElementById("onePerson").onclick = function() { //单人餐按钮
			keywords("单人")
		}

		document.getElementById("twoPerson").onclick = function() { //双人餐按钮
			keywords("2人")
		}

		document.getElementById("searchBtn").onclick = function() { //搜索按钮
			if (document.getElementById("keywordInput").value == "") {
				alert("搜索内容不能为空！")
			} else {
				var inputKeyword = document.getElementById("keywordInput").value
				keywords(inputKeyword)
			}

		}




		function add() { //页码增加函数
			page++
			url = url.split("currentPage=")[0] //分割 URL
			window.location.href = url + "currentPage=" + page
		}

		function reduce() { //页码减少函数
			page--
			url = url.split("currentPage=")[0]
			window.location.href = url + "currentPage=" + page
		}

		function keywords(k) {
			url = url.split("keyword=")[0]
			window.location.href = url + "keyword=" + k + "&version=2&currentPage=0"
		}

	}, 100);

	/* 加载DOM与CSS */
	document.body.innerHTML = content
	document.head.innerHTML = css
}
