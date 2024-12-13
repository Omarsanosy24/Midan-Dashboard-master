import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Category from "@material-ui/icons/Category";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import WalletIcon from '@mui/icons-material/Wallet';
import ArchiveIcon from '@material-ui/icons/Archive';
import InfoIcon from '@mui/icons-material/Info';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import UserList from "./views/Users/UsersList";
import CategoryList from "./views/Category/GategoryList.js";
import AddCategory from "./views/Category/AddCategory.js";
import EditCategory from "./views/Category/EditCategory.js";
import BrandList from "./views/Brands/BrandList.js";
import AddBrand from "./views/Brands/AddBrand";
import ProductsList from "./views/Products/ProductsList.js";
import EditBrand from "./views/Brands/EditBrand.js";
import AddProduct from "./views/Products/AddProduct.js";
import OrdersList from "./views/Orders/OrdersList.js";
import EditOrder from "./views/Orders/EditOrder.js";
import EditOrderProducts from "./views/Orders/EditOrderProducts.js";
import Addvariant from "./views/Products/AddVariant.js";
import EditProduct from "./views/Products/EditProduct.js";
import Editvariant from "./views/Products/EditVariant";
import EditOffer from "./views/Offers/Edit";
import AddOffer from "./views/Offers/Add";
import OffersList from "./views/Offers/List";
import Complains from "./views/Complains/Complains";
import EditAbout from "./views/AboutData/Edit";
import EditTerms from "./views/TermsData/Edit";
import EditContact from "./views/ContactUs/Edit";
import AnnouncementsList from "./views/Announcements/List";
import CreateAnnouncement from "./views/Announcements/Create";
import TransactionsList from "./views/transactions/List";
import PendingDepositsList from "./views/PendingDeposits/List";
import EditDeposit from "./views/PendingDeposits/Edit";
import EditUser from "./views/Users/Edit";

const dashboardRoutes = [
  {
    path: "/orders",
    name: "Orders",
    rtlName: "الطلبات",
    icon: ArchiveIcon,
    component: OrdersList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-order/:id`,
    name: "Edit Order",
    component: EditOrder,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-order-products/:id`,
    name: "Edit Order",
    component: EditOrderProducts,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/products",
    name: "Products",
    rtlName: "المنتجات",
    icon: Dashboard,
    component: ProductsList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/add-product",
    name: "Add New Product",
    component: AddProduct,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/edit-product/:id",
    name: "Edit Product",
    component: EditProduct,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/add-variant/:id`,
    name: "Add Variant",
    component: Addvariant,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-variant/:id`,
    name: "Edit Variant",
    component: Editvariant,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/users",
    name: "Users",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-user/:id`,
    name: "Edit User",
    component: EditUser,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/categories",
    name: "Categories",
    rtlName: "الفئات",
    icon: Category,
    component: CategoryList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/add-category",
    name: "Add Category",
    component: AddCategory,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-category/:id`,
    component: EditCategory,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/Brands",
    name: "Brands",
    rtlName: "العلامات التجارية",
    icon: BubbleChart,
    component: BrandList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/add-brand",
    name: "Add Brand",
    component: AddBrand,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-brand/:id`,
    name: "Edit Brand",
    component: EditBrand,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/offers",
    name: "Offers",
    rtlName: "العروض",
    icon: LocalOfferIcon,
    component: OffersList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/add-offers",
    name: "Add offers",
    component: AddOffer,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-offers/:id`,
    component: EditOffer,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/complains",
    name: "Complains",
    rtlName:"شكاوى",
    icon: FactCheckIcon,
    component: Complains,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  
  {
    path: `/transactions`,
    name: "Transactions",
    rtlName:"المعاملات",
    icon: WalletIcon,
    component: TransactionsList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/deposits`,
    name: "Pending Deposits",
    rtlName:"الودائع المعلقة",
    icon: WalletIcon,
    component: PendingDepositsList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: `/edit-deposit/:id`,
    name: "Update deposit",
    component: EditDeposit,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  
  {
    path: `/announcements`,
    name: "Announcements",
    rtlName:"الإعلانات",
    icon: CircleNotificationsIcon,
    component: AnnouncementsList,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/create-announcement",
    name: "Announcements",
    rtlName:"الإعلانات",
    component: CreateAnnouncement,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  
  {
    path: "/contact-data",
    name: "Contact us",
    rtlName:"اتصل بنا",
    icon: InfoIcon,
    component: EditContact,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/about-data",
    name: "About us Data",
    rtlName:"بيانات عنا",
    icon: InfoIcon,
    component: EditAbout,
    layout: "/admin",
    layoutAR: "/rtl",
  },
  {
    path: "/terms-data",
    name: "Terms and conditions",
    rtlName:"الأحكام والشروط",
    icon: InfoIcon,
    component: EditTerms,
    layout: "/admin",
    layoutAR: "/rtl",
  },
];

export default dashboardRoutes;
