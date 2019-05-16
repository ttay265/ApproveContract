sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Filter, JSONModel, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Detail", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.OrderDetail
         */
        onInit: function () {
            this.resultValid = [];
            this.idxNumber = 0;
            this.idxMax = 0;
            this.tb_rsDetail = this.byId("tb_rsDetailData");
            this.selectedRow = [];
            this.setModel(
                new JSONModel(), "resourceDetail"
            );
            this.jsModel = new sap.ui.model.json.JSONModel("jsModel");
            this.Device = this.getDevice();

            if (!this.CharValuesHelpDialog) {
                this.CharValuesHelpDialog = sap.ui.xmlfragment("ZAC_APP.fragment.CharValuesHelp", this);
                this.getView().addDependent(this.CharValuesHelpDialog);
                this.CharValuesHelpDialog.setModel(new JSONModel());
            }

            // BCCTVH BEGIN
            if (!this.bcctvhDialog) {
                this.bcctvhDialog = sap.ui.xmlfragment(this.getView().getId(), "ZAC_APP.fragment.bcctvhDialog", this);
                this.bcctvhDialog.setStretch(true);
                this.tb_rsDetailReport = this.byId("tb_rsDetailReport");
                this.tb_rsDetailReport.setModel(
                    new JSONModel(), "rsDetailReport"
                );
                this.getView().addDependent(this.bcctvhDialog);
            }
            //BCCTVH END
            this.getRouter().getRoute("resourceDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        onAfterRendering: function () {
        },
        onBeforeRendering: function () {
        },
        _onObjectMatched: function (oEvent) {

            // this.inpValue = '';
            this.resultValid = [];
            this.tb_rsDetail.getModel('resourceDetail').setData(null);
            this.idxNumber = 0;
            this.selectedRow = 0;
            var resource = oEvent.getParameter("arguments").Arbpl;
            var werks = oEvent.getParameter("arguments").Werks;

            if (resource && werks) {
                if (this.getGlobalModel()) {
                    this.getGlobalModel().setProperty("/Arbpl", resource, null, true);
                    this.getGlobalModel().setProperty("/Werks", werks, null, true);
                }
            }
            var filters = [];
            var that = this;
            //Binding items
            this.tb_rsDetail.setBusy(true);

            var urlParameters = {
                "search": resource,
                "$top": "30"
            };
            var filters = [];
            var resourceFilter = new Filter({
                path: "Arbpl",
                operator: "EQ",
                value1: resource
            });
            filters.push(resourceFilter);

            var werksFilter = new Filter({
                path: "Werks",
                operator: "EQ",
                value1: werks
            });
            filters.push(werksFilter);

            var onSuccess = function (oData) {
                that.tb_rsDetail.setBusy(false);
                that.jsModel.setData(oData, false);
                that.showByIndex(0);
            }, onFail = function (error) {
                that._tblCustomerSet.setBusy(false);
            };
            this.getModel().read("/ResDetailSet", {
                    urlParameters: urlParameters,
                    filters: filters,
                    success: onSuccess,
                    fail: onFail
                }
            );
        },
        onCharValueHelp: function (e) {
            var atinn = e.getSource().getBindingContext("resourceDetail").getProperty("Atinn");
            var that = this;
            var onSuccess = function (oData) {
                var vhModel = that.CharValuesHelpDialog.getModel();
                vhModel.setData(oData.results);
            }, onFail = function (error) {

            };
            var filters = [];
            filters.push(new sap.ui.model.Filter("Atinn", "EQ", atinn));
            this.getModel().read("/CharValuesSet", {
                filters: filters,
                success: onSuccess,
                fail: onFail
            });
            this.CharValuesHelpDialog.open();
        },
        onUpAction: function () {
            if (this.inpValue) {
                this.confirmSaveResource(null, 'upAct');
            } else {
                if (this.idxNumber >= 1) {
                    this.idxNumber--;
                    this.showByIndex(this.idxNumber);
                    return;
                }
                if (this.idxNumber === 0) {
                    this.idxNumber = this.idxMax;
                    this.showByIndex(this.idxNumber);
                }
            }
        },
        onDownAction: function () {
            if (this.inpValue) {
                this.confirmSaveResource(null, 'downAct');
            } else {
                if (this.idxNumber < this.idxMax) {
                    this.idxNumber++;
                    this.showByIndex(this.idxNumber);
                    return;
                }
                if (this.idxNumber === this.idxMax) {
                    this.idxNumber = 0;
                    this.showByIndex(this.idxNumber);
                }
            }
        },
        _onCharValSelected: function (e) {
            var atwrt = e.getParameter("listItem").getBindingContext().getProperty("Atwrt");
            var atwtb = e.getParameter("listItem").getBindingContext().getProperty("Atwtb");
            var resModel = this.tb_rsDetail.getModel("resourceDetail");
            // Set data model for BCCTVH
            this.getGlobalModel().setProperty("/Atwrt", this.inpValue, null, true);
            resModel.setProperty("Atwrt", atwrt, this.tb_rsDetail.getItems()[0].getBindingContext("resourceDetail"));
            resModel.setProperty("Atwtb", atwtb, this.tb_rsDetail.getItems()[0].getBindingContext("resourceDetail"));
            this.CharValuesHelpDialog.close();
        },
        showByIndex: function (idxNumber) {
            // Get data master list
            this.selectedRow = [];
            var resModel = this.tb_rsDetail.getModel("resourceDetail");
            var i = 0;
            var oData = this.jsModel.getData();
            var displayedLines = [];
            if (oData) {
                this.idxMax = (oData.results.length - 1);
            } else {
                return;
            }
            var Ferth = this.byId("inp_SPTL").getValue();
            var Wempf = this.byId("inp_MLSX").getValue();
// TuanNQ21 - refactor code
            if (oData.results.length < 1 || oData.results.length <= idxNumber) {
                this.tb_rsDetail.getModel(
                    "resourceDetail").setData(null);

                return;
            }
            displayedLines.push(oData.results[idxNumber]);

            // Taivt5
            this.selectedRow.push(oData.results[idxNumber]);

            // Set data model for BCCTVH
            this.getGlobalModel().setProperty("/Atwrt", this.inpValue, null, true);             //Ma lo
            this.getGlobalModel().setProperty("/Atnam", oData.results[idxNumber].Atnam, null, true);    //Ma lo
            this.getGlobalModel().setProperty("/Ktext", oData.results[idxNumber].Ktext, null, true);    //Ma lo
            this.getGlobalModel().setProperty("/Wempf", Wempf, null, true);                     //Ma lo
            this.getGlobalModel().setProperty("/Ferth", Ferth, null, true);                     //Cac sp trong lo
            resModel.setData(displayedLines);
            // set visible for up & down button
            if (idxNumber === 0) {
                resModel.setProperty("/upVisible", false);
            }
            if (idxNumber === oData.results.length - 1) {
                resModel.setProperty("/downVisible", false);
            }

            resModel.setProperty("/Atfor", oData.results[idxNumber].Atfor);
            resModel.setProperty("/Atson", oData.results[idxNumber].Atson);
            resModel.setProperty("/indexTitle", "Item " + (idxNumber + 1) + " of " + oData.results.length);
            return;


            // for (i = 0; i < oData.results.length; i++) {
            //     if (i === idxNumber) {
            //         displayedLines.push(oData.results[i])
            //         this.selectedRow.push(oData.results[i]);
            //         // Set data model for BCCTVH
            //         this.getGlobalModel().setProperty("/Atwrt", this.inpValue, null, true);             //Ma lo
            //         this.getGlobalModel().setProperty("/Atnam", oData.results[i].Atnam, null, true);    //Ma lo
            //         this.getGlobalModel().setProperty("/Ktext", oData.results[i].Ktext, null, true);    //Ma lo
            //         this.getGlobalModel().setProperty("/Wempf", Wempf, null, true);                     //Ma lo
            //         this.getGlobalModel().setProperty("/Ferth", Ferth, null, true);                     //Cac sp trong lo
            //
            //         this.tb_rsDetail.getModel("resourceDetail").setData(displayedLines);
            //         return;
            //     } else {
            //         this.tb_rsDetail.getModel("resourceDetail").setData(null);
            //     }
            //
            // }
// TuanNQ21 - refactor code
            this.getGlobalModel().setProperty("/resourceName", oData.Ktext, null, true);
        },
        // onAcceptVal: function (oEvent) {
        //     // this.resultValid=[];
        //     this.resultVal = 0;
        //     this.inpValue = oEvent.getSource().getValue();
        //     this.onValidateValue(this.inpValue);
        // },

        onValidateValue: function (value) {
            var i = 0;
            var that = this;
            if (this.selectedRow) {
                var char = this.selectedRow[0].Atnam;
            }
            if (value) {
                var filters = [];
                var charFilter = new Filter({
                    path: "Attin",
                    operator: "EQ",
                    value1: char
                });
                filters.push(charFilter);
                var onSuccess = function (oData) {
                    console.log(oData);
                    that.resultValid = [];
                    for (i = 0; i < oData.results.length; i++) {
                        // Accept values
                        if (value === oData.results[i].Atwrt) {
                            that.resultVal = 1;
                            break;
                        } else {
                            // Additional value as checked 'X'
                            if (oData.results[i].Atson === 'X') {
                                that.resultVal = 1;
                            } else {
                                that.resultValid.push(oData.results[i].Atwrt);
                            }
                        }
                    }
                }, onFail = function (error) {

                };
                this.getModel().read("/CharValuesSet", {
                        filters: filters,
                        success: onSuccess,
                        fail: onFail
                    }
                );
            }
            ;
            return {
                returnValue: {
                    "result": that.resultVal,
                    "value": that.resultValid
                }
            };

        },
        //Button action
        onGetMLSX: function () {
            var Wempf = this.byId("inp_MLSX").getValue();
            if (Wempf) {
                this.sPath = this.getModel().createKey("/SlocSet", {
                    Wempf: Wempf
                });
                // console.log(this.sPath);
                this.getView().bindElement({
                    path: this.sPath
                });
            }
        },
        confirmSaveResource: function (oEvent, inpAction) {
            var msg_Save = this.getResourceBundle().getText("msg_SaveCTVH");
            var msg_Input = this.getResourceBundle().getText("msg_ValidInput");
            var msg_GTGN = this.getResourceBundle().getText("msg_GTGN");
            var msg_Confirm = this.getResourceBundle().getText("msg_SaveConfirm");
            var msg_SPTL = this.getResourceBundle().getText("msg_SPTL");
            var sanpham = this.byId('inp_SPTL').getValue();
            var currentLine = this.selectedRow;
            var giaTriGhiNhan = currentLine[0].Atwrt;

            var that = this, i = 0;


            // if (currentLine) {
            // if (currentLine[0].Atfor !== 'NUM') {
            //     var onValid = this.onValidateValue(that.inpValue);
            //     if (onValid.returnValue.result !== 1) {
            //         that.resultValid = [];
            //         MessageToast.show(msg_Input + " " + onValid.returnValue.value);
            //         return;
            //     }
            // }
            // }

            if (!sanpham) {
                MessageToast.show(msg_SPTL);
                return;
            }

            if (!giaTriGhiNhan) {
                MessageToast.show(msg_GTGN);
            } else {
                MessageBox.confirm(msg_Save, fnCallbackConfirm, msg_Confirm);
                function fnCallbackConfirm(bResult) {
                    if (bResult === 'OK') {
                        that.doSaveResource(oEvent);

                        switch (inpAction) {
                            case 'upAct': {
                                var data = that.tb_rsDetail.getModel("resourceDetail").getData();
                                for (i = 0; i < data.length; i++) {
                                    data[i].Atwrt = '';
                                }
                                that.tb_rsDetail.getModel('resourceDetail').setData(data);
                                that.inpValue = "";
                                that.tb_rsDetail.getModel("resourceDetail").refresh();
                                that.onUpAction();
                                break;
                            }
                            default: {
                                var data = that.tb_rsDetail.getModel("resourceDetail").getData();
                                for (i = 0; i < data.length; i++) {
                                    data[i].Atwrt = '';
                                }
                                that.tb_rsDetail.getModel('resourceDetail').setData(data);
                                that.inpValue = "";
                                that.tb_rsDetail.getModel("resourceDetail").refresh();
                                that.onDownAction();
                                break;
                            }
                        }
                        return;

                    } else {
                        switch (inpAction) {
                            case 'upAct': {
                                var data = that.tb_rsDetail.getModel("resourceDetail").getData();
                                for (i = 0; i < data.length; i++) {
                                    data[i].Atwrt = '';
                                }
                                that.tb_rsDetail.getModel('resourceDetail').setData(data);
                                that.inpValue = "";
                                that.tb_rsDetail.getModel("resourceDetail").refresh();
                                that.onUpAction();
                                break;
                            }
                            case 'downAct': {
                                var data = that.tb_rsDetail.getModel("resourceDetail").getData();
                                for (i = 0; i < data.length; i++) {
                                    data[i].Atwrt = '';
                                }
                                that.tb_rsDetail.getModel('resourceDetail').setData(data);
                                that.inpValue = "";
                                that.tb_rsDetail.getModel("resourceDetail").refresh();
                                that.onDownAction();
                                break;
                            }
                        }
                        return;
                    }
                }
            }
        },
        doSaveResource: function (oEvent) {
            var msg_Success = this.getResourceBundle().getText("msg_Success");
            var msg_Failed = this.getResourceBundle().getText("msg_Failed");
            var that = this;

            var today = new Date();
            var werks = this.getGlobalModel().getProperty("/Werks");
            var Aufnr = this.byId("inp_MLSX").getValue();
            var notes = this.byId("txt_Notes").getValue();

            console.log(notes, "Test");

            var transParameters = {
                Id: "",
                Msid: null,
                Werks: werks,
                Wempf: Aufnr,
                Arbpl: this.selectedRow[0].Arbpl,
                Mkmzl: "",                             //so lan ghi
                Atnam: this.selectedRow[0].Atnam,      //
                Atbez: this.selectedRow[0].Atbez,      //
                Atwrt: this.selectedRow[0].Atwrt,                  // Gia tri ghi nhan
                Atwtb: this.selectedRow[0].Atwtb,                             // Characteristic value description
                Crdat: null,
                Crtim: null,
                Bname: "",
                Notes: notes
            };
            console.log(transParameters, "transData");
            //Send data
            var fnCallback = function (oData) {
                that.getView().setBusy(false);
                if (oData.Return !== "") {
                    MessageToast.show(msg_Success);
                    //02.05.2018 --- BEGIN
                    var data = that.tb_rsDetail.getModel("resourceDetail").getData();
                    console.log(data);
                    data[0].Atwrt = "";
                    that.inpValue = "";
                    that.tb_rsDetail.getModel("resourceDetail").refresh();
                    //02.05.2018 --- END
                    that.byId("txt_Notes").setValue(null);
                    return;
                }
            }, onError = function (error) {
                MessageToast.show(msg_Failed);
                that.getView().setBusy(false);
            };
            this.getView().setBusy(true);
            this.getModel().create("/BcctvhSet", transParameters, {success: fnCallback, error: onError});
        },
        navToBCCTVH: function () {
            var context = this.getGlobalModel('rsDetailReport').getData();
            if (context.Arbpl && context.Wempf) {
                this.report(context);
                this.bcctvhDialog.open();
            } else {
                MessageToast.show(this.getResourceBundle().getText("msg_SelResource"));
            }
        },
        report: function (context) {
            var filters = [];
            var that = this;
            //Binding items
            this.tb_rsDetailReport.setBusy(true);
            var filters = [];

            var werksFilter = new Filter({
                path: "Werks",
                operator: "EQ",
                value1: context.Werks
            });
            filters.push(werksFilter);

            var resourceFilter = new Filter({
                path: "Arbpl",
                operator: "EQ",
                value1: context.Arbpl
            });
            filters.push(resourceFilter);

            var wempfFilter = new Filter({
                path: "Wempf",
                operator: "EQ",
                value1: context.Wempf
            });
            filters.push(wempfFilter);


            var atnamFilter = new Filter({
                path: "Atnam",
                operator: "EQ",
                value1: context.Atnam
            });
            filters.push(atnamFilter);
            var onSuccess = function (oData) {
                that.tb_rsDetailReport.setBusy(false);
                that.tb_rsDetailReport.setModel(new JSONModel(), "rsDetailReport");
                that.tb_rsDetailReport.getModel("rsDetailReport").setData(oData);
            }, onFail = function (error) {
                that._tblCustomerSet.setBusy(false);
            };
            this.getModel().read("/BcctvhSet", {
                    filters: filters,
                    success: onSuccess,
                    fail: onFail
                }
            );
        },
        navToZppc07OEEReport: function (oEvent) {
            var context = this.getGlobalModel().getData();
            var ferth = this.byId("inp_SPTL").getValue();
            if (context) {
                this.getRouter().navTo(
                    "resourceOEEDetail",
                    {
                        "Arbpl": context.Arbpl,
                        "Werks": context.Werks
                    },
                    false);
                if (ferth) {
                    this.getFilterParmeter().setProperty("/Ferth", ferth, null, true);
                }
            }
        },
        navToZppc07StatisticsReport: function (oEvent) {
            // MessageToast.show(this.getResourceBundle().getText("msg_OnProgress"));
            var source = oEvent.getSource();
            this.doNavigation("zppc07StatisticsReport", source);
        },
        __btn_Cancel: function () {
            // this.jsModel.setData(null, false);
            this.tb_rsDetailReport.getModel("rsDetailReport").setData(null);
            this.bcctvhDialog.close();
        }

    });
});