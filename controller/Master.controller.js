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
            this.valueHelpDialog = this.initFragment("ZAC_APP.fragment.ValueHelp", "valueHelp");
            this.setModel(new JSONModel({
                count: 0,
                result: []
            }), "header");
            this.getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
        },
        onRefresh: function (oEvent) {
            var filters = this.getFilter();
            this.loadData(filters);
            oEvent.getSource().hide();
        },

        retrieveSAPLogonUser: function () {
            var userLogon = "";
            try {
                userLogon = new sap.ushell.services.UserInfo().getId();
            } catch (e) {
            }
            return userLogon;
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
        handleConfirmSort: function (oEvent) {
            var sortDialog = oEvent.getSource();
            var sortId = sortDialog.getSelectedSortItem();
            var sortDescending = sortDialog.getSortDescending();
            var sortItem = sap.ui.getCore().byId(sortId);
            var sortField = sortItem.getKey();
            //process sort
            var sorters = [];
            var sorter = new sap.ui.model.Sorter(sortField, sortDescending);
            sorters.push(sorter);
            //sort table
            var table = this.byId("tableMaster");
            var binding = table.getBinding("items");
            if (binding) {
                binding.sort(sorters);
            }
        },
        beforeOpen: function (e) {
            //Binding data
            e.getSource().setBusy(true);
            var searchValue = this.currentVH.getValue();
            this.onLoadValueHelp(searchValue);
        },
        filterValueHelp: function (searchValue) {
            var andFilter = [];
            if (searchValue) {
                var orFilter = [];
                orFilter.push(new Filter({
                    path: 'Id',
                    operator: FilterOperator.Contains,
                    value1: searchValue
                }));
                orFilter.push(new Filter({
                    path: 'Name',
                    operator: FilterOperator.Contains,
                    value1: searchValue
                }));
                andFilter.push(new Filter(orFilter, false));
            }
            var tblValueHelp = this.byId("tblValueHelp");
            var binding = tblValueHelp.getBinding("items");
            binding.filter(andFilter);
        },
        onValueHelpSearch: function (e) {
            var SearchValue = e.getParameter("query");
            this.filterValueHelp(SearchValue);
        },
        onLoadValueHelp: function (searchValue) {
            var odataModel = this.getModel();
            var that = this;
            var entitySetDirectory = "";
            var filterTitle = "";
            // this.valueHelpDialog.setModel(new JSONModel(), "valueHelp");
            var onSuccess = function (d, r) {
                    var vhModel = that.valueHelpDialog.getModel("valueHelp");
                    vhModel.setProperty("/", d.results);
                    vhModel.setProperty("/label", filterTitle);
                    that.byId("searchValueHelp").setValue(searchValue);
                    if (searchValue) {
                        that.filterValueHelp(searchValue);
                    }
                    that.valueHelpDialog.setBusy(false);
                },
                onError = function (e) {
                    MessageToast.show(e.toString());
                    that.valueHelpDialog.setBusy(false);
                };
            var currentFilterControlId = this.currentVH.getParent().getParent().getParent().getParent().getId();
            var currentFilterId = currentFilterControlId.split("--", 2)[1];
            switch (currentFilterId) {
                case 'SoldToParty': {
                    entitySetDirectory = "/CustomerValueHelpSet";
                    filterTitle = "Sold To Party";
                    break;
                }
                case 'SalesOrg': {
                    entitySetDirectory = "/SalesOrgValueHelpSet";
                    filterTitle = "Sales Organization";
                    break;
                }
                case 'DistChannel': {
                    entitySetDirectory = "/DistChannelValueHelpSet";
                    filterTitle = "Distribution Channel";
                    break;
                }
                case 'SalesOffice': {
                    entitySetDirectory = "/SalesOfficeValueHelpSet";
                    filterTitle = "Sales Office";
                    break;
                }
                case 'SalesGroup': {
                    entitySetDirectory = "/SalesGroupValueHelpSet";
                    filterTitle = "Sales Group";
                    break;
                }
                case 'CustomerGroup': {
                    entitySetDirectory = "/CustomerGroupValueHelpSet";
                    filterTitle = "Customer Group";
                    break;
                }
                case 'SalesOrderType': {
                    entitySetDirectory = "/SalesOrderTypeValueHelpSet";
                    filterTitle = "Sales Order Type";
                    break;
                }
                default:
                    return;
            }
            odataModel.read(entitySetDirectory, {
                success: onSuccess,
                error: onError
            });
        },
        onSearchHelpOk: function (e) {
            var source = this.currentVH;
            var context = e.getSource().getBindingContext("valueHelp");
            var id = context.getProperty("Id");
            source.setValue(id);
            this.valueHelpDialog.close();
            this.validateFilterValue();
        },
        validateFilterValue: function () {
            var filterModel = this.FilterDialog.getModel("filter");
            var filterData = {};
            if (filterModel) {
                filterData = filterModel.getProperty("/");
            }
            if ((filterData.soldToParty_Low > filterData.soldToParty_High && filterData.soldToParty_High && filterData.soldToParty_Low) ||
                (filterData.documentDate_Low > filterData.documentDate_High && filterData.documentDate_High && filterData.documentDate_Low) ||
                (filterData.salesOrg_Low > filterData.salesOrg_High && filterData.salesOrg_High && filterData.salesOrg_Low) ||
                (filterData.distChannel_Low > filterData.distChannel_High && filterData.distChannel_High && filterData.distChannel_Low) ||
                (filterData.salesOffice_Low > filterData.salesOffice_High && filterData.salesOffice_High && filterData.salesOffice_Low) ||
                (filterData.salesGroup_Low > filterData.salesGroup_High && filterData.salesGroup_High && filterData.salesGroup_Low) ||
                (filterData.customerGroup_Low > filterData.customerGroup_High && filterData.customerGroup_High && filterData.customerGroup_Low) ||
                (filterData.salesOrderType_Low > filterData.salesOrderType_High && filterData.salesOrderType_High && filterData.salesOrderType_Low)) {
                MessageBox.error("Lower limit is greater than upper limit");
                return false;
            } else {
                return true;
            }
        },
        onValueHelpPressed: function (oEvent) {
            this.currentVH = oEvent.getSource();
            if (!this.valueHelpDialog) {
                this.valueHelpDialog = this.initFragment("ZAC_APP.fragment.ValueHelp", "valueHelp");
            }
            this.valueHelpDialog.open();
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
        handleResetFilters: function (e) {
            var filterModel = e.getSource().getModel("filter");
            if (filterModel) {
                filterModel.setProperty("/", {});
            }
        },
        loadData: function (filters) {
            var that = this;
            var model = this.getModel();
            var onSuccess = function (o, r) {
                    //map odata
                    var data = o.results;
                    if (data) {
                        that.getModel("header").setProperty("/result", data);
                        that.getModel("header").setProperty("/count", data.length);
                    }
                },
                onError = function (e) {
                    MessageBox.error(e);
                };
            model.read("/HeaderSet", {
                    filters: filters,
                    success: onSuccess,
                    error: onError
                }
            )
        },
        handleConfirmFilter: function () {
            var valid = this.validateFilterValue();
            if (valid) {
                var filters = this.getFilter();
                this.loadData(filters);
            }
        },
        getFilter: function () {
            var filters = [];
            var filterModel = this.FilterDialog.getModel("filter");
            var filterData = {};
            if (filterModel) {
                filterData = filterModel.getProperty("/");
            }
            var filterCustomer = {
                path: "Customer"
            };
            if (filterData.soldToParty_Low && filterData.soldToParty_Low !== "") {
                filterCustomer = {
                    path: "Customer",
                    operator: FilterOperator.EQ,
                    value1: filterData.soldToParty_Low
                };
                if (filterData.soldToParty_High && filterData.soldToParty_High !== "") {
                    filterCustomer.operator = FilterOperator.BT;
                    filterCustomer.value2 = filterData.soldToParty_High;
                }
                filters.push(new Filter(filterCustomer));
            } else if (filterData.soldToParty_High && filterData.soldToParty_High !== "") {
                filterCustomer.operator = FilterOperator.LE;
                filterCustomer.value1 = filterData.soldToParty_High;
                filters.push(new Filter(filterCustomer));
            }
            var filterDocumentDate = {
                path: "DocumentDate"
            };
            if (filterData.documentDate_Low && filterData.documentDate_Low !== "") {
                filterData.documentDate_Low.setHours(7);
                filterDocumentDate = {
                    path: "DocumentDate",
                    operator: FilterOperator.EQ,
                    value1: filterData.documentDate_Low
                };
                if (filterData.documentDate_High && filterData.documentDate_High !== "") {
                    filterData.documentDate_High.setHours(7);
                    filterDocumentDate.operator = FilterOperator.BT;
                    filterDocumentDate.value2 = filterData.documentDate_High;
                }
                filters.push(new Filter(filterDocumentDate));
            } else if (filterData.documentDate_High && filterData.documentDate_High !== "") {
                filterData.documentDate_High.setHours(7);
                filterDocumentDate.operator = FilterOperator.LE;
                filterDocumentDate.value1 = filterData.documentDate_High;
                filters.push(new Filter(filterDocumentDate));
            }
            var filterSalesOrg = {
                path: "SalesOrg"
            };
            if (filterData.salesOrg_Low && filterData.salesOrg_Low !== "") {
                filterSalesOrg = {
                    path: "SalesOrg",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOrg_Low
                };
                if (filterData.salesOrg_High && filterData.salesOrg_High !== "") {
                    filterSalesOrg.operator = FilterOperator.BT;
                    filterSalesOrg.value2 = filterData.salesOrg_High;
                }
                filters.push(new Filter(filterSalesOrg));
            } else if (filterData.salesOrg_High && filterData.salesOrg_High !== "") {
                filterSalesOrg.operator = FilterOperator.LE;
                filterSalesOrg.value1 = filterData.salesOrg_High;
                filters.push(new Filter(filterSalesOrg));
            }
            var filterDistChannel = {
                path: "DistrChannel"
            };
            if (filterData.distChannel_Low && filterData.distChannel_Low !== "") {
                filterDistChannel = {
                    path: "DistrChannel",
                    operator: FilterOperator.EQ,
                    value1: filterData.distChannel_Low
                };
                if (filterData.distChannel_High && filterData.distChannel_High !== "") {
                    filterDistChannel.operator = FilterOperator.BT;
                    filterDistChannel.value2 = filterData.distChannel_High;
                }
                filters.push(new Filter(filterDistChannel));
            } else if (filterData.distChannel_High && filterData.distChannel_High !== "") {
                filterDistChannel.operator = FilterOperator.LE;
                filterDistChannel.value1 = filterData.distChannel_High;
                filters.push(new Filter(filterDistChannel));
            }
            var filterSalesOffice = {
                path: "SalesOffice"
            };
            if (filterData.salesOffice_Low && filterData.salesOffice_Low !== "") {
                filterSalesOffice = {
                    path: "SalesOffice",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOffice_Low
                };
                if (filterData.salesOffice_High && filterData.salesOffice_High !== "") {
                    filterSalesOffice.operator = FilterOperator.BT;
                    filterSalesOffice.value2 = filterData.salesOffice_High;
                }
                filters.push(new Filter(filterSalesOffice));
            } else if (filterData.salesOffice_High && filterData.salesOffice_High !== "") {
                filterSalesOffice.operator = FilterOperator.LE;
                filterSalesOffice.value1 = filterData.salesOffice_High;
                filters.push(new Filter(filterSalesOffice));
            }
            var filterSalesGroup = {
                path: "SalesGroup"
            };
            if (filterData.salesGroup_Low && filterData.salesGroup_Low !== "") {
                filterSalesGroup = {
                    path: "SalesGroup",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesGroup_Low
                };
                if (filterData.salesGroup_High && filterData.salesGroup_High !== "") {
                    filterSalesGroup.operator = FilterOperator.BT;
                    filterSalesGroup.value2 = filterData.salesGroup_High;
                }
                filters.push(new Filter(filterSalesGroup));
            } else if (filterData.salesGroup_High && filterData.salesGroup_High !== "") {
                filterSalesGroup.operator = FilterOperator.LE;
                filterSalesGroup.value1 = filterData.salesGroup_High;
                filters.push(new Filter(filterSalesGroup));
            }
            var filterCustomerGroup = {
                path: "CustomerGroup"
            };
            if (filterData.customerGroup_Low && filterData.customerGroup_Low !== "") {
                filterCustomerGroup = {
                    path: "CustomerGroup",
                    operator: FilterOperator.EQ,
                    value1: filterData.customerGroup_Low
                };
                if (filterData.customerGroup_High && filterData.customerGroup_High !== "") {
                    filterCustomerGroup.operator = FilterOperator.BT;
                    filterCustomerGroup.value2 = filterData.customerGroup_High;
                }
                filters.push(new Filter(filterCustomerGroup));
            } else if (filterData.customerGroup_High && filterData.customerGroup_High !== "") {
                filterCustomerGroup.operator = FilterOperator.LE;
                filterCustomerGroup.value1 = filterData.customerGroup_High;
                filters.push(new Filter(filterCustomerGroup));
            }
            var filterSalesOrderType = {
                path: "SalesOrderType"
            };
            if (filterData.salesOrderType_Low && filterData.salesOrderType_Low !== "") {
                filterSalesOrderType = {
                    path: "SalesOrderType",
                    operator: FilterOperator.EQ,
                    value1: filterData.salesOrderType_Low
                };
                if (filterData.salesOrderType_High && filterData.salesOrderType_High !== "") {
                    filterSalesOrderType.operator = FilterOperator.BT;
                    filterSalesOrderType.value2 = filterData.salesOrderType_High;
                }
                filters.push(new Filter(filterSalesOrderType));
            } else if (filterData.salesOrderType_High && filterData.salesOrderType_High !== "") {
                filterSalesOrderType.operator = FilterOperator.LE;
                filterSalesOrderType.value1 = filterData.salesOrderType_High;
                filters.push(new Filter(filterSalesOrderType));
            }
            return filters;
        }
    });
});