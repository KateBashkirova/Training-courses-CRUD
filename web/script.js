//список глобальных переменных
var returnedJSON; //хранит распаршенную JSON строку, вернувшуюся с сервлета
var functionListenerState = null; //хранит информацию о том, на какой сервлет отправится заполненная в index.html форма для дальнейшей обработки
var courseIdForUpdate = null; //id курса, информация о котором подлежит обновлению в БД
var rowsToClose = null; //хранит информацию о том, какие поля ввода нужно закрыть

//функция, которая запускается сразу же при загрузке страницы, - отображает весь список курсов из БД
window.onload = function(){
    var request = new XMLHttpRequest(); //запрос
    request.open("POST","DisplayServlet",false); //формируем запрос
    var string = "pageOnload"; //помещаем в запрос информацию о том, что страница только что прогрузилась
    request.setRequestHeader("Content-type", string);
    request.send();
    //получаем ответ сервлета
    var response;
    response = request.response;
    var parsedResponce = JSON.parse(response); //парсим ответ

    returnedJSON = parsedResponce; //помещаем ответ сервлета в новую переменную
    showNewTable(); //вызываем функцию формирования новой таблицы
}

//функция, которая закрывает определённые поля ввода
function closeRows(){
    //если открыты поля ввода для добавления нового курса
    if(rowsToClose == 0){
        //удалить эти поля
        var courseName = document.getElementById("courseName");
        var field = document.getElementById("field");
        var companyName = document.getElementById("companyName");
        var price = document.getElementById("price");
        var mentor = document.getElementById("mentor");
        courseName.remove();
        field.remove();
        companyName.remove();
        price.remove();
        mentor.remove();
    }
    //если открыты поля ввода для изменения информации о уже существующем курсе
    if(rowsToClose == 1){
        //удалить эти поля
        var courseName = document.getElementById("newCourseName");
        var field = document.getElementById("newField");
        var companyName = document.getElementById("newCompanyName");
        var price = document.getElementById("newPrice");
        var mentor = document.getElementById("newMentor");
        courseName.remove();
        field.remove();
        companyName.remove();
        price.remove();
        mentor.remove();
    }
}

//функция, которая определяет, на какой сервлет поступят данные с заполненной формы для дальнейшей обработки
function functionListener(){
    //если форма была заполнена информацией о новом курсе - отправляем её на сервлет добавления нового курса
    if(functionListenerState == 1)
    {
        sendJsonToCreate();
    }
    //если форма была заполнена изменённой информацией о уже существующем курсе - отправляем её на сервлет обновления
    //информации и существующем курсе
    if(functionListenerState == 2)
    {
        sendJsonToUpdate();
    }
}

//функция формирования JSON строки из содержимого таблицы и отправка этой строки на сервлет добавления нового курса
function sendJsonToCreate() {
    var object = {}; //создаём объект из формы
    var formData = new FormData(document.forms.newCourseForm); //ссылаемся на форму

    formData.forEach(function(value, key){
        object[key] = value; //заполняем
    });

    var json = JSON.stringify(object); //преобразуем в JSON-строку
    var request = new XMLHttpRequest(); //создаём запрос
    request.open("POST","CreateServlet",false); //ссылаемся на сервлет; запрос ассинхронный
    request.setRequestHeader("Content-type", json); //формируем данные для отправки
    request.send(); //отправляем на сервер JSON-строку
    //обработка ошибки в случае неудачи
    if (request.status != 200) {
        alert(request.status + ': ' + request.statusText);
    }
    else {
        alert("Курс успешно добавлен");
    }
    var response;
    response = request.response; //получили ответ
    var parsedJSON = JSON.parse(response); //распарсили ответ в объект

    returnedJSON = parsedJSON;
    document.getElementById("showAllCourses").style.display = "block"; //отображаем кнопку showAllCourses
    showNewTable(); //вызываем функцию формирования новой таблицы
}

//функция формирования строк для изменения информации об уже существующем курсе
function updateCourse(courseId) {
    //обозначаем, что заполняем форму для того, чтобы обновить информацию, а не создать новый курс
    functionListenerState = 2;
    courseIdForUpdate = courseId; //id курса, информацию о котором нужно обновить
    //обозначаем, что дальше будут созданы строки для изменения информации о курсе
    rowsToClose = 1;
    //создаём новые строки
    let rows="";
    rows+="<tbody id = \"updateRows\">"
    rows+="<tr>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"newCourseName\" name=\"courseName\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"newField\" name=\"field\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"newCompanyName\" name=\"companyName\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"newPrice\" name=\"price\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"newMentor\" name=\"mentor\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="</tr>";
    rows+="</tbody>"
    rows+="<td>"+"<button id=\"confirmBtn\" type=\"reset\" class=\"changingBtn\">Подтвердить</button>"+"</td>";
    let table = document.getElementById("updateRows"); //найти элемент updateRows
    let tableContent = rows; //прочитать его содержимое изменить его на сгенерированные строки
    table.innerHTML = tableContent; //отобразить
}

