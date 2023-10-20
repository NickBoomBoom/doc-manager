<template>
  <q-select
    v-model="model"
    use-input
    use-chips
    multiple
    label="标签:"
    input-debounce="0"
    new-value-mode="add-unique"
    hide-dropdown-icon
    option-value="id"
    option-label="name"
    @new-value="createNewValue"
  >
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
async function createNewValue(val: string, done: (item?: any) => void) {
  try {
    val = val.trim();
    if (!val) {
      return;
    }
    let target = list.value.find((t) => t.name === val);
    if (!target) {
      target = await tagApi.create({
        name: val,
      });
      list.value.push(target as any);
      done(list.value[list.value.length - 1]);
    } else {
      done(target);
    }
  } catch (error) {
    console.error(error);
  }
}

async function bind() {
  console.log(1111, model.value);
  await docTagApi.bind(props.docTagId, {
    docId: props.docId,
    tagIds: model.value.map((t: any) => t.id).toString(),
  });
}
</script>
