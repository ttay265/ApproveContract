sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "ZAC_APP/model/models",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("ZAC_APP.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function() {
            //
            // this.userInfo = new sap.ushell.services.UserInfo();
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            // Initialize router
            this.getRouter().initialize();
            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            var globalModel = new JSONModel({
                "Werks": "",   //Plant
                "Arbpl": "",   //Resource
                "Ktext": "",
                "Atnam": "",   //Characteric
                "Wempf": "",   //Mã lô
                "Ferth": ""    //Cá SP trong lô
            });

            var globalFilterModel = new  JSONModel({
                "Plant": "",    //Plant
                "Bname": "",    //Ma NV
                "Empgr": "",    //Nhóm nv
                "Wempf": "",    //Mã lô SX
                "Ferth": ""     //Cá SP trong lô
            });

            var globalOEEModel = new  JSONModel({
                "Werks": "",
                "Wempf": "",
                "Wrtim": "",
                "Arbpl": "",
                "Atnam": "",
                "Ktext": "",
                "Frdat": "",
                "Todat": "",
                "Frtim": "",
                "Totim": "",
                "Shift": "",
                "Atwtb": "",
                "Notes": "",
                "Total": ""
            });

            this.setModel(globalOEEModel, 'globalOEEModel');
            this.setModel(globalFilterModel, "globalFilterParam");
            this.setModel(globalModel, "globalProperties");
        },
        createDeviceModel : function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (!Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        },
    });

});