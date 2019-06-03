sap.ui.define([
    "ZAC_APP/controller/BaseController",
], function (BaseController) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.InitView", {
        onInit: function () {
            var CustomerVHMode = new JSONModel();
            var SalesOrgVHModel = new JSONModel();
            var DistChannelVHModel = new JSONModel();
            var SalesOfficeVHModel = new JSONModel();
            var SalesGroupVHModel = new JSONModel();
            var CustomerGroupVHModel = new JSONModel();
            var oDataModel = this.getModel();
            // this.loadCustomerVH();
        },
        loadCustomerVH: function () {
            var onSuccess = function (o, r) {
                    //map odata
                    var data = o.results;
                    if (data && data.length > 0) {
                        that.getModel("vhCustomer").setProperty("/", data);
                        that.getModel("vhCustomer").setProperty("/count", data.length);
                    }
                },
                onError = function () {
                    MessageBox.error("There is an error with the network connection");
                };
            model.read("/CustomerValueHelpSet", {
                    filters: filters,
                    success: onSuccess,
                    error: onError
                }
            )
        },
        // loadSalesOrgVH: function () {
        //     var onSuccess = function (o, r) {
        //             //map odata
        //             var data = o.results;
        //             if (data && data.length > 0) {
        //                 that.getModel("header").setProperty("/", data);
        //                 that.getModel("header").setProperty("/count", data.length);
        //             }
        //         },
        //         onError = function () {
        //             MessageBox.error("There is an error with the network connection");
        //         };
        //     model.read("/CustomerValueHelpSet", {
        //             filters: filters,
        //             success: onSuccess,
        //             error: onError
        //         }
        //     )
        // }, loadCustomerVH: function () {
        //     var onSuccess = function (o, r) {
        //             //map odata
        //             var data = o.results;
        //             if (data && data.length > 0) {
        //                 that.getModel("header").setProperty("/", data);
        //                 that.getModel("header").setProperty("/count", data.length);
        //             }
        //         },
        //         onError = function () {
        //             MessageBox.error("There is an error with the network connection");
        //         };
        //     model.read("/CustomerValueHelpSet", {
        //             filters: filters,
        //             success: onSuccess,
        //             error: onError
        //         }
        //     )
        // }, loadCustomerVH: function () {
        //     var onSuccess = function (o, r) {
        //             //map odata
        //             var data = o.results;
        //             if (data && data.length > 0) {
        //                 that.getModel("header").setProperty("/", data);
        //                 that.getModel("header").setProperty("/count", data.length);
        //             }
        //         },
        //         onError = function () {
        //             MessageBox.error("There is an error with the network connection");
        //         };
        //     model.read("/CustomerValueHelpSet", {
        //             filters: filters,
        //             success: onSuccess,
        //             error: onError
        //         }
        //     )
        // }, loadCustomerVH: function () {
        //     var onSuccess = function (o, r) {
        //             //map odata
        //             var data = o.results;
        //             if (data && data.length > 0) {
        //                 that.getModel("header").setProperty("/", data);
        //                 that.getModel("header").setProperty("/count", data.length);
        //             }
        //         },
        //         onError = function () {
        //             MessageBox.error("There is an error with the network connection");
        //         };
        //     model.read("/CustomerValueHelpSet", {
        //             filters: filters,
        //             success: onSuccess,
        //             error: onError
        //         }
        //     )
        // },

    });

});