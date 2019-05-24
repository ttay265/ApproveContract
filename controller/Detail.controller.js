sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, JSONModel, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Detail", {
        onInit: function() {
          this.applyDensityClass();
            this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (e) {

            var contractNo = e.getParameter("arguments").ContractId;
            this.loadData(contractNo);
        },
        loadData: function (contractNo) {
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
                    data.ContractNo = currentContract.ContractNo;
                    data.CustomerRefNo = currentContract.CustomerRefNo;
                    data.Currency = currentContract.Currency;
                    data.DocumentDate = currentContract.DocumentDate;
                    data.CustomerRefDate = currentContract.CustomerRefDate;
                    data.PaymentTermDes = currentContract.PaymentTermDes;
                }
                detail1Model.setData("", data);

            }, onError = function () {

            };
            odataModel.read(key, {
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