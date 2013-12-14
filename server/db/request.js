// ----------------------------------------------------------------------------
// This file is part of "Curuba Server".
//
// "Curuba Server" is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// "Curuba Server" is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with "Curuba Server".  If not, see <http://www.gnu.org/licenses/>.
// ----------------------------------------------------------------------------
var Request = {	
	CONNECTION : 'select test from test',
	LISTDEVICEREQUEST : 'SELECT Device.idDevice ID, Device.DeviceNumber DeviceNumber, Device.DeviceType Type, Device.DeviceState State, CustomInfo.Name Name FROM Device LEFT JOIN CustomInfo On CustomInfo.DeviceId = Device.idDevice WHERE ',
	DEVICEDETAIL : 'SELECT Device.idDevice ID, Device.DeviceNumber DeviceNumber, Device.DeviceType Type, Device.DeviceState State, CustomInfo.Name Name FROM Device Join CustomInfo On CustomInfo.DeviceId = Device.idDevice WHERE DeviceId = \'%s\'',
	SETDEVICENAME : 'UPDATE CustomInfo SET Name=\'%s\' WHERE DeviceId=%s',
	SETDEVICESTATE : 'UPDATE CustomInfo SET Name=\'%s\' WHERE DeviceId=%s',
	GETSTATISTICS : 'SELECT Statistic.Date, Statistic.Value FROM Statistic JOIN Device On Device.idDevice = Statistic.DeviceId JOIN TypeStatistic On TypeStatistic.idTypeStatistic = Statistic.TypeStatisticId WHERE Device.idDevice = \'%s\' AND TypeStatistic.Value = %s AND Statistic.Date like \'%%%s%\'',
	ADDSTATISTICS : 'INSERT INTO Statistic (DeviceId, TypeStatisticId, Date, Value) VALUES (\'%s\', 3, DATE_ADD(CURDATE(), INTERVAL HOUR(CURTIME()) hour), %s)',
	GETDEVICECONFIGURATION : 'SELECT idScheduleDevice Id, ScheduleDevice.ScheduleType, Device.idDevice DeviceId, Minute, Hour, DayMonth, Month, DayWeek, Year, ConfigSchedule.DeviceState, ConfigSchedule.DeviceValue Value, ScheduleDevice.ScheduleDeviceIdTo, CustomInfo.Name Name, Device.DeviceType Type, Device.DeviceState State FROM Device LEFT Join CustomInfo On CustomInfo.DeviceId = Device.idDevice LEFT JOIN ScheduleDevice On Device.idDevice = ScheduleDevice.DeviceId LEFT JOIN ConfigSchedule On ConfigSchedule.DeviceState = ScheduleDevice.ScheduleConfigId WHERE (ScheduleDevice.ScheduleType = 0 OR ScheduleDevice.ScheduleType = 1 OR ScheduleDevice.ScheduleType IS NULL) AND Device.idDevice = %s',
	SETDEVICECONFIGURATION : 'INSERT INTO CustomInfo (Name, DeviceId) VALUES (\'%s\', %s) ON DUPLICATE KEY UPDATE Name = VALUES(Name), DeviceId = VALUES(DeviceId);',
	SETDEVICECONFIGURATIONINSERTSCHEDULE : 'INSERT INTO ScheduleDevice (ScheduleType, DeviceId, Minute, Hour, DayMonth, Month, DayWeek, Year, ) VALUES (0,%s,%s,%s,%s,%s,%s,%s, )',
	REGISTRERDEVICE : 'INSERT INTO Device (DeviceGUID, DeviceType, DeviceState, ip, DeviceNumber) VALUES (\'%s\',%s,%s,\'%s\',%s) ON DUPLICATE KEY UPDATE DeviceGUID = VALUES(DeviceGUID), DeviceType = VALUES(DeviceType), DeviceState = VALUES(DeviceState), ip = VALUES(ip), DeviceNumber= VALUES(DeviceNumber);',
	SELECTDEVICEID : 'SELECT idDevice FROM Device WHERE DeviceGUID = \'%s\' AND DeviceNumber = %s;',
	AddCUSTOMINFO : 'INSERT INTO CustomInfo (Name, DeviceId) VALUES (\'Default\', %s) ON DUPLICATE KEY UPDATE Name = Name, DeviceId=VALUES(DeviceId);',
	INITJOB : 'SELECT Minute, Hour, DayMonth, Month, DayWeek, ConfigSchedule.DeviceState State, ConfigSchedule.DeviceValue Value, Device.DeviceNumber, ScheduleDevice.DeviceId, ScheduleDevice.idScheduleDevice  from ScheduleDevice JOIN ConfigSchedule On ConfigSchedule.idConfigSchedule = ScheduleDevice.ScheduleConfigId JOIN Device On Device.idDevice = ScheduleDevice.DeviceId',
	SELECTDEVICEGUID: 'select DeviceGUID FROM Device WHERE idDevice = %s'
};

exports.Request = Request;