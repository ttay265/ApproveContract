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
                    data.ObjectNumber = currentContract.ObjectNumber;
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
                    var mCallback = function (oData) {
                        MessageToast.show("Contract " + oData.ContractNo + ": " + oData.Message);
                        that.getRouter().navTo("master", true);
                    };
                    that.approveContract(mCallback);

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
        approveContract: function (mCallBack) {
            var detail1Model = this.getModel("detail1");
            var ObjectNumber = detail1Model.getProperty("/ObjectNumber");
            var ContractNo = detail1Model.getProperty("/ContractNo");
            var oDataModel = this.getModel();
            var sendData = {
                "ContractNo": ContractNo,
                "ObjectNo": ObjectNumber
            };
            oDataModel.callFunction("/ApproveContract", {
                method: "POST",
                urlParameters: sendData,
                success: function (oData, response) {
                    if (oData.Return === "00") {
                        mCallBack(oData);
                    }
                }, // callback function for success
                error: function (oError) {
                    MessageToast.show("Error" + oError.toString());
                }
            });
            // function import name
        },
        onRejectContract: function () {
            var that = this;
            var msgApproveContractConfirm = this.getResourceBundle().getText("msgApproveContractConfirm");
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var onClose = function (oAction) {
                if (oAction === MessageBox.Action.OK) {
                    var mCallback = function (oData) {
                        MessageToast.show("Contract " + oData.ContractNo + ": " + oData.Message);
                        that.getRouter().navTo("master", true);
                    };
                    that.rejectContract(mCallback);
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
        rejectContract: function (mCallBack) {
            var detail1Model = this.getModel("detail1");
            var ObjectNumber = detail1Model.getProperty("/ObjectNumber");
            var ContractNo = detail1Model.getProperty("/ContractNo");
            var deliveryBlock = this.byId("selectDeliveryBlock").getSelectedKey();
            var Reason = this.byId("note").getValue();
            var oDataModel = this.getModel();
            var sendData = {
                "ContractNo": ContractNo,
                "DeliveryBlock": deliveryBlock,
                "ObjectNo": ObjectNumber,
                "Reason": Reason
            };
            oDataModel.callFunction("/RejectContract", {
                method: "POST",
                urlParameters: sendData,
                success: function (oData, response) {
                    if (oData.Return === "00") {
                        mCallBack(oData);
                    }
                }, // callback function for success
                error: function (oError) {
                }
            });

        },
    });
});