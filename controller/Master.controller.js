sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
], function (BaseController, JSONModel, MessageToast, MessageBox, Filter) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Master", {
        onOpenFilter: function () {
            if (!this.FilterDialog) {
                this.FilterDialog = this.initFragment("ZAC_APP.fragment.MasterFilter", "filter");
            }
            this.FilterDialog.open();
        },
        onOpenSort: function () {
            if (!this.SortDialog) {
                this.SortDialog = this.initFragment("ZAC_APP.fragment.MasterSort", "sort");
            }
            this.SortDialog.open();
        }
    });

});