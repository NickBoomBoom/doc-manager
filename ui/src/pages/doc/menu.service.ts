import {
  MenuItem,
  TreeNode,
  OpenSpace,
  SpaceSubject,
  DocSubject,
  SecondDocSubject,
} from 'interfaces/menu.interface';
import { Doc } from 'interfaces/doc.interface';
import { Dialog, Notify } from 'quasar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

class Menu {
  menus$: BehaviorSubject<TreeNode[]> = new BehaviorSubject<TreeNode[]>([]);
  openSpace$: BehaviorSubject<SpaceSubject> = new BehaviorSubject<SpaceSubject>(
    null,
  );
  openDoc$: BehaviorSubject<DocSubject> = new BehaviorSubject<DocSubject>(null);
  openSecondDoc$: BehaviorSubject<SecondDocSubject> =
    new BehaviorSubject<SecondDocSubject>(null);
  deleteDoc$: Subject<MenuItem> = new Subject();
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
  ): TreeNode {
    const index = insertItem
      ? insertItem.index + '-' + insertItem.children?.length
      : this.menus$.value.length + '';
    const node: TreeNode = this.formatData(menuItem, index);
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
    return node;
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
  find(
    id: number,
    arr: TreeNode[] = this.menus$.value,
    _isDoc: boolean = true,
  ): TreeNode {
    let res: TreeNode;
    for (let i = 0; i < arr.length; i++) {
      const t = arr[i];
      const {
        children,
        extra: { isDoc, targetId },
      } = t;

      if (targetId === id && isDoc === _isDoc) {
        res = t;
        break;
      } else if (children?.length) {
        const res2 = this.find(id, children, _isDoc);
        if (res2) {
          res = res2;
          break;
        }
      }
    }
    return res;
  }

  findByMenuId(menuId: number): TreeNode {
    let bol = false;
    let res: TreeNode;
    const _f = (arr: TreeNode[]) => {
      for (let i = 0; i < arr.length; i++) {
        if (bol) {
          break;
        }
        const item = arr[i];
        const { id, children } = item;
        if (id === menuId) {
          res = item;
          bol = true;
          break;
        } else if (children?.length) {
          _f(children);
        }
      }
    };

    _f(this.menus$.value);
    return res;
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
    const { isSpace, isDoc, data, menuId } = item;
    const { children, ...extra } = item;
    const label = isSpace ? data.name : isDoc ? data.title : '';
    const icon = isSpace ? 'sort' : isDoc ? 'article' : '';
    const res: TreeNode = {
      label,
      id: menuId,
      icon,
      index,
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

  updateMenus(data: TreeNode[]) {
    const parse = (item: TreeNode, index: string): TreeNode => {
      item.index = index;
      if (item.children?.length) {
        item.children = item.children.map((t, i) => {
          return parse(t, `${index}-${i}`);
        });
      }
      return item;
    };
    data.forEach((t, i) => {
      t = parse(t, i + '');
    });
    this.menus$.next(data);
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

  async createDoc(treeNode?: TreeNode, cb?: (t: TreeNode) => void) {
    this.insertTreeNode = treeNode;
    const body: Doc = {
      content: null,
      spaceId: treeNode?.extra.targetId || null,
    };
    const res: MenuItem = await docApi.add(body);
    const node = this.insert(res);
    this.openDoc$.next(res);
    cb?.(node);
  }

  createSpace(treeNode?: TreeNode, cb?: (t: TreeNode) => void) {
    Dialog.create({
      title: '添加空间',
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
        const node = this.insert(res, treeNode);
        cb?.(node);
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

  updateDoc(doc: Doc) {
    const { id, title, spaceId } = doc;
    const target: TreeNode = this.find(id!);
    this.update(['label', 'extra.data.title'], [title, title], target.index);
  }

  async updateSpace(treeNode: TreeNode) {
    const {
      label: oldValue,
      index,
      extra: { targetId },
    } = treeNode;
    Dialog.create({
      title: '编辑空间',
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
          message: '修改空间名称失败,请稍后再试',
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
      title: '确定删除该空间?',
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
  async deleteDoc(treeNode: TreeNode) {
    Dialog.create({
      title: '确定删除该文档?',
      cancel: true,
    }).onOk(async () => {
      const loadingDialog = Dialog.create({
        title: '正在删除中...',
        progress: true,
        ok: false,
      });
      try {
        const { index, extra } = treeNode;
        const { targetId } = extra;
        await docApi.delete(targetId);
        this.remove(index);
        this.deleteDoc$.next(extra);
      } catch (error) {
        console.error(error);
      } finally {
        loadingDialog.hide();
      }
    });
  }

  // 层级index
  async move(menuId: number) {
    const target = this.findByMenuId(menuId);
    const parent: TreeNode = this.getParentByIndex(target.index);
    const children: TreeNode[] = parent?.children || this.menus$.value;
    const index = children.findIndex((t) => t.id === menuId);
    let prevMenuId = null;
    const belongId = parent?.extra.targetId;
    if (index > 0) {
      prevMenuId = children[index - 1].id;
    }

    try {
      await menuApi.move({
        menuId,
        prevMenuId,
        belongId,
      });
    } catch (error) {
      console.error(error);
      Dialog.create({
        persistent: true,
        title: 'Oops! 出了点意外',
        message: '移动失败,请刷新页面再次重试',
        ok: '好的好的',
      }).onOk(() => {
        window.location.reload();
      });
    }
  }
}
const menuService = new Menu();
export default menuService;
