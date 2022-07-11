function getUrl() {
	var url = $(".dns-text").val();
	url = decodeURIComponent(url.replace(/\s+/g, ""));
	if (/^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/i.test(url)) {
		console.log("待解析地址:" + url);
		url = url.replace(/http:\/\/|https:\/\//, "");
		url = url.split("/")[0];
		return url;
	}
	return null;
}

function dnsParse(name, type) {
	var dns = "https://dns.alidns.com/resolve?name=" + name + ".&type=" + type;
	console.log(dns);
	var data = [];
	$.ajax({
		url: dns,
		type: "get",
		dataType: "json",
		async: false,
		success: function(res) {
			res = res.Answer;
			if (!res) {
				return null;
			}
			for (let i in res) {
				if (res[i].type === parseInt(type)) {
					data.push(res[i].data)
				}
			}
		}
	})
	return data;
}

function displayResult(data) {
	for (let i in data) {
		let html = "";
		for (let j in data[i].result) {
			html += `${data[i].result[j]}<br>`;
		}
		$(`.parse-box-value[data-name=${data[i].type}]`).html(html?html.replace(/<br>$/,""):`<span style="color:red">暂无数据，获取失败</span>`);
	}
}

function fromUrl(keys){
	if(!keys||typeof keys!=="string"){
		return false;
	}
	var queryData=location.search;
	if(!queryData){
		return false;
	}
	queryData=queryData.slice(1).split("&");
	var queryJson={};
	for(let i in queryData){
		let dataArray=queryData[i].split("=");
		if(dataArray[0]){
			queryJson[dataArray[0]]=dataArray[1];
		}
	}
	keys=keys.split(",");
	if(keys.length===1){
		return queryJson[keys[0]];
	}else{
		var res={};
		for(let i in keys){
			res[keys[i]]=queryJson[keys[i]];
		}
		return res;
	}
}

$(function(){
	var data = {
		"url": null,
		"data": [{
				"id": "1",
				"type": "A",
				"description": "IPv4 地址",
				"result": null
			},
			{
				"id": "2",
				"type": "NS",
				"description": "NS 记录",
				"result": null
			},
			{
				"id": "5",
				"type": "CNAME",
				"description": "域名 CNAME 记录",
				"result": null
			},
			{
				"id": "6",
				"type": "SOA",
				"description": "ZONE 的 SOA 记录",
				"result": null
			},
			{
				"id": "16",
				"type": "TXT",
				"description": "TXT 记录",
				"result": null
			},
			{
				"id": "28",
				"type": "AAAA",
				"description": "IPv6 地址",
				"result": null
			}
		]
	}
	$(".dns-btn").click(function() {
		data.url = getUrl();
		if (!data.url) {
			alert("url错误");
			return false;
		}
		console.log("正在解析:"+data.url);
		for (let d of data.data) {
			d.result = dnsParse(data.url, d.id);
		}
		console.log(data);
		displayResult(data.data);
	})
	var queryLink=fromUrl("url");
	if(queryLink){
		$(".dns-text").val(decodeURIComponent(queryLink));
		$(".dns-btn").click();
	}
	$.get("./README.md", (res) => {
		if (typeof res === "string" && res) {
			$(".markdown-content").html(marked.parse(res));
		}
	})
	$(".markdown-btn svg").click((e) => {
		e = $(e.currentTarget);
		if (e.children("title").text() === "展开") {
			e.children("title").text("收起");
			$(e).children("svg path").attr("d", "M6 10L42 10 M6 20L42 20 M6 40L24 26L42 40");
			$(".markdown-btn").attr("show", "");
			$(".markdown-content").removeAttr("hidden");
		} else {
			e.children("title").text("展开");
			$(e).children("svg path").attr("d", "M6 10L42 10 M6 20L42 20 M6 40L24 26L42 40");
			$(".markdown-btn").removeAttr("show");
			$(".markdown-content").attr("hidden", "");
		}
	})
})
