function getUrl() {
	var url = $("#inputBox").val();
	url = url.replace(/\s+/g, "");
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
	var html = "";
	for (let i in data) {
		html = "";
		for (let j in data[i].result) {
			html += "<li>" + data[i].result[j] + "</li>";
		}
		$("ol[data-type=" + data[i].type + "]").html(html);
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
	$("#paurseBtn").click(function() {
		data.url = getUrl();
		if (!data.url) {
			alert("url错误");
			return false;
		}
		console.log("正在解析:"+data.url);
		for (let i in data.data) {
			data.data[i].result = dnsParse(data.url, data.data[i].id);
		}
		console.log(data);
		displayResult(data.data);
	})
	$("#clearBtn").click(function() {
		$("#inputBox").val("");
		var temp = $("#displayBox").find("ol");
		for (let i in temp) {
			temp[i].innerHTML = "";
		}
	})
	var queryLink=fromUrl("url");
	if(queryLink){
		$("#inputBox").val(queryLink);
		$("#paurseBtn").click();
	}
})
