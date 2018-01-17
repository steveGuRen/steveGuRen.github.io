## 配置步骤
#### product数据源的表相关配置
+ 配置product.ui_conf_template表，注意配置prefix_id字段和baseId字段，否则增加页面会报错
+ 配置product.ui_table表，注意配置table_mode字段，如果为FORM，则是表单样式,下面的界面查询的是模板配置的表，每行记录代表配置了一个表的数据需要保存
```sql
---配置模板对应的表
select t.*,t.rowid from  product.ui_table t where ui_temp_id = 516;
```
![image.png](http://upload-images.jianshu.io/upload_images/1815061-5718710acb4881fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


+  配置product.ui_table_column 表，页面是查询配置表中的行对应的列，例如如果第一行是
```sql
select * from product.ui_table_column t where t.ui_temp_id=516 and t.table_code='UP_PRODUCT_ITEM'
```

## 表字段解析

#### ui_table_column
- 1， __is_edit__：0表示不允许编辑，1表示允许编辑，0不会出现在编辑页面上，只有1的时候才会在页面上展示,2表示的是作为跟前缀进行字符串拼接作为主键，（单表的主键可能不需要设置为前缀拼接字段的），__实际是在表单元素加上hidden属性__
- 2，__defaultInstId__字段是edit.java的init用到的参数，目前是通过baseId进行赋值，一般配置成一个已配置表数据的ID值。
- 3，__remark__字段，对于弹出窗口的字段，该字段需要设置
- 4，__default_value__字段，作为默认值，在“复制的过程”中作为替换的值，将值进行替换
- 5，__isKey__,不等于0表示是主键，0表示非主键，等于1的时候生成的表单是可显示不可编辑，等于2的时候生成的表单是可显示可编辑，等于0的时候是不可显示不可编辑；等于3的时候，会在对应的SVImpl.java文件生成获得主键的代码，用以单表新增插入数据。1的时候是用的计费ID+主键来生成主键，2的时候是手动输入的主键，3的时候是后台通过序列获得的主键
- 6，__is_null__,1会在__table__的表单元素上加上required=true属性，0不会加
- 7，__query_type__,1会在__form__类型的表单元素上作为查询条件，0则不显示该查询条件
- 8，__is_result_type__,1作为manm的查询列表展示属性，0表示不在查询列表上展示
- 9，__column_index__，字段会按该字段从小到大排序显示
- 10，__component_type__，包含default，popup，sys_select，datefield，textarea枚举值，default是普通的文本框，textarea是对应form表单的textarea，popup是带选择框的文本框，datefield是带日期选择框的文本框，sys_select对应的是select元素；如果是popup，那么对应的remark字段的值将会作为弹出窗口的URL访问地址，如果是sys_select，那么对应的remark字段是表product.sys_static_data里面的code_type字段，可以通过该remark值查询表product.sys_static_data，从而查出下拉框的下拉列表项
#### ui_table
- 1，__table_mode__，目前枚举值有form，checkbox，tabel，如果设置成form，那么不会存在defaultObj，defaultObj是“复制的过程”由default_value封装的对象，也就是说form默认是通过查询出来的对象设置默认值。
SVImpl.java里面的savaData方法会根据该字段生成不同的保存逻辑的代码。
```java
//UPCBasePage的setTemplateHint方法的代码
setHint(hints,"baseId", "基于ID", templateInfo.getString("baseId") );
extendData.put("defaultInstId", templateInfo.getString("baseId"));
```
2.当ui_temp_id=0的时候，才能生成对应的__单表__的BO文件
![image.png](http://upload-images.jianshu.io/upload_images/1815061-66103aeb6cd13e65.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

####ui_conf_template
- 1，base_id必须配置的字段，用来“复制”的基础ID
- 2，item_type，生成代码的各个文件的名字会以此为前缀

#### 如何寻找对应菜单的配置
* 菜单可以通过sec.sec_function以及sec.SEC_ROLE_GRANT两个表找出来
* 模板配置
   1，用谷歌浏览器找到页面对应的url，url一般会有一个包含“manm”字段的英文，通过该英文找到对应的dao层代码，dao层代码有对应的BO开头的engine类，通过该类去掉engine英文得到的字符串就是bo文件的开头，找到bo文件可以找到对应的表
   2，通过第一步找到的表，查询product.ui_table表的table_code字段 查询到对应的模板Id，然后通过id找product.ui_conf_template表，如果找不到，就是要自己去配置的了。
#### BO生成
* 生成逻辑是查找ui_table中ui_temp_id=0的记录然后逐个表进行生成，所以要配置一个ui_temp_id=0的记录才能生成BO
```sql
select M.IS_HIDE,M.TABLE_NAME,M.IS_NULL,M.TABLE_CODE,M.HUMP_TABLE_NAME,M.TABLE_MODE,M.UI_TEMP_ID,M.ORDER_SEQ,M.RELATE_CODE ,M.ROWID as MROWID___  
from UI_TABLE M 
where 1 = 1 AND M.UI_TEMP_ID = 0  
order by  M.UI_TEMP_ID , M.ORDER_SEQ;
```

## UpcTable.js方法解析
* getOperFormData
点击保存的时候，该方法会遍历Id为SubForm的div的所有子input元素，构成一个elements数组，如果是修改操作，会根据每个input里面的rowClass自定义属性判断是否是已经修改过的属性，然后组装参数，提交到后台dao保存修改后的数据，该方法是被html上的savaData调用
* changeFormData，rowClass的修改是方法changeFormData，changeFormData只要是点击过该input元素都会认为是修改过而把rowClass改为modify，该方法是作为一个事件回调函数绑定在input元素上
* clickTableRow，点击表格中的每一行都会触发次方法，该方法会将点击的行作为当前行，并且修改样式
```javascript
function getOperFormData(node, operType){
	var resultObj = {msg:"",result:true};
	var dataObj = {}, globalCheckObj = {};
	var elements = node.find("input,select,textarea");
	for(var index=0;index < elements.length;index++){
		var element = $(elements[index]);
		var elementResultObj = {msg:"",result:true};
		var val = element.val();
		var name =element.attr("name");
		var desc = "";
		if(element.attr("desc") && val){
			desc = element.attr("desc");
			if (val.indexOf("\\") > -1) {
				handleInputErr(elementResultObj, "\t不能输入\\!", desc);
			}else if (val.indexOf("\n") > -1) {
				handleInputErr(elementResultObj, "\t不能有换行符!", desc);
			}else{ 			
 				$.validate.verifyField(element, elementResultObj);
 			}
		}
		if(elementResultObj.result && desc){
			globalCheckObj[desc] = val;
		}else{
			if(!elementResultObj.result){
				resultObj["result"]=false;
				resultObj["msg"]+= elementResultObj.msg;				
			}

		}
		var rowStatus = element.attr("rowClass");
		var isPk = element.attr("isPk");
		if(operType == "copy" || operType == "new" || rowStatus == "modify" || isPk == "1"){
			dataObj[name] = val;
		}
	};
	checkGlobalField(resultObj, globalCheckObj);
	if(resultObj.result){
		resultObj["submitData"]=[{"oper":operType,"data":dataObj}];
	}else{
		resultObj["msg"]="<li><ul>基本信息"+resultObj["msg"] + "</ul></li>";
	}
	return resultObj;
}

function changeFormData(obj){
	if($(obj).attr("type") == "checkbox"){
		resetCheckGroupBox(obj);
	}else{
		$(obj).addClass("e_orange");
		$(obj).attr("rowClass", "modify");
		resetExtendId(obj);	
		insertToolTipInput($(obj));
	}
}

```


## 已发现bug列表
* baseId对应的表数据不存在，导致无法添加数据，因为使用的是insert into select方法保存的数据，因为select不到，所以点击保存的时候无法保存

## 各省数据库表差异
* 江西省没有UP_PREPAY_DEPOSIT_RULE表，该表对应的是杂七杂八--》活动划拨菜单