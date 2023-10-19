<template>
  <q-select
    dense
    v-model="model"
    use-input
    use-chips
    multiple
    input-debounce="0"
    new-value-mode="add-unique"
    hide-dropdown-icon
    option-value="id"
    option-label="name"
    :loading="saveLoading"
    @new-value="createNewValue"
  >
    <template #prepend>
      <q-icon name="bookmark" color="primary" />
    </template>
    <template #selected-item="{ opt, removeAtIndex, index }">
      <q-chip
        dense
        color="primary"
        text-color="white"
        size="12px"
        removable
        @remove="removeAtIndex(index)"
      >
        {{ opt.name }}
      </q-chip>
    </template>
  </q-select>
</template>
<script setup lang="ts">
import _ from 'lodash-es';
const props = defineProps<{
  docId: number;
  docTagId: number;
}>();
const model = ref([]);
const list = ref<any[]>([]);
const loading = ref(true);
const saveLoading = ref(false);

watch(model, _.debounce(bind));
onMounted(init);

async function init() {
  try {
    loading.value = true;
    const [tagRes, selfRes] = await Promise.all([
      tagApi.all(),
      docTagApi.get(props.docTagId),
    ]);
    list.value = tagRes;
    model.value = selfRes;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
async function createNewValue(
  val: string,
  done: (
    item?: any,
    mode?: 'add-unique' | 'add' | 'toggle' | undefined,
  ) => void,
) {
  try {
    val = val.trim();
    if (!val) {
      return;
    }
    saveLoading.value = true;
    let target = list.value.find((t) => t.name === val);
    if (!target) {
      target = await tagApi.create({
        name: val,
      });
      list.value.push(target as any);
    }
    done(target);
    await docTagApi.bind(props.docTagId, {
      docId: props.docId,
      tagIds: model.value.map((t: any) => t.id).toString(),
    });
  } catch (error) {
    console.error(error);
  } finally {
    saveLoading.value = false;
  }
}

async function bind() {
  await docTagApi.bind(props.docTagId, {
    docId: props.docId,
    tagIds: model.value.map((t: any) => t.id).toString(),
  });
}
</script>
