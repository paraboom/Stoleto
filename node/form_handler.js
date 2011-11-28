var orderCounter = 1;

/**
 * Обработчик формы заказа
 */
var FormHandler = function() {};
FormHandler.prototype.dummyData = [];

/**
 * Возвращает все заказы
 * @param Function callback
 */
FormHandler.prototype.findAll = function(callback) {
    callback(null, this.dummyData);
};

/**
 * Поиск заказ по id
 * @param Number id Айдишник заказа
 */
FormHandler.prototype.findById = function(id, callback) {
    var result = null;
    for (var i = 0; i < this.dummyData.length; i++) {
        if (this.dummyData[i]._id == id) {
            result = this.dummyData[i];
            break;
        }
    }
    callback(null, result);
};

/**
 * Сохраняем новый заказ или заказы
 * @param Object orders Массив или один объект заказа
 */
FormHandler.prototype.save = function(orders, callback) {
    var order = null;
    if (typeof(orders.length) == 'undefined') {
        orders = [orders];
    }

    for (var i = 0; i < orders.length; i++) {
        order = orders[i];
        order._id = orderCounter++;
        orders.create_at = new Date();

        this.dummyData[this.dummyData.length] = order;
    }
    callback(null, orders);
};

new FormHandler().save([{
    type: 'commercial',
    timing: 10,
    style: 'funny',
    competitors: 'They r fuckers',
    specials: 'Nothing special',
    content: 'About our car',
    additionals: '',
    name: 'Ivan Sharicov'
}, {
    type: 'introduction',
    timing: 30,
    style: 'moody',
    competitors: 'They know how to sell things',
    specials: 'We r loosers',
    content: 'Introduction to our talk show',
    additionals: 'Shiny voice, please',
    name: 'Larisa Gorohina'
}], function(error, orders) {});exports.FormHandler = FormHandler;