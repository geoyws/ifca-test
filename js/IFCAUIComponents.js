function Listview(id) {
    this.id = id;
    var arraylist = [];
    this.items = arraylist;
}

Listview.prototype.addItem = function (item) {
    this.items.push(item);
}

Listview.prototype.onClickItem = function (callback) {
    $(document).on("click", "#" + this.id + " li", callback);
}

Listview.prototype.generateListview = function (event) {
    var listString = "<ul id='" + this.id + "' data-role='listview'>";
       

    $.each(this.items, function (index, value) {
        listString += event.displayItemFormat(value);
    });

    listString += "</ul>";

    return listString;
}

Listview.prototype.displayItemFormat = function (value) {
    return "<li data='" + value + "' data-inset='true' >" + value + "</li>";
}

IFCAListview.prototype = Object.create(Listview.prototype);

IFCAListview.prototype.constructor = IFCAListview;

function IFCAListview(id) {
    Listview.call(this, id);
}
