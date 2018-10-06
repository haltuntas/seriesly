jQuery(document).ready(function($) {

    $('.tab').hide();
    $('#sidebar nav li').removeClass('active');

    $('.tab').first().show();
    $('#sidebar nav li').first().addClass('active');

    function setTabActive(target) {

        var _this = $('#sidebar nav li a[href="' + target + '"]');

        if(_this.length) {

            var tabEl = _this.parent().parent().parent().parent();
            var sectionEl = tabEl.children('section');

            window.location.hash = target;

            $('#content header h1').text(_this.text());
            document.title = _this.text() + ' - Seriesly Client';

            $('#sidebar nav li').removeClass('active');
            $('.tab').hide();

            _this.parent().addClass('active');
            $('#content').find(target).show();

        }

    }

    if(window.location.hash) {
        setTabActive(window.location.hash);
    }

    $(document).on('click', '#sidebar nav li a', function(e) {
        e.preventDefault();
        setTabActive($(this).attr('href'));
        $('#sidebar').removeClass('show');
        $('#overlay').fadeOut(200);
    });

    $(document).on('click', '#content header .menu', function(e) {
        $('#overlay').fadeToggle(200, function() {
            $('#sidebar').toggleClass('show');
        });
    });

    $('.btn').click(function(e) {
        e.preventDefault();
    });

});

// ----------------------------- Database Setting -----------------------------
var request_cmd_type = [];
var request_cmd_function = [];
var request_cmd_data = [];
var request_cmd_keys = [];
var currentDatabaseTables = [];
var currentDatabaseTableKeys = [];
var databaseToWorkWith = "";
var uiTimerVar = setInterval(uiTimer ,1000);
var DatabaseTableTimerVar = setInterval(DatabaseTableTimer ,1000);

var Plotly_y = [];
var Plotly_x = [];
var Plotly_data = [];
var Plotly_layout = [];

var AutoForm_cnt = 0;

var jsonhttp_client = new XMLHttpRequest();

function DatabaseTableTimer(){
    button_connect();
    clearInterval(DatabaseTableTimerVar);
}
function uiTimer() {
    document.getElementById("status_output_1").innerHTML = "";
    document.getElementById("status_output_3").innerHTML = "";
    document.getElementById("status_output_5").innerHTML = "";
    document.getElementById("createDatabaseTableName").className = "form-field";
    document.getElementById("databaseTable_keylist_1").className = "form-select";
    clearInterval(uiTimerVar);
}
function button_update_db_list(){
    const length = currentDatabaseTables.length;
    var html_write = [];
    for (let index = 0; index < length; index++){
        html_write += "<option>" + currentDatabaseTables[index] + "</option>";
    }
    document.getElementById("databaseTables_1").innerHTML =  html_write
    document.getElementById("databaseTables_2").innerHTML =  html_write
    document.getElementById("databaseTables_3").innerHTML =  html_write
}

function button_connect(){
    request_cmd_type = "_all_dbs";
    request_cmd_function = "GET";
    currentDatabaseTables = [];
    com_server_databases("_all_dbs");
}

function change_connection_security(){
    if(document.getElementById("changeConnectionSecurity").checked == true){
        document.getElementById("ConnectionSecurity").innerHTML =  "https://"
    }else{
        document.getElementById("ConnectionSecurity").innerHTML =  "http://"
    }

}

function button_get_table_information(){
    request_cmd_type = "get_database_info";
    request_cmd_function = "GET";
    com_server_databases(document.getElementById("databaseTables_1").value);
}

