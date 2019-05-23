sap.ui.define([
    "ZAC_APP/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";
    return BaseController.extend("ZAC_APP.controller.Master", {
        onInit: function () {
            this.applyDensityClass();
            this.fSoldToParty = this.byId("fSoldToParty");
            this.fDocumentDate = this.byId("fDocumentDate");
            this.fSalesOrg = this.byId("fSalesOrg");
            this.fDistChannel = this.byId("fDistChannel");
            this.fSalesOffice = this.byId("fSalesOffice");
            this.fSalesGroup = this.byId("fSalesGroup");
            this.fCustomerGroup = this.byId("fCustomerGroup");
            this.fSalesOrderType = this.byId("fSalesOrderType");
            this.FilterDialog = this.initFragment("ZAC_APP.fragment.MasterFilter", "filter");
            this.SortDialog = this.initFragment("ZAC_APP.fragment.MasterSort", "sort");
            this.setModel(new JSONModel(), "header");
            this.getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function () {
            var filters = this.getFilter();
            this.loadData(filters);
        },
        onOpenFilter: function () {
            if (!this.FilterDialog) {

            }
            this.FilterDialog.open();
        },
        onOpenSort: function () {
            if (!this.SortDialog) {

            }
            this.SortDialog.open();
        },
        navToDetail: function (e) {
            //get contract no of thje line
            var context = e.getSource().getBindingContext("header");
            var ContractNo = context.getProperty("ContractNo");
            var headerObject = context.getProperty("");
            this.setNavData("currentContract", headerObject);
            var router = this.getRouter();
            router.navTo("detail", {
                "ContractId": ContractNo
            }, false);
        },
        loadData: function (filters) {
            var that = this;
            var model = this.getModel();
            var onSuccess = function (o, r) {
                    //map odata
                    var data = o.results;
                    if (data && data.length > 0) {
                        that.getModel("header").setProperty("/", data);
                        that.getModel("header").setProperty("/count", data.length);
                    }
                },
                onError = function () {
                    MessageBox.error("There is an error with the network connection");
                };
            model.read("/HeaderSet", {
                    filters: filters,
                    success: onSuccess,
                    error: onError
                }
            )
        },
        handleConfirm: function () {
            var filters = this.getFilter();
            this.loadData(filters);
        },
        getFilter: function () {
            var filters = [];
            var filterModel = this.FilterDialog.getModel("filter");
            var filterData = {};
            if (filterModel) {
                filterData = filterModel.getProperty("/");
            }
            if (filterData.soldToParty_Low && filterData.soldToParty_Low !== "") {
                var filterCustomer = {
                    path: "Customer",
                    operator: FilterOperator.EQ,
                    value1: filterData.soldToParty_Low
                };
                if (filterData.soldToParty_High && filterData.soldToParty_High !== "") {
                    filterCustomer.operator = FilterOperator.BT;
                    filterCustomer.value2 = filterData.soldToParty_High;
                }
                filters.push(new Filter(filterCustomer));
            }
            if (filterData.documentDate_Low && filterData.documentDate_Low !== "") {
                var filterDocumentDate = {
                    path: "DocumentDate",
                    operator: FilterOperator.EQ,
                    value1: filterData.documentDate_Low
                };
                if (filterData.documentDate_High && filterData.documentDate_High !== "") {
                    filterDocumentDate.operator = FilterOperator.BT;
                    filterDocumentDate.value2 = filterData.documentDate_High;
                }
                filters.push(new Filter(filterDocumentDate));
            }
            if (filterData.salesOrg_Low && filterData.salesOrg_Low !== "") {
                var filterSalesOrg = {
                    path: "SalesOrg",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOrg_Low
                };
                if (filterData.salesOrg_High && filterData.salesOrg_High !== "") {
                    filterSalesOrg.operator = FilterOperator.BT;
                    filterSalesOrg.value2 = filterData.salesOrg_High;
                }
                filters.push(new Filter(filterSalesOrg));
            }
            if (filterData.distChannel_Low && filterData.distChannel_Low !== "") {
                var filterDistChannel = {
                    path: "DistrChannel",
                    operator: FilterOperator.EQ,
                    value1: filterData.distChannel_Low
                };
                if (filterData.distChannel_High && filterData.distChannel_High !== "") {
                    filterDistChannel.operator = FilterOperator.BT;
                    filterDistChannel.value2 = filterData.distChannel_High;
                }
                filters.push(new Filter(filterDistChannel));
            }
            if (filterData.salesOffice_Low && filterData.salesOffice_Low !== "") {
                var filterSalesOffice = {
                    path: "SalesOffice",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOffice_Low
                };
                if (filterData.salesOffice_High && filterData.salesOffice_High !== "") {
                    filterSalesOffice.operator = FilterOperator.BT;
                    filterSalesOffice.value2 = filterData.salesOffice_High;
                }
                filters.push(new Filter(filterSalesOffice));
            }
            if (filterData.salesGroup_Low && filterData.salesGroup_Low !== "") {
                var filterSalesGroup = {
                    path: "SalesGroup",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOffice_Low
                };
                if (filterData.salesGroup_High && filterData.salesGroup_High !== "") {
                    filterSalesGroup.operator = FilterOperator.BT;
                    filterSalesGroup.value2 = filterData.salesGroup_High;
                }
                filters.push(new Filter(filterSalesGroup));
            }
            if (filterData.customerGroup_Low && filterData.customerGroup_Low !== "") {
                var filterCustomerGroup = {
                    path: "CustomerGroup",
                    operator: FilterOperator.EQ,
                    value1: filterData.customerGroup_Low
                };
                if (filterData.customerGroup_High && filterData.customerGroup_High !== "") {
                    filterCustomerGroup.operator = FilterOperator.BT;
                    filterCustomerGroup.value2 = filterData.customerGroup_High;
                }
                filters.push(new Filter(filterCustomerGroup));
            }
            if (filterData.salesOrderType_Low && filterData.salesOrderType_Low !== "") {
                var filterSalesOrderType = {
                    path: "SalesOrderType",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOrderType_Low
                };
                if (filterData.salesOrderType_High && filterData.salesOrderType_High !== "") {
                    filterSalesOrderType.operator = FilterOperator.BT;
                    filterSalesOrderType.value2 = filterData.salesOrderType_High;
                }
                filters.push(new Filter(filterSalesOrderType));
            }
            return filters;
        }
    });

});