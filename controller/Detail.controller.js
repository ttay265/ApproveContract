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
            this.openBusyDialog({
                text: "Loading...",
                showCancelButton: true
            });
            var postProcessing = function (that) {
                that.closeBusyDialog();
            };
            this.loadDetail1(contractNo, postProcessing);
            this.loadDetail2(contractNo, postProcessing);
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
                mCallback(that);
            }, onError = function () {
                mCallback(that);
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
            var msgApproveContractConfirm = this.getResourceBundle().getText("msgApproveContractConfirm");
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var onClose = function (oAction) {
                if (oAction === MessageBox.Action.OK) {
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
        onRejectContract: function () {
            if (!this.RejectDialog) {
                this.RejectDialog = this.initFragment("ZAC_APP.fragment.RejectDialog", "reject");
            }
            this.RejectDialog.open();
        },


    });
});