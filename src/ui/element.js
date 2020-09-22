import Vue from 'vue';
import {
  Menu, Submenu,
  RadioGroup, RadioButton,
  MenuItem, Button,
  Message, Select, Icon,
  Form, FormItem, Input, Main,
  Container, Header, Aside,
  Breadcrumb, BreadcrumbItem,
  Card, Row, Col, TableColumn, Table,
  Switch, Tooltip, Pagination, Dialog, Upload,
  MessageBox, Tag, Tree, Tabs, TabPane,
  Option, Cascader, Alert, Loading, Step, Steps,
  CheckboxGroup, Checkbox, Timeline, TimelineItem
} from 'element-ui';
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(Cascader)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Loading)
Vue.use(Alert)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)




//导入弹框提示组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm