<template>
  <div class="card" dir="rtl">
    <!-- Breadcrumb Navigation -->
    <div class="card flex justify-center mt-3 mb-3">
      <!-- Breadcrumb component showing the navigation path -->
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <!-- Add New Branch Button -->
    <Button 
      label="إضافة جديد" 
      icon="fas fa-plus" 
      class="p-button-sm mb-3"
      @click="openAddEditBranchDialog()"
    />

    <!-- Fullscreen Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 w-screen h-screen flex align-items-center justify-content-center z-5"
      style="background-color: #2828289c;"
    >
      <div class="text-primary-500 border-round text-center">
        <!-- Loading spinner icon -->
        <i class="fa-solid fa-circle-notch fa-spin fa-spin-reverse fa-2xl" style="font-size: 80px;"></i>
      </div>
    </div>

    <!-- Branch Tabs -->
    <Tabs v-model:value="activeTab" @update:value="onTabChange">
      <!-- Tab List (branch names as tabs) -->
      <TabList>
        <Tab 
          v-for="branch in allBranches" 
          :value="branch.branch_id"
          :key="branch.branch_id"
        >
          {{ branch.name }}
        </Tab>
      </TabList>            

      <!-- Tab Panels (branch details) -->
      <TabPanels>
        <TabPanel 
          v-for="branch in allBranches"
          :key="branch.branch_id"
          :value="branch.branch_id"
        >
          <div class="branchInfoCard">
            <div class="grid">
              <!-- Branch Info Column -->
              <div class="col">
                <h2>
                  <i class="fa-solid fa-shop"></i> 
                  {{ branch.name }}
                </h2>
                <p>
                  <i class="fa-solid fa-map-location-dot"></i>
                  العنوان: {{ branch.address }}
                </p>
                <Button 
                  as="a" 
                  label="الموقع على الخريطة" 
                  :href="branch.google_map_location" 
                  target="_blank" 
                  rel="noopener" 
                  variant="link" 
                />
              </div>

              <!-- Contact Info Column -->
              <div class="col">
                <h2>
                  <i class="fa-solid fa-address-book"></i>
                  التواصل
                </h2>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.phone1" />
                </p>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.phone2" />
                </p>
              </div>

              <!-- Manager Info Column -->
              <div class="col">
                <h2>
                  <i class="fas fa-user-tie"></i>
                  الادارة
                </h2>
                <p>
                  <i class="fas fa-user"></i>
                  مدير الموقع: {{ branch.manager.fullname }}
                </p>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.manager.phone1" :disabled="branch.manager.phone1 === ''" />
                </p>
                <p>
                  <Tag icon="fas fa-phone-flip" severity="info" :value="branch.manager.phone2" :disabled="branch.manager.phone2 === ''" />
                </p>
                <p>
                  <Tag icon="fas fa-envelope" severity="info" :value="branch.manager.email" :disabled="branch.manager.email === ''" />
                </p>
                <p>
                  <Tag icon="fa-solid fa-location-dot" severity="info" :value="branch.manager.address" :disabled="branch.manager.address === ''" />
                </p>
              </div>

              <!-- Actions Column (Edit/Delete buttons) -->
              <div class="col-fixed">
                <Button 
                  icon="fas fa-edit" 
                  class="ml-1 p-button-sm" 
                  severity="contrast" 
                  rounded 
                  aria-label="تعديل" 
                  @click="openAddEditBranchDialog(branch)" 
                />
                <Button 
                  icon="fas fa-trash-alt" 
                  class="p-button-sm" 
                  severity="danger" 
                  rounded 
                  aria-label="حذف" 
                  @click="confirmDeleteBranch(branch)" 
                />
              </div>
            </div>
          </div>

          <!-- Vehicle Accordion Trigger Button -->
          <div class="flex mb-4 gap-2 justify-end mt-4">
            <Button 
                icon="fas fa-car" 
                class="ml-1 p-button-sm" 
                :outlined="activeAccordion !== '0'"
                rounded 
                aria-label="العجلات" 
                @click="activeAccordion = '0'"
              />
          </div>

          <!-- Vehicle Accordion -->
          <Accordion v-model:value="activeAccordion">
            <AccordionPanel value="0">
              <AccordionHeader>العجلات</AccordionHeader>
              <AccordionContent>
                <!-- Vehicles DataTable -->
                <DataTable
                  v-model:filters="vehicleFilter"
                  :value="allBrancheVehicles"
                  dataKey="id"
                  paginator
                  :rows="10"
                  filterDisplay="menu"
                  :globalFilterFields="['brand', 'model', 'plate_number']"
                  responsiveLayout="scroll"
                  class="text-right"
                >
                  <template #header>
                    <div class="flex justify-between">
                      <IconField>
                        <InputIcon class="fas fa-search" />
                        <InputText 
                          v-model="vehicleFilter.global.value" 
                          placeholder="بحث..." 
                        />
                      </IconField>
                    </div>
                  </template>

                  <template #empty>
                    <Message severity="warn">لا توجد عجلات مسجلة لهذا المركز</Message>
                  </template>

                  <!-- Vehicle Columns -->
                  <Column field="brand" header="الماركة" sortable>
                    <template #header>
                      <i class="fa-solid fa-car-side text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="model" header="الموديل" sortable>
                    <template #header>
                      <i class="fa-solid fa-car-side text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="color" header="اللون" sortable>
                    <template #header>
                      <i class="fa-solid fa-palette text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="plate_number" header="رقم اللوحة" sortable>
                    <template #header>
                      <i class="fa-solid fa-id-card text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="year" header="السنة" sortable>
                    <template #header>
                      <i class="fa-solid fa-calendar-week text-gray-500"></i>
                    </template>
                  </Column>

                  <Column field="owner_type" header="نوع المالك" sortable>
                    <template #header>
                      <i class="fa-solid fa-users-viewfinder text-gray-500"/>
                    </template>
                    <template #body="{data}">
                      <Tag v-if="data.owner_type === 'branche'" icon="fas fa-shop" severity="warn" value="المركز"></Tag>
                      <Tag v-if="data.owner_type === 'otherOwner'" icon="fas fa-user" severity="info" value="مستثمر"></Tag>
                    </template>
                  </Column>

                  <Column field="owner.fullname" header="المالك" sortable>
                    <template #header>
                      <i class="fas fa-user-alt text-gray-500"/>
                    </template>
                  </Column>

                  <Column field="status" header="حالة العجلة" sortable>
                    <template #header>
                      <i class="fas fa-diagram-project"/>
                    </template>
                    <template #body="{data}">
                      <Tag v-if="data.status === 'available'" icon="fas fa-car-side" severity="info" value="متاح"></Tag>
                      <Tag v-if="data.status === 'rented'" icon="fas fa-hourglass-start" severity="warn" value="مستاجر"></Tag>
                      <Tag v-if="data.status === 'maintenance'" icon="fas fa-car-burst" severity="error" value="صيانة"></Tag>
                    </template>
                  </Column>

                  <Column field="created_at" header="تاريخ الاضافة" sortable>
                    <template #header>
                      <i class="fas fa-calendar-alt text-gray-500"/>
                    </template>
                  </Column>

                  <!-- More Details Button Column -->
                  <Column header="تفاصيل اكثر">
                    <template #header>
                      <i class="fas fa-clone"/>
                    </template>
                    <template #body>
                      <Button 
                        icon="fa-solid fa-arrow-up-right-from-square" 
                        severity="success" 
                        rounded 
                        variant="outlined" 
                        aria-label="تفاصيل اكثر"
                        class="p-button-sm"
                        @click="openVehicleLogDialog()"
                        />
                    </template>
                  </Column>
                </DataTable>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- Add/Edit Branch Dialog -->
    <Dialog
      v-model:visible="addEditBranchFormDialogVisible"
      :header="isEditMode ? 'حفظ التعديلات' : 'اضافة جديد'"
      :style="{ width: '30vw' }"
      modal
      @hide="resetForm"
      dir="rtl"
    >
      <div class="flex flex-column gap-4 mt-3">
        <!-- Branch Name -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.name" placeholder="اسم المركز" fluid />
        </IconField>

        <!-- Branch Address -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.address" placeholder="عنوان المركز" fluid />
        </IconField>

        <!-- Branch Phone Numbers -->
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.phone1" placeholder="رقم هاتف المركز" fluid />
        </IconField>
        <IconField>
          <InputIcon class="fa-solid fa-phone-flip" />
          <InputText v-model="brancheForm.phone2" placeholder="رقم هاتف المركز2" fluid />
        </IconField>

        <!-- Manager Selection -->
        <IconField>
          <InputIcon class="fas fa-user-tie" />
          <Select 
            v-model="brancheForm.manager_id" 
            :options="allUsers" 
            filter 
            optionLabel="fullname" 
            optionValue="id" 
            placeholder="اختر مدير المركز" 
            class="w-full md:w-56" 
          />
        </IconField>
      </div>

      <!-- Dialog Footer -->
      <template #footer>
        <Button
          @click="addEditBranchFormDialogVisible = false"
          label="الغاء"
          icon="fas fa-times"
          severity="secondary"
          class="p-button-sm"
        />
        <Button
          :label="isEditMode ? 'حفظ' : 'إضافة'"
          icon="fas fa-floppy-disk"
          :loading="isSaving"
          class="p-button-sm"
          @click="saveBranch()"
        />
      </template>
    </Dialog>

    <!-- Vehicle Log Dialog -->
    <Dialog 
      v-model:visible="vehicleLogDialogVisible"
      header="تتبع العجلة"
      modal
      :style="{ width: '75vw' }"
      dir="rtl"
    >
      <div class="flex flex-column gap-4 mt-3">
        <!-- Vehicle Logs DataTable -->
        <DataTable
          v-model:filters="vehicleLogFilter"
          :value="vehicleLog"
          dataKey="log_id"
          paginator
          :rows="10"
          filterDisplay="menu"
          :globalFilterFields="['date', 'action', 'details', 'performed_by.fullname']"
          class="text-right"
        >
          <template #header>
            <div class="flex justify-between">
              <IconField>
                <InputIcon class="fas fa-search" />
                <InputText v-model="vehicleLogFilter.global.value" placeholder="بحث..."/>
              </IconField>
            </div>
          </template>

          <template #empty>
            <Message severity="warn"><i class="fas fa-info"/> لاتوجد بيانات بعد</Message>
          </template>

          <!-- Vehicle Log Columns -->
          <Column field="log_id" sortable>
            <template #header>
              <i class="fas fa-hashtag text-gray-500"/>
            </template>
          </Column>

          <Column field="date" header="تاريخ الحدث" sortable>
            <template #header>
              <i class="fas fa-calendar-alt text-gray-500"/>
            </template>
          </Column>

          <Column field="action" header="الحدث" sortable>
            <template #header>
              <i class="fas fa-bell text-gray-500"/>
            </template>
          </Column>

          <Column field="details" header="التفاصيل" sortable>
            <template #header>
              <i class="fas fa-text-width text-gray-500"/>
            </template>
          </Column>

          <Column field="performed_by.fullname" header="بواسطة" sortable>
            <template #header>
              <i class="fas fa-user text-gray-500"/>
            </template>
          </Column>

          <Column field="created_at" header="الوقت الفعلي" sortable>
            <template #header>
              <i class="fas fa-calenadar_alt text-gray-500"/>
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
/* =====================================
  IMPORTS SECTION
===================================== */
// Vue Composition API imports
import { ref, reactive, onMounted } from "vue";

