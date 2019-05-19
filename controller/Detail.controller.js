sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, JSONModel, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Detail", {
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