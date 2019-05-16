sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
], function (BaseController, JSONModel, MessageToast, MessageBox, Filter) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Master", {
        onInit: function () {
            this.refreshIndicator = this.byId("_refresh");
            this.getView().setModel(
                new JSONModel(), "resourceMaster"
            );
            this.getView().setModel(
                new JSONModel(), "selectedResource"
            );
            if (!this.filterDialog) {
                this.filterDialog = sap.ui.xmlfragment(this.getView().getId(), "ZAC_APP.fragment.FilterDialog", this);
                this.inp_Plant = this.byId("inp_Plant");
                this.inp_Nhomnv = this.byId("inp_Nhomnv");
                this.inp_Malosx = this.byId("inp_Malosx");
                this.listSuggestItems = this.byId("liItems");
                this.listSuggestItems.setModel(
                    new JSONModel(),
                    "slocProdModel"
                );
                this.getView().addDependent(this.filterDialog);
            }

            this.getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
        },
        onAfterRendering: function () {

        },
        onBeforeRendering: function () {

        },
        _onObjectMatched: function () {

        },
        onRefresh: function () {
            var inpData = this.getFilterParmeter().getData();
            if (inpData) {
                // this.doFilterData(inpData.Plant, inpData.Empgr, inpData.Wempf);
                this.doFilterData(inpData.Plant, inpData.Empgr, inpData.Wempf, inpData.Bname);
            }
            ;
            this.refreshIndicator.hide();
        },
        doFilterData: function (Plant, Empgr, Malosx, userLogon) {
            var filters = [];
            var that = this;
            //Plant
            var resourceFilter = new Filter({
                path: "Werks",
                operator: "EQ",
                value1: Plant
            });
            filters.push(resourceFilter);
            //Employee group
            var resourceFilter = new Filter({
                path: "Greid",
                operator: "EQ",
                value1: Empgr
            });
            filters.push(resourceFilter);
            //Ma lo san xuat
            var resourceFilter = new Filter({
                path: "Wempf",
                operator: "EQ",
                value1: Malosx
            });
            filters.push(resourceFilter);

            var uNameFilter = new Filter({
                path: "Bname",
                operator: "EQ",
                value1: userLogon
            });
            filters.push(uNameFilter);

            var onSuccess = function (oData) {
                that.refreshIndicator.hide();
                that.getModel("resourceMaster").setData(oData, false);
            }, onFail = function (error) {
                console.log(error, "error");
                that.refreshIndicator.hide();
            };
            this.getModel().read("/ResourceSet", {
                    filters: filters,
                    success: onSuccess,
                    fail: onFail
                }
            );
        },
        navToDetail: function (oEvent) {
            // Proccess for get paramgeter as Array when read model(results array)
            var Arbpl = oEvent.getParameters().listItem.mProperties.description;
            var Werks = oEvent.getParameters().listItem.mProperties.info;
            var msgErr = this.getResourceBundle().getText("msg_Arbpl");

            if (Arbpl && Werks) {
                this.getRouter().navTo(
                    "resourceDetail",
                    {
                        "Arbpl": Arbpl,
                        "Werks": Werks
                    },
                    false);
            } else {
                MessageToast.show(msgErr);
            }
        },
        navToFilterDialog: function () {
            this.filterDialog.open();
        },
        __btn_Cancel: function () {
            this.filterDialog.close();
        },
        __btn_Accept: function () {
            var that = this;
            // 28.05.2018 Added BEGIN
            // Run on /UI2/FLP ONLY
            // var userLogon = 'FPT.FIORI';//new sap.ushell.services.UserInfo().getId();
            var userLogon;
            try {
                userLogon = new sap.ushell.services.UserInfo().getId();
            } catch (e) {
                return;
            }
            // 28.05.2018 Added BEND
            var plant_inp = this.inp_Plant.getSelectedKey();
            var empGr_inp = this.inp_Nhomnv.getSelectedKey();
            var maLosx_inp = this.inp_Malosx.getValue();
            // var malosx_inp = this.getModel("selectedResource").getProperty("/title");

            var onSuccess = function (odata) {
                that.getFilterParmeter().setProperty("/Plant", plant_inp, null, true);
                that.getFilterParmeter().setProperty("/Empgr", empGr_inp, null, true);
                // 28.05.2018 Added BEGIN
                that.getFilterParmeter().setProperty("/Bname", userLogon, null, true);
                // 28.05.2018 Added END
                that.getFilterParmeter().setProperty("/Wempf", odata.Wempf, null, true);
                that.doFilterData(plant_inp, empGr_inp, odata.Wempf, userLogon);
                that.filterDialog.close();
            }, onError = function () {
                MessageBox.error(that.getResourceBundle().getText("msgNoSloc"));
            };
            var key = this.getModel().createKey("/SlocSet",
                {
                    Plant: plant_inp,
                    Wempf: maLosx_inp
                });
            if (maLosx_inp) {
                this.getModel().read(key, {
                        success: onSuccess,
                        error: onError
                    }
                );
            } else {
                this.doSuggestSlocProd(maLosx_inp);
            }
        },
        onSuggestSlocProd: function (oEvent) {
            if (oEvent.getSource()) {
                var searchValue = oEvent.getSource().getValue();
                if (searchValue) {
                    this.doSuggestSlocProd(searchValue);
                }
            }
        },
        doSuggestSlocProd: function (inpValue) {
            var searchParameters = {
                "search": inpValue,
                "$top": "15"
            };
            var filters = [];
            var filterParam = new sap.ui.model.Filter({
                path: 'Plant',
                operator: 'EQ',
                value1: this.inp_Plant.getSelectedKey().toString()
            });
            filters.push(filterParam);

            var msgNoFound = this.getResourceBundle().getText("msgNoFound");

            var that = this;

            var onSuccess = function (oData) {
                if (oData.results.length < 1) {
                    that.listSuggestItems.getModel("slocProdModel").setData(null, false);
                    MessageToast.show(msgNoFound);
                } else {
                    that.listSuggestItems.getModel("slocProdModel").setData(oData, false);
                    console.log(that.tbSearchSloc);
                }
            }, onFail = function (error) {

            };

            this.getModel().read("/SlocSet", {
                    urlParameters: searchParameters,
                    filters: filters,
                    success: onSuccess,
                    error: onFail
                }
            );
        },

        selSlocProd: function (oEvent) {
            var selectedResourceModel = this.getModel("selectedResource");
            var selSlocProd = oEvent.getSource().getSelectedItem().getProperty("title");
            var selProdInSloc = oEvent.getSource().getSelectedItem().getProperty("info");
            if (selProdInSloc) {
                this.getFilterParmeter().setProperty("/Ferth", selProdInSloc, null, true);
                selectedResourceModel.setProperty("/title", selSlocProd);
                selectedResourceModel.setProperty("/info", selProdInSloc);
            }
            this.inp_Malosx.setValue(selSlocProd);
            this.listSuggestItems.getModel("slocProdModel").setData(null, false);
        }
    });

});