// PrimeVue composables
import { useToast } from "primevue/usetoast";   // Toast notifications
import { useConfirm } from "primevue/useconfirm"; // Confirmation dialog

// PrimeVue Components
import Breadcrumb from "primevue/breadcrumb";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from 'primevue/select';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import { FilterMatchMode } from "@primevue/core/api";

// Services
import branchService, { type Branch } from "./branchesService";
import UsersService from "../users/usersService";
import vehicleService from "../vehicles/vehicelsService";

/* =====================================
  STATE VARIABLES SECTION
===================================== */
// Toast notifications instance
const toast = useToast();

// Confirm dialog instance
const confirm = useConfirm();

// List of all branches
const allBranches = ref<Branch[]>([]);

// List of all users (for manager selection)
const allUsers = ref<any[]>([]);

// Form mode (edit or add)
const isEditMode = ref(false);

// Loading state for overlay
const isLoading = ref(true);

// Saving state for form
const isSaving = ref(false);

// Confirming deletion state
const isConfirming = ref(false);

// Active tab (branch)
const activeTab = ref<number | null>(null);

// Dialog visibility states
const addEditBranchFormDialogVisible = ref(false);
const vehicleLogDialogVisible = ref(false);

// Vehicle data for selected branch
const allBrancheVehicles = ref([]);

