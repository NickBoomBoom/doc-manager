import { SpaceUpdate } from 'interfaces/category.interface';
import { MenuItem } from 'interfaces/menu.interface';
import { Dialog, Notify } from 'quasar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface TreeNode {
  label: string;
  id: number;
  icon: string;
  children?: TreeNode[];
  index: string;
  extra: MenuItem;
  lazy: boolean;
}

export interface OpenSpace {
  node: TreeNode;
  state: boolean;
}
class Menu {
  menus$: BehaviorSubject<TreeNode[]> = new BehaviorSubject<TreeNode[]>([]);
  createNote$: Subject<TreeNode | undefined> = new Subject();
  openSpace$: Subject<OpenSpace> = new Subject();
  // 同时只能做一件事
  insertTreeNode: TreeNode | undefined;

  update(keys: string[], values: any[], index: string) {
    const source = this.getTargetByIndex(index);
    keys.forEach((t, i) => {
      const arr = t.split('.');
      let target: any = source;
      arr.forEach((tt, ii) => {
        if (ii === arr.length - 1) {
          target[tt] = values[i];
        } else {
          target = target[tt];
        }
      });
    });
    this.menus$.next(this.menus$.getValue());
  }
  insert(
    menuItem: MenuItem,
    insertItem: TreeNode | undefined = this.insertTreeNode,
  ) {
    const index = insertItem
      ? insertItem.index + '-' + insertItem.children?.length
      : this.menus$.value.length + '';
    const node = this.formatData(menuItem, index);
    if (insertItem) {
      this.getTargetByIndex(insertItem.index).children!.push(node);
    } else {
      this.menus$.value.push(node);
    }
    this.menus$.next(this.menus$.getValue());
    const parentByNode = this.getParentByIndex(node.index);
    parentByNode &&
      this.openSpace$.next({
        node: parentByNode,
        state: true,
      });
  }

  remove(index: string) {
    const parent = this.getParentByIndex(index);
    if (parent) {
      const arr = index.split('-');
      const targetIndex = +arr[arr.length - 1];
      parent.children?.splice(targetIndex, 1);
    } else {
      this.menus$.value.splice(+index, 1);
    }
    this.menus$.next(this.menus$.getValue());
  }

  getParentByIndex(index: string): TreeNode {
    let target: TreeNode | any;
    const arr = index.split('-');
    arr.pop();
    arr.forEach((t: string, i: number) => {
      if (i === 0) {
        target = this.menus$.value[+t];
      } else {
        target = target.children![+t];
      }
    });
    return target;
  }

  getTargetByIndex(index: string): TreeNode {
    let target: TreeNode | any;
    const arr = index.split('-');
    arr.forEach((t: string, i: number) => {
      if (i === 0) {
        target = this.menus$.value[+t];
      } else {
        target = target.children![+t];
      }
    });
    return target;
  }
  formatData(item: MenuItem, index: string): TreeNode {
    const { isSpace, isNote, data, menuId } = item;
    const { children, ...extra } = item;
    const label = isSpace ? data.name : isNote ? data.title : '';
    const icon = isSpace ? 'sort' : isNote ? 'description' : '';
    const res: any = {
      label,
      id: menuId,
      icon,
      index: index,
      extra,
      lazy: false,
    };
    if (isSpace) {
      res.children = (children || []).map((t, i) => {
        return this.formatData(t, `${index}-${i}`);
      });
    }
    return res;
  }
  load() {
    return new Observable((subscriber) => {
      menuApi
        .getAll()
        .then((res) => {
          const formatRes = res.map((t: MenuItem, i: number) => {
            return this.formatData(t, i + '');
          });
          this.menus$.next(formatRes);
          subscriber.next(formatRes);
        })
        .catch((err) => {
          subscriber.error(err);
        })
        .finally(() => {
          subscriber.complete();
        });
    });
  }

  notifyCreateNote(treeNode?: TreeNode) {
    this.insertTreeNode = treeNode;
    this.createNote$.next(treeNode);
  }

  createSpace(treeNode?: TreeNode) {
    Dialog.create({
      title: '添加分类',
      prompt: {
        model: '',
        type: 'text',
        isValid: (v: string) => !!v,
      },
      cancel: true,
    }).onOk(async (name) => {
      try {
        const res = await spaceApi.add({
          name,
          parentId: treeNode?.extra?.targetId,
        });
        this.insert(res, treeNode);
      } catch (error) {
        console.error(error);
        Notify.create({
          message: '添加失败,请稍后再试',
          progress: true,
          type: 'negative',
          position: 'top',
        });
      }
    });
  }

  async updateSpace(treeNode: TreeNode) {
    const {
      label: oldValue,
      index,
      extra: { targetId },
    } = treeNode;
    Dialog.create({
      title: '修改名称',
      prompt: {
        model: oldValue,
        type: 'text',
        isValid: (v: string) => !!v,
      },
      cancel: true,
    }).onOk(async (newValue) => {
      try {
        // 先前置直接修改掉,后台静默调用接口
        // 如果失败了 再将其复原
        this.update(['label', 'extra.data.name'], [newValue, newValue], index);
        await spaceApi.update(targetId, {
          name: newValue,
        });
      } catch (error) {
        console.error(error);
        Notify.create({
          message: '修改分类名称失败,请稍后再试',
          progress: true,
          type: 'negative',
          position: 'top',
        });
        this.update(['label', 'extra.data.name'], [oldValue, oldValue], index);
      }
    });
  }

  async deleteSpace(treeNode: TreeNode) {
    Dialog.create({
      title: '确定删除该分类?',
      cancel: true,
    }).onOk(async () => {
      const loadingDialog = Dialog.create({
        title: '正在删除中...',
        progress: true,
        ok: false,
      });
      try {
        const {
          index,
          extra: { targetId },
        } = treeNode;
        await spaceApi.delete(targetId);
        this.remove(index);
      } catch (error) {
        console.error(error);
      } finally {
        loadingDialog.hide();
      }
    });
  }
}
const menuService = new Menu();
export default menuService;
