sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog"
], function (Controller, Device, MessageToast, JSONModel, BusyDialog) {
    "use strict";
    /*
     Common base class for the controllers of this app containing some convenience methods
     */
    return Controller.extend("ZTVBH.controller.BaseController", {
        applyDensityClass: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        },
        initFragment: function (sFragName, sModelName) {
            var fragment = sap.ui.xmlfragment(this.getView().getId(), sFragName, this);
            this.getView().addDependent(fragment);
            fragment.setModel(new JSONModel(), sModelName);
            fragment.addStyleClass(this.getOwnerComponent().getContentDensityClass());
            return fragment;
        },
        openBusyDialog: function (oSetting) {
            if (!this.busyDialog) {
                this.busyDialog = new BusyDialog(oSetting);
            } else {
                this.busyDialog.setTitle(oSetting.title);
                this.busyDialog.getText(oSetting.text);
                this.busyDialog.setShowCancelButton(oSetting.showCancelButton);
            }
            this.busyDialog.open();
        },
        closeBusyDialog: function () {
            if (this.busyDialog) {
                this.busyDialog.close();
            }
        },
        /**
         * Convenience method for getting the control of view by Id.
         * @public
         * @param {string} sId id of the control
         * @returns {sap.m.control} the control
         */
        byId: function (sId) {
            return this.getView().byId(sId);
        },
        getSId: function (id) {
            return this.getView().getId() + "--" + id;
        },
        /**
         * Convenience method for getting the control of view by Id.
         * @public
         * @param {string} sId id of the control
         * @returns {sap.m.control} the control
         */
        toast: function (sMessage) {
            return MessageToast.show(sMessage);
        },

        back: function () {
            window.history.back();
        },

        getDevice: function () {
            return Device;
        },
        dialogClose: function (oSource) {
            oSource.close();
        },
        /**
         * Convenience method for accessing the router in each controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            // if (sName === null || sName === "") {
            // 	return this.getOwnerComponent().getModel("i18n");
            // }
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        createModel: function (sName) {
            var model = new JSONModel();
            this.getView().setModel(model, sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },
        onDialogClose: function (e) {
            e.getSource().getParent().close();
        },
        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resource model of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getGlobalOEEModel: function () {
            return this.getOwnerComponent().getModel("globalOEEModel");
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getGlobalModel: function () {
            return this.getOwnerComponent().getModel("globalProperties");
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getFilterParmeter: function () {
            return this.getOwnerComponent().getModel("globalFilterParam");
        },
        /**
         * Convenience method to get the global model containing the global state of the app.
         * @returns {object} the global Propery model
         */
        getCartModel: function () {
            return this.getOwnerComponent().getModel("CartProperties");
        },
        /**
         * Convenience method
         * @returns {object} the application controller
         */
        getApplication: function () {
            return this.getGlobalModel().getProperty("/application");
        },

        /**
         * Convenience method checking login token
         * @returns {object} the application controller
         */
        checkLogin: function () {
            var user = this.getGlobalModel().getProperty("/user");
            var token = this.getGlobalModel().getProperty("/token");
            return token !== "" && user !== "";
        },
        changeToUTC: function (dateObject) {
            var oriTime = dateObject.getHours();
            oriTime += 7; // offset = (UTC+7).
            dateObject.setHours(oriTime);
            return dateObject;
        }
    });
});