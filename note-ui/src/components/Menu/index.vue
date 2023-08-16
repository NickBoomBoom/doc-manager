<template>
  <div class="h-full flex flex-col">
    <header class="px-2">顶部操作栏</header>

    <n-scrollbar class="flex-1 ">
      <MenuItem :data="list" />
    </n-scrollbar>

    <footer class="px-2">
      <n-button text> 新增分类 </n-button>
    </footer>
  </div>
</template>
<script setup lang="ts">
const list = [
  {
    id: 1,
    name: '分类1分类1分类1分类1分类1分类1分类1分类1',
    type: 1,
    children: [
      {
        id: 1,
        name: '文章'
      },
      {
        id: 2,
        name: '文章2'
      },
      {
        id: 3,
        name: '文章4'
      },
      {
        id: 1,
        name: '子分类',
        type: 1,
        children: [
          {
            id: 1,
            name: '文章文章文章文章文章文章文章文章文章文章文章'
          },
          {
            id: 2,
            name: '文章2'
          },
          {
            id: 3,
            name: '文章4'
          },
          {
            id: 44,
            name: '子分类3',
            type: 1,
            children: [
              {
                id: 1,
                name: '文章'
              },
              {
                id: 2,
                name: '文章2'
              },
              {
                id: 3,
                name: '文章4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 1,
    name: '分类1分类1分类1分类1分类1分类1分类1分类1',
    type: 1,
    children: [
      {
        id: 1,
        name: '文章'
      },
      {
        id: 2,
        name: '文章2'
      },
      {
        id: 3,
        name: '文章4'
      },
      {
        id: 1,
        name: '子分类',
        type: 1,
        children: [
          {
            id: 1,
            name: '文章文章文章文章文章文章文章文章文章文章文章'
          },
          {
            id: 2,
            name: '文章2'
          },
          {
            id: 3,
            name: '文章4'
          },
          {
            id: 44,
            name: '子分类3',
            type: 1,
            children: [
              {
                id: 1,
                name: '文章'
              },
              {
                id: 2,
                name: '文章2'
              },
              {
                id: 3,
                name: '文章4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 1,
    name: '分类1分类1分类1分类1分类1分类1分类1分类1',
    type: 1,
    children: [
      {
        id: 1,
        name: '文章'
      },
      {
        id: 2,
        name: '文章2'
      },
      {
        id: 3,
        name: '文章4'
      },
      {
        id: 1,
        name: '子分类',
        type: 1,
        children: [
          {
            id: 1,
            name: '文章文章文章文章文章文章文章文章文章文章文章'
          },
          {
            id: 2,
            name: '文章2'
          },
          {
            id: 3,
            name: '文章4'
          },
          {
            id: 44,
            name: '子分类3',
            type: 1,
            children: [
              {
                id: 1,
                name: '文章'
              },
              {
                id: 2,
                name: '文章2'
              },
              {
                id: 3,
                name: '文章4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 1,
    name: '分类1分类1分类1分类1分类1分类1分类1分类1',
    type: 1,
    children: [
      {
        id: 1,
        name: '文章'
      },
      {
        id: 2,
        name: '文章2'
      },
      {
        id: 3,
        name: '文章4'
      },
      {
        id: 1,
        name: '子分类',
        type: 1,
        children: [
          {
            id: 1,
            name: '文章文章文章文章文章文章文章文章文章文章文章'
          },
          {
            id: 2,
            name: '文章2'
          },
          {
            id: 3,
            name: '文章4'
          },
          {
            id: 44,
            name: '子分类3',
            type: 1,
            children: [
              {
                id: 1,
                name: '文章'
              },
              {
                id: 2,
                name: '文章2'
              },
              {
                id: 3,
                name: '文章4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 1,
    name: '分类1分类1分类1分类1分类1分类1分类1分类1',
    type: 1,
    children: [
      {
        id: 1,
        name: '文章'
      },
      {
        id: 2,
        name: '文章2'
      },
      {
        id: 3,
        name: '文章4'
      },
      {
        id: 1,
        name: '子分类',
        type: 1,
        children: [
          {
            id: 1,
            name: '文章文章文章文章文章文章文章文章文章文章文章'
          },
          {
            id: 2,
            name: '文章2'
          },
          {
            id: 3,
            name: '文章4'
          },
          {
            id: 44,
            name: '子分类3',
            type: 1,
            children: [
              {
                id: 1,
                name: '文章'
              },
              {
                id: 2,
                name: '文章2'
              },
              {
                id: 3,
                name: '文章4'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    type: 2,
    id: 2,
    name: '外部文章名外部文章名外部文章名外部文章名外部文章名外部文章名外部文章名外部文章名'
  }
]
</script>
<style lang="less" scoped></style>
