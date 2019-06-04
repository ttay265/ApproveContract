sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/core/ValueState",
    "sap/ui/model/type/Currency"
], function (BaseController, ValueState, Currency) {
    "use strict";
    var baseController = new BaseController();
    return {
        formattedCurrency: function (amount, currency) {
            var oCurrency = new Currency({
                showMeasure: false
            });

            return oCurrency.formatValue([amount, currency], "string");

        },
        formattedCurrencyWithUom: function (amount, currency) {
            var oCurrency = new Currency({
                showMeasure: false
            });

            var string = "";
            if (amount && amount > 0) {
                string = oCurrency.formatValue([amount, currency], "string") + " " + "VND";
            } else {
                string = "0 VND";
            }
            return string;
        }
    };
});