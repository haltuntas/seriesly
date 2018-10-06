function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function sortJsonObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function UnixTS2PlotlyTime(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];

  var date = a.getDate();
  if((date/1)<10)
    var date = '0' + date;

  var hour = a.getHours();
  if((hour/1)<10)
    var hour = '0' + hour;

  var min = a.getMinutes();
  if((min/1)<10)
    var min = '0' + min;

  var sec = a.getSeconds();
  if((sec/1)<10)
    var sec = '0' + sec;

  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}//2013-10-04 22:23:00

function smooth(arr, windowSize, getter = (value) => value, setter) {
  const get = getter
  const result = []

  for (let i = 0; i < arr.length; i += 1) {
    const leftOffeset = i - windowSize
    const from = leftOffeset >= 0 ? leftOffeset : 0
    const to = i + windowSize + 1

    let count = 0
    let sum = 0
    for (let j = from; j < to && j < arr.length; j += 1) {
      sum += get(Number(arr[j]))
      count += 1
    }

    result[i] = setter ? setter(Number(arr[i]), sum / count) : sum / count
  }

  return result
}
