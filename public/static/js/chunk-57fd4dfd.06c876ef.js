(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-57fd4dfd"],{"01d5":function(s,t,e){},6218:function(s,t,e){"use strict";var a=e("01d5"),l=e.n(a);l.a},a0d0:function(s,t,e){"use strict";e.r(t);var a=function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("div",{staticClass:"content"},[e("div",{staticClass:"left"},[e("div",{staticClass:"toptitle"},[e("div",[s._v(s._s(s.bill.invoiceTypeName))]),s._v(" "),e("span",[s._v(s._s(s.bill.tollSignName))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("价格")]),s._v(" "),e("span",[s._v("￥"+s._s(s.bill.totalAmount))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("税额")]),s._v(" "),e("span",[s._v("￥"+s._s(s.bill.totalTaxNum))])]),s._v(" "),e("div",{staticClass:"flexCon blue"},[e("div",[s._v("价格合计")]),s._v(" "),e("span",[s._v("￥"+s._s(s.bill.totalTaxSum))])]),s._v(" "),e("div",{staticClass:"br"}),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("发票代码")]),s._v(" "),e("span",[s._v(s._s(s.bill.invoiceDataCode))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("发票号码")]),s._v(" "),e("span",[s._v(s._s(s.bill.invoiceNumber))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("开票日期")]),s._v(" "),e("span",[s._v(s._s(s.bill.billingTime))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("校验码")]),s._v(" "),e("span",[s._v(s._s(s.bill.checkCode))])]),s._v(" "),e("div",{staticClass:"br"}),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("销售方")]),s._v(" "),e("span",[s._v(s._s(s.bill.salesName))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("纳税人识别号")]),s._v(" "),e("span",[s._v(s._s(s.bill.salesTaxpayerNum))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("地址、电话")]),s._v(" "),e("span",[s._v(s._s(s.bill.salesTaxpayerAddress))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("开户行及账号")]),s._v(" "),e("span",[s._v(s._s(s.bill.salesTaxpayerBankAccount))])]),s._v(" "),e("div",{staticClass:"br"}),s._v(" "),e("div",{staticClass:"flexCon red"},[e("div",[s._v("购买方")]),s._v(" "),e("span",[s._v(s._s(s.bill.purchaserName))])]),s._v(" "),e("div",{staticClass:"flexCon red"},[e("div",[s._v("纳税人识别号")]),s._v(" "),e("span",[s._v(s._s(s.bill.taxpayerNumber))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("地址、电话")]),s._v(" "),e("span",[s._v(s._s(s.bill.taxpayerAddressOrId))])]),s._v(" "),e("div",{staticClass:"flexCon"},[e("div",[s._v("开户行及账号")]),s._v(" "),e("span",[s._v(s._s(s.bill.taxpayerBankAccount))])])]),s._v(" "),e("div",{staticClass:"middle"},[e("div",[s._v("详情")]),s._v(" "),e("div",{staticClass:"br"}),s._v(" "),e("el-row",{staticClass:"detailTitle"},[e("el-col",{attrs:{span:10}},[s._v("货物或应税劳务、服务")]),s._v(" "),e("el-col",{attrs:{span:4}},[s._v("单价(元)")]),s._v(" "),e("el-col",{attrs:{span:4}},[s._v("数量")]),s._v(" "),e("el-col",{attrs:{span:3}},[s._v("金额(元)")]),s._v(" "),e("el-col",{attrs:{span:3}},[s._v("税额(元)")])],1),s._v(" "),s._l(s.bill.detailData,(function(t){return e("el-row",[e("el-col",{attrs:{span:10}},[s._v(s._s(t.goodserviceName))]),s._v(" "),e("el-col",{attrs:{span:4}},[s._v("￥"+s._s(s._f("numFilter")(t.price)))]),s._v(" "),e("el-col",{attrs:{span:4}},[s._v(s._s(s._f("numFilter")(t.number)))]),s._v(" "),e("el-col",{attrs:{span:3}},[s._v(s._s(t.sum))]),s._v(" "),e("el-col",{attrs:{span:3}},[s._v(s._s(t.tax))])],1)})),s._v(" "),e("el-row",{staticClass:"detailSum"},[e("el-col",{attrs:{span:10}},[s._v("价格合计")]),s._v(" "),e("el-col",{attrs:{span:11}},[s._v("/")]),s._v(" "),e("el-col",{attrs:{span:3}},[s._v("$"+s._s(s.bill.totalTaxSum))])],1),s._v(" "),e("div",{staticClass:"br"}),s._v(" "),e("div",[s._v("备注")]),s._v(" "),e("div",{staticClass:"note"},[s._v(s._s(s.bill.invoiceRemarks))])],2),s._v(" "),e("div",{staticClass:"right"},[e("el-form",{ref:"validForm",staticStyle:{width:"60%","min-width":"500px"},attrs:{"label-position":s.labelPosition,"label-width":"120px",model:s.form}},[e("h2",{staticStyle:{"text-align":"center"}},[s._v("发票录入")]),s._v(" "),e("el-form-item",{attrs:{label:"发票归属部门",rules:[{required:!0,message:"请输入",trigger:"blur"}]}},[e("el-select",{attrs:{filterable:"",placeholder:"所在部门"},model:{value:s.form.fp_gsbm,callback:function(t){s.$set(s.form,"fp_gsbm",t)},expression:"form.fp_gsbm"}},s._l(s.bmOptions,(function(s){return e("el-option",{key:s.id,attrs:{label:s.bmmc,value:s.id}})})),1)],1),s._v(" "),e("el-form-item",{attrs:{label:"发票归属人",rules:[{required:!0,message:"请输入",trigger:"blur"}]}},[e("el-select",{attrs:{filterable:"",placeholder:"发票归属人"},model:{value:s.form.fp_gsr,callback:function(t){s.$set(s.form,"fp_gsr",t)},expression:"form.fp_gsr"}},s._l(s.userOptions,(function(s){return e("el-option",{key:s.id,attrs:{label:s.zymc,value:s.id}})})),1)],1),s._v(" "),e("el-form-item",{attrs:{label:"备注"}},[e("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:s.form.fp_bz,callback:function(t){s.$set(s.form,"fp_bz",t)},expression:"form.fp_bz"}})],1),s._v(" "),e("div",{staticStyle:{"text-align":"center"}},[e("el-button",{attrs:{type:"primary"},on:{click:function(t){return s.saveBill("validForm")}}},[s._v("录入")]),s._v(" "),e("el-button",[s._v("返回")])],1)],1)],1)])},l=[],i=e("2934"),r={dwbm:localStorage.getItem("dwbm")},o={name:"volume",data:function(){return{labelPosition:"right",form:{fp_gsr:"",fp_gsbm:"",fp_bz:""},bill:{},bmOptions:[],userOptions:[]}},filters:{numFilter:function(s){var t="";return t=s?parseFloat(s).toFixed(2):"--",t}},beforeMount:function(){if(!this.$route.params.scanStr)return this.$message.error("缺少参数"),void this.$router.go(-1);this.getAllUser(),this.getAllBm()},mounted:function(){this.handleBillInfo(),this.handleUserInfo()},methods:{getAllBm:function(){var s=this,t={dwbm:localStorage.getItem("dwbm")};Object(i["a"])("/manager/queryAllBm",t,"POST").then((function(t){0==t.code&&(s.bmOptions=t.data.data)}))},getAllUser:function(){var s=this,t={dwbm:localStorage.getItem("dwbm"),bmbm:this.form.fp_gsbm};Object(i["a"])("/manager/queryAllUser",t,"POST").then((function(t){0==t.code&&(s.userOptions=t.data)}))},handleBillInfo:function(){if(this.$route.params.scanStr){var s=this.$route.params.scanStr;this.$route.params.isHave&&(this.$message.warning("发票已存在，请勿重复录入"),s=this.$route.params.scanStr.fp_detail.fp_detail),this.billResJSON=s,s=JSON.parse(s),this.bill.invoiceTypeName=s.invoiceTypeName,this.bill.invoiceDataCode=s.invoiceDataCode,this.bill.invoiceNumber=s.invoiceNumber,this.bill.billingTime=s.billingTime,this.bill.checkCode=s.checkCode,this.bill.taxDiskCode=s.taxDiskCode,this.bill.purchaserName=s.purchaserName,this.bill.taxpayerNumber=s.taxpayerNumber,this.bill.salesName=s.salesName,this.bill.salesTaxpayerNum=s.salesTaxpayerNum,this.bill.salesTaxpayerBankAccount=s.salesTaxpayerBankAccount,this.bill.salesTaxpayerAddress=s.salesTaxpayerAddress,this.bill.totalTaxNum=s.totalTaxNum,this.bill.totalTaxSum=s.totalTaxSum,this.bill.totalAmount=s.totalAmount,this.bill.invoiceRemarks=s.invoiceRemarks,this.bill.detailData=s.invoiceDetailData}},handleUserInfo:function(){if(this.$route.params.isHave){var s=this.$route.params.scanStr;console.log(s.fp_gsr),s.fp_gsr&&(this.form.fp_gsr=s.fp_gsr,this.form.fp_gsbm=s.fp_gsbm,this.form.fp_bz=s.fp_bz)}},saveBill:function(s){var t=this;console.log(s),""!=this.billResJSON&&void 0!=this.billResJSON?this.$refs[s].validate((function(s){if(s){var e=Object.assign(t.form,{billInfo:t.billResJSON},{uid:localStorage.getItem("userId")},r);console.log(e),Object(i["a"])("/bill/saveBill",e,"POST").then((function(s){0==s.code?(t.$message.success("操作成功"),t.$router.go(-1)):t.$message.error(s.message)}))}})):this.$message.error("发票信息为空,请先验证发票")}}},n=o,v=(e("6218"),e("2877")),_=Object(v["a"])(n,a,l,!1,null,"01c03c8f",null);t["default"]=_.exports}}]);