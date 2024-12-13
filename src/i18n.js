import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "id": 'ID',
                    'name': 'Name',
                    'ar_name': 'Arabic Name',
                    "description": 'Description',
                    "ar_description": 'Description',
                    "phone": 'Phone',
                    "email": 'Email',
                    "image": 'Image',
                    "AR Image": "Arabic Image",
                    "created_at": 'Created at',
                    "store_name": 'Store name',
                    "updated_at": "Updated at",
                    "ACTION": "ACTION",
                    "No data please add new one": 'No data please add new one',
                    "List Items": 'List Items',
                    "Here is a subtitle for this table": 'Here is a subtitle for this table',
                    "Previous": 'Previous',
                    "Next": 'Next',
                    "status": "Status",
                    "total": "Total",
                    'Image': 'Image',
                    "Save": 'Save',
                    "Gallery": "Gallery",
                    "Update": 'Update',
                    "Remove": "Remove",
                    "Remove all": 'Remove all',
                    "Category": "Category",
                    "Brands": "Brands",
                    "Stock": "Stock",
                    "Add": "Add",
                    "Next": "Next",
                    "Add New Stock": "Add New Stock",
                    "Quantity": "Quantity",
                    "Cancel": "Cancel",
                    "Basic Information": "Basic Information",
                    "Category & Brand": "Category & Brand",
                    "Edit variants": "Edit variants",
                    "Variants": "Variants",
                    "Add New Variant": "Add New Variant",
                    "Variant Name": "Variant Name",
                    "Variant Values": "Variant Values",
                    "Value": "Value",
                    "Edit": "Edit",
                    "Add Category": "Add Category",
                    "Edit Category": "Edit Category",
                    "Add Brand": "Add Brand",
                    "Edit Brand": "Edit Brand",
                    "Variants Table": "Variants Table",
                    "Actions": "Actions",
                    "Save": "Save",
                    "Edit": "Edit",
                    "start_at": "Start Date",
                    "expire_at": "Expire Date",
                    "percentage": "Percentage",
                    "products_count": "Products count",
                    "Products": "Products",
                    "shipping_fee": "Shipping fee",
                    "start date/time": "start date/time",
                    "End date/time": "End date/time",
                    "Edit offer": "Edit offer",
                    "Add Offer": "Add Offer",
                    "Order details": "Order details",
                    "Pharmacy price": "Pharmacy price",
                    "Pharmacy price after sale": "Pharmacy price after sale",
                    "Store price": "Store price",
                    "Store price after sale": "Store price after sale",
                    "Cancelled": "Cancelled",
                    "Customer": "Customer",
                    "Street": "Street",
                    "Special mark": "Special mark",
                    "Status": "Status",
                    "Current status": "Status",
                    "Payment": "Payment",
                    "body":"Message",
                    "title":"Title",
                    "Arabic":"Arabic",
                    "action_type":"Action type",
                    "action_id":'Action id',
                    "governate":"Governate",
                    "wallet": "Wallet",
                }
            },
            ar: {
                translations: {
                    "id": 'رقم التسلسل',
                    'name': 'الاسم',
                    'ar_name': ' الاسم العربي ',
                    "description": 'وصف',
                    "ar_description": 'وصف عربي',
                    "phone": 'هاتف',
                    "email": 'البريد الإلكتروني',
                    "image": 'الصوره',
                    "AR Image": "صورة باللغة العربية",
                    "created_at": 'أنشئت في',
                    "updated_at": "تم التحديث في",
                    "ACTION": "الأداء",
                    "No data please add new one": 'لا توجد بيانات الرجاء إضافة واحدة جديدة',
                    "List Items": 'عناصر القائمة',
                    "Here is a subtitle for this table": 'هنا عنوان فرعي لهذا الجدول',
                    "Previous": 'سابق',
                    "Next": 'التالي',
                    "status": "الحاله",
                    "total": "اجمالي",
                    "tax": "ضريبة",
                    "shipping_fee": "مصاريف الشحن",
                    "subtotal": "المجموع الفرعي",
                    'Image': 'صورة',
                    "Save": 'يحفظ',
                    "Gallery": "الصور",
                    "Update": 'تحديث',
                    "Remove": "إزالة",
                    "Remove all": 'حذف الكل',
                    "Category": "فئة",
                    "Brands": "العلامات التجارية",
                    "Stock": "مخزون",
                    "Add": "يضيف",
                    "Next": "التالي",
                    "Add New Stock": "إضافة مخزون جديد",
                    "Quantity": "كمية",
                    "Cancel": "يلغي",
                    "Basic Information": "معلومات اساسية",
                    "Category & Brand": "الفئة والعلامة التجارية",
                    "Edit variants": "المتغيرات",
                    "Variants": "المتغيرات",
                    "Add New Variant": "أضف متغير جديد",
                    "Variant Name": "اسم المتغير",
                    "Variant Values": "القيم المتغيرة",
                    "Value": "قيمة",
                    "Edit": "تعديل",
                    "Add Category": "إضافة فئة",
                    "Edit Category": "تحرير الفئة",
                    "Add Brand": "أضف العلامة التجارية",
                    "Edit Brand": "تعديل العلامة التجارية",
                    "Variants Table": "جدول المتغيرات",
                    "Actions": "أفعال",
                    "Save": "يحفظ",
                    "Edit": "تعديل",
                    "start_at": "تاريخ البدء",
                    "expire_at": "تاريخ الانتهاء",
                    "percentage": "نسبة مئوية",
                    "products_count": "عدد المنتجات",
                    "Products": "المنتجات",
                    "start date/time": "تاريخ / وقت البدء",
                    "End date/time": "تاريخ / وقت الانتهاء",
                    "Edit offer": "تحرير العرض",
                    "Add Offer": "إضافة عرض",
                    "Order details": "تفاصيل الطلب",
                    "Pharmacy price": "سعر الصيدلة",
                    "Pharmacy price after sale": "سعر الصيدلية بعد الخصم",
                    "Store price": "سعر المتجر",
                    "Store price after sale": "سعر المتجر بعد الخصم",
                    "Cancelled": "ألغيت",
                    "Customer": "عميل",
                    "Street": "شارع",
                    "Special mark": "علامة خاصة",
                    "Status": "حالة",
                    "Current status": "الحالة الحالية",
                    "Payment": "دفع",
                    "Subtotal": "المجموع الفرعي",
                    "Total": "المجموع",
                    "Shipping fee": "رسوم الشحن",
                    "store_name": 'اسم المتجر',
                    "You must have at least one variant": "يجب أن يكون لديك متغير واحد على الأقل",
                    "Order Id": "رقم الطلب",
                    "User Name": "اسم االمستخدم",
                    "Search": "بحث",
                    "Add Product": "أضف منتج",
                    "Browse": "تصفح",
                    "Search for product": "ابحث عن المنتج",
                    "Paid by customer": "يدفعه العميل",
                    "Summary": "ملخص",
                    "Updated total": "المجموع المحدث",
                    "Amount to collect": "المبلغ المراد تحصيله",
                    "Save the change": "احفظ التغيير",
                    "Price": "سعر",
                    "Stock Type": "نوع المخزون",
                    "products selected": "المنتجات المختارة",
                    "Close": "أغلق",
                    "Adjust quantity": "ضبط الكمية",
                    "Remove item": "إزالة",
                    "Apply discount":"تطبيق الخصم",
                    "Update quantity":"تحديث الكمية",
                    "Done":"فعله",
                    "title":"عنوان نص",
                    "body":"رسالة",
                    "About us":"بيانات عنا",
                    "data":"بيانات",
                    "ar_data":"بيانات عربى",
                    "Terms and conditions":"الأحكام والشروط",
                    "Address":"عنوان",
                    "Arabic Address":"العنوان العربي",
                    "Website":"موقع الكتروني",
                    "Facebook":"فيسبوك",
                    "Conatct us":"اتصل بنا",
                    "Arabic title":"عنوان عربي",
                    "Arabic":"عربي",
                    "Create Announcement":"إنشاء إعلان",
                    "Send Notification?":"هل تريد إرسال إشعار؟",
                    "type":'نوع',
                    "amount":'مبلغ',
                    "action_type":"نوع الإجراء",
                    "action_id":'رقم ألاجراء',
                    "Edit Deposit":"تحرير الإيداع",
                    "Approve":"اعتماد",
                    "Customer name":"اسم العميل",
                    "Customer phone":"رقم العميل",
                    "Store name":"اسم المتجر",
                    "User info":"معلومات المستخدم",
                    "Store info":"معلومات المتجر",
                    'Type':"نوع",
                    "Branches":"الفروع",
                    "Branch":"الفرع",
                    "Region":"منطقة",
                    "User orders":"طلبات المستخدم",
                    "notes":"ملاحظات",
                    "Create Deposit":"إنشاء إيداع",
                    "Create":"إنشاء",
                    "User Transactions":"معاملات المستخدم",
                    "receipts":"الإيصال",
                    "governate":"محافظة",
                    "Latitude":"خط العرض",
                    "Longitude":"خط الطول",
                    "SKU":"كود المنتج",
                    "wallet": "محفظة"
                }
            },
        },
        fallbackLng: "en",
        debug: true,

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18next;