// Accordion active panel
const activeAccordion = ref('0');

// Vehicle logs data
const vehicleLog = ref([]);

// Filters for DataTables
const vehicleFilter = reactive({
  global: {value: null, matchMode:FilterMatchMode.CONTAINS},
});
const vehicleLogFilter = reactive({
  global: {value: null, matchMode:FilterMatchMode.CONTAINS},
});

// Breadcrumb configuration
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "الفروع", to: "/departments" },
]);

// Branch form model
const brancheForm = ref<Branch>({
  branch_id: undefined,
  name: "",
  address: "",
  phone1: "",
  phone2: "",
  manager_id: null, // manager object or null
  google_map_location: "",
  is_active: true,
});

/* =====================================
  MOCK DATA SECTION
===================================== */
const mockLogs = [
  // Array of vehicle log objects (same structure as API response)
  {
    log_id: 1,
    vehicle_id: 2,
    date: "2025-10-20",
    action: "فحص دوري",
    details: "تم فحص المحرك وتغيير زيت الفرامل.",
    performed_by: { user_id: 11, fullname: "علي محمد" },
    created_at: "2025-10-20 09:15:00",
    updated_at: "2025-10-20 09:15:00"
  },
  {
    log_id: 2,
    vehicle_id: 2,
    date: "2025-10-25",
    action: "إصلاح",
    details: "استبدال بطارية السيارة ونظام الإشعال.",
    performed_by: { user_id: 12, fullname: "مريم خالد" },
    created_at: "2025-10-25 14:40:00",
    updated_at: "2025-10-25 14:40:00"
  },
  {
    log_id: 3,
    vehicle_id: 3,
    date: "2025-09-10",
    action: "تنظيف داخلي",
    details: "تنظيف داخلي شامل وإزالة البقع من المقاعد.",
    performed_by: { user_id: 13, fullname: "سامي صالح" },
    created_at: "2025-09-10 11:00:00",
    updated_at: "2025-09-10 11:00:00"
  },
  {
    log_id: 4,
    vehicle_id: 3,
    date: "2025-10-01",
    action: "تغيير إطارات",
    details: "استبدال الإطارات الأمامية واستكمال توازن العجلات.",
    performed_by: null,
    created_at: "2025-10-01 08:30:00",
    updated_at: "2025-10-01 08:30:00"
  },
  {
    log_id: 5,
    vehicle_id: 4,
    date: "2025-08-15",
    action: "فحص كهربائي",
    details: "الكشف عن تسرب في دائرة الإضاءة الأمامية وإصلاحه.",
    performed_by: { user_id: 14, fullname: "هند علي" },
    created_at: "2025-08-15 10:20:00",
    updated_at: "2025-08-15 10:20:00"
  },
  {
    log_id: 6,
    vehicle_id: 5,
    date: "2025-10-27",
    action: "تحديث نظام",
    details: "تحديث برنامج وحدة التحكم الإلكتروني (ECU) لإصدار أحدث.",
    performed_by: { user_id: 15, fullname: "أحمد جابر" },
    created_at: "2025-10-27 16:05:00",
    updated_at: "2025-10-27 16:05:00"
  }
];

