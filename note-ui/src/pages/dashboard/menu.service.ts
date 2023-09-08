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

export interface OpenCategory {
  node: TreeNode;
  state: boolean;
}
class Menu {
  menus$: BehaviorSubject<TreeNode[]> = new BehaviorSubject<TreeNode[]>([]);
  createNote$: Subject<TreeNode | undefined> = new Subject();
  createCategory$: Subject<TreeNode | undefined> = new Subject();
  openCategory$: Subject<OpenCategory> = new Subject();
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
      this.openCategory$.next({
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
    const { isCategory, isNote, data, menuId } = item;
    const { children, ...extra } = item;
    const label = isCategory ? data.name : isNote ? data.title : '';
    const icon = isCategory ? 'category' : isNote ? 'description' : '';
    const res: any = {
      label,
      id: menuId,
      icon,
      index: index,
      extra,
      lazy: false,
    };
    if (isCategory) {
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
  notifyCreateCategory(treeNode?: TreeNode) {
    this.insertTreeNode = treeNode;
    this.createCategory$.next(treeNode);
  }

  async updateCategory(newValue: string, oldValue: string, treeNode: TreeNode) {
    const {
      index,
      extra: { targetId },
    } = treeNode;
    try {
      await categoryApi.update(targetId, {
        name: newValue,
      });
      this.update(['label', 'extra.data.name'], [newValue, newValue], index);
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
  }

  async deleteCategory(treeNode: TreeNode) {
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
        await categoryApi.delete(targetId);
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
