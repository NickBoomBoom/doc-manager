<template>
  <div ref="targetRef" class="h-full"></div>
</template>
<script setup lang="ts">
import { DocTagItem } from 'interfaces/doc-tag.interface';

import * as echarts from 'echarts';
const targetRef = ref();
let instance: any;
async function init() {
  try {
    instance = echarts.init(targetRef.value);
    instance.showLoading();
    const res = await docTagApi.all();
    const series: any[] = [];
    const nodes: any[] = [];
    const links: any[] = [];
    const categories = [{ name: 'Tag' }, { name: 'Document' }];
    res.forEach((t: DocTagItem) => {
      const { id, name, docs } = t;
      nodes.push({
        name: name,
        value: id,
        category: 'Tag',
        symbolSize: 40,
      });
      docs.forEach((tt) => {
        const docName = `文章ID${tt}`;
        if (!nodes.some((ttt) => ttt.name === docName)) {
          nodes.push({
            name: docName,
            value: tt,
            category: 'Document',
            symbolSize: 30,
          });
        }
        links.push({
          source: name,
          target: docName,
        });
      });
    });
    series.push({
      name: '关系图',
      type: 'graph',
      layout: 'force',
      data: nodes,
      links,
      categories,
      roam: true,
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
      },
      labelLayout: {
        hideOverlap: true,
      },
      scaleLimit: {
        min: 0.4,
        max: 2,
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10,
        },
      },
      force: {
        repulsion: 600, // 斥力因子，控制节点之间的距离
        gravity: 0.1, // 节点受到的重力大小，值越大节点趋向于聚集在图表中心
        edgeLength: 200, // 边的默认长度
      },
    });
    const option = {
      tooltip: {},
      series,
    };

    instance.setOption(option);
    instance.on('click', (params: any) => {
      console.log(params);
    });
  } catch (error) {
    console.error(error);
  } finally {
    instance?.hideLoading();
  }
}

function handelItem(...args) {
  console.log(args);
}
onMounted(init);
</script>
<style lang="scss" scoped></style>