/* =====================================
  FUNCTIONS SECTION
===================================== */

// Fetch all branches from API
const fetchAllBranches = async () => {
  isLoading.value = true; // Show loading overlay
  try {
    allBranches.value = await branchService.getAll(); // API call to fetch branches
    activeTab.value = allBranches.value.length ? allBranches.value[0].branch_id : null;
  } catch (err) {
    console.error(err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to fetch branches",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
    onTabChange(activeTab.value) // Load vehicles for first tab
  }
};

// Fetch vehicles for a specific branch
const onTabChange = async(branchId: number)=> {
  if (!branchId) return ;
  allBrancheVehicles.value = [];
  try {
    const response = await vehicleService.getByOwner('branche', branchId);
    allBrancheVehicles.value = response.data;
    console.log(allBrancheVehicles.value)
  } catch (err) {
    console.log('err', err);
  }
}

// Save branch (create or update)
const saveBranch = async () => {
  isSaving.value = true;
  try {
    if (isEditMode.value) {
      await branchService.update(brancheForm.value.branch_id, brancheForm.value);
      toast.add({ severity: "success", summary: "Saved", detail: "Branch updated successfully", life: 3000 });
    } else {
      await branchService.create(brancheForm.value);
      toast.add({ severity: "success", summary: "Success", detail: "New branch added", life: 3000 });
    }
    fetchAllBranches();
    addEditBranchFormDialogVisible.value = false;
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to save branch", life: 3000 });
  } finally {
    isSaving.value = false;
  }
};

// Fetch all users for manager selection dropdown
const fetchAllUsers = async () => {
  try {
    allUsers.value = await UsersService.getAll();
  } catch (err) {
    console.error(err);
    toast.add({ severity: "error", summary: "Error", detail: "Failed to fetch users", life: 3000 });
  }
};

// Open Add/Edit Branch Dialog
const openAddEditBranchDialog = (branch: Branch | null = null) => {
  if (branch) {
    isEditMode.value = true;
    brancheForm.value = { ...branch, manager_id: branch.manager };
  } else {
    resetForm();
  }
  fetchAllUsers(); // Load users for selection
  addEditBranchFormDialogVisible.value = true;
};

// Open Vehicle Log Dialog
const openVehicleLogDialog = ()=>{
  vehicleLogDialogVisible.value = true;
  vehicleLog.value = mockLogs; // Load mock logs (replace with API later)
}

// Confirm branch deletion
const confirmDeleteBranch = (branch: Branch) => {
  if (isConfirming.value) return;
  isConfirming.value = true;

  confirm.require({
    message: `هل انت متاكد من حذف بيانات المركز "${branch.name}"?`,
    header: "تاكيد الحذف",
    icon: "pi pi-exclamation-triangle text-yellow-500",
    acceptLabel: "تاكيد",
    acceptIcon: "pi pi-check",
    acceptClass:"p-button-sm border border-red-500 bg-red-500 text-white",
    rejectLabel: "الغاء",
    rejectIcon: "pi pi-times",
    rejectClass:"p-button-sm border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-200",
    accept: async () => {
      try {
        await branchService.delete(branch.branch_id);
        toast.add({ severity: "success", summary: "Deleted", detail: "Branch deleted successfully", life: 3000 });
        fetchAllBranches();
      } catch (err) {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to delete branch", life: 3000 });
      } finally {
        isConfirming.value = false;
      }
    },
    reject: () => (isConfirming.value = false),
  });
};

// Reset branch form to initial state
const resetForm = () => {
  isEditMode.value = false;
  brancheForm.value = {
    branch_id: undefined,
    name: '',
    address: '',
    phone1: '',
    phone2: '',
    manager_id: null,
    google_map_location: '',
    is_active: true,
  };
};

/* =====================================
  LIFECYCLE HOOKS
===================================== */
// Fetch branches when component mounts
onMounted(() => {
  fetchAllBranches();
});
</script>

<style scoped>
/* Branch Card Styling */
.branchInfoCard {
  padding: 10px;
  border-radius: 25px;

  /* Gradient background with image overlay */
  background: 
    linear-gradient(to right, #354143, #62ada29c),
    url(/src/assets/others/1.jpg) no-repeat;
  background-position: left;
}
</style>