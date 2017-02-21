function Init()
{
	System.Gadget.Settings.writeString('zabbix_server', 'zabbix.nsk.cwc.ru');
	var zabbix_server = System.Gadget.Settings.readString('zabbix_server');
	
	//document.getElementById('zabbix_server').innerHTML = zabbix_server;
}