<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="/WEB-INF/jsp/commons.jsp" %>
    <%@ include file="/WEB-INF/jsp/bootstrap.jsp" %>
    <title>lock</title>
    <script src="js/lock.js"></script>
</head>
<body>
<div id="wrap">
    <div id="nav">
        <table>
            <tbody>
            <tr>
                <td>门锁名称:</td>
                <td><input id="search-name" class="easyui-textbox"></td>
                <td><a id="search" class="easyui-linkbutton" iconCls="icon-search">查询</a></td>
                <td><a id="reset" class="easyui-linkbutton" iconCls="icon-clear">重置</a></td>
            </tr>
            </tbody>
        </table>
    </div>

    <div id="data"></div>


    <div id="editor" data-options="buttons:'#buttons'">
        <form id="form" method="post">
            <table>
                <tr class="gateway">
                    <td>所属网关:<input type="hidden" name="id"></td>
                    <td><input id="gatewayId" name="gatewayId"></td>
                </tr>
                <tr>
                    <td>门锁名称:</td>
                    <td><input id="name" class="easyui-textbox" name="name" data-options="required:true,validType:'length[1,30]'"></td>
                </tr>
                <tr class="number">
                    <td>设备号:</td>
                    <td><input id="number" class="easyui-numberbox" name="number" readonly></td>
                </tr>
            </table>
        </form>
    </div>
    <div id="buttons">
        <a id="sure" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">确定</a>

        <a id="enter" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">进入</a>

        <a id="begin" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">开始</a>
        <a id="bind" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">绑定</a>

        <a id="cancel" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'">取消</a>
    </div>

    <div id="word">
        <table>
            <tr>
                <td>密码类型:</td>
                <td>
                    <select id="type">
                        <option value="main" selected>管理员密码</option>
                        <option value="temp">临时密码</option>
                        <option value="user">用户密码</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>密码编号:</td>
                <td><input id="index" class="easyui-numberbox" data-options="required:true,min:2,max:98"></td>
            </tr>
            <tr>
                <td>新密码:</td>
                <td><input id="value" class="easyui-numberbox" data-options="required:true"></td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>