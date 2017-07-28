var updateInterval = 30;
var updateSeconds = updateInterval;

var HOSTID = '10393'; 
var ITEMID_AVERAGE = '30151'; //SQL: Average Wait Time (ms)
var ITEMID_LOCK = '30165'; //SQL: Lock Timeouts/sec

var zabbix_url = 'http://zabbix/api_jsonrpc.php';
var zabbix_user = 'Admin';
var zabbix_password = 'zabbix';
var zabbixID = '';

function Init()
{
	var oBackground = document.getElementById("imgBackground");
	oBackground.src = "url(images/background.png)";
   
	System.Gadget.settingsUI = 'settings.html';
	
	setInterval(UpdateData, 3000);

}

function GetGadgetPath()
{
	return System.Gadget.path;
}

function UpdateData()
{
  //updateSeconds = updateSeconds == 0 ? updateInterval : updateSeconds - 1;
  //$('#statusLink').html('Update in ' + updateSeconds + ' sec.');
  //document.getElementById('TimeRefresh').innerHTML = 'Обновление через: ' + updateSeconds;
  ZabbixAuth(function()
   {
	   GetAverageWaitTime(function()
	   {
		   ZabbixLogout();
	   });
	});
}
	
function ZabbixAuth(callback)
{
	var response;
	var http_request = new XMLHttpRequest();
	
	var json = {
					"jsonrpc": "2.0",
					"method": "user.login",
					"params": {
								"user": zabbix_user, 
								"password": zabbix_password
					},
					"id": 1
				};
		
	var str = JSON.stringify(json);
	
	http_request.open("POST", zabbix_url, true);
	http_request.setRequestHeader('Content-Type', 'application/json');
	
	http_request.send(str);
	
	http_request.onreadystatechange = function() 
	{
		if (this.readyState === 4)
		{
				response = this.responseText;
				var res = JSON.parse(response);
				zabbixID = res.result;
				document.getElementById('ZabbixID').innerHTML = 'ID: ' + zabbixID;
				callback();
		}
	}
}

function ZabbixLogout()
{
	var response;
	var http_request = new XMLHttpRequest();

	var json = {
					"jsonrpc": "2.0",
					"method": "user.logout",
					"params": {
								"user": zabbix_user, 
								"password": zabbix_password
							},
					"id": 1,
					"auth": zabbixID
				};
	
	var str = JSON.stringify(json);
	
	http_request.open("POST", zabbix_url, true);	
	http_request.setRequestHeader('Content-Type', 'application/json');
	
	http_request.send(str);
	
	http_request.onreadystatechange = function() 
	{
		//do something
	}

}

function GetAverageWaitTime(callback)
{
	var response;
	var http_request = new XMLHttpRequest();
	
	var json = {
					"jsonrpc": "2.0",
					"method": "item.get",
					"params": {
								"output": ["delay", "lastvalue"],
								"filter": { 
											itemid: [ITEMID_AVERAGE, ITEMID_LOCK]
										},
								"hostids": HOSTID
							},
					"id": 1,
					"auth": zabbixID
				};
				
	var str = JSON.stringify(json);
	
	http_request.open("POST", zabbix_url, true);	
	http_request.setRequestHeader('Content-Type', 'application/json');
	
	http_request.send(str);
		
	http_request.onreadystatechange = function()
	{
		if (this.readyState === 4)
		{
			response = this.responseText;
			var res = JSON.parse(response);
			
			//Get AverageWaitTime
			var res_average_delay = res.result[0].delay;
			var res_average_lastvalue = res.result[0].lastvalue;
			
			//Get Lock
			var res_lock_lastvalue = res.result[1].lastvalue;
			
			document.getElementById('TimeRefresh').innerHTML = 'Обновление через: ' + res_average_delay;
			document.getElementById('AverageWaitTime').innerHTML = 'Average Wait Time: ' + res_average_lastvalue;
					
			document.getElementById('LockTimeouts').innerHTML = 'Lock Timeouts: ' + res_lock_lastvalue;
			
			callback();
		}
	}
}