function button_create_db_table(){
    const length = currentDatabaseTables.length;
    var dbname = document.getElementById("createDatabaseTableName").value;
    var found = false;
    for (let index = 0; index < length; index++){
        if(currentDatabaseTables[index]===dbname){
            found = true;
        }
    }
    var html_write = [];
    if(found){
        found = false;
        html_write += "<div class=\"md-6\"><div class=\"alert warning\">Database not created!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        document.getElementById("createDatabaseTableName").className = "form-field filled error";
        uiTimerVar = setInterval(uiTimer ,1000);
        DatabaseTableTimerVar = setInterval(DatabaseTableTimer ,1000); //aynı anda iki request yapıp listeyi güncelleyemediğim için 1000ms sonra yapıyorum.
        button_connect();
    }else if(!found){
        request_cmd_type = "create_database_table";
        request_cmd_function = "PUT";
        html_write += "<div class=\"md-6\"><div class=\"alert success\">Database created!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        document.getElementById("createDatabaseTableName").className = "form-field success";
        uiTimerVar = setInterval(uiTimer ,1000);
        DatabaseTableTimerVar = setInterval(DatabaseTableTimer ,1000); //aynı anda iki request yapıp listeyi güncelleyemediğim için 1000ms sonra yapıyorum.
        com_server_databases(dbname);
    }
}

function button_delete_db_table(){
    const length = currentDatabaseTables.length;
    var dbname = document.getElementById("databaseTables_1").value;
    var found = false;
    for (let index = 0; index < length; index++){
        if(currentDatabaseTables[index]===dbname){
            found = true;
        }
    }
    var html_write = [];
    if(found){
        found = false;
        request_cmd_type = "delete_database_table";
        request_cmd_function = "DELETE";
        html_write += "<div class=\"md-6\"><div class=\"alert success\">Database deleted!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        uiTimerVar = setInterval(uiTimer ,1000);
        com_server_databases(dbname);
    }else if(!found){
        html_write += "<div class=\"md-6\"><div class=\"alert warning\">No Database found!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        uiTimerVar = setInterval(uiTimer ,1000);
        button_connect();
    }
}

function button_compact_db_table(){
    const length = currentDatabaseTables.length;
    var dbname = document.getElementById("databaseTables_1").value;
    var found = false;
    for (let index = 0; index < length; index++){
        if(currentDatabaseTables[index]===dbname){
            found = true;
        }
    }
    var html_write = [];
    if(found){
        found = false;
        request_cmd_type = "compact_database_table";
        request_cmd_function = "POST";
        html_write += "<div class=\"md-6\"><div class=\"alert success\">Compact command!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        uiTimerVar = setInterval(uiTimer ,3000);
        var query = dbname + "/_compact";
        com_server_databases(query);
    }else if(!found){
        html_write += "<div class=\"md-6\"><div class=\"alert warning\">No Database found!</div></div>"
        document.getElementById("status_output_1").innerHTML =  html_write;
        uiTimerVar = setInterval(uiTimer ,3000);
        button_connect();
    }
}


function button_update_key_list(){
    if(document.getElementById("databaseTables_2").value === "Press connect first & update..."){
        document.getElementById("status_output_3").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\">Press connect first & update...</div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }
    databaseToWorkWith = document.getElementById("databaseTables_2").value;
    var query_string = "_dump?keys=1";
    var query = databaseToWorkWith + "/" + query_string;
    request_cmd_type = "updateKeyList";
    request_cmd_function = "GET";
    com_server_databases(query);
}

function button_update_query(){

    if(document.getElementById("databaseTables_2").value === "Press connect first & update..."){
        document.getElementById("status_output_3").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\">Press connect first & update...</div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }else if(document.getElementById("queryStart").value === "Start"){
        document.getElementById("status_output_3").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\"> Start Date format should be yyyy-MM-dd HH:mm:ss </div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }else if(document.getElementById("queryStop").value === "Stop"){
        document.getElementById("status_output_3").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\"> Stop Date format should be yyyy-MM-dd HH:mm:ss </div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }else if(document.getElementById("databaseTable_keylist_1").value === "Press Key List to update"){
        document.getElementById("status_output_3").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\"> Press \"Get Key List\" to update </div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }

    databaseToWorkWith = document.getElementById("databaseTables_2").value;
    var _queryStart = Math.round(new Date(document.getElementById("queryStart").value).getTime());
    var _queryStop = Math.round(new Date(document.getElementById("queryStop").value).getTime());
    var _queryGroup = document.getElementById("queryGroup").value

    switch(document.getElementById("queryGroup").value) {
        case "any":         _queryGroup = 1; break;
        case "500 msec":    _queryGroup = 500; break;
        case "1 sec":       _queryGroup = 1000; break;
        case "10 sec":      _queryGroup = 1000 * 10; break;
        case "30 sec":      _queryGroup = 1000 * 30; break;
        case "1 min":       _queryGroup = 1000 * 60; break;
        case "5 min":       _queryGroup = 1000 * 60 * 5; break;
        case "10 min":      _queryGroup = 1000 * 60 * 10; break;
        case "15 min":      _queryGroup = 1000 * 60 * 15; break;
        case "30 min":      _queryGroup = 1000 * 60 * 30; break;
        case "1 hour":      _queryGroup = 1000 * 60 * 60; break;
        case "2 hour":      _queryGroup = 1000 * 60 * 60 * 2; break;
        case "6 hour":      _queryGroup = 1000 * 60 * 60 * 6; break;
        case "12 hour":     _queryGroup = 1000 * 60 * 60 * 12; break;
        case "1 day":       _queryGroup = 1000 * 60 * 60 * 24; break;
        case "1 week":      _queryGroup = 1000 * 60 * 60 * 24 * 7; break;
        default:            _queryGroup = 1; document.getElementById("queryGroup").value="any";
    }

    if(document.getElementById("queryReducer").value === "Data Reducer"){
        var _queryReducer = "any";
        document.getElementById("queryReducer").value="any"
    }else{
        var _queryReducer = document.getElementById("queryReducer").value;
    }

    var _queryVariable = "&ptr=/" + document.getElementById("databaseTable_keylist_1").value;
    _queryVariable += "&reducer=" + _queryReducer;

    request_cmd_keys.push(document.getElementById("databaseTable_keylist_1").value);

    if(AutoForm_cnt>0){
        for (let index2 = 0; index2 < AutoForm_cnt; index2++){
             _queryVariable += "&ptr=/" + document.getElementById("databaseTable_keylist_1_" + index2).value;
             request_cmd_keys.push(document.getElementById("databaseTable_keylist_1_" + index2).value);
             if(document.getElementById("queryReducer" + index2).value === "Data Reducer"){
                 var _queryReducer = "any";
                 document.getElementById("queryReducer" + index2).value="any"
             }else{
                 var _queryReducer = document.getElementById("queryReducer" + index2).value;
             }
             _queryVariable += "&reducer=" + _queryReducer;
        }
    }

    var query_string = "_query?from=" + _queryStart + "&to=" + _queryStop + "&group=" + _queryGroup + _queryVariable;
    var query = databaseToWorkWith + "/" + query_string;

    request_cmd_type = "makeAQuery";
    request_cmd_function = "GET";
    Plotly.purge('PlotlyDiv', Plotly_data);
    com_server_databases(query);
}

function add_new_key_to_query(){
    var html_write = "<br><div class=\"columns\"><div class=\"md-6\"><select \
    class=\"form-select\" id=\"queryReducer" + AutoForm_cnt + "\"><option selected \
    disabled> Data Reducer <option>any</option><option>avg</option><option>max</option>\
    <option>min</option><option>count</option><option>sum</option><option>sumsq</option>\
    <option>c</option><option>c_min</option><option>c_max</option><option>c_avg</option>\
    <option>identity</option><option>distinct</option><option>obj_keys</option><option>\
    obj_distinct_keys</option></select></div><div class=\"md-6\"><select class=\"form-select\"\
    id=\"databaseTable_keylist_1_" + AutoForm_cnt + "\"><option>Press Key List to update</option>"

    for (let index = 0; index < currentDatabaseTableKeys.length; index++){
        html_write += "<option>" + currentDatabaseTableKeys[index] + "</option>";
    }

    html_write += "</select></div></div><span id=\"AddNewKey_span_" + (AutoForm_cnt+1) + "\"></span>"
    document.getElementById("AddNewKey_span_" + AutoForm_cnt).innerHTML += html_write;
    AutoForm_cnt += 1;
}

function remove_key_from_query(){
    if(AutoForm_cnt > 0 ){
        AutoForm_cnt -= 1;
        document.getElementById("AddNewKey_span_" + AutoForm_cnt).innerHTML = [];
    }
}

function button_update_write(){

    if(document.getElementById("databaseTables_3").value === "Press connect first & update..."){
        document.getElementById("status_output_5").innerHTML =  "<div class=\"md-6\"><div class=\"alert warning\">Press connect first & update...</div></div>";
        uiTimerVar = setInterval(uiTimer ,3000);
        return;
    }

    databaseToWorkWith = document.getElementById("databaseTables_3").value;

    if(document.getElementById("writeOnTime").value === "WriteTo"){
        var query = databaseToWorkWith + "/";
    }else{
        var _queryWrite = Math.round(new Date(document.getElementById("writeOnTime").value).getTime());
        var query = databaseToWorkWith +"?ts=" + _queryWrite;
    }

    request_cmd_type = "writeADatum";
    request_cmd_function = "POST";
    request_cmd_data = document.getElementById("dataPostTextArea").value;
    com_server_databases(query);
}


function com_server_databases(query_string)
{
    var hostName = document.getElementById("hostAddress").value;
    var url = [];
    if(document.getElementById("changeConnectionSecurity").checked == true){
        url = "https://"+ hostName + query_string;
    }else{
         url = "http://"+ hostName + query_string;
    }
//    var url = "http://"+ hostName + query_string;
    var status_output = [];
    status_output =  request_cmd_function + "<br>";
    status_output +=  url + "<br>";

    jsonhttp_client.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText === ""){
                status_output += "returns null!";
                return;
            }
            var json_query = JSON.parse(this.responseText);
            if(request_cmd_type == "_all_dbs"){
                request_cmd_type = [];

                var connectionStatus = document.getElementById('connectionStatus');
                connectionStatus.value = "Connected";
                connectionStatus.style = "background-color:green";

                var json_response = JSON.parse(this.responseText);
                const length = json_response.length;
                var html_write = [];
                currentDatabaseTables = json_response;
                for (let index = 0; index < length; index++){
                    html_write += "<option>" + json_response[index] + "</option>";
                }
                document.getElementById("databaseTables_1").innerHTML =  html_write;
                document.getElementById("databaseTables_2").innerHTML =  html_write;
                document.getElementById("databaseTables_3").innerHTML =  html_write
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type == "get_database_info"){
                request_cmd_type = [];
                var json_response = JSON.parse(this.responseText);
                var rk = Object.keys(json_query);
                var rv = Object.values(json_query);
                var html_write = [];
                const length = rk.length;

                html_write += "<table class=\"table border stripe responsive hover\">";
                html_write += "<thead><th>Param</th><th>Val</th></thead><tbody>";
                for (let index = 0; index < length; index++){
                    html_write += "<tr><td data-th=\"Param\">" + rk[index] + "</td>";
                    html_write += "<td data-th=\"Val\">" + rv[index] + "</td></tr>";
                }
                html_write += "</tbody></table>";
                document.getElementById("DatabaseInfoTable").innerHTML =  html_write;
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type === "delete_database_table"){
                request_cmd_type = [];
                button_connect();
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type === "compact_database_table"){
                request_cmd_type = [];
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type === "makeAQuery"){
                request_cmd_type = [];
                var DataOutput = [];
                var json_response = sortJsonObject(JSON.parse(this.responseText));
                var rx = Object.keys(json_response);
    			var ry = Object.values(json_response);

                const length_1 = rx.length;
                var index_1 = 0;
                const length_2 = ry[0].length;
                var index_2 = 0;

                DataOutput += "Data Lenght:" + length_1 + "\n index[0]  -> \n";

                for (index_1 = 0; index_1 < length_1; index_1++){
                    if (document.getElementById("changeXIndex").checked == true){
                        Plotly_x.push(index_1);
                    }else{
                        Plotly_x.push(UnixTS2PlotlyTime(rx[index_1]/1));
                    }
    			}
                for (index_1 = 0; index_1 < length_1; index_1++){
                    DataOutput += rx[index_1] + ",";
                    for (index_2 = 0; index_2 < length_2; index_2++){
                        if(index_2<length_2-1){
                            DataOutput += ((ry[index_1][index_2] !== null) ? ry[index_1][index_2] : 0) + ",";
                        }else{
                            DataOutput +=((ry[index_1][index_2] !== null) ? ry[index_1][index_2] : 0);
                        }
                    }
                    DataOutput += "\n";
                }

                for (index_2 = 0; index_2 < length_2; index_2++){
                    var tmpArray1=new Array(length_1);
                    for (index_1 = 0; index_1 < length_1; index_1++){
//                        tmpArray1[index_1] = ry[index_1][index_2];
                        tmpArray1[index_1] = ((ry[index_1][index_2] !== null) ? ry[index_1][index_2] : 0);
                    }
                    Plotly_y.push(tmpArray1);
                }

                DataOutput += "index[" + (length_1*length_2-1) + "] \n";

                for (index_2 = 0; index_2 < length_2; index_2++){
                        Plotly_data.push({
                            x:Plotly_x,
                            y:Plotly_y[index_2],
                            //y:smooth(Plotly_y[index_2], 10),
                            type: 'scatter',
                            name: request_cmd_keys[index_2],
                            margin: {
                                t: 0, //top margin
                                l: 0, //left margin
                                r: 0, //right margin
                                b: 0 //bottom margin
                            }
                        });
                }

                Plotly.newPlot('PlotlyDiv',
                        Plotly_data,
                        {title: "Query Result: " + UnixTS2PlotlyTime(Number(rx[0])) + " to " + UnixTS2PlotlyTime(Number(rx[length_1-1])),
                        font:{ size:16 }
                    });
                window.onresize = function() { Plotly.Plots.resize( 'PlotlyDiv' ) };
                Plotly_data = [];
                Plotly_x = [];
                Plotly_y = [];
                request_cmd_keys = [];
                if (document.getElementById("BoolDataToTextArea").checked == true){
                    document.getElementById("DataTextArea").value =  DataOutput;
                }
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type === "updateKeyList"){
                request_cmd_type = [];
                var json_response = JSON.parse(this.responseText);
                var json_key_array = json_response.keys
                const length = json_key_array.length;
                if (!length)
                {
                    document.getElementById("databaseTable_keylist_1").className = "form-field filled error";
                    uiTimerVar = setInterval(uiTimer ,3000);
                }else{
                    var html_write = [];
                    currentDatabaseTableKeys =[];
                    currentDatabaseTableKeys = json_key_array;
                    for (let index = 0; index < length; index++){
                        html_write += "<option>" + json_key_array[index] + "</option>";
                        if(AutoForm_cnt>0){
                            for (let index2 = 0; index2 < AutoForm_cnt; index2++){
                                document.getElementById("databaseTable_keylist_1_" + index2).innerHTML = html_write;
                            }
                        }
                    }
                    document.getElementById("databaseTable_keylist_1").className = "form-select";
                    document.getElementById("databaseTable_keylist_1").innerHTML =  html_write
                }
                status_output += this.responseText + "<br>";
            }
        }else if (this.status == 201) {
            if(request_cmd_type === "writeADatum"){
                status_output += request_cmd_data;
                request_cmd_type = [];
                request_cmd_data = [];
                status_output += this.responseText + "<br>";
            }else if(request_cmd_type === "create_database_table"){
                request_cmd_type = [];
                button_connect();
                status_output += this.responseText + "<br>";
            }
        }else if (this.status == 400){
            status_output += this.responseText + "<br>";
        }
        document.getElementById("status_output_2").innerHTML =  status_output;
        document.getElementById("status_output_4").innerHTML =  status_output;
        document.getElementById("status_output_6").innerHTML =  status_output;
    };
    jsonhttp_client.open(request_cmd_function,url, true);
    jsonhttp_client.send(request_cmd_data);
    request_cmd_function = [];
}
