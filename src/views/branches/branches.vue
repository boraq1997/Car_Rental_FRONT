<template>
    <div class="card" dir="rtl">
        <div class="card flex justify-center mt-3 mb-3">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
        </div>
        <Button 
            label="إضافة جديد" 
            icon="fas fa-plus" 
            class="p-button-sm mb-3"
        />

        <div
            v-if="isLoading"
            class="fixed top-0 left-0 w-screen h-screen flex align-items-center justify-content-center z-5"
            style="background-color: #2828289c;"
        >
            <div class="text-primary-500 border-round text-center">
                <i class="fa-solid fa-circle-notch fa-spin fa-spin-reverse fa-2xl" style="font-size: 80px;"></i>
            </div>
        </div>

        <Tabs v-model:value="activeTab">
                <TabList>
                    <Tab 
                        v-for="branch in allBranches" 
                        :value="branch.branch_id"
                        :key="branch.branch_id"    
                    >{{ branch.name }}</Tab>
                </TabList>            
            <TabPanels>
                <TabPanel 
                    v-for="branche in allBranches"
                    :key="branche.branch_id"
                    :value="branche.branch_id"
                >
                    <div class="branchInfoCard">
                        <div class="grid">
                            <div class="col">
                                <h2>
                                    <i class="fa-solid fa-shop"></i> 
                                    {{ branche.name }}
                                </h2>
                                <p>
                                    <i class="fa-solid fa-map-location-dot"></i>
                                     العنوان: {{ branche.address }}
                                </p>
                                <Button as="a" label="الموقع على الخريطة" :href="branche.google_map_location" target="_blank" rel="noopener" variant="link" />
                            </div>
                            <div class="col">
                                <h2>
                                    <i class="fa-solid fa-address-book"></i>
                                     التواصل
                                </h2>
                                <p>
                                    <Tag icon="fas fa-phone-flip" severity="info" :value="branche.phone1"></Tag>
                                </p>
                                <p>
                                    <Tag icon="fas fa-phone-flip" severity="info" :value="branche.phone2"></Tag>
                                </p>
                            </div>
                            <div class="col">
                                <h2>
                                    <i class="fas fa-user-tie"></i>
                                    الادارة
                                </h2>
                                <p>
                                    <i class="fas fa-user"></i>
                                     مدير الموقع: {{ branche.manager.fullname }}
                                </p>
                                <p>
                                    <Tag icon="fas fa-phone-flip" severity="info" :value="branche.manager.phone1" :disabled="branche.manager.phone1 === ''"></Tag>
                                </p>
                                <p>
                                    <Tag icon="fas fa-phone-flip" severity="info" :value="branche.manager.phone2" :disabled="branche.manager.phone2 === ''"></Tag>
                                </p>
                                <p>
                                    <Tag icon="fas fa-envelope" severity="info" :value="branche.manager.email" :disabled="branche.manager.email === ''"></Tag>
                                </p>
                                <p>
                                    <Tag icon="fa-solid fa-location-dot" severity="info" :value="branche.manager.address" :disabled="branche.manager.address === ''"></Tag>
                                </p>
                            </div>
                        </div>
                        

                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Breadcrumb from "primevue/breadcrumb";
import { FilterMatchMode } from "@primevue/core/api";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import branchService, {type Branch} from "./branchesService";
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const toast = useToast();
const confirm = useConfirm();

const allBranches = ref<any[]>([]);
const isEditMode = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const isConfirming = ref(false);
const activeTab = ref<number | null>(null)
const filters = reactive({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

// Breadcrumb
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([
  { label: "الرئيسية", to: "/" },
  { label: "الفروع", to: "/departments" },
]);

const brancheForm = ref<Branch>({
  branch_id: undefined,
  name: "",
  address: "",
  phone1: "",
  phone2: "",
  manager: null, // هنا يجب أن يكون كائن أو null وليس رقم فقط
  google_map_location: "",
  is_active: true,
});

const fetchAllBranches = async()=>{
    isLoading.value = true;
    try {
        allBranches.value = await branchService.getAll();
        activeTab.value = allBranches.value[0].branch_id;
    } catch (err) {
        console.log(err);
        toast.add({
            severity: "error",
            summary: "خطاء",
            detail: "حدث خطاء اثناء جلب الفروع",
            life: 3000,
        });
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchAllBranches();
})
</script>

<style scoped>
.branchInfoCard {
    padding: 10px;
    border-radius: 25px;

    /* التدرج + الصورة */
    background: 
        linear-gradient(to right, #354143, #62ada29c),
        url(/src/assets/others/1.jpg) no-repeat;

    background-position: left;
}
</style>