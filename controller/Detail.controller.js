sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "ZAC_APP/model/formatter"
], function (BaseController, Filter, JSONModel, MessageToast, MessageBox, formatter) {
    "use strict";

    return BaseController.extend("ZAC_APP.controller.Detail", {
        formatter: formatter,
        onInit: function () {
            this.applyDensityClass();
            this.setModel(new JSONModel(), "detail1");
            this.setModel(new JSONModel(), "detail2");
            this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (e) {
            //Set Busy whenever new detail loaded
            var contractNo = e.getParameter("arguments").ContractId;
            this.loadData(contractNo);
        },
        loadData: function (contractNo) {
            var that = this;
            that.byId("detail1_a").setBusy(true);
            that.byId("detail1_b").setBusy(true);
            that.byId("detail2").setBusy(true);
            this.loadDetail1(contractNo, function (that) {

                that.loadDetail2(contractNo, function (that) {
                    that.byId("detail2").setBusy(false);
                });
            });

        },
        loadDetail1: function (contractNo, mCallback) {
            var that = this;
            var odataModel = this.getModel();
            var key = odataModel.createKey("/Detail1Set", {
                "ContractNo": contractNo
            });
            var onSuccess = function (o, r) {
                var detail1Model = that.getModel("detail1");
                var data = o;
                if (that.checkNavData("currentContract")) {
                    var currentContract = that.consumeNavData("currentContract");
                    data.CustomerRefNo = currentContract.CustomerRefNo;
                    data.Currency = currentContract.Currency;
                    data.DocumentDate = currentContract.DocumentDate;
                    detail1Model.updateBindings(true);
                }
                detail1Model.setProperty("/", data);
                that.byId("detail1_a").setBusy(false);
                that.byId("detail1_b").setBusy(false);
                mCallback(that);
            }, onError = function () {
                that.byId("detail1_a").setBusy(false);
                that.byId("detail1_b").setBusy(false);
            };
            odataModel.read(key, {
                success: onSuccess,
                error: onError
            });
        },
        loadDetail2: function (contractNo, mCallback) {
            var that = this;
            var odataModel = this.getModel();
            var filters = [];
            var contractNoFilter = new Filter({
                path: "ContractNo",
                operator: "EQ",
                value1: contractNo
            });
            filters.push(contractNoFilter);
            var onSuccess = function (o, r) {
                var detail2Model = that.getModel("detail2");
                var data = o.results;
                detail2Model.setProperty("/", data);
                detail2Model.setProperty("/count", data.length);
                detail2Model.updateBindings(true);
                mCallback(that);
            }, onError = function () {
                mCallback(that);
            };
            odataModel.read("/Detail2Set", {
                filters: filters,
                success: onSuccess,
                error: onError
            });
        },
        onApproveContract: function () {
            var that = this;
            var msgApproveContractConfirm = this.getResourceBundle().getText("msgApproveContractConfirm");
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var onClose = function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                    that.approveContract();
                    MessageToast.show("Confirmed");
                } else if (oAction === MessageBox.Action.Cancel) {
                    //cancel
                }
            };
            MessageBox.confirm(
                msgApproveContractConfirm, {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: onClose
                }
            );
        },
        approveContract: function () {
            var oDataModel = this.getModel();
            var sendData = {
                "ContractNo": "",
                "ObjectNo": ""
            };
            oDataModel.callFunction("ApproveContract", // function import name
                "POST", // http method
                sendData, // function import parameters
                null,
                function (oData, response) {
                }, // callback function for success
                function (oError) {
                });
        },
        onRejectContract: function () {
            var that = this;
            var msgApproveContractConfirm = this.getResourceBundle().getText("msgApproveContractConfirm");
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var onClose = function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                    that.rejectContract();
                    MessageToast.show("Confirmed");
                } else if (oAction === MessageBox.Action.Cancel) {
                    //cancel
                }
            };
            MessageBox.confirm(
                msgApproveContractConfirm, {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: onClose
                }
            );
        },
        onOpenRejectDialog: function () {
            var that = this;
            if (!this.RejectDialog) {
                this.RejectDialog = this.initFragment("ZAC_APP.fragment.RejectDialog", "reject");
            }
            this.RejectDialog.open();
        },
        rejectContract: function () {
            var oDataModel = this.getModel();
            var sendData = {
                "ContractNo": "",
                "DeliveryBlock": "",
                "ObjectNo": "",
                "Reason": ""
            };
            oDataModel.callFunction("RejectContract", // function import name
                "POST", // http method
                sendData, // function import parameters
                null,
                function (oData, response) {
                }, // callback function for success
                function (oError) {
                });
        },


    });
});