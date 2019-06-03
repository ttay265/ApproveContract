sap.ui.define([
    "ZAC_APP/controller/BaseController",
], function (BaseController) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.InitView", {
        onInit: function () {
            var oDataModel = this.getModel();
            // this.loadCustomerVH();
        }

    });

});