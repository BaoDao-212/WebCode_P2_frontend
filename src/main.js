import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import DynamicDialog from 'primevue/dynamicdialog';
import FileUpload from 'primevue/fileupload';
import Paginator from 'primevue/paginator';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Menu from 'primevue/menu';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';
import Row from 'primevue/row';
import SelectButton from 'primevue/selectbutton';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tag from 'primevue/tag';

import CodeHighlight from '@/components/CodeHighlight.vue';
import CardCourse from '@/components/CardCourse.vue';
import CardTheory from '@/components/CardTheory.vue';

import '@/assets/styles.scss';
import { setupStore } from './stores';
import CardLessonMini from './components/CardLessonMini.vue';
import { basicSetup } from 'codemirror';
import VueCodemirror from 'vue-codemirror';
import vue3GoogleLogin from 'vue3-google-login';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from 'primevue/button';
const app = createApp(App);
setupStore(app);
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.component('QuillEditor', QuillEditor);
app.use(ConfirmationService);
console.log(import.meta.env.VITE_APP_BASE_GOOGLE_LOGIN);
app.use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_APP_BASE_GOOGLE_LOGIN
});

app.use(VueCodemirror, {
    // optional default global options
    autofocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: 'Code goes here...',
    extensions: [basicSetup]
    // ...
});
app.component('CardCourse', CardCourse);
app.component('CardTheory', CardTheory);
app.component('CardLessonMini', CardLessonMini);
app.component('CodeHighlight', CodeHighlight);

app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);

app.component('Card', Card);
app.component('Chart', Chart);

app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Paginator', Paginator);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('DynamicDialog', DynamicDialog);
app.component('FileUpload', FileUpload);
app.component('Image', Image);
app.component('InlineMessage', InlineMessage);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Message', Message);
app.component('MultiSelect', MultiSelect);
app.component('Password', Password);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('SelectButton', SelectButton);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Textarea', Textarea);

app.component('Tag', Tag);
app.component('Toast', Toast);

app.mount('#app');