//функция формирования JSON строки из содержимого таблицы и отправка этой строки на сервлет изменения информации
//об уже существующем курсе
function sendJsonToUpdate(){
    var object = {}; //создаём объект из формы
    var formData = new FormData(document.forms.newCourseForm); //ссылаемся на форму

    formData.forEach(function(value, key){
        object[key] = value; //заполняем
    });
    object['id']=courseIdForUpdate.toString();
    var jsonUpdate = JSON.stringify(object); //преобразуем в JSON-строку
    var request = new XMLHttpRequest(); //создаём запрос
    request.open("POST","UpdateServlet",false); //ссылаемся на сервлет; запрос ассинхронный
    request.setRequestHeader("Content-type", jsonUpdate); //формируем данные для отправки
    request.send(); //отправляем на сервер JSON-строку
    //обработка ошибки в случае неудачи
    if (request.status != 200) {
        alert(request.status + ': ' + request.statusText);
    }
    else {
        alert("Исправления внесены");
    }
    var response;
    response = request.response; //получили ответ
    var parsedJSON = JSON.parse(response); //распарсили ответ в объект

    returnedJSON = parsedJSON;
    document.getElementById("showAllCourses").style.display = "block"; //отобразить кнопку showAllCourses
    showNewTable();
}

//функция формирования JSON строки для отправки на сервлет для удаления информации о курсе
function deleteCourse(courseId) {
    var request = new XMLHttpRequest();
    request.open("POST","DeleteServlet",false);
    var string = courseId;
    request.setRequestHeader("Content-type", string); //отправляем на сервлет id курса, который нужно удалить
    request.send();
    if (request.status != 200) {
        alert("Что-то пошло не так");
    }
    else {
        alert("Выбранный курс будет удалён");
    }

    var response;
    response = request.response;
    var parsedResponce = JSON.parse(response);

    returnedJSON = parsedResponce;
    showNewTable();
}

//функция отображения новой таблицы с курсами
function showNewTable() {
    let str=createNewTable(returnedJSON); //создали новую таблицу
    let originalTable = document.getElementById("newTable"); //найти элемент newTable
    let tableContent = str; //прочитать его содержимое и добавить к нему новую таблицу
    originalTable.innerHTML = tableContent; //заменить элемент newTable на его обновлённую версию
}

//функция формирования новой таблицы на основе вернувшейся с сервлета информации
function createNewTable(parsedJSON) {
    let str=""; //строка
    var length=0;
    for(var k in parsedJSON) if(parsedJSON.hasOwnProperty(k)) length++; //вычислить длину объекта
    for (var i=0; i<length;i++) //для всех строк
    {
        //сформировать новую таблицу
        str+="<tbody id = \"newTable\">"
        str+="<tr>";
        str+="<td id = tdCourseName"+ parsedJSON[i.toString()].id + ">"+parsedJSON[i.toString()].courseName+"</td>";
        str+="<td id = tdField"+ parsedJSON[i.toString()].id + ">"+parsedJSON[i.toString()].field+"</td>";
        str+="<td id = tdCompanyName"+ parsedJSON[i.toString()].id + ">"+parsedJSON[i.toString()].companyName+"</td>";
        str+="<td id = tdPrice"+ parsedJSON[i.toString()].id + ">"+parsedJSON[i.toString()].price+"</td>";
        str+="<td id = tdMentor"+ parsedJSON[i.toString()].id + ">"+parsedJSON[i.toString()].mentor+"</td>";
        str+="<td>"+"<button class=\"changingBtn\" id = editCourse"+parsedJSON[i.toString()].id + " onclick='updateCourse(" + parsedJSON[i.toString()].id + ")'>Изменить</button>"+"</td>";
        str+="<td>"+"<button class=\"changingBtn\" id = deleteCourse"+parsedJSON[i.toString()].id + " onclick='deleteCourse(" + parsedJSON[i.toString()].id + ")'>Удалить</button>"+"</td>";
        str+="</tr>";
        str+="</tbody>";
    }
    return str; //возвращаем строки таблицы
}

function emptyRows(){
    //обозначаем, что заполняем форму для того, чтобы добавить новый курс
    functionListenerState = 1;
    //обозначаем, что дальше будут созданы строки для добавления информации о новом курсе
    rowsToClose = 0;
    let rows="";
    rows+="<tbody id = \"emptyRows\">"
    rows+="<tr>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"courseName\" name=\"courseName\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"field\" name=\"field\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"companyName\" name=\"companyName\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"price\" name=\"price\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="<td>";
    rows+="<input type=\"text\" id=\"mentor\" name=\"mentor\" class=\"form-control\" aria-label=\"Default\" aria-describedby=\"inputGroup-sizing-default\" required>";
    rows+="</td>";
    rows+="</tr>";
    rows+="</tbody>"
    rows+="<p><button id=\"confirmBtn\" type=\"reset\" class=\"newButtons\" style=\"right:930px; top:27px;\">Подтвердить</button></p>";

    let table = document.getElementById("emptyRows"); //найти элемент emptyRows
    let tableContent = table.textContent + rows; //прочитать его содержимое и добавить к нему сгенерированные строки
    table.innerHTML = tableContent //заменить элемент emptyRows на его обновлённую версию
}